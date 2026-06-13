"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/slug";

async function isAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN";
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
  await db.business.update({ where: { id: businessId }, data: { active } });
  revalidatePath("/admin");
  revalidatePath("/");
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

  if (name.length < 2) return { error: "İşletme adı gerekli." };
  if (!EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta gir." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  if (await db.user.findUnique({ where: { email } })) {
    return { error: "Bu e-posta ile zaten bir hesap var." };
  }

  const category = await db.category.findFirst();
  if (!category) return { error: "Önce kategori tanımlanmalı." };

  const slug = `${slugify(name) || "salon"}-${Math.random().toString(36).slice(2, 6)}`;

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
      active: true,
      ownerId: owner.id,
      categoryId: category.id,
      hours: { create: hours },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true, email, password, slug };
}
