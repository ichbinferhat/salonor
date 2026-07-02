/** Türk telefon numarasını normalize eder: yalnızca rakamlar, baştaki 0/90 sadeleştirilir → 10 hane (5xx...). */
export function normalizePhone(raw: string): string {
  let d = (raw ?? "").replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(-10);
}

/** Geçerli bir TR cep numarası mı (5 ile başlayan 10 hane). */
export function isValidTrMobile(raw: string): boolean {
  const d = normalizePhone(raw);
  return d.length === 10 && d.startsWith("5");
}

/**
 * Rehberden gelen ham numarayı KATI biçimde TR cebe çevirir. normalizePhone'un
 * slice(-10) gevşekliğinin aksine yabancı numaraları (ör. +1 555 123 4567) yanlışlıkla
 * TR cep sanmaz. Geçerliyse 10 haneli ("5xx...") döner, değilse null.
 */
export function parseTrMobile(raw: string): string | null {
  let d = (raw ?? "").replace(/\D/g, "");
  if (d.startsWith("0090")) d = d.slice(4);
  else if (d.startsWith("90") && d.length === 12) d = d.slice(2);
  else if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  return d.length === 10 && d.startsWith("5") ? d : null;
}

/** Görsel format: 05xx xxx xx xx */
export function formatPhoneTr(raw: string): string {
  const d = normalizePhone(raw);
  if (d.length !== 10) return raw ?? "";
  return `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
}

/**
 * Uluslararası çevirme (ülke) kodları — randevu formundaki ülke seçici için.
 * Türkiye ilk/varsayılan; ardından Türk diasporasının yoğun olduğu + hedef pazarlar.
 */
export const DIAL_CODES: { code: string; dial: string; name: string; flag: string }[] = [
  { code: "TR", dial: "90", name: "Türkiye", flag: "🇹🇷" },
  { code: "DE", dial: "49", name: "Almanya", flag: "🇩🇪" },
  { code: "AT", dial: "43", name: "Avusturya", flag: "🇦🇹" },
  { code: "CH", dial: "41", name: "İsviçre", flag: "🇨🇭" },
  { code: "NL", dial: "31", name: "Hollanda", flag: "🇳🇱" },
  { code: "BE", dial: "32", name: "Belçika", flag: "🇧🇪" },
  { code: "FR", dial: "33", name: "Fransa", flag: "🇫🇷" },
  { code: "GB", dial: "44", name: "Birleşik Krallık", flag: "🇬🇧" },
  { code: "SE", dial: "46", name: "İsveç", flag: "🇸🇪" },
  { code: "DK", dial: "45", name: "Danimarka", flag: "🇩🇰" },
  { code: "NO", dial: "47", name: "Norveç", flag: "🇳🇴" },
  { code: "IT", dial: "39", name: "İtalya", flag: "🇮🇹" },
  { code: "ES", dial: "34", name: "İspanya", flag: "🇪🇸" },
  { code: "US", dial: "1", name: "ABD / Kanada", flag: "🇺🇸" },
  { code: "AZ", dial: "994", name: "Azerbaycan", flag: "🇦🇿" },
];

/**
 * Ülke kodu (dial) + kullanıcının girdiği ulusal numara → E.164 rakam dizisi (öneksiz,
 * ör. "905308841272"). Ulusal numaranın baştaki 0'ı atılır. Geçersizse (çok kısa/uzun) null.
 * WaMessage/WhatsApp bu biçimi doğrudan kabul eder (gönderimde başına '+' eklenir).
 */
export function buildIntlPhone(dial: string, raw: string): string | null {
  const nat = (raw ?? "").replace(/\D/g, "").replace(/^0+/, "");
  const d = (dial ?? "").replace(/\D/g, "");
  if (!d || nat.length < 5) return null;
  const full = d + nat;
  if (full.length < 8 || full.length > 15) return null; // E.164 aralığı
  return full;
}

/** E.164 rakam dizisi makul mü (8-15 hane; ülkeden bağımsız). */
export function isValidIntlPhone(raw: string): boolean {
  const d = (raw ?? "").replace(/\D/g, "");
  return d.length >= 8 && d.length <= 15;
}
