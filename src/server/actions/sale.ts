"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";
import { todayStr } from "@/lib/datetime";
import { normalizePhone, isValidTrMobile } from "@/lib/phone";

export type SaleLine = {
  name: string;
  kind: "service" | "product" | "other";
  priceTl: number;
  qty: number;
  productId?: string | null;
};

export async function createSaleAction(opts: {
  customerName?: string;
  customerPhone?: string;
  paymentMethod: string;
  items: SaleLine[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const items = (opts.items ?? []).filter(
    (i) => i.name?.trim() && Number.isFinite(i.priceTl) && i.priceTl >= 0 && i.qty > 0
  );
  if (items.length === 0) return { ok: false, error: "En az bir ürün/hizmet ekle." };

  const total = items.reduce((s, i) => s + i.priceTl * i.qty, 0);
  const method = ["Nakit", "Kart", "Havale"].includes(opts.paymentMethod) ? opts.paymentMethod : "Nakit";

  // Telefon girildiyse otomatik puan kazanımı (her 100 ₺ = 5 puan).
  // Telefon yoksa puan yazılmaz; girildiyse geçerli TR cep olmalı.
  const rawPhone = opts.customerPhone?.trim();
  let phone: string | null = null;
  if (rawPhone) {
    if (!isValidTrMobile(rawPhone)) return { ok: false, error: "Geçerli bir cep numarası gir (5xx...)." };
    phone = normalizePhone(rawPhone);
  }
  const earnedPoints = phone ? Math.floor(total / 100) * 5 : 0;
  const customerName = opts.customerName?.trim() || null;

  // Ürün satışları için talep edilen toplam miktarları topla (aynı ürün
  // birden çok satırda olabilir).
  const productNeed = new Map<string, number>();
  for (const i of items) {
    if (i.kind === "product" && i.productId) {
      productNeed.set(i.productId, (productNeed.get(i.productId) ?? 0) + i.qty);
    }
  }

  try {
    await db.$transaction(async (tx) => {
      // Stok kontrolü: stoktan fazla satılamaz + ürünler BU işletmeye ait olmalı.
      if (productNeed.size > 0) {
        const products = await tx.product.findMany({
          where: { id: { in: [...productNeed.keys()] }, businessId },
          select: { id: true, name: true, stock: true },
        });
        // İstemciden gelen ürün ID'lerinin tümü bu işletmede bulunmalı (yabancı/silinmiş
        // ürün ID'siyle cross-tenant stok düşümünü engelle).
        if (products.length !== productNeed.size) {
          throw new Error("PRODUCT_NOT_FOUND");
        }
        for (const p of products) {
          const need = productNeed.get(p.id) ?? 0;
          if (need > p.stock) {
            throw new Error(`STOCK:${p.name}:${p.stock}`);
          }
        }
      }

      await tx.sale.create({
        data: {
          businessId,
          customerName,
          totalTl: total,
          paymentMethod: method,
          date: todayStr(),
          items: {
            create: items.map((i) => ({
              name: i.name.trim(),
              kind: i.kind,
              qty: i.qty,
              priceTl: i.priceTl,
            })),
          },
        },
      });

      // Stok düş — İŞLETMEYE SINIRLI atomik decrement (cross-tenant yazımı imkânsız;
      // yabancı/silinmiş ürün count=0 döner → transaction güvenle geri alınır).
      for (const [productId, qty] of productNeed) {
        const r = await tx.product.updateMany({
          where: { id: productId, businessId },
          data: { stock: { decrement: qty } },
        });
        if (r.count === 0) throw new Error("PRODUCT_NOT_FOUND");
      }

      // Telefon girildiyse otomatik puan kazandır
      if (phone && earnedPoints > 0) {
        const account = await tx.loyaltyAccount.upsert({
          where: { businessId_phone: { businessId, phone } },
          create: { businessId, customerName: customerName || "Müşteri", phone, points: earnedPoints },
          update: { points: { increment: earnedPoints }, ...(customerName ? { customerName } : {}) },
        });
        await tx.loyaltyTxn.create({
          data: { accountId: account.id, delta: earnedPoints, reason: "Kasa satışı" },
        });
      }
    });

    revalidatePath("/panel/kasa");
    revalidatePath("/panel/urunler");
    revalidatePath("/panel/para-puan");
    revalidatePath("/panel");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("STOCK:")) {
      const [, name, stock] = e.message.split(":");
      return { ok: false, error: `"${name}" için yeterli stok yok (kalan ${stock}).` };
    }
    if (e instanceof Error && e.message === "PRODUCT_NOT_FOUND") {
      return { ok: false, error: "Seçilen ürün bulunamadı." };
    }
    console.error("createSaleAction error:", e);
    return { ok: false, error: "Satış kaydedilemedi. Tekrar dene." };
  }
}
