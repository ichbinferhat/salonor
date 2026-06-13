"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession, createSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { todayStr } from "@/lib/datetime";
import type { FormState } from "./auth";

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

  const agg = await db.review.aggregate({
    where: { businessId: appt.businessId },
    _avg: { rating: true },
    _count: true,
  });
  await db.business.update({
    where: { id: appt.businessId },
    data: {
      ratingAvg: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      ratingCount: agg._count,
    },
  });

  revalidatePath("/hesap");
  revalidatePath(`/salon/${appt.business.slug}`);
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
