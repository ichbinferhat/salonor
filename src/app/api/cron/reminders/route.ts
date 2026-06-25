import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { chargeAndSendSms } from "@/lib/sms-send";
import { smsConfigured, smsCreditCost } from "@/lib/sms";
import { signApptToken } from "@/lib/appt-token";
import { siteUrl } from "@/lib/site-url";
import { todayStr, addDaysStr, minToHHMM, formatDateTr } from "@/lib/datetime";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Otomatik randevu hatırlatma cron'u (Vercel Cron — vercel.json'da günlük tetiklenir).
 * Yarınki ONAYLI + henüz hatırlatılmamış randevulara:
 *  - mobil PUSH (bedava, uygulaması olan müşteriye)
 *  - SMS (yalnızca gerçek sağlayıcı + kontör varsa; yoksa atlanır, mock'ta kontör düşmez)
 * gönderir; mesaj tek-tık "Geliyorum / İptal" linki içerir. reminderSentAt ile çift gönderim önlenir.
 *
 * Güvenlik: CRON_SECRET tanımlıysa Authorization: Bearer <secret> zorunlu.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Üretimde CRON_SECRET tanımsızsa fail-CLOSED: kimliksiz tetikleme, randevu başına
    // tek-seferlik push/SMS'i erken harcayabilir veya planlı gönderimi bastırabilir.
    return NextResponse.json({ ok: false, error: "cron_not_configured" }, { status: 503 });
  }

  const target = addDaysStr(todayStr(), 1); // yarın
  const appts = await db.appointment.findMany({
    where: { date: target, status: "CONFIRMED", reminderSentAt: null },
    select: {
      id: true,
      date: true,
      startMin: true,
      customerId: true,
      customerPhone: true,
      business: { select: { id: true, name: true, smsCredits: true } },
    },
  });

  let push = 0;
  let sms = 0;

  for (const a of appts) {
    try {
      // ÇİFT GÖNDERİM KORUMASI: göndermeden ÖNCE atomik olarak sahiplen. Çakışan
      // ikinci cron tetiklemesi aynı randevuyu sahiplenemez (count===0 → atla).
      const claim = await db.appointment.updateMany({
        where: { id: a.id, reminderSentAt: null },
        data: { reminderSentAt: new Date() },
      });
      if (claim.count === 0) continue;

      const token = await signApptToken(a.id);
      const link = `${siteUrl()}/r/${token}`;
      const dateLabel = formatDateTr(a.date, { day: "numeric", month: "long" });
      const time = minToHHMM(a.startMin);

      // 1) Push — uygulaması olan müşteriye (bedava)
      if (a.customerId) {
        await notifyUser(a.customerId, {
          title: `${a.business.name} — randevu hatırlatma`,
          body: `Yarın ${time} randevun var. Teyit/iptal için dokun.`,
          url: "/hesap",
        });
        push++;
      }

      // 2) SMS — yalnızca gerçek sağlayıcı tanımlı + mesajın TAM kontörü varsa
      if (a.customerPhone && smsConfigured()) {
        const body = `${a.business.name}: Yarin ${dateLabel} ${time} randevunuz var. Geliyorum/Iptal: ${link}`;
        if (a.business.smsCredits >= smsCreditCost(body)) {
          await chargeAndSendSms(a.business.id, a.customerPhone, body, "reminder");
          sms++;
        }
      }
    } catch (e) {
      console.error("reminder cron randevu hatası:", a.id, e);
    }
  }

  return NextResponse.json({ ok: true, processed: appts.length, push, sms });
}
