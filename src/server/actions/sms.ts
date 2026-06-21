"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerBusinessId } from "@/lib/owner";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { chargeAndSendSms } from "@/lib/sms-send";
import { smsCreditCost } from "@/lib/sms";
import { normalizePhone, isValidTrMobile } from "@/lib/phone";

type Result = { ok: true; sent: number; failed: number } | { ok: false; error: string };

/** Owner: bir veya birden çok numaraya toplu SMS gönderir. */
export async function sendBulkSmsAction(opts: {
  phones: string[];
  body: string;
}): Promise<Result> {
  const t = (await getDictionary()).panelOther.sms;
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: t.errorUnauthorized };

  const body = opts.body?.trim();
  if (!body || body.length < 2) return { ok: false, error: t.errorBodyEmpty };
  if (body.length > 500) return { ok: false, error: t.errorBodyTooLong };

  const phones = Array.from(
    new Set((opts.phones ?? []).map((p) => normalizePhone(p)).filter((p) => isValidTrMobile(p)))
  );
  if (phones.length === 0) return { ok: false, error: t.errorNoValidNumber };

  // Toplu gönderim ya hep ya hiç: tüm partinin maliyeti (alıcı × kontör) bakiyeye
  // sığmıyorsa baştan reddet. Aynı anda iki gönderim yarışmasın diye (TOCTOU)
  // kontörü atomik koşullu düşümle önceden ayır; sadece bakiye yetiyorsa düşülür.
  const total = phones.length * smsCreditCost(body);
  const reserved = await db.business.updateMany({
    where: { id: businessId, smsCredits: { gte: total } },
    data: { smsCredits: { decrement: total } },
  });
  if (reserved.count === 0) return { ok: false, error: t.errorInsufficientCredits };

  let sent = 0;
  let failed = 0;
  for (const p of phones) {
    // Kontör yukarıda ayrıldı: prepaid=true ile yeniden düşme, başarısızlıkta iade et.
    const status = await chargeAndSendSms(businessId, p, body, "bulk", true);
    if (status === "failed") failed += 1;
    else sent += 1;
  }

  revalidatePath("/panel/sms");
  return { ok: true, sent, failed };
}
