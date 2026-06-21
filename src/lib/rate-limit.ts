/**
 * Basit, bağımlılıksız hız sınırlayıcı (sliding window, bellek içi).
 *
 * Not: Sunucusuz ortamda sayaç her instance'ta ayrıdır ve soğuk başlangıçta
 * sıfırlanır — yani kesin değil, ama kötüye kullanımı (aynı IP'den seri istek)
 * ciddi biçimde azaltır. Kesin/sert koruma için Google Cloud bütçe limiti kullanılır.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
let lastSweep = 0;

/** Süresi dolmuş kayıtları ara sıra temizle (bellek şişmesini önler). */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
}

export type RateResult = { ok: boolean; retryAfterSec: number };

/**
 * @param key      benzersiz anahtar (ör. `style:1.2.3.4`)
 * @param limit    pencere başına izin verilen istek sayısı
 * @param windowMs pencere uzunluğu (ms)
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  sweep(now);

  const b = store.get(key);
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }
  b.count += 1;
  return { ok: true, retryAfterSec: 0 };
}
