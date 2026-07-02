import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { chargeAndSendSms } from "@/lib/sms-send";
import { smsConfigured, smsCreditCost } from "@/lib/sms";
import { sendWhatsApp, whatsappConfigured } from "@/lib/whatsapp";
import { sendEmail, emailConfigured } from "@/lib/email";
import { emailLayout, esc } from "@/lib/email-templates";
import { signApptShort } from "@/lib/appt-token";
import { buildApptMessage } from "@/lib/appt-message";
import { siteUrl } from "@/lib/site-url";
import { todayStr, nowMinutes, addDaysStr, minToHHMM, formatDateTr } from "@/lib/datetime";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 3 SAATLİK randevu hatırlatma cron'u (2. hatırlatma — ertesi-gün cron'undan AYRI).
 * Önümüzdeki ~3 saat içinde başlayacak, henüz 3s-hatırlatması yapılmamış ONAYLI
 * randevulara push + WhatsApp (SMS'ten öncelikli) + e-posta gönderir. `reminder3hSentAt`
 * ile çift gönderim önlenir. SIK çalışmalı (ör. 10-15 dk'da bir DIŞ cron ile — cron-job.org).
 * Pencere gece yarısını aşarsa (now+180 > 1440) ertesi günün erken saatleri de sorgulanır.
 *
 * Not: Aynı gün + 3 saatten yakın YENİ rezervasyonlar booking sırasında reminder3hSentAt
 * ile işaretlenir (onay mesajı yeterli) → burada MÜKERRER gönderilmez.
 *
 * Güvenlik: CRON_SECRET tanımlıysa Authorization: Bearer <secret> VEYA ?key=<secret>.
 */
const LEAD_MIN = 180; // 3 saat

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    const keyParam = new URL(request.url).searchParams.get("key");
    if (auth !== `Bearer ${secret}` && keyParam !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "cron_not_configured" }, { status: 503 });
  }

  const today = todayStr();
  const now = nowMinutes();
  const wrap = now + LEAD_MIN - 1440; // > 0 → pencere gece yarısını aşıyor
  const tomorrow = addDaysStr(today, 1);

  const appts = await db.appointment.findMany({
    where: {
      status: "CONFIRMED",
      reminder3hSentAt: null,
      OR: [
        { date: today, startMin: { gt: now, lte: now + LEAD_MIN } },
        ...(wrap > 0 ? [{ date: tomorrow, startMin: { gte: 0, lte: wrap } }] : []),
      ],
    },
    select: {
      id: true,
      code: true,
      date: true,
      startMin: true,
      customerId: true,
      customerName: true,
      customerPhone: true,
      customer: { select: { email: true } },
      staff: { select: { name: true } },
      items: { select: { name: true } },
      business: { select: { id: true, name: true, smsCredits: true } },
    },
  });

  let push = 0;
  let wa = 0;
  let sms = 0;
  let email = 0;

  for (const a of appts) {
    try {
      // ÇİFT GÖNDERİM KORUMASI: göndermeden önce atomik sahiplen.
      const claim = await db.appointment.updateMany({
        where: { id: a.id, reminder3hSentAt: null },
        data: { reminder3hSentAt: new Date() },
      });
      if (claim.count === 0) continue;

      const link = `${siteUrl()}/r/${signApptShort(a.code)}?iptal=1`;
      const time = minToHHMM(a.startMin);
      const isToday = a.date === today;
      const dayWord = isToday ? "Bugün" : "Yarın";
      const services = a.items.map((i) => i.name).join(", ");

      // 1) Push — uygulaması olan müşteriye (bedava)
      if (a.customerId) {
        await notifyUser(a.customerId, {
          title: `${a.business.name} — randevu hatırlatma`,
          body: `${dayWord} ${time} randevun ${isToday ? "yaklaşıyor" : "var"}. İptal için dokun.`,
          url: "/hesap",
        });
        push++;
      }

      // 2) WhatsApp — WaMessage (kuruluysa; SMS'ten öncelikli)
      let waSent = false;
      if (a.customerPhone && whatsappConfigured()) {
        const body = buildApptMessage({
          intro: "🔔 Randevu hatırlatması",
          lead: isToday
            ? `bugün ${a.business.name} randevunuz yaklaşıyor:`
            : `yarın ${a.business.name} randevunuz var:`,
          customerName: a.customerName,
          date: a.date,
          startMin: a.startMin,
          services,
          staffName: a.staff?.name,
          cancelUrl: link,
        });
        const r = await sendWhatsApp(a.customerPhone, body);
        if (r.status === "sent") {
          wa++;
          waSent = true;
          const raw = process.env.WHATSAPP_SEND_DELAY_MS;
          const parsed = raw == null || raw.trim() === "" ? 1200 : Number(raw);
          const delay = Number.isFinite(parsed) && parsed >= 0 ? parsed : 1200;
          if (delay > 0) await new Promise((res) => setTimeout(res, Math.min(delay, 5000)));
        }
      }

      // 3) SMS — WhatsApp gitmediyse ve gerçek sağlayıcı + kontör varsa
      if (!waSent && a.customerPhone && smsConfigured()) {
        const body = `${a.business.name}: ${dayWord} ${time} randevunuz var. Iptal: ${link}`;
        if (a.business.smsCredits >= smsCreditCost(body)) {
          await chargeAndSendSms(a.business.id, a.customerPhone, body, "reminder");
          sms++;
        }
      }

      // 4) E-posta — kayıtlı müşteriye (bedava; RESEND_API_KEY tanımlıysa)
      if (a.customer?.email && emailConfigured()) {
        const dateLabel = formatDateTr(a.date, { day: "numeric", month: "long" });
        const r = await sendEmail({
          to: a.customer.email,
          subject: `${a.business.name} — randevu hatırlatması (${dayWord.toLowerCase()} ${time})`,
          html: emailLayout({
            heading: "Randevu hatırlatması",
            bodyHtml: `${dayWord} <b>${esc(dateLabel)} ${time}</b> · ${esc(a.business.name)} randevun var.<br/><br/>Gelemeyeceksen aşağıdan tek tıkla iptal edebilirsin.`,
            cta: { label: "İptal", url: link },
          }),
          text: `${a.business.name}: ${dayWord} ${time} randevun var. İptal: ${link}`,
        });
        if (r.status === "sent") email++;
      }
    } catch (e) {
      console.error("3h reminder cron randevu hatası:", a.id, e);
      await db.appointment
        .updateMany({ where: { id: a.id }, data: { reminder3hSentAt: null } })
        .catch(() => {});
    }
  }

  return NextResponse.json({ ok: true, processed: appts.length, push, wa, sms, email });
}
