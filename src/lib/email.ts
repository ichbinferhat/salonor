/**
 * E-posta sağlayıcı soyutlaması (Resend).
 *
 * Gerçek gönderim için ortam değişkenleri ayarlanır:
 *   RESEND_API_KEY=re_...                       (https://resend.com → API Keys)
 *   EMAIL_FROM="Salonor <bilgi@salonor.com>"    (opsiyonel; varsayılan aşağıda —
 *                                                doğrulanmış domain gerektirir)
 *
 * RESEND_API_KEY tanımlı değilse "mock" modunda çalışır: e-posta GERÇEKTEN
 * gönderilmez ama akış (randevu onayı / hatırlatma / şifre sıfırlama) bozulmadan
 * devam eder. Böylece anahtar eklenene kadar hiçbir özellik kırılmaz.
 *
 * Ek bağımlılık yok — Resend REST API'si doğrudan fetch ile çağrılır.
 */

export type EmailResult = { status: "sent" | "failed" | "mock"; detail?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** RESEND_API_KEY tanımlıysa gerçek gönderim yapılabilir. */
export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/** Gönderen adresi: EMAIL_FROM env'i ya da doğrulanmış domain üzerinden varsayılan. */
function fromAddress(): string {
  return process.env.EMAIL_FROM || "Salonor <bilgi@salonor.com>";
}

/** Tek bir adrese e-posta gönderir (sağlayıcı yoksa mock). Hata akışı bozmaz. */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<EmailResult> {
  const to = opts.to.trim().toLowerCase();
  if (!EMAIL_RE.test(to)) return { status: "failed", detail: "geçersiz e-posta" };
  if (!opts.subject.trim() || !opts.html.trim()) return { status: "failed", detail: "boş içerik" };

  if (!emailConfigured()) return { status: "mock" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.text ? { text: opts.text } : {}),
      }),
    });
    if (res.ok) return { status: "sent" };
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    return { status: "failed", detail: `${res.status} ${detail}`.trim() };
  } catch (e) {
    return { status: "failed", detail: e instanceof Error ? e.message : "ağ hatası" };
  }
}
