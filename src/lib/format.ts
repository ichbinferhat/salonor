export function formatTl(amount: number): string {
  return `${amount.toLocaleString("tr-TR")} ₺`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} dk`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} sa` : `${h} sa ${m} dk`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toLocaleUpperCase("tr-TR"))
    .join("");
}

export function timeAgoTr(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days < 1) return "Bugün";
  if (days < 7) return `${days} gün önce`;
  if (days < 31) return `${Math.floor(days / 7)} hafta önce`;
  if (days < 365) return `${Math.floor(days / 30)} ay önce`;
  return `${Math.floor(days / 365)} yıl önce`;
}

export function ratingLabel(avg: number): string {
  if (avg >= 4.8) return "Olağanüstü";
  if (avg >= 4.5) return "Mükemmel";
  if (avg >= 4.0) return "Çok iyi";
  if (avg >= 3.5) return "İyi";
  return "Ortalama";
}
