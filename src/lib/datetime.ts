// Tüm randevu zamanları Europe/Istanbul'a göre tutulur:
// date = "YYYY-MM-DD", startMin/endMin = gece yarısından itibaren dakika.
const TZ = "Europe/Istanbul";

export const WEEKDAYS_TR = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

export const WEEKDAYS_SHORT_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

/** İstanbul'a göre bugünün tarihi: "YYYY-MM-DD" */
export function todayStr(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

/** İstanbul'a göre şu anki dakika (gece yarısından itibaren) */
export function nowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  const [h, m] = parts.split(":").map(Number);
  return (h % 24) * 60 + m;
}

export function addDaysStr(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Pazar ... 6 = Cumartesi */
export function weekdayOf(dateStr: string): number {
  return new Date(dateStr + "T12:00:00Z").getUTCDay();
}

export function minToHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "14 Haziran Cumartesi" gibi */
export function formatDateTr(
  dateStr: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", weekday: "long" }
): string {
  return new Intl.DateTimeFormat("tr-TR", { ...opts, timeZone: "UTC" }).format(
    new Date(dateStr + "T12:00:00Z")
  );
}

export function formatDateShortTr(dateStr: string): string {
  return formatDateTr(dateStr, { day: "numeric", month: "short" });
}
