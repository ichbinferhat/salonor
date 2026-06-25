/**
 * Uygulamanın herkese açık temel URL'i (mutlak bağlantılar için — ör. hatırlatma
 * mesajındaki teyit linki). Sıra: açık env (NEXT_PUBLIC_SITE_URL) → varsayılan
 * (salonor.com). (Vercel terk edildi; eski VERCEL_PROJECT_PRODUCTION_URL dalı kaldırıldı.)
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return "https://salonor.com";
}
