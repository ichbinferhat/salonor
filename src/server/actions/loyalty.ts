"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";
import { normalizePhone, isValidTrMobile } from "@/lib/phone";

type Result = { ok: true } | { ok: false; error: string };

/** Bir müşteriye puan ekler/oluşturur (telefon anahtarlı). Adisyon ve manuel kullanım için. */
export async function earnPointsAction(opts: {
  customerName: string;
  phone: string;
  points: number;
  reason?: string;
}): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const phone = normalizePhone(opts.phone);
  if (!isValidTrMobile(phone)) return { ok: false, error: "Geçerli bir cep numarası gir (5xx...)." };
  const name = opts.customerName?.trim() || "Müşteri";
  const points = Math.max(1, Math.round(opts.points));
  if (!Number.isFinite(points)) return { ok: false, error: "Geçersiz puan." };

  try {
    await db.$transaction(async (tx) => {
      const account = await tx.loyaltyAccount.upsert({
        where: { businessId_phone: { businessId, phone } },
        create: { businessId, customerName: name, phone, points },
        update: { points: { increment: points }, customerName: name },
      });
      await tx.loyaltyTxn.create({
        data: { accountId: account.id, delta: points, reason: opts.reason?.trim() || "Puan kazanımı" },
      });
    });
    revalidatePath("/panel/para-puan");
    return { ok: true };
  } catch (e) {
    console.error("earnPointsAction:", e);
    return { ok: false, error: "Puan eklenemedi. Tekrar dene." };
  }
}

/** Puan harcama (kullanım). Bakiye yetersizse hata. */
export async function redeemPointsAction(opts: {
  accountId: string;
  points: number;
  reason?: string;
}): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const points = Math.max(1, Math.round(opts.points));
  if (!Number.isFinite(points)) return { ok: false, error: "Geçersiz puan." };

  try {
    await db.$transaction(async (tx) => {
      // ATOMİK koşullu düşüm: WHERE points>=harcama olan TEK update ifadesi satırı
      // kilitleyip günceller; eşzamanlı iki harcama yarışında ikincisi koşulu
      // sağlamazsa count=0 döner → bakiye ASLA eksiye düşmez (önceki oku-kontrol-yaz
      // deseni Read Committed altında çift-harcamaya açıktı).
      const dec = await tx.loyaltyAccount.updateMany({
        where: { id: opts.accountId, businessId, points: { gte: points } },
        data: { points: { decrement: points } },
      });
      if (dec.count === 0) {
        // Düşüm olmadı: hesap yok mu, yoksa bakiye mi yetersiz — ayırt et.
        const exists = await tx.loyaltyAccount.findFirst({
          where: { id: opts.accountId, businessId },
          select: { id: true },
        });
        throw new Error(exists ? "INSUFFICIENT" : "NOT_FOUND");
      }
      await tx.loyaltyTxn.create({
        data: { accountId: opts.accountId, delta: -points, reason: opts.reason?.trim() || "Puan kullanımı" },
      });
    });
    revalidatePath("/panel/para-puan");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") return { ok: false, error: "Müşteri bulunamadı." };
    if (e instanceof Error && e.message === "INSUFFICIENT") return { ok: false, error: "Yetersiz puan bakiyesi." };
    console.error("redeemPointsAction:", e);
    return { ok: false, error: "İşlem yapılamadı. Tekrar dene." };
  }
}
