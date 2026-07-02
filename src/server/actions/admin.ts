"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { recomputeBusinessRating } from "@/lib/rating";
import { PLANS, isPlanKey, type PlanKey } from "@/lib/plans";

async function isAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN";
}

/**
 * İşletmenin paketini değiştirir (yalnızca ADMIN).
 * Kontör (smsCredits) KORUNUR — paket değişimi mevcut kontörü ezmez/sıfırlamaz.
 * Hediye kontörü ayrı `addSmsCreditsAction` ile yüklenir.
 */
export async function setBusinessPlanAction(businessId: string, plan: string) {
  if (!(await isAdmin())) return { ok: false };
  if (!isPlanKey(plan)) return { ok: false };
  await db.business.update({
    where: { id: businessId },
    data: { plan },
  });
  revalidatePath("/admin");
  return { ok: true };
}

/** İşletmeye SMS kontörü ekler/manuel yükler (yalnızca ADMIN). */
export async function addSmsCreditsAction(businessId: string, amount: number) {
  if (!(await isAdmin())) return { ok: false };
  const inc = Math.round(amount);
  if (!Number.isFinite(inc) || inc === 0) return { ok: false };
  // Kontör 0'ın altına inemez: eksiltme (negatif inc) mevcut bakiyeden büyükse
  // sonucu 0'a sabitle. Aksi halde DB'ye negatif kontör yazılır ve istemcinin
  // Math.max(0, ...) ile kırptığı sayıyla kalıcı olarak ters düşer.
  await db.$transaction(async (tx) => {
    const biz = await tx.business.findUnique({
      where: { id: businessId },
      select: { smsCredits: true },
    });
    if (!biz) return;
    await tx.business.update({
      where: { id: businessId },
      data: { smsCredits: Math.max(0, biz.smsCredits + inc) },
    });
  });
  revalidatePath("/admin");
  return { ok: true };
}

/** İşletmeyi öne çıkan yap/kaldır (yalnızca ADMIN). */
export async function setFeaturedAction(businessId: string, featured: boolean) {
  if (!(await isAdmin())) return { ok: false };
  await db.business.update({ where: { id: businessId }, data: { featured } });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

/** İşletmeyi askıya al / aktifleştir (yalnızca ADMIN). Pasif işletme vitrinde görünmez. */
export async function setBusinessActiveAction(businessId: string, active: boolean) {
  if (!(await isAdmin())) return { ok: false };
  // Aktifleştir → yayında + askı kalkar. Pasifleştir → GERÇEK askıya alma (sahip panele
  // giremez). Yeni taslaklar suspended=false başlar → sahip bilgileri tamamlayabilir.
  await db.business.update({ where: { id: businessId }, data: { active, suspended: !active } });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

/**
 * İşletmeyi kalıcı olarak siler (yalnızca ADMIN). İlişkili tüm kayıtlar
 * (randevular, yorumlar, satışlar, saatler, personel vb.) DB onDelete: Cascade
 * ile silinir; ardından bu işletmeye bağlı sahip hesabı da ayrıca temizlenir.
 * Geri alınamaz — istemci tarafında onay (confirm) istenir.
 */
export async function deleteBusinessByAdminAction(businessId: string) {
  if (!(await isAdmin())) return { ok: false };
  const biz = await db.business.findUnique({
    where: { id: businessId },
    select: { id: true, slug: true, ownerId: true },
  });
  if (!biz) return { ok: false };
  // İşletmeyi sil — ilişkili kayıtlar onDelete: Cascade ile temizlenir.
  await db.business.delete({ where: { id: businessId } });
  // Yetim kalmaması için sahip hesabını da temizle (sahip yalnızca bu işletmeye bağlı).
  await db.user.delete({ where: { id: biz.ownerId } }).catch(() => {});
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/salon/${biz.slug}`);
  return { ok: true };
}

/**
 * Yorumu gizler/gösterir (yalnızca ADMIN). Gizli yorum vitrinde görünmez ve
 * puana sayılmaz; gizleyince şikayet işareti de düşer. Puan yeniden hesaplanır.
 */
export async function setReviewHiddenAction(reviewId: string, hidden: boolean) {
  if (!(await isAdmin())) return { ok: false };
  const review = await db.review.findUnique({
    where: { id: reviewId },
    select: { businessId: true, business: { select: { slug: true } } },
  });
  if (!review) return { ok: false };
  await db.review.update({
    where: { id: reviewId },
    data: { hidden, reported: hidden ? false : undefined },
  });
  await recomputeBusinessRating(review.businessId);
  revalidatePath("/admin");
  revalidatePath(`/salon/${review.business.slug}`);
  return { ok: true };
}

/** Yorumu kalıcı siler (yalnızca ADMIN — açık spam/saldırı için). Puan yeniden hesaplanır. */
export async function deleteReviewByAdminAction(reviewId: string) {
  if (!(await isAdmin())) return { ok: false };
  const review = await db.review.findUnique({
    where: { id: reviewId },
    select: { businessId: true, business: { select: { slug: true } } },
  });
  if (!review) return { ok: false };
  await db.review.delete({ where: { id: reviewId } });
  await recomputeBusinessRating(review.businessId);
  revalidatePath("/admin");
  revalidatePath(`/salon/${review.business.slug}`);
  return { ok: true };
}

export type CreateBizState =
  | { error: string }
  | { ok: true; email: string; password: string; slug: string }
  | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop";

/** Admin manuel işletme oluşturur: sahip hesabı + işletme + varsayılan saatler. Anında vitrinde. */
export async function createBusinessByAdminAction(
  _prev: CreateBizState,
  formData: FormData
): Promise<CreateBizState> {
  if (!(await isAdmin())) return { error: "Yetkisiz." };

  const name = String(formData.get("name") ?? "").trim();
  const ownerName = String(formData.get("ownerName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const planRaw = String(formData.get("plan") ?? "baslangic");
  const plan: PlanKey = isPlanKey(planRaw) ? planRaw : "baslangic";

  if (name.length < 2) return { error: "İşletme adı gerekli." };
  if (!EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta gir." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  if (await db.user.findUnique({ where: { email } })) {
    return { error: "Bu e-posta ile zaten bir hesap var." };
  }

  const category = await db.category.findFirst();
  if (!category) return { error: "Önce kategori tanımlanmalı." };

  // Benzersiz slug
  const base = slugify(name) || "salon";
  let slug = base;
  let n = 1;
  while (await db.business.findUnique({ where: { slug } })) slug = `${base}-${++n}`;

  const owner = await db.user.create({
    data: {
      name: ownerName || name,
      email,
      passwordHash: await hashPassword(password),
      role: "OWNER",
    },
  });

  // Hafta içi 09:00–19:00, Cmt 10:00–18:00, Paz kapalı
  const hours = Array.from({ length: 7 }, (_, weekday) => {
    if (weekday === 0) return { weekday, openMin: 600, closeMin: 1080, closed: true };
    if (weekday === 6) return { weekday, openMin: 600, closeMin: 1080, closed: false };
    return { weekday, openMin: 540, closeMin: 1140, closed: false };
  });

  try {
    await db.business.create({
      data: {
        slug,
        name,
        description: "",
        phone: "",
        address: "",
        district: "",
        city: "İstanbul",
        lat: 41.0082,
        lng: 28.9784,
        coverImage: DEFAULT_COVER,
        // Taslak olarak başla: konum (şehir/koordinat) henüz girilmediğinden işletme
        // yanlış sabit İstanbul/Sultanahmet konumuyla vitrinde + şehir filtresinde +
        // haritada görünmesin. Sahip ayarlardan gerçek konumu girdikten sonra admin
        // panelindeki anahtar (setBusinessActiveAction) ile aktifleştirilir.
        active: false,
        plan,
        smsCredits: PLANS[plan].smsBonus,
        ownerId: owner.id,
        categoryId: category.id,
        hours: { create: hours },
      },
    });
  } catch (e) {
    console.error("createBusinessByAdminAction error:", e);
    // İşletme açılamazsa yetim sahip hesabını temizle
    await db.user.delete({ where: { id: owner.id } }).catch(() => {});
    return { error: "İşletme oluşturulamadı. Lütfen tekrar dene." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, email, password, slug };
}
