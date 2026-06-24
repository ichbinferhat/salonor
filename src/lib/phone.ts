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
