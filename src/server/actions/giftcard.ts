"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";
import { todayStr } from "@/lib/datetime";

type Result = { ok: true } | { ok: false; error: string };

/** Okunması kolay benzersiz hediye çeki kodu üretir: HED-XXXX-XXXX */
function genCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // karışan harfler hariç
  const block = () =>
    Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `HED-${block()}-${block()}`;
}

export async function createGiftCardAction(opts: {
  amountTl: number;
  buyerName?: string;
  recipient?: string;
  expiresAt?: string;
}): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const amount = Math.round(opts.amountTl);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000_000)
    return { ok: false, error: "Geçerli bir tutar gir." };

  // Son kullanım tarihi opsiyonel; verildiyse yalnızca kanonik YYYY-MM-DD kabul
  // edilir (lexical karşılaştırma redeem'de buna güveniyor).
  const expiresAt = opts.expiresAt?.trim() || null;
  if (expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt))
    return { ok: false, error: "Geçerli bir tarih gir." };

  try {
    // Çakışma ihtimaline karşı benzersiz kod garanti et
    let code = genCode();
    while (await db.giftCard.findUnique({ where: { code } })) code = genCode();

    await db.giftCard.create({
      data: {
        businessId,
        code,
        amountTl: amount,
        balanceTl: amount,
        buyerName: opts.buyerName?.trim() || null,
        recipient: opts.recipient?.trim() || null,
        expiresAt,
      },
    });
    revalidatePath("/panel/hediye-ceki");
    return { ok: true };
  } catch (e) {
    console.error("createGiftCardAction:", e);
    return { ok: false, error: "Hediye çeki oluşturulamadı." };
  }
}

/** Çekten bakiye düşer (kullanım). */
export async function redeemGiftCardAction(opts: { id: string; amountTl: number }): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const amount = Math.round(opts.amountTl);
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Geçerli bir tutar gir." };

  // Önce dostça hata mesajları için oku (pasif / süre / yetersiz ayrımı).
  const card = await db.giftCard.findFirst({ where: { id: opts.id, businessId } });
  if (!card) return { ok: false, error: "Çek bulunamadı." };
  if (!card.active) return { ok: false, error: "Çek pasif." };
  // Son kullanım tarihi (YYYY-MM-DD) bugünden önceyse kullandırılamaz.
  if (card.expiresAt && card.expiresAt < todayStr()) return { ok: false, error: "Çekin süresi dolmuş." };
  if (amount > card.balanceTl) return { ok: false, error: "Çek bakiyesi yetersiz." };

  try {
    // KOŞULLU atomik düşüm — eşzamanlı iki kullanım çift harcama yapamaz
    // (balanceTl yalnızca yeterli bakiye varsa düşürülür). Düşüm ve bakiye
    // sıfırlanınca pasifleştirme tek transaction'da birlikte commit edilir.
    const [dec] = await db.$transaction([
      db.giftCard.updateMany({
        where: { id: card.id, businessId, active: true, balanceTl: { gte: amount } },
        data: { balanceTl: { decrement: amount } },
      }),
      // Bu düşümle bakiye tam sıfırlanıyorsa pasifleştir. Aynı `gte`+`lte`
      // koşulu yetersiz bakiyeli (düşümün gerçekleşmediği) çeke dokunmaz.
      db.giftCard.updateMany({
        where: { id: card.id, businessId, active: true, balanceTl: { gte: amount, lte: amount } },
        data: { active: false },
      }),
    ]);
    if (dec.count === 0) return { ok: false, error: "Çek bakiyesi yetersiz." };
    revalidatePath("/panel/hediye-ceki");
    return { ok: true };
  } catch (e) {
    console.error("redeemGiftCardAction:", e);
    return { ok: false, error: "İşlem yapılamadı." };
  }
}

export async function toggleGiftCardAction(id: string, active: boolean): Promise<Result> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };
  const card = await db.giftCard.findFirst({ where: { id, businessId } });
  if (!card) return { ok: false, error: "Çek bulunamadı." };
  await db.giftCard.update({ where: { id: card.id }, data: { active } });
  revalidatePath("/panel/hediye-ceki");
  return { ok: true };
}
