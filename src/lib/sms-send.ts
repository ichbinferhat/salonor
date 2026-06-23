import { db } from "./db";
import { sendSms, smsCreditCost } from "./sms";
import { normalizePhone, isValidTrMobile } from "./phone";

/**
 * Tek bir numaraya kontör düşerek SMS gönderir ve kaydeder.
 * Yalnızca sunucu tarafı yardımcı (server action DEĞİL) — businessId güveni
 * çağırana aittir. Kontör yetersizse gönderim yapılmaz, "failed" kaydı düşülür.
 *
 * `prepaid` true ise, kontör çağıran tarafından (örn. toplu gönderim) atomik
 * olarak önceden ayrılmıştır: bu çağrı bakiye kontrolü yapmaz ve başarılı
 * gönderimde tekrar düşmez; yalnızca başarısız gönderimde ayrılan kontörü iade eder.
 */
export async function chargeAndSendSms(
  businessId: string,
  rawPhone: string,
  body: string,
  kind: "manual" | "confirm" | "reminder" | "bulk" = "manual",
  prepaid = false
): Promise<"sent" | "failed" | "mock"> {
  const phone = normalizePhone(rawPhone);
  const cost = smsCreditCost(body);

  if (!isValidTrMobile(phone)) {
    if (prepaid) {
      // Ayrılan kontörü iade et (geçersiz numara için gönderim yapılmadı).
      await db.business
        .update({ where: { id: businessId }, data: { smsCredits: { increment: cost } } })
        .catch(() => {});
    }
    await db.smsLog
      .create({ data: { businessId, toPhone: phone, body, kind, status: "failed", credits: 0 } })
      .catch(() => {});
    return "failed";
  }

  if (!prepaid) {
    const business = await db.business.findUnique({
      where: { id: businessId },
      select: { smsCredits: true },
    });
    if (!business || business.smsCredits < cost) {
      await db.smsLog
        .create({ data: { businessId, toPhone: phone, body, kind, status: "failed", credits: 0 } })
        .catch(() => {});
      return "failed";
    }
  }

  const res = await sendSms(phone, body);
  const status = res.status; // sent | mock | failed

  if (status === "sent") {
    if (prepaid) {
      // Kontör zaten ayrıldı; sadece kaydı düş.
      await db.smsLog
        .create({ data: { businessId, toPhone: phone, body, kind, status, credits: cost } })
        .catch(() => {});
    } else {
      await db.$transaction([
        db.business.update({ where: { id: businessId }, data: { smsCredits: { decrement: cost } } }),
        db.smsLog.create({ data: { businessId, toPhone: phone, body, kind, status, credits: cost } }),
      ]);
    }
  } else if (status === "mock") {
    // Sağlayıcı yapılandırılmamış: GERÇEK gönderim yapılmadı → kontör DÜŞME.
    if (prepaid) {
      // Toplu gönderimde önceden ayrılmış kontörü iade et.
      await db.business
        .update({ where: { id: businessId }, data: { smsCredits: { increment: cost } } })
        .catch(() => {});
    }
    await db.smsLog
      .create({ data: { businessId, toPhone: phone, body, kind, status: "mock", credits: 0 } })
      .catch(() => {});
  } else {
    if (prepaid) {
      // Gönderim başarısız: ayrılan kontörü iade et.
      await db.business
        .update({ where: { id: businessId }, data: { smsCredits: { increment: cost } } })
        .catch(() => {});
    }
    await db.smsLog
      .create({ data: { businessId, toPhone: phone, body, kind, status: "failed", credits: 0 } })
      .catch(() => {});
  }
  return status;
}
