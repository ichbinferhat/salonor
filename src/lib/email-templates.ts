import { siteUrl } from "./site-url";

/**
 * Markalı e-posta gövdesi üreticisi + HTML kaçış yardımcısı.
 * Gönderilen e-postalarda dinamik değerler (işletme/müşteri adı, kod) HTML
 * enjeksiyonuna karşı `esc()` ile kaçışlanmalıdır.
 */

/** Dinamik değerleri e-posta gövdesinde güvenli hale getirir (HTML kaçış). */
export function esc(s: string): string {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Salonor markalı, e-posta istemcilerinde güvenli (inline CSS) tam HTML belge. */
export function emailLayout(opts: {
  heading: string;
  bodyHtml: string;
  cta?: { label: string; url: string };
}): string {
  const site = siteUrl();
  return `<!doctype html>
<html lang="tr">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;background:#f7f5ef;">
  <div style="background:#f7f5ef;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #ece8df;">
      <div style="padding:22px 28px;border-bottom:1px solid #f0ece3;">
        <a href="${site}" style="font-size:22px;font-weight:800;color:#131b2e;text-decoration:none;letter-spacing:-0.02em;">Salonor</a>
      </div>
      <div style="padding:28px;">
        <h1 style="margin:0 0 14px;font-size:20px;color:#131b2e;">${opts.heading}</h1>
        <div style="font-size:15px;line-height:1.65;color:#3a4151;">${opts.bodyHtml}</div>
        ${
          opts.cta
            ? `<div style="margin-top:24px;"><a href="${opts.cta.url}" style="display:inline-block;background:#6c4df6;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:999px;font-size:15px;">${opts.cta.label}</a></div>`
            : ""
        }
      </div>
      <div style="padding:18px 28px;border-top:1px solid #f0ece3;font-size:12px;color:#8a8f9c;">
        Salonor · Randevu yönetim platformu · <a href="${site}" style="color:#8a8f9c;">salonor.com</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
