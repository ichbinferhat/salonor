"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";

export type CatalogState = { error?: string; ok?: boolean } | undefined;

const num = (v: FormDataEntryValue | null) => Math.round(Number(v));
const MONEY_MAX = 100_000_000;
const clampInt = (v: number, min: number, max: number, fallback: number) =>
  Number.isFinite(v) ? Math.min(Math.max(Math.round(v), min), max) : fallback;

// Bugünün yerel takvim tarihi (YYYY-MM-DD) — <input type="date"> ile aynı formatta.
const todayIso = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

/* ───────────────────────── Paketler ───────────────────────── */

export async function addPackageAction(_p: CatalogState, formData: FormData): Promise<CatalogState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceTl = num(formData.get("priceTl"));
  const sessions = num(formData.get("sessions"));
  const validityDays = num(formData.get("validityDays"));

  if (name.length < 2) return { error: "Paket adı gir." };
  if (!Number.isFinite(priceTl) || priceTl <= 0 || priceTl > MONEY_MAX)
    return { error: "Geçerli bir fiyat gir." };

  await db.package.create({
    data: {
      businessId,
      name,
      description: description || null,
      priceTl,
      sessions: clampInt(sessions, 1, 9999, 1),
      validityDays: clampInt(validityDays, 1, 3650, 30),
    },
  });
  revalidatePath("/panel/paketler");
  return { ok: true };
}

export async function updatePackageAction(_p: CatalogState, formData: FormData): Promise<CatalogState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const id = String(formData.get("id") ?? "").trim();
  const existing = id ? await db.package.findFirst({ where: { id, businessId } }) : null;
  if (!existing) return { error: "Yetkisiz." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceTl = num(formData.get("priceTl"));
  const sessions = num(formData.get("sessions"));
  const validityDays = num(formData.get("validityDays"));

  if (name.length < 2) return { error: "Paket adı gir." };
  if (!Number.isFinite(priceTl) || priceTl <= 0 || priceTl > MONEY_MAX)
    return { error: "Geçerli bir fiyat gir." };

  await db.package.update({
    where: { id: existing.id },
    data: {
      name,
      description: description || null,
      priceTl,
      sessions: clampInt(sessions, 1, 9999, 1),
      validityDays: clampInt(validityDays, 1, 3650, 30),
    },
  });
  revalidatePath("/panel/paketler");
  return { ok: true };
}

export async function togglePackageAction(id: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const p = await db.package.findFirst({ where: { id, businessId } });
  if (!p) return;
  await db.package.update({ where: { id }, data: { active: !p.active } });
  revalidatePath("/panel/paketler");
}

export async function deletePackageAction(id: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const p = await db.package.findFirst({ where: { id, businessId } });
  if (!p) return;
  await db.package.delete({ where: { id } });
  revalidatePath("/panel/paketler");
}

/* ───────────────────────── Kampanyalar ───────────────────────── */

export async function addCampaignAction(_p: CatalogState, formData: FormData): Promise<CatalogState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const description = String(formData.get("description") ?? "").trim();
  const discountPct = num(formData.get("discountPct"));
  const expiresAt = String(formData.get("expiresAt") ?? "").trim();

  if (code.length < 3) return { error: "En az 3 karakterlik bir kod gir." };
  if (!Number.isFinite(discountPct) || discountPct <= 0 || discountPct > 90)
    return { error: "İndirim oranı 1–90 arası olmalı." };
  if (expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt))
    return { error: "Geçerli bir bitiş tarihi gir." };
  if (expiresAt && expiresAt < todayIso())
    // panelCatalog.catalog.expiryInPast — reddet: doğmuş-bitmiş kupon
    return { error: "Bitiş tarihi bugünden önce olamaz." };

  const exists = await db.campaign.findFirst({ where: { businessId, code } });
  if (exists) return { error: "Bu kod zaten var." };

  await db.campaign.create({
    data: { businessId, code, description: description || null, discountPct, expiresAt: expiresAt || null },
  });
  revalidatePath("/panel/kampanyalar");
  return { ok: true };
}

export async function updateCampaignAction(_p: CatalogState, formData: FormData): Promise<CatalogState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const id = String(formData.get("id") ?? "").trim();
  const existing = id ? await db.campaign.findFirst({ where: { id, businessId } }) : null;
  if (!existing) return { error: "Yetkisiz." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const description = String(formData.get("description") ?? "").trim();
  const discountPct = num(formData.get("discountPct"));
  const expiresAt = String(formData.get("expiresAt") ?? "").trim();

  if (code.length < 3) return { error: "En az 3 karakterlik bir kod gir." };
  if (!Number.isFinite(discountPct) || discountPct <= 0 || discountPct > 90)
    return { error: "İndirim oranı 1–90 arası olmalı." };
  if (expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt))
    return { error: "Geçerli bir bitiş tarihi gir." };
  if (expiresAt && expiresAt < todayIso())
    // panelCatalog.catalog.expiryInPast — reddet: doğmuş-bitmiş kupon
    return { error: "Bitiş tarihi bugünden önce olamaz." };

  // Kod değiştiyse çakışma kontrolü (kendi satırını hariç tut).
  if (code !== existing.code) {
    const clash = await db.campaign.findFirst({ where: { businessId, code } });
    if (clash) return { error: "Bu kod zaten var." };
  }

  await db.campaign.update({
    where: { id: existing.id },
    data: { code, description: description || null, discountPct, expiresAt: expiresAt || null },
  });
  revalidatePath("/panel/kampanyalar");
  return { ok: true };
}

export async function toggleCampaignAction(id: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const c = await db.campaign.findFirst({ where: { id, businessId } });
  if (!c) return;
  await db.campaign.update({ where: { id }, data: { active: !c.active } });
  revalidatePath("/panel/kampanyalar");
}

export async function deleteCampaignAction(id: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const c = await db.campaign.findFirst({ where: { id, businessId } });
  if (!c) return;
  await db.campaign.delete({ where: { id } });
  revalidatePath("/panel/kampanyalar");
}

/* ───────────────────────── Ürünler & Stok ───────────────────────── */

export async function addProductAction(_p: CatalogState, formData: FormData): Promise<CatalogState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const name = String(formData.get("name") ?? "").trim();
  const priceTl = num(formData.get("priceTl"));
  const stock = num(formData.get("stock"));
  const lowStockAt = num(formData.get("lowStockAt"));

  if (name.length < 2) return { error: "Ürün adı gir." };
  if (!Number.isFinite(priceTl) || priceTl < 0 || priceTl > MONEY_MAX)
    return { error: "Geçerli bir fiyat gir." };

  await db.product.create({
    data: {
      businessId,
      name,
      priceTl,
      stock: clampInt(stock, 0, 1_000_000, 0),
      lowStockAt: clampInt(lowStockAt, 0, 1_000_000, 5),
    },
  });
  revalidatePath("/panel/urunler");
  return { ok: true };
}

export async function updateProductAction(_p: CatalogState, formData: FormData): Promise<CatalogState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const id = String(formData.get("id") ?? "").trim();
  const existing = id ? await db.product.findFirst({ where: { id, businessId } }) : null;
  if (!existing) return { error: "Yetkisiz." };

  const name = String(formData.get("name") ?? "").trim();
  const priceTl = num(formData.get("priceTl"));
  const stock = num(formData.get("stock"));
  const lowStockAt = num(formData.get("lowStockAt"));

  if (name.length < 2) return { error: "Ürün adı gir." };
  if (!Number.isFinite(priceTl) || priceTl < 0 || priceTl > MONEY_MAX)
    return { error: "Geçerli bir fiyat gir." };

  await db.product.update({
    where: { id: existing.id },
    data: {
      name,
      priceTl,
      stock: clampInt(stock, 0, 1_000_000, 0),
      lowStockAt: clampInt(lowStockAt, 0, 1_000_000, 5),
    },
  });
  revalidatePath("/panel/urunler");
  return { ok: true };
}

export async function adjustStockAction(id: string, delta: number) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const p = await db.product.findFirst({ where: { id, businessId } });
  if (!p) return;
  const next = Math.max(0, p.stock + delta);
  await db.product.update({ where: { id }, data: { stock: next } });
  revalidatePath("/panel/urunler");
}

export async function deleteProductAction(id: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const p = await db.product.findFirst({ where: { id, businessId } });
  if (!p) return;
  await db.product.delete({ where: { id } });
  revalidatePath("/panel/urunler");
}

/* ───────────────────────── Prim & Performans ───────────────────────── */

export async function setCommissionAction(staffId: string, pct: number) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const st = await db.staff.findFirst({ where: { id: staffId, businessId } });
  if (!st) return;
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  await db.staff.update({ where: { id: staffId }, data: { commissionPct: clamped } });
  revalidatePath("/panel/prim");
}
