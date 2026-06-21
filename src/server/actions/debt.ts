"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";
import { todayStr } from "@/lib/datetime";
import { normalizePhone } from "@/lib/phone";

type Result = { ok: true } | { ok: false; error: string };

export async function createDebtAction(opts: {
  customerName: string;
  phone?: string;
  totalTl: number;
  installments?: number;
  note?: string;
}): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const name = opts.customerName?.trim();
  const total = Math.round(opts.totalTl);
  if (!name || name.length < 2) return { ok: false, error: "Müşteri adı gir." };
  if (!Number.isFinite(total) || total <= 0 || total > 100_000_000)
    return { ok: false, error: "Geçerli bir tutar gir." };
  const installments = Math.max(1, Math.round(opts.installments ?? 1));

  try {
    await db.debt.create({
      data: {
        businessId,
        customerName: name,
        phone: opts.phone ? normalizePhone(opts.phone) : null,
        totalTl: total,
        installments,
        note: opts.note?.trim() || null,
        date: todayStr(),
      },
    });
    revalidatePath("/panel/borclar");
    return { ok: true };
  } catch (e) {
    console.error("createDebtAction:", e);
    return { ok: false, error: "Borç kaydı oluşturulamadı." };
  }
}

/** Borca tahsilat (ödeme) ekler. */
export async function addDebtPaymentAction(opts: {
  debtId: string;
  amountTl: number;
  method?: string;
}): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const amount = Math.round(opts.amountTl);
  const debt = await db.debt.findFirst({ where: { id: opts.debtId, businessId } });
  if (!debt) return { ok: false, error: "Borç bulunamadı." };
  const remaining = debt.totalTl - debt.paidTl;
  if (amount <= 0) return { ok: false, error: "Geçerli bir tutar gir." };
  if (amount > remaining) return { ok: false, error: `Kalan borçtan fazla (${remaining} ₺).` };

  const method = ["Nakit", "Kart", "Havale"].includes(opts.method ?? "") ? opts.method! : "Nakit";

  try {
    const over = await db.$transaction(async (tx) => {
      // KOŞULLU atomik artış — eşzamanlı iki tahsilat kalan borçtan fazla
      // ödeyemez (paidTl yalnızca total'i aşmayacaksa artırılır).
      const inc = await tx.debt.updateMany({
        where: { id: debt.id, businessId, paidTl: { lte: debt.totalTl - amount } },
        data: { paidTl: { increment: amount } },
      });
      if (inc.count === 0) return true; // kalan borçtan fazla — işlemi geri al
      await tx.debtPayment.create({
        data: { debtId: debt.id, amountTl: amount, method, date: todayStr() },
      });
      return false;
    });
    if (over) return { ok: false, error: `Kalan borçtan fazla (${remaining} ₺).` };
    revalidatePath("/panel/borclar");
    revalidatePath("/panel");
    return { ok: true };
  } catch (e) {
    console.error("addDebtPaymentAction:", e);
    return { ok: false, error: "Tahsilat eklenemedi." };
  }
}

export async function deleteDebtAction(id: string): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };
  const debt = await db.debt.findFirst({ where: { id, businessId } });
  if (!debt) return { ok: false, error: "Borç bulunamadı." };
  await db.debt.delete({ where: { id: debt.id } });
  revalidatePath("/panel/borclar");
  return { ok: true };
}
