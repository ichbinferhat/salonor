"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getOwnerBusiness, requireOwnerBusinessId } from "@/lib/owner";
import { slugify } from "@/lib/slug";
import { hasConflict, generateCode } from "@/lib/slots";
import { todayStr } from "@/lib/datetime";

export type ActionState = { error?: string; ok?: boolean } | undefined;

/* ───────────────────────── Onboarding ───────────────────────── */

export type OnboardingData = {
  name: string;
  categorySlug: string;
  description: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  openMin: number;
  closeMin: number;
  closedDays: number[]; // kapalı gün indexleri (0=Pazar)
  services: { name: string; durationMin: number; priceTl: number }[];
};

export async function createBusinessAction(
  data: OnboardingData
): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session || session.role !== "OWNER") {
    return { ok: false, error: "İşletme hesabıyla giriş yapmalısın." };
  }

  const existing = await db.business.findUnique({ where: { ownerId: session.userId } });
  if (existing) return { ok: false, error: "Zaten bir işletmen var." };

  if (data.name.trim().length < 2) return { ok: false, error: "İşletme adı gerekli." };
  if (data.services.length === 0) return { ok: false, error: "En az bir hizmet ekle." };

  const category = await db.category.findUnique({ where: { slug: data.categorySlug } });
  if (!category) return { ok: false, error: "Geçersiz kategori." };

  // Benzersiz slug üret
  const base = slugify(data.name) || "salon";
  let slug = base;
  let n = 1;
  while (await db.business.findUnique({ where: { slug } })) {
    slug = `${base}-${++n}`;
  }

  const cover =
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop";

  await db.business.create({
    data: {
      slug,
      name: data.name.trim(),
      description: data.description.trim() || `${data.name.trim()} — ${category.name}`,
      phone: data.phone.trim(),
      address: data.address.trim(),
      district: data.district.trim(),
      city: data.city.trim(),
      lat: data.lat,
      lng: data.lng,
      coverImage: cover,
      ownerId: session.userId,
      categoryId: category.id,
      images: { create: [{ url: cover, sort: 0 }] },
      hours: {
        create: Array.from({ length: 7 }, (_, weekday) => ({
          weekday,
          openMin: data.openMin,
          closeMin: data.closeMin,
          closed: data.closedDays.includes(weekday),
        })),
      },
      serviceCategories: {
        create: {
          name: "Hizmetler",
          sort: 0,
          services: {
            create: data.services.map((s, i) => ({
              name: s.name.trim(),
              durationMin: s.durationMin,
              priceTl: s.priceTl,
              sort: i,
              business: { connect: { slug } },
            })),
          },
        },
      },
    },
  });

  revalidatePath("/panel");
  return { ok: true, slug };
}

/* ───────────────────────── Hizmet kategorileri ───────────────────────── */

export async function addServiceCategoryAction(_p: ActionState, formData: FormData): Promise<ActionState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Bölüm adı gerekli." };

  const count = await db.serviceCategory.count({ where: { businessId } });
  await db.serviceCategory.create({ data: { businessId, name, sort: count } });
  revalidatePath("/panel/hizmetler");
  return { ok: true };
}

export async function deleteServiceCategoryAction(categoryId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const cat = await db.serviceCategory.findUnique({ where: { id: categoryId } });
  if (cat?.businessId !== businessId) return;
  await db.serviceCategory.delete({ where: { id: categoryId } });
  revalidatePath("/panel/hizmetler");
}

/* ───────────────────────── Hizmetler ───────────────────────── */

export async function saveServiceAction(_p: ActionState, formData: FormData): Promise<ActionState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const id = String(formData.get("id") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const durationMin = Number(formData.get("durationMin"));
  const priceTl = Number(formData.get("priceTl"));

  if (name.length < 2) return { error: "Hizmet adı gerekli." };
  if (!Number.isFinite(durationMin) || durationMin < 5) return { error: "Geçerli bir süre gir (dk)." };
  if (!Number.isFinite(priceTl) || priceTl < 0) return { error: "Geçerli bir fiyat gir." };

  const cat = await db.serviceCategory.findFirst({ where: { id: categoryId, businessId } });
  if (!cat) return { error: "Bölüm bulunamadı." };

  if (id) {
    const svc = await db.service.findFirst({ where: { id, businessId } });
    if (!svc) return { error: "Hizmet bulunamadı." };
    await db.service.update({
      where: { id },
      data: { name, description: description || null, durationMin, priceTl, categoryId },
    });
  } else {
    const count = await db.service.count({ where: { categoryId } });
    const svc = await db.service.create({
      data: { businessId, categoryId, name, description: description || null, durationMin, priceTl, sort: count },
    });
    // Yeni hizmeti tüm aktif personele ata
    const staff = await db.staff.findMany({ where: { businessId, active: true }, select: { id: true } });
    if (staff.length) {
      await db.staffService.createMany({
        data: staff.map((s) => ({ staffId: s.id, serviceId: svc.id })),
      });
    }
  }

  revalidatePath("/panel/hizmetler");
  return { ok: true };
}

export async function deleteServiceAction(serviceId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const svc = await db.service.findFirst({ where: { id: serviceId, businessId } });
  if (!svc) return;
  await db.service.delete({ where: { id: serviceId } });
  revalidatePath("/panel/hizmetler");
}

/* ───────────────────────── Personel ───────────────────────── */

const AVATAR_FALLBACKS = [11, 12, 13, 14, 15, 16, 20, 26, 33, 47, 51, 60];

export async function saveStaffAction(_p: ActionState, formData: FormData): Promise<ActionState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (name.length < 2) return { error: "Personel adı gerekli." };

  if (id) {
    const st = await db.staff.findFirst({ where: { id, businessId } });
    if (!st) return { error: "Personel bulunamadı." };
    await db.staff.update({ where: { id }, data: { name, title: title || "Uzman" } });
  } else {
    const count = await db.staff.count({ where: { businessId } });
    const img = `https://i.pravatar.cc/300?img=${AVATAR_FALLBACKS[count % AVATAR_FALLBACKS.length]}`;
    const st = await db.staff.create({
      data: { businessId, name, title: title || "Uzman", image: img },
    });
    // Yeni personele tüm hizmetleri ata
    const services = await db.service.findMany({ where: { businessId }, select: { id: true } });
    if (services.length) {
      await db.staffService.createMany({
        data: services.map((s) => ({ staffId: st.id, serviceId: s.id })),
      });
    }
  }

  revalidatePath("/panel/personel");
  revalidatePath("/panel/takvim");
  return { ok: true };
}

export async function toggleStaffActiveAction(staffId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const st = await db.staff.findFirst({ where: { id: staffId, businessId } });
  if (!st) return;
  await db.staff.update({ where: { id: staffId }, data: { active: !st.active } });
  revalidatePath("/panel/personel");
  revalidatePath("/panel/takvim");
}

export async function deleteStaffAction(staffId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const st = await db.staff.findFirst({ where: { id: staffId, businessId } });
  if (!st) return;
  // Gelecek randevusu varsa silme, pasifleştir
  const upcoming = await db.appointment.count({
    where: { staffId, date: { gte: todayStr() }, status: "CONFIRMED" },
  });
  if (upcoming > 0) {
    await db.staff.update({ where: { id: staffId }, data: { active: false } });
  } else {
    await db.staff.delete({ where: { id: staffId } });
  }
  revalidatePath("/panel/personel");
  revalidatePath("/panel/takvim");
}

/* ───────────────────────── Randevu yönetimi (panel) ───────────────────────── */

export async function createWalkInAction(opts: {
  staffId: string;
  date: string;
  startMin: number;
  serviceIds: string[];
  customerName: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const staff = await db.staff.findFirst({ where: { id: opts.staffId, businessId } });
  if (!staff) return { ok: false, error: "Personel bulunamadı." };
  if (opts.serviceIds.length === 0) return { ok: false, error: "En az bir hizmet seç." };

  const services = await db.service.findMany({
    where: { id: { in: opts.serviceIds }, businessId },
  });
  if (services.length === 0) return { ok: false, error: "Hizmet bulunamadı." };

  const totalDur = services.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = services.reduce((s, x) => s + x.priceTl, 0);
  const endMin = opts.startMin + totalDur;

  if (await hasConflict({ staffId: opts.staffId, date: opts.date, startMin: opts.startMin, endMin })) {
    return { ok: false, error: "Bu saatte personelin başka randevusu var." };
  }

  let code = generateCode();
  if (await db.appointment.findUnique({ where: { code } })) code = generateCode();

  await db.appointment.create({
    data: {
      code,
      businessId,
      customerName: opts.customerName.trim() || "Salon müşterisi",
      staffId: opts.staffId,
      date: opts.date,
      startMin: opts.startMin,
      endMin,
      status: "CONFIRMED",
      totalTl,
      items: {
        create: services.map((s) => ({
          serviceId: s.id, name: s.name, durationMin: s.durationMin, priceTl: s.priceTl,
        })),
      },
    },
  });

  revalidatePath("/panel/takvim");
  revalidatePath("/panel");
  return { ok: true };
}

export async function setAppointmentStatusAction(
  appointmentId: string,
  status: "COMPLETED" | "CANCELLED" | "NO_SHOW" | "CONFIRMED"
) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const appt = await db.appointment.findFirst({ where: { id: appointmentId, businessId } });
  if (!appt) return;
  await db.appointment.update({ where: { id: appointmentId }, data: { status } });
  revalidatePath("/panel/takvim");
  revalidatePath("/panel");
}

/* ───────────────────────── Yorum yanıtı ───────────────────────── */

export async function replyReviewAction(_p: ActionState, formData: FormData): Promise<ActionState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };
  const reviewId = String(formData.get("reviewId") ?? "");
  const reply = String(formData.get("reply") ?? "").trim();

  const review = await db.review.findFirst({ where: { id: reviewId, businessId } });
  if (!review) return { error: "Yorum bulunamadı." };

  await db.review.update({ where: { id: reviewId }, data: { reply: reply || null } });
  revalidatePath("/panel/yorumlar");
  return { ok: true };
}

/* ───────────────────────── Ayarlar ───────────────────────── */

export async function updateBusinessAction(_p: ActionState, formData: FormData): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { error: "Yetkisiz." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  if (name.length < 2) return { error: "İşletme adı gerekli." };

  const validCoords =
    Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;

  await db.business.update({
    where: { id: business.id },
    data: {
      name,
      description,
      phone,
      address,
      district,
      city,
      ...(validCoords ? { lat, lng } : {}),
    },
  });

  revalidatePath("/panel/ayarlar");
  revalidatePath(`/salon/${business.slug}`);
  return { ok: true };
}

export async function updateHoursAction(
  hours: { weekday: number; openMin: number; closeMin: number; closed: boolean }[]
): Promise<{ ok: boolean }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false };

  await Promise.all(
    hours.map((h) =>
      db.workingHour.upsert({
        where: { businessId_weekday: { businessId, weekday: h.weekday } },
        update: { openMin: h.openMin, closeMin: h.closeMin, closed: h.closed },
        create: { businessId, weekday: h.weekday, openMin: h.openMin, closeMin: h.closeMin, closed: h.closed },
      })
    )
  );

  revalidatePath("/panel/ayarlar");
  revalidatePath("/panel/takvim");
  return { ok: true };
}

export async function updateCoverAction(imageUrl: string) {
  const business = await getOwnerBusiness();
  if (!business) return;
  await db.business.update({ where: { id: business.id }, data: { coverImage: imageUrl } });
  revalidatePath("/panel/ayarlar");
  revalidatePath(`/salon/${business.slug}`);
}
