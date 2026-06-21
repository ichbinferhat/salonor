"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getSession, createSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getAvailableSlots, generateCode, type Slot } from "@/lib/slots";
import { todayStr, addDaysStr, minToHHMM, formatDateTr } from "@/lib/datetime";
import { isValidTrMobile } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";
import { chargeAndSendSms } from "@/lib/sms-send";
import { smsConfigured } from "@/lib/sms";

/** İstek sahibinin IP'si (hız sınırı anahtarı için). */
async function clientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

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

/** Aktif + süresi geçmemiş kampanyayı bulur (işletmeye ait). */
async function findValidCampaign(businessId: string, code: string) {
  const c = code.trim().toUpperCase();
  if (!c) return null;
  const camp = await db.campaign.findFirst({ where: { businessId, code: c, active: true } });
  if (!camp) return null;
  if (camp.expiresAt && camp.expiresAt < todayStr()) return null;
  return camp;
}

export async function validateCampaignAction(
  businessId: string,
  code: string
): Promise<{ ok: true; code: string; discountPct: number } | { ok: false; error: string }> {
  // Kupon kodu tahmini/enumerasyonunu sınırla (IP başına 10 dk'da 15 deneme).
  const ip = await clientIp();
  if (!rateLimit(`coupon:${ip}`, 15, 10 * 60 * 1000).ok) {
    return { ok: false, error: "Çok fazla deneme. Lütfen biraz sonra tekrar dene." };
  }
  const camp = await findValidCampaign(businessId, code);
  if (!camp) return { ok: false, error: "Kod geçersiz veya süresi dolmuş." };
  return { ok: true, code: camp.code, discountPct: camp.discountPct };
}

export type BookingResult =
  | { ok: true; code: string; couponDropped?: boolean }
  | { ok: false; error: string };

export async function createAppointmentAction(opts: {
  businessId: string;
  serviceIds: string[];
  staffId: string | null;
  date: string;
  startMin: number;
  note?: string;
  customerName?: string;
  customerPhone?: string;
  campaignCode?: string;
}): Promise<BookingResult> {
  const session = await getSession();
  const custName = (opts.customerName ?? "").trim();
  const custPhone = (opts.customerPhone ?? "").trim();
  if (!session) {
    if (custName.length < 3) return { ok: false, error: "Lütfen adını ve soyadını gir." };
    if (!isValidTrMobile(custPhone))
      return { ok: false, error: "Geçerli bir cep telefonu numarası gir (05XX XXX XX XX)." };
  } else if (custPhone && !isValidTrMobile(custPhone)) {
    // Girişli kullanıcıda telefon opsiyonel; ancak doluysa geçerli olmalı
    // (bozuk numaranın kaydedilmesini ve teyit SMS'inin boşa gitmesini engelle).
    return { ok: false, error: "Geçerli bir cep telefonu numarası gir (05XX XXX XX XX)." };
  }

  if (!opts.serviceIds.length) return { ok: false, error: "En az bir hizmet seçmelisin." };

  // Tarih ve saat sınır doğrulaması (sunucu tarafı — istemci payload'ına güvenilmez).
  const today = todayStr();
  if (opts.date < today) return { ok: false, error: "Geçmiş bir tarihe randevu alınamaz." };
  if (opts.date > addDaysStr(today, 30))
    return { ok: false, error: "Şimdilik en fazla 30 gün ilerisi için randevu alabilirsin." };
  if (!Number.isInteger(opts.startMin) || opts.startMin < 0 || opts.startMin >= 1440)
    return { ok: false, error: "Geçersiz saat seçimi." };

  // Misafir rezervasyon spam koruması (IP başına saatte 8).
  if (!session) {
    const ip = await clientIp();
    if (!rateLimit(`book:${ip}`, 8, 60 * 60 * 1000).ok)
      return { ok: false, error: "Çok fazla randevu denemesi. Lütfen biraz sonra tekrar dene." };
  }

  try {
    const services = await db.service.findMany({
      where: { id: { in: opts.serviceIds }, businessId: opts.businessId },
    });
    if (services.length !== opts.serviceIds.length) {
      return { ok: false, error: "Seçilen hizmetler bulunamadı." };
    }

    const totalDur = services.reduce((s, x) => s + x.durationMin, 0);
    let totalTl = services.reduce((s, x) => s + x.priceTl, 0);
    const endMin = opts.startMin + totalDur;

    // İndirim kodu uygula. İstemcide geçerli görünen kupon, rezervasyon anında
    // süresi dolmuş/pasif olabilir; bu durumda sessizce tam ücret almak yerine
    // "kupon düştü" bayrağıyla kullanıcıyı bilgilendiririz.
    let appliedCampaignId: string | null = null;
    let couponDropped = false;
    if (opts.campaignCode) {
      const camp = await findValidCampaign(opts.businessId, opts.campaignCode);
      if (camp) {
        totalTl = Math.round((totalTl * (100 - camp.discountPct)) / 100);
        appliedCampaignId = camp.id;
      } else {
        couponDropped = true;
      }
    }

    // Slot doğrulama — HEM "farketmez" HEM "belirli personel" yolu buradan geçer.
    // getAvailableSlots tek noktada şunları garanti eder: personelin bu işletmeye ait
    // olması, aktif olması, seçilen TÜM hizmetleri yapabilmesi (StaffService), saatin
    // çalışma saatleri içinde + 15dk ızgarada olması, kapalı gün olmaması ve bugün için
    // LEAD_TIME. (Server action herkese açık olduğundan istemci doğrulamasına güvenilmez.)
    const slots = await getAvailableSlots({
      businessId: opts.businessId,
      date: opts.date,
      durationMin: totalDur,
      staffId: opts.staffId ?? undefined,
      serviceIds: opts.serviceIds,
    });
    const slot = slots.find((s) => s.time === opts.startMin);
    if (!slot || (opts.staffId && !slot.staffIds.includes(opts.staffId))) {
      return { ok: false, error: "Seçtiğin saat uygun değil. Lütfen başka bir saat seç." };
    }

    // Aday personel(ler): belirli personel ya da o saatte müsait olanların TÜMÜ (fallback).
    const candidateStaff = opts.staffId ? [opts.staffId] : slot.staffIds;

    // Atomik rezervasyon: Serializable transaction içinde çakışmayı YENİDEN kontrol et,
    // boş ilk personeli seç ve oluştur. DB'deki kısmi unique index (staffId,date,startMin
    // — yalnızca CONFIRMED/COMPLETED) ile birlikte iki eşzamanlı isteğin aynı slota çift
    // rezervasyon yapmasını (overbooking) engeller: birebir aynı slotta unique index
    // (P2002), örtüşen farklı-başlangıçlı yarışta Postgres SSI (P2034) devreye girer —
    // ikisi de "saat doldu" olarak ele alınır.
    let createdCode: string | null;
    try {
      createdCode = await db.$transaction(
        async (tx) => {
          let chosen: string | null = null;
          for (const sid of candidateStaff) {
            const conflicts = await tx.appointment.count({
              where: {
                staffId: sid,
                date: opts.date,
                status: { in: ["CONFIRMED", "COMPLETED"] },
                startMin: { lt: endMin },
                endMin: { gt: opts.startMin },
              },
            });
            if (conflicts === 0) {
              chosen = sid;
              break;
            }
          }
          if (!chosen) return null;

          let code = generateCode();
          if (await tx.appointment.findUnique({ where: { code } })) code = generateCode();

          await tx.appointment.create({
            data: {
              code,
              businessId: opts.businessId,
              customerId: session?.userId ?? null,
              customerName: custName || session?.name || null,
              customerPhone: custPhone || null,
              staffId: chosen,
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
          return code;
        },
        { isolationLevel: "Serializable" }
      );
    } catch (e) {
      const errCode = (e as { code?: string })?.code;
      if (errCode === "P2002" || errCode === "P2034") {
        return { ok: false, error: "Seçtiğin saat az önce doldu. Lütfen başka bir saat seç." };
      }
      throw e;
    }

    if (!createdCode) {
      return { ok: false, error: "Seçtiğin saat az önce doldu. Lütfen başka bir saat seç." };
    }
    const code = createdCode;

    if (appliedCampaignId) {
      await db.campaign.update({
        where: { id: appliedCampaignId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Randevu teyit SMS'i — yalnızca gerçek SMS sağlayıcı tanımlıysa (mock modda
    // boşuna kontör düşmesin). Gönderim başarısızlığı randevuyu bozmaz.
    if (custPhone && smsConfigured()) {
      try {
        const biz = await db.business.findUnique({
          where: { id: opts.businessId },
          select: { name: true, smsCredits: true },
        });
        if (biz && biz.smsCredits > 0) {
          const dateLabel = formatDateTr(opts.date, { day: "numeric", month: "long" });
          const body = `${biz.name}: Randevunuz ${dateLabel} ${minToHHMM(opts.startMin)} icin onaylandi. Kod: ${code}`;
          await chargeAndSendSms(opts.businessId, custPhone, body, "confirm");
        }
      } catch (e) {
        console.error("randevu teyit SMS hatası:", e);
      }
    }

    revalidatePath("/hesap");
    revalidatePath("/panel");
    revalidatePath("/panel/takvim");

    return { ok: true, code, couponDropped };
  } catch (e) {
    console.error("createAppointmentAction error:", e);
    return { ok: false, error: "Randevu oluşturulamadı. Lütfen tekrar dene." };
  }
}

export type InlineAuthResult = { ok: true; name: string } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Randevu akışı içinde yönlendirmesiz giriş */
export async function inlineLoginAction(opts: {
  email: string;
  password: string;
}): Promise<InlineAuthResult> {
  // Kaba kuvvet / credential-stuffing koruması: form girişiyle (auth.ts loginAction)
  // AYNI kovayı paylaşır (`login:IP`), böylece iki giriş yolu TOPLAMDA 10 dk'da 10
  // denemeyle sınırlıdır — saldırgan denemeleri iki yola bölerek limiti aşamaz.
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 10, 10 * 60 * 1000).ok) {
    return { ok: false, error: "Çok fazla deneme. Lütfen birkaç dakika sonra tekrar dene." };
  }

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
  // Kayıt suistimali (kitle hesap oluşturma) koruması: IP başına saatte 8 kayıt.
  const ip = await clientIp();
  if (!rateLimit(`register:${ip}`, 8, 60 * 60 * 1000).ok) {
    return { ok: false, error: "Çok fazla deneme. Lütfen birazdan tekrar dene." };
  }

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
