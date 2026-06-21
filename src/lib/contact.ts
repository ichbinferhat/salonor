/** Türk telefon numarasını uluslararası biçime (90XXXXXXXXXX) çevirir. */
export function trPhoneDigits(phone: string | null | undefined): string | null {
  const d = (phone ?? "").replace(/\D/g, "");
  if (d.length < 10) return null;
  if (d.startsWith("90")) return d;
  if (d.startsWith("0")) return "90" + d.slice(1);
  if (d.length === 10) return "90" + d; // 5XX XXX XX XX
  return d;
}

/** WhatsApp gönderme bağlantısı (wa.me) — ücretsiz, sağlayıcı gerektirmez. */
export function waLink(phone: string | null | undefined, text: string): string | null {
  const d = trPhoneDigits(phone);
  if (!d) return null;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

/**
 * WhatsApp sohbet bağlantısı — müşteri salona ulaşsın diye (gelen kanal).
 * Metin isteğe bağlı; verilmezse boş sohbet açılır. Numara yoksa null.
 */
export function waChatLink(phone: string | null | undefined, text?: string): string | null {
  const d = trPhoneDigits(phone);
  if (!d) return null;
  return text ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : `https://wa.me/${d}`;
}

/** SMS uygulamasını mesaj dolu açan bağlantı. */
export function smsLink(phone: string | null | undefined, text: string): string | null {
  const d = trPhoneDigits(phone);
  if (!d) return null;
  return `sms:+${d}?body=${encodeURIComponent(text)}`;
}
