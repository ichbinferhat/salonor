"use client";

/**
 * Özel next/image yükleyici (loader).
 *
 * NEDEN: Render ücretsiz planın CPU'su zayıf; Next'in yerleşik image
 * optimizatörü her görseli yeniden indirip yeniden kodlarken 2-3 sn gecikiyor.
 * Görsellerimiz zaten Unsplash CDN'inden geliyor — Unsplash istenen genişlikte
 * WebP'yi kendi hızlı CDN'inde anında üretebiliyor. Bu yükleyici küçültmeyi
 * Unsplash'e devrederek Render optimizatörünü tamamen atlatır → fotoğraflar
 * doğrudan kaynak CDN'den, hızlıca gelir.
 *
 * Diğer kaynaklar (pravatar avatarları, yerel statik dosyalar) olduğu gibi
 * döner; onlar zaten küçük/optimize.
 */
export default function imageLoader({ src, width, quality }) {
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality || 70));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  return src;
}
