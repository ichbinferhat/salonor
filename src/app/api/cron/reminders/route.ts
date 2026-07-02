import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyUser } from "@/lib/push";
import { chargeAndSendSms } from "@/lib/sms-send";
import { smsConfigured, smsCreditCost } from "@/lib/sms";
import { sendWhatsApp, whatsappConfigured } from "@/lib/whatsapp";
import { sendEmail, emailConfigured } from "@/lib/email";
import { emailLayout, esc } from "@/lib/email-templates";
import { signApptToken } from "@/lib/appt-token";
import { siteUrl } from "@/lib/site-url";
import { todayStr, addDaysStr, minToHHMM, formatDateTr } from "@/lib/datetime";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Otomatik randevu hatırlatma cron'u (Vercel Cron — vercel.json'da günlük tetiklenir).
 * Yarınki ONAYLI + henüz hatırlatılmamış randevulara:
 *  - mobil PUSH (bedava, uygulaması olan müşteriye)
 *  - WhatsApp (WaMessage kuruluysa; bağlı numaradan — SMS'ten önceliklidir)
 *  - SMS (yalnızca gerçek sağlayıcı + kontör varsa VE WhatsApp gitmediyse; mock'ta kontör düşmez)
 *  - E-posta (bedava; RESEND_API_KEY tanımlıysa)
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
      customer: { select: { email: true } },
      business: { select: { id: true, name: true, smsCredits: true } },
    },
  });

  let push = 0;
  let wa = 0;
  let sms = 0;
  let email = 0;

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

      // 2) WhatsApp — WaMessage (resmi olmayan; bağlı numaradan). Kuruluysa ÖNCELİKLİ:
      // gittiyse aynı kişiye ayrıca SMS atılmaz (çift mesaj + çift maliyet önlenir).
      let waSent = false;
      if (a.customerPhone && whatsappConfigured()) {
        const body = `${a.business.name} — randevu hatırlatması\nYarın ${dateLabel} ${time} randevunuz var.\nTeyit veya iptal için: ${link}`;
        const r = await sendWhatsApp(a.customerPhone, body);
        if (r.status === "sent") {
          wa++;
          waSent = true;
          // Anti-ban: mesajlar arasına küçük bir nefes payı koy (blast görünmesin).
          // WHATSAPP_SEND_DELAY_MS ile ayarlanır (boş/geçersiz → 1200; "0" → kapalı).
          const raw = process.env.WHATSAPP_SEND_DELAY_MS;
          const parsed = raw == null || raw.trim() === "" ? 1200 : Number(raw);
          const delay = Number.isFinite(parsed) && parsed >= 0 ? parsed : 1200;
          if (delay > 0) await new Promise((res) => setTimeout(res, Math.min(delay, 5000)));
        }
      }

      // 3) SMS — WhatsApp gitmediyse VE gerçek sağlayıcı tanımlı + mesajın TAM kontörü varsa
      if (!waSent && a.customerPhone && smsConfigured()) {
        const body = `${a.business.name}: Yarin ${dateLabel} ${time} randevunuz var. Geliyorum/Iptal: ${link}`;
        if (a.business.smsCredits >= smsCreditCost(body)) {
          await chargeAndSendSms(a.business.id, a.customerPhone, body, "reminder");
          sms++;
        }
      }

      // 4) E-posta — kayıtlı müşteriye (bedava; yalnızca RESEND_API_KEY tanımlıysa)
      if (a.customer?.email && emailConfigured()) {
        const r = await sendEmail({
          to: a.customer.email,
          subject: `${a.business.name} — yarınki randevu hatırlatması`,
          html: emailLayout({
            heading: "Randevu hatırlatması",
            bodyHtml: `Yarın <b>${esc(dateLabel)} ${time}</b> · ${esc(a.business.name)} randevun var.<br/><br/>Geliyor musun? Aşağıdan tek tıkla teyit edebilir veya iptal edebilirsin.`,
            cta: { label: "Teyit / İptal", url: link },
          }),
          text: `${a.business.name}: Yarın ${dateLabel} ${time} randevun var. Teyit/iptal: ${link}`,
        });
        if (r.status === "sent") email++;
      }
    } catch (e) {
      console.error("reminder cron randevu hatası:", a.id, e);
      // Gönderim sırasında beklenmedik hata (ör. e-posta/SMS sağlayıcı geçici kesinti):
      // sahiplenmeyi geri al ki bir sonraki cron tekrar denesin — tek hatırlatma
      // kalıcı olarak "yanmasın". (Nadir bir çift-hatırlatma, hatırlatmanın hiç
      // gitmemesine yeğdir.)
      await db.appointment
        .updateMany({ where: { id: a.id }, data: { reminderSentAt: null } })
        .catch(() => {});
    }
  }

  return NextResponse.json({ ok: true, processed: appts.length, push, wa, sms, email });
}
