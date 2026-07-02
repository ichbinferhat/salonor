import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Randevu eylem token'ı (tek-tık "İptal" linki için) — KISA biçim.
 *
 * Linki kısa tutmak için JWT yerine `<randevuKodu>.<imza>` kullanılır:
 *   SLNR-X7K2M9.aB3dEf9hK2mN
 * İmza = HMAC-SHA256(AUTH_SECRET, "appt:"+code) → base64url, ilk 12 karakter (~72 bit).
 * Giriş gerektirmez; yalnızca bu randevuyu hedefler ve imza sahtecilikten korur
 * (kod tahmin edilse bile geçerli imza üretilemez). Kod zaten @unique olduğundan
 * arama doğrudan kod ile yapılır — ekstra DB kolonu/JWT gerekmez.
 */
const SIG_LEN = 12;

function secretKey(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET tanımlı değil — randevu token'ı üretilemez.");
  return s;
}

function sigFor(code: string): string {
  return createHmac("sha256", secretKey()).update(`appt:${code}`).digest("base64url").slice(0, SIG_LEN);
}

/** Randevu kodundan imzalı kısa token üretir: "SLNR-XXXXXX.<imza>". */
export function signApptShort(code: string): string {
  return `${code}.${sigFor(code)}`;
}

/** Token geçerliyse randevu KODUNU, değilse null döner (sabit-zamanlı imza kıyası). */
export function verifyApptShort(token: string): string | null {
  const i = token.lastIndexOf(".");
  if (i < 1 || i >= token.length - 1) return null;
  const code = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sigFor(code);
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return code;
}
