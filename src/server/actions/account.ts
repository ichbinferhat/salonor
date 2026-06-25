"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getSession, createSession, destroySession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { todayStr } from "@/lib/datetime";
import { rateLimit } from "@/lib/rate-limit";
import { recomputeBusinessRating } from "@/lib/rating";
import { getDictionary } from "@/i18n";
import type { FormState } from "./auth";

async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel'in güvenilir gerçek-istemci IP başlığını önce kullan (spoof'a kapalı);
  // ham x-forwarded-for son çaredir (istemci tarafından sahtelenebilir).
  return (
    h.get("x-real-ip") ??
    h.get("x-vercel-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export async function toggleFavoriteAction(businessId: string, slug: string) {
  const session = await getSession();
  if (!session) redirect(`/giris?next=/salon/${slug}`);

  const key = { userId_businessId: { userId: session.userId, businessId } };
  const existing = await db.favorite.findUnique({ where: key });

  if (existing) {
    await db.favorite.delete({ where: key });
  } else {
    await db.favorite.create({ data: { userId: session.userId, businessId } });
  }

  revalidatePath(`/salon/${slug}`);
  revalidatePath("/hesap/favoriler");
  return !existing;
}

export async function cancelAppointmentAction(appointmentId: string) {
  const session = await getSession();
  if (!session) redirect("/giris");

  const appt = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { customerId: true, status: true, date: true, business: { select: { slug: true } } },
  });

  if (!appt || appt.customerId !== session.userId) return;
  if (appt.status !== "CONFIRMED" || appt.date < todayStr()) return;

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/hesap");
  revalidatePath("/panel");
  revalidatePath("/panel/takvim");
}

export async function createReviewAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/giris");

  const appointmentId = String(formData.get("appointmentId") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Lütfen 1-5 arası bir puan seçin." };
  }
  if (comment.length < 5) {
    return { error: "Lütfen deneyiminizi birkaç kelimeyle anlatın." };
  }

  const appt = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      customerId: true,
      status: true,
      businessId: true,
      review: { select: { id: true } },
      business: { select: { slug: true } },
    },
  });

  if (!appt || appt.customerId !== session.userId) return { error: "Randevu bulunamadı." };
  if (appt.status !== "COMPLETED") return { error: "Yalnızca tamamlanan randevular değerlendirilebilir." };
  if (appt.review) return { error: "Bu randevu zaten değerlendirilmiş." };

  await db.review.create({
    data: {
      businessId: appt.businessId,
      customerId: session.userId,
      appointmentId: appt.id,
      rating,
      comment,
    },
  });

  await recomputeBusinessRating(appt.businessId);

  revalidatePath("/hesap");
  revalidatePath(`/salon/${appt.business.slug}`);
  return { ok: true };
}

/**
 * Herkese açık yorum (Google tarzı — giriş gerektirmez). Girişliyse adı/hesabı
 * kullanılır; değilse verilen ad ile anonim kaydedilir. Spam'i sınırlamak için
 * IP başına saatte 3 yorum. (Sahte yorum riskine karşı admin yorumları silebilir.)
 */
export async function addPublicReviewAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const slug = String(formData.get("slug") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();
  const nameInput = String(formData.get("name") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1) {
    const dict = await getDictionary();
    return { error: dict.salon.selectRatingFirst };
  }
  if (rating > 5)
    return { error: "Lütfen 1-5 arası bir puan seç." };
  if (comment.length < 5)
    return { error: "Lütfen deneyimini birkaç kelimeyle anlat." };

  const business = await db.business.findUnique({ where: { slug }, select: { id: true } });
  if (!business) return { error: "İşletme bulunamadı." };

  const session = await getSession();
  if (!session && nameInput.length < 2) return { error: "Lütfen adını gir." };

  const ip = await clientIp();
  if (!rateLimit(`review:${ip}`, 3, 60 * 60 * 1000).ok)
    return { error: "Çok fazla yorum gönderdin. Lütfen biraz sonra tekrar dene." };

  // SAHTE YORUM / PUAN MANİPÜLASYONU KORUMASI:
  // Yalnızca bu işletmede TAMAMLANMIŞ randevusu olan (doğrulanmış) yorum anında
  // yayınlanıp puana sayılır. Anonim VEYA randevusuz girişli yorum ONAY BEKLER
  // (hidden=true): vitrinde görünmez, puana sayılmaz; admin onaylayınca yayınlanır.
  // (Eskiden girişli HERKESİN yorumu anında puana sayılıyordu → randevusuz hesapla
  // puan şişirme açığı vardı.)
  let verified = false;
  if (session) {
    const completed = await db.appointment.count({
      where: { businessId: business.id, customerId: session.userId, status: "COMPLETED" },
    });
    verified = completed > 0;
  }
  const pending = !verified;

  try {
    await db.review.create({
      data: {
        businessId: business.id,
        customerId: session?.userId ?? null,
        authorName: session ? null : nameInput.slice(0, 60),
        rating,
        comment: comment.slice(0, 1000),
        verified,
        hidden: pending,
      },
    });

    if (!pending) await recomputeBusinessRating(business.id);
  } catch (e) {
    console.error("addPublicReviewAction:", e);
    return { error: "Yorum kaydedilemedi, lütfen tekrar dene." };
  }

  // Not: revalidatePath'i burada KULLANMIYORUZ — ağır salon sayfasını eşzamanlı
  // yeniden render etmek "Gönderiliyor..."u uzatıyordu. Yeni yorum, modal
  // kapanınca client tarafında router.refresh() ile anında görünür.
  if (pending) {
    return {
      ok: true,
      notice: "Yorumun alındı, teşekkürler! İşletme/yönetim onayından sonra yayınlanacak.",
    };
  }
  return { ok: true };
}

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/giris");

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (name.length < 3) return { error: "Lütfen adınızı ve soyadınızı girin." };

  const data: { name: string; phone: string | null; passwordHash?: string } = {
    name,
    phone: phone || null,
  };

  if (newPassword) {
    if (newPassword.length < 6) return { error: "Yeni şifre en az 6 karakter olmalı." };
    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
      return { error: "Mevcut şifreniz hatalı." };
    }
    data.passwordHash = await hashPassword(newPassword);
  }

  await db.user.update({ where: { id: session.userId }, data });
  await createSession({ userId: session.userId, role: session.role, name });

  revalidatePath("/hesap/profil");
  return { ok: true };
}

/**
 * Hesabı kalıcı olarak siler (App Store 5.1.1(v) + Google Play hesap-silme politikası
 * gereği zorunlu). Şifre doğrulaması ister.
 *
 * Pratikte bu akış yalnızca MÜŞTERİ (CUSTOMER) için erişilebilir — `/hesap/*` layout'u
 * OWNER/ADMIN'i panele yönlendirdiğinden işletme sahibi bu formu göremez. Müşteri için:
 *  - favorites ve devices → onDelete: Cascade ile silinir
 *  - appointments.customer, reviews.customer → onDelete: SetNull ile anonimleştirilir
 *    (geçmiş randevular işletme tarafında kaybolmaz, yalnızca kişisel bağ koparılır).
 *
 * NOT: Eğer bir OWNER bu aksiyonu çağırırsa User→Business (onDelete: Cascade) tetiklenir
 * ve işletme + tüm randevu/personel/hizmet kayıtları SİLİNİR. İşletme silme için panel
 * üzerinden ayrı/onaylı bir akış planlanmalıdır.
 */
export async function deleteAccountAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/giris");

  const password = String(formData.get("password") ?? "");

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    await destroySession();
    redirect("/");
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    return { error: "Şifre hatalı. Hesabınız silinmedi." };
  }

  await db.user.delete({ where: { id: session.userId } });
  await destroySession();
  redirect("/?hesap-silindi=1");
}
