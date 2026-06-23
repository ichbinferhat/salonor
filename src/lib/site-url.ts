/**
 * Uygulamanın herkese açık temel URL'i (mutlak bağlantılar için — ör. hatırlatma
 * mesajındaki teyit linki). Sıra: açık env → Vercel production host → varsayılan.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const v = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (v) return `https://${v}`;
  return "https://salonor.vercel.app";
}
