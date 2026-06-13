"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession, createSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getAvailableSlots, hasConflict, generateCode, type Slot } from "@/lib/slots";
import { todayStr } from "@/lib/datetime";

export async function fetchSlotsAction(opts: {
  businessId: string;
  date: string;
  durationMin: number;
  staffId?: string;
  serviceIds: string[];
}): Promise<Slot[]> {
  if (!opts.businessId || !opts.date || opts.durationMin <= 0) return [];
  return getAvailableSlots(opts);
}

export type BookingResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

export async function createAppointmentAction(opts: {
  businessId: string;
  serviceIds: string[];
  staffId: string | null;
  date: string;
  startMin: number;
  note?: string;
}): Promise<BookingResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Devam etmek için giriş yapmalısın." };

  if (!opts.serviceIds.length) return { ok: false, error: "En az bir hizmet seçmelisin." };
  if (opts.date < todayStr()) return { ok: false, error: "Geçmiş bir tarihe randevu alınamaz." };

  const services = await db.service.findMany({
    where: { id: { in: opts.serviceIds }, businessId: opts.businessId },
  });
  if (services.length !== opts.serviceIds.length) {
    return { ok: false, error: "Seçilen hizmetler bulunamadı." };
  }

  const totalDur = services.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = services.reduce((s, x) => s + x.priceTl, 0);
  const endMin = opts.startMin + totalDur;

  // Personel seçimi: belirli personel ya da o saatte müsait ilk personel
  let staffId = opts.staffId;
  if (!staffId) {
    const slots = await getAvailableSlots({
      businessId: opts.businessId,
      date: opts.date,
      durationMin: totalDur,
      serviceIds: opts.serviceIds,
    });
    const slot = slots.find((s) => s.time === opts.startMin);
    if (!slot) return { ok: false, error: "Seçtiğin saat az önce doldu. Lütfen başka bir saat seç." };
    staffId = slot.staffIds[0];
  }

  // Son çakışma kontrolü
  if (await hasConflict({ staffId, date: opts.date, startMin: opts.startMin, endMin })) {
    return { ok: false, error: "Seçtiğin saat az önce doldu. Lütfen başka bir saat seç." };
  }

  let code = generateCode();
  // Kod çakışması (çok düşük ihtimal) için tek tekrar
  if (await db.appointment.findUnique({ where: { code } })) code = generateCode();

  await db.appointment.create({
    data: {
      code,
      businessId: opts.businessId,
      customerId: session.userId,
      staffId,
      date: opts.date,
      startMin: opts.startMin,
      endMin,
      status: "CONFIRMED",
      totalTl,
      note: opts.note?.trim() || null,
      items: {
        create: services.map((s) => ({
          serviceId: s.id,
          name: s.name,
          durationMin: s.durationMin,
          priceTl: s.priceTl,
        })),
      },
    },
  });

  revalidatePath("/hesap");
  revalidatePath("/panel");
  revalidatePath("/panel/takvim");

  return { ok: true, code };
}

export type InlineAuthResult = { ok: true; name: string } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Randevu akışı içinde yönlendirmesiz giriş */
export async function inlineLoginAction(opts: {
  email: string;
  password: string;
}): Promise<InlineAuthResult> {
  const email = opts.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || opts.password.length < 6) {
    return { ok: false, error: "E-posta veya şifre hatalı." };
  }
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(opts.password, user.passwordHash))) {
    return { ok: false, error: "E-posta veya şifre hatalı." };
  }
  await createSession({ userId: user.id, role: user.role, name: user.name });
  return { ok: true, name: user.name };
}

/** Randevu akışı içinde yönlendirmesiz kayıt */
export async function inlineRegisterAction(opts: {
  name: string;
  email: string;
  password: string;
}): Promise<InlineAuthResult> {
  const name = opts.name.trim();
  const email = opts.email.trim().toLowerCase();
  if (name.length < 3) return { ok: false, error: "Lütfen adını ve soyadını gir." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Geçerli bir e-posta adresi gir." };
  if (opts.password.length < 6) return { ok: false, error: "Şifre en az 6 karakter olmalı." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Bu e-posta ile zaten bir hesap var." };

  const user = await db.user.create({
    data: { name, email, passwordHash: await hashPassword(opts.password), role: "CUSTOMER" },
  });
  await createSession({ userId: user.id, role: user.role, name: user.name });
  return { ok: true, name: user.name };
}
