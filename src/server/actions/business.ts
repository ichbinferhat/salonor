"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getOwnerBusiness, requireOwnerBusinessId } from "@/lib/owner";
import { slugify } from "@/lib/slug";
import { generateCode } from "@/lib/slots";
import { todayStr } from "@/lib/datetime";
import { recomputeBusinessRating } from "@/lib/rating";
import { normalizePhone, isValidTrMobile } from "@/lib/phone";
import { PLANS, isPlanKey } from "@/lib/plans";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";

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
  if (!Number.isFinite(durationMin) || durationMin < 5 || durationMin > 1440)
    return { error: "Geçerli bir süre gir (dk)." };
  if (!Number.isFinite(priceTl) || priceTl < 0 || priceTl > 100_000_000)
    return { error: "Geçerli bir fiyat gir." };

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
    // Yeni hizmeti TÜM personele ata (pasif dahil). Pasif personelin StaffService'i
    // olması zararsızdır (booking aktiflik kontrolünü ayrıca yapar); böylece personel
    // tekrar aktifleştiğinde, pasifken eklenmiş hizmetlere de online randevuya çıkar.
    const staff = await db.staff.findMany({ where: { businessId }, select: { id: true } });
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
  const business = await getOwnerBusiness();
  if (!business) return { error: "Yetkisiz." };
  const businessId = business.id;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (name.length < 2) return { error: "Personel adı gerekli." };

  if (id) {
    const st = await db.staff.findFirst({ where: { id, businessId } });
    if (!st) return { error: "Personel bulunamadı." };
    await db.staff.update({ where: { id }, data: { name, title: title || "Uzman" } });
  } else {
    // Plan personel limiti — yalnızca YENİ personel eklerken uygula (geçmiş limit-üstü
    // personele dokunma). Aktif personel sayısı limite ulaştıysa yeni ekleme engellenir.
    const plan = isPlanKey(business.plan) ? PLANS[business.plan] : PLANS.baslangic;
    const activeCount = await db.staff.count({ where: { businessId, active: true } });
    if (activeCount >= plan.staff) {
      const m = (await getDictionary()).panelCatalog.staff;
      return { error: interpolate(m.staffLimitReached, { limit: plan.staff, plan: plan.name }) };
    }
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
  // Personelin HERHANGİ bir randevusu (geçmiş dahil) varsa kalıcı SİLME, pasifleştir.
  // Aksi halde onDelete: Cascade tüm randevu + ciro + istatistik geçmişini yok eder.
  const anyAppt = await db.appointment.count({ where: { staffId } });
  if (anyAppt > 0) {
    await db.staff.update({ where: { id: staffId }, data: { active: false } });
  } else {
    await db.staff.delete({ where: { id: staffId } });
  }
  revalidatePath("/panel/personel");
  revalidatePath("/panel/takvim");
}

/**
 * Bir personelin yapabileceği hizmetleri (StaffService satırları) toptan günceller.
 * Verilen serviceIds, personelin yeni tam hizmet listesidir: eksilenler silinir,
 * eklenenler oluşturulur. Hem personel hem TÜM hizmet ID'leri sahibin işletmesine
 * ait olmalı (yabancı/silinmiş ID sessizce düşmez).
 */
export async function setStaffServicesAction(
  staffId: string,
  serviceIds: string[]
): Promise<{ ok: boolean; error?: string }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: "Yetkisiz." };

  const staff = await db.staff.findFirst({ where: { id: staffId, businessId }, select: { id: true } });
  if (!staff) return { ok: false, error: "Personel bulunamadı." };

  // Tekilleştir + sahiplik doğrula: tüm ID'ler bu işletmenin gerçek hizmetleri olmalı.
  const uniqueIds = [...new Set(serviceIds)];
  if (uniqueIds.length) {
    const owned = await db.service.count({ where: { id: { in: uniqueIds }, businessId } });
    if (owned !== uniqueIds.length) return { ok: false, error: "Geçersiz hizmet." };
  }

  // Mevcut atamalar; sadece farkı uygula (gereksiz yazma yok), atomik transaction içinde.
  const existing = await db.staffService.findMany({
    where: { staffId },
    select: { serviceId: true },
  });
  const current = new Set(existing.map((e) => e.serviceId));
  const next = new Set(uniqueIds);
  const toAdd = uniqueIds.filter((sid) => !current.has(sid));
  const toRemove = [...current].filter((sid) => !next.has(sid));

  if (toAdd.length || toRemove.length) {
    await db.$transaction([
      ...(toRemove.length
        ? [db.staffService.deleteMany({ where: { staffId, serviceId: { in: toRemove } } })]
        : []),
      ...(toAdd.length
        ? [db.staffService.createMany({ data: toAdd.map((serviceId) => ({ staffId, serviceId })) })]
        : []),
    ]);
  }

  revalidatePath("/panel/personel");
  revalidatePath("/panel/takvim");
  return { ok: true };
}

/* ───────────────────────── Randevu yönetimi (panel) ───────────────────────── */

export async function createWalkInAction(opts: {
  staffId: string;
  date: string;
  startMin: number;
  serviceIds: string[];
  customerName: string;
  customerPhone?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const m = (await getDictionary()).business.walkInErrors;
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: m.unauthorized };

  const staff = await db.staff.findFirst({ where: { id: opts.staffId, businessId } });
  if (!staff) return { ok: false, error: m.staffNotFound };
  if (opts.serviceIds.length === 0) return { ok: false, error: m.selectService };

  const services = await db.service.findMany({
    where: { id: { in: opts.serviceIds }, businessId },
  });
  // Gönderilen TÜM hizmet ID'leri geçerli olmalı (yabancı/silinmiş ID sessizce
  // düşerse süre/fiyat eksik hesaplanır). booking.ts ile aynı sağlam kontrol.
  if (services.length !== opts.serviceIds.length) {
    return { ok: false, error: m.servicesNotFound };
  }
  if (!Number.isInteger(opts.startMin) || opts.startMin < 0 || opts.startMin >= 1440) {
    return { ok: false, error: m.invalidTime };
  }

  // Personel-hizmet uyumu: panel walk-in'i online booking (booking.ts) ile tutarlı
  // tutmak için, personelin yapamadığı (StaffService ataması olmayan) bir hizmet
  // seçilmişse hata dön. Aksi halde prim/ciro raporlarında personele yapmadığı bir
  // hizmetin cirosu yazılır.
  const assigned = await db.staffService.findMany({
    where: { staffId: opts.staffId, serviceId: { in: opts.serviceIds } },
    select: { serviceId: true },
  });
  if (assigned.length !== opts.serviceIds.length) {
    return { ok: false, error: m.staffServiceMismatch };
  }

  // Opsiyonel telefon (hatırlatma için): boş bırakılabilir, ama girilirse geçerli
  // bir TR cep numarası olmalı.
  const custPhoneRaw = (opts.customerPhone ?? "").trim();
  let customerPhone: string | null = null;
  if (custPhoneRaw) {
    if (!isValidTrMobile(custPhoneRaw)) {
      return { ok: false, error: m.invalidPhone };
    }
    customerPhone = normalizePhone(custPhoneRaw);
  }

  const totalDur = services.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = services.reduce((s, x) => s + x.priceTl, 0);
  const endMin = opts.startMin + totalDur;

  // Randevu gün sonunu (24:00) aşamaz — aşan blok takvimde grid dışına taşar.
  if (endMin > 1440) {
    return { ok: false, error: m.pastDayEnd };
  }

  // Atomik: çakışmayı transaction içinde yeniden kontrol et + oluştur. Online randevu
  // ile aynı slota çift rezervasyonu önler (DB kısmi unique index + Serializable izolasyon).
  // Not: Kapalı gün/çalışma saati kontrolü yapılmaz — sahip bilinçli olarak istisna
  // randevu ekleyebilsin (calendar-board bunu açıkça sunuyor).
  try {
    const created = await db.$transaction(
      async (tx) => {
        const conflicts = await tx.appointment.count({
          where: {
            staffId: opts.staffId,
            date: opts.date,
            status: { in: ["CONFIRMED", "COMPLETED"] },
            startMin: { lt: endMin },
            endMin: { gt: opts.startMin },
          },
        });
        if (conflicts > 0) return false;

        let code = generateCode();
        if (await tx.appointment.findUnique({ where: { code } })) code = generateCode();

        await tx.appointment.create({
          data: {
            code,
            businessId,
            customerName: opts.customerName.trim() || "Salon müşterisi",
            customerPhone,
            staffId: opts.staffId,
            date: opts.date,
            startMin: opts.startMin,
            endMin,
            status: "CONFIRMED",
            totalTl,
            seenAt: new Date(), // sahibin kendi eklediği randevu zaten görülmüş sayılır
            items: {
              create: services.map((s) => ({
                serviceId: s.id, name: s.name, durationMin: s.durationMin, priceTl: s.priceTl,
              })),
            },
          },
        });
        return true;
      },
      { isolationLevel: "Serializable" }
    );
    if (!created) return { ok: false, error: m.slotTaken };
  } catch (e) {
    const errCode = (e as { code?: string })?.code;
    if (errCode === "P2002" || errCode === "P2034") {
      return { ok: false, error: m.slotTaken };
    }
    console.error("createWalkInAction error:", e);
    return { ok: false, error: m.createFailed };
  }

  revalidatePath("/panel/takvim");
  revalidatePath("/panel");
  return { ok: true };
}

/** İşletme sahibinin görmediği (online gelen) yaklaşan randevu sayısı — bildirim rozeti için. */
export async function getUnseenAppointmentCountAction(): Promise<number> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return 0;
  return db.appointment.count({
    where: {
      businessId,
      seenAt: null,
      status: "CONFIRMED",
      date: { gte: todayStr() },
    },
  });
}

/**
 * Görülmemiş randevuları "görüldü" işaretler. id verilmezse sahibinin tüm
 * yaklaşan görülmemiş randevuları işaretlenir. Geriye kalan görülmemiş sayısını döner.
 */
export async function markAppointmentsSeenAction(
  appointmentId?: string
): Promise<{ ok: boolean; remaining: number }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, remaining: 0 };

  await db.appointment.updateMany({
    where: {
      businessId,
      seenAt: null,
      status: "CONFIRMED",
      date: { gte: todayStr() },
      ...(appointmentId ? { id: appointmentId } : {}),
    },
    data: { seenAt: new Date() },
  });

  const remaining = await db.appointment.count({
    where: { businessId, seenAt: null, status: "CONFIRMED", date: { gte: todayStr() } },
  });

  revalidatePath("/panel/bildirimler");
  revalidatePath("/panel");
  return { ok: true, remaining };
}

export async function setAppointmentStatusAction(
  appointmentId: string,
  status: "COMPLETED" | "CANCELLED" | "NO_SHOW" | "CONFIRMED"
) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const appt = await db.appointment.findFirst({ where: { id: appointmentId, businessId } });
  if (!appt) return;
  if (appt.status === status) return; // zaten bu durumda — gereksiz yazma/revalidate yok
  await db.appointment.update({ where: { id: appointmentId }, data: { status } });
  revalidatePath("/panel/takvim");
  revalidatePath("/panel");
}

/** Randevuyu "hatırlatıldı" olarak işaretler / işareti kaldırır (çift gönderimi önlemek için). */
export async function markReminderSentAction(
  appointmentId: string,
  sent: boolean
): Promise<{ ok: boolean }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false };
  const appt = await db.appointment.findFirst({ where: { id: appointmentId, businessId } });
  if (!appt) return { ok: false };
  await db.appointment.update({
    where: { id: appointmentId },
    data: { reminderSentAt: sent ? new Date() : null },
  });
  revalidatePath("/panel/bildirimler");
  return { ok: true };
}

/* ───────────────────────── Yorum yanıtı ───────────────────────── */

export async function replyReviewAction(_p: ActionState, formData: FormData): Promise<ActionState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };
  const reviewId = String(formData.get("reviewId") ?? "");
  const reply = String(formData.get("reply") ?? "").trim();

  const review = await db.review.findFirst({ where: { id: reviewId, businessId } });
  if (!review) return { error: "Yorum bulunamadı." };

  // Yanıt uzunluk doğrulaması (boş yanıt = yanıtı kaldırma, kasıtlı izinli).
  if (reply.length > 0 && reply.length < 2) return { error: "Yanıt çok kısa." };
  if (reply.length > 1000) return { error: "Yanıt çok uzun (en fazla 1000 karakter)." };

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
  const whatsappRaw = String(formData.get("whatsappPhone") ?? "").trim();
  // İsteğe bağlı WhatsApp hattı: girilmişse geçerli bir cep numarası olmalı, yoksa null.
  const whatsappDigits = normalizePhone(whatsappRaw);
  const whatsappPhone = whatsappRaw && isValidTrMobile(whatsappDigits) ? whatsappDigits : null;
  const address = String(formData.get("address") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const googlePlaceIdRaw = String(formData.get("googlePlaceId") ?? "").trim();
  // Kullanıcı tam URL yapıştırırsa içinden place_id'yi ayıkla, yoksa olduğu gibi al.
  const googlePlaceId =
    (/place_id[=:]([\w-]+)/.exec(googlePlaceIdRaw)?.[1] ?? googlePlaceIdRaw) || null;

  // Öne çıkan kampanya/duyuru (salon sayfasında şerit olarak görünür)
  const promoText = String(formData.get("promoText") ?? "").trim();
  const promoUntilRaw = String(formData.get("promoUntil") ?? "").trim();
  const promoUntil = /^\d{4}-\d{2}-\d{2}$/.test(promoUntilRaw) ? promoUntilRaw : null;

  if (name.length < 2) return { error: "İşletme adı gerekli." };
  if (whatsappRaw && !isValidTrMobile(whatsappDigits))
    return { error: "WhatsApp numarası geçerli bir cep telefonu olmalı (05XX XXX XX XX) veya boş bırakılmalı." };

  const validCoords =
    Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;

  await db.business.update({
    where: { id: business.id },
    data: {
      name,
      description,
      phone,
      whatsappPhone,
      address,
      district,
      city,
      googlePlaceId,
      promoText: promoText || null,
      promoUntil,
      ...(validCoords ? { lat, lng } : {}),
    },
  });

  revalidatePath("/panel/ayarlar");
  revalidatePath(`/salon/${business.slug}`);
  return { ok: true };
}

/**
 * İşletme sahibi kendi salonundaki bir yorumu siler (spam/sahte/uygunsuz yorum
 * moderasyonu). Sadece kendi işletmesinin yorumuna dokunabilir; silince puan
 * ortalaması ve sayısı yeniden hesaplanır.
 */
export async function deleteReviewAction(reviewId: string): Promise<{ ok: boolean }> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false };

  const review = await db.review.findFirst({
    where: { id: reviewId, businessId: business.id },
    select: { id: true },
  });
  if (!review) return { ok: false };

  await db.review.delete({ where: { id: reviewId } });
  await recomputeBusinessRating(business.id);

  revalidatePath("/panel/yorumlar");
  revalidatePath(`/salon/${business.slug}`);
  return { ok: true };
}

/**
 * İşletme sahibi bir yorumu "şikayet" eder (sahte/uygunsuz olduğunu düşünüyorsa).
 * Yorum silinmez/gizlenmez — sadece admin panelinde incelensin diye işaretlenir.
 * Bu, sahibinin gerçek olumsuz yorumu doğrudan silmesine alternatif dürüst yoldur.
 */
export async function reportReviewAction(reviewId: string): Promise<{ ok: boolean }> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false };

  const review = await db.review.findFirst({
    where: { id: reviewId, businessId: business.id },
    select: { id: true },
  });
  if (!review) return { ok: false };

  await db.review.update({ where: { id: reviewId }, data: { reported: true } });
  revalidatePath("/panel/yorumlar");
  return { ok: true };
}

export async function updateHoursAction(
  hours: { weekday: number; openMin: number; closeMin: number; closed: boolean }[]
): Promise<{ ok: boolean }> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false };

  // Sunucu doğrulaması (server action herkese açık, istemci doğrulamasına güvenilmez):
  // açık günlerde açılış >= kapanış geçersizdir; aksi halde o gün hiç slot üretilmez
  // ve müşteriye sessizce kapalı görünür.
  for (const h of hours) {
    if (h.closed) continue;
    if (
      !Number.isInteger(h.openMin) ||
      !Number.isInteger(h.closeMin) ||
      h.openMin < 0 ||
      h.closeMin > 1440 ||
      h.openMin >= h.closeMin
    ) {
      return { ok: false };
    }
  }

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
