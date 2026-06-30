import { headers } from "next/headers";

/**
 * Güvenilir istemci IP'si (hız sınırı kova anahtarı için). TEK kaynak —
 * tüm server action'lar ve route handler'lar buradan kullanır.
 *
 * GÜVENLİK: `x-real-ip` ve `x-forwarded-for`'un SOL ucu istemci tarafından
 * SAHTELENEBİLİR. Bunlara güvenmek hız sınırını ETKİSİZ kılar: saldırgan her
 * istekte farklı bir sahte IP göndererek sınırsız yeni kova açar (login brute-force,
 * şifre-sıfırlama spam'i, kayıt suistimali sınırları çöker).
 *
 * Canlı altyapı Render (Cloudflare DNS-only/grey → proxy YOK). Render, gerçek peer
 * IP'sini `x-forwarded-for`'un EN SAĞINA ekler; istemci bu son hop'tan sonrasına
 * yazı ekleyemez. Bu yüzden güvenilen değer, sağdan `TRUSTED_PROXY_HOPS` (vars. 1)
 * kadar içerideki girdidir. Birden çok güvenilir proxy katmanı varsa env ile ayarlanır.
 */
const TRUSTED_HOPS = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS ?? "1") || 1);

/** Bir Headers nesnesinden güvenilir istemci IP'sini çıkarır (route handler'lar için). */
export function clientIpFromHeaders(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) {
      const idx = Math.max(0, parts.length - TRUSTED_HOPS);
      return parts[idx];
    }
  }
  return "unknown";
}

/** Server action'lar için: aktif istek başlıklarından güvenilir istemci IP'sini döner. */
export async function getClientIp(): Promise<string> {
  return clientIpFromHeaders(await headers());
}
