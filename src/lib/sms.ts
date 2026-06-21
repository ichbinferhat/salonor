import { normalizePhone } from "./phone";

/**
 * SMS sağlayıcı soyutlaması.
 *
 * Gerçek gönderim için ortam değişkenleri ayarlanır (Netgsm örneği):
 *   SMS_PROVIDER=netgsm
 *   NETGSM_USER=...        (kullanıcı no / abone no)
 *   NETGSM_PASS=...        (API şifresi)
 *   NETGSM_HEADER=...      (onaylı başlık / gönderici adı)
 *
 * Anahtar tanımlı değilse "mock" modunda çalışır: mesaj gerçekten gönderilmez,
 * ama akış (kontör düşümü, kayıt) test edilebilsin diye başarı döner.
 */

export type SmsResult = { status: "sent" | "failed" | "mock"; detail?: string };

export function smsConfigured(): boolean {
  return (
    (process.env.SMS_PROVIDER ?? "").toLowerCase() === "netgsm" &&
    !!process.env.NETGSM_USER &&
    !!process.env.NETGSM_PASS &&
    !!process.env.NETGSM_HEADER
  );
}

/** 1 SMS'in kaç kontör tükettiğini hesaplar (160 karakter = 1 kontör; Türkçe karakterler için 70'lik blok). */
export function smsCreditCost(body: string): number {
  const unicode = /[ğüşıöçĞÜŞİÖÇ]/.test(body);
  const per = unicode ? 70 : 160;
  return Math.max(1, Math.ceil((body?.length || 1) / per));
}

async function sendViaNetgsm(to: string, body: string): Promise<SmsResult> {
  try {
    const params = new URLSearchParams({
      usercode: process.env.NETGSM_USER!,
      password: process.env.NETGSM_PASS!,
      gsmno: `90${to}`,
      message: body,
      msgheader: process.env.NETGSM_HEADER!,
    });
    const res = await fetch("https://api.netgsm.com.tr/sms/send/get/?" + params.toString(), {
      method: "GET",
    });
    const text = (await res.text()).trim();
    // Netgsm başarı kodları "00" veya "01"/"02" ile başlar
    if (/^0[0-9]/.test(text)) return { status: "sent", detail: text };
    return { status: "failed", detail: text };
  } catch (e) {
    return { status: "failed", detail: e instanceof Error ? e.message : "ağ hatası" };
  }
}

/** Tek bir numaraya SMS gönderir (sağlayıcı yoksa mock). */
export async function sendSms(rawTo: string, body: string): Promise<SmsResult> {
  const to = normalizePhone(rawTo);
  if (to.length !== 10) return { status: "failed", detail: "geçersiz numara" };
  if (!body?.trim()) return { status: "failed", detail: "boş mesaj" };

  if (!smsConfigured()) return { status: "mock" };

  const provider = (process.env.SMS_PROVIDER ?? "").toLowerCase();
  if (provider === "netgsm") return sendViaNetgsm(to, body);
  return { status: "mock" };
}
