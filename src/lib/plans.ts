// Salonor Business paketleri — TEK doğruluk kaynağı.
// Fiyatlandırma sayfası, admin paneli (paket değiştir / işletme oluştur) ve plan
// kontrolü hep buradan okur. Buradaki bir değişiklik tüm uygulamaya yansır.

export type PlanKey = "baslangic" | "profesyonel" | "kurumsal";

export type Plan = {
  key: PlanKey;
  name: string;
  tagline: string;
  /** Aylık abonelik ücreti (₺, KDV hariç). */
  monthlyTl: number;
  /** Personel / kullanıcı limiti. */
  staff: number;
  /** Üyelikle hediye edilen SMS kontörü (admin bunu işletmenin smsCredits'ine yazar). */
  smsBonus: number;
  /**
   * Bu pakette AÇIK olan sistem sayısı — FEATURE_ORDER listesinin baştan kaç
   * tanesinin dahil olduğu. Paketler kümülatiftir: üst paket alt paketin tüm
   * sistemlerini kapsar, üzerine yenilerini ekler. (Pazarlama/plan vitrini.)
   */
  featureCount: number;
  popular?: boolean;
};

export const PLANS: Record<PlanKey, Plan> = {
  baslangic: {
    key: "baslangic",
    name: "Başlangıç",
    tagline: "Yeni başlayan ve butik salonlar için",
    monthlyTl: 1590,
    staff: 4,
    smsBonus: 350,
    featureCount: 5,
  },
  profesyonel: {
    key: "profesyonel",
    name: "Profesyonel",
    tagline: "Büyüyen salonların favorisi",
    monthlyTl: 2490,
    staff: 8,
    smsBonus: 500,
    featureCount: 11,
    popular: true,
  },
  kurumsal: {
    key: "kurumsal",
    name: "Kurumsal",
    tagline: "Yoğun ve çok personelli işletmeler",
    monthlyTl: 3490,
    staff: 12,
    smsBonus: 1000,
    featureCount: 15,
  },
};

/** Görüntüleme sırasına göre paketler. */
export const PLAN_LIST: Plan[] = [PLANS.baslangic, PLANS.profesyonel, PLANS.kurumsal];

/** Yıllık abonelikte bedava ay sayısı (12 ay kullan, 10 ay öde). */
export const ANNUAL_FREE_MONTHS = 2;

/** Yıllık toplam ücret (₺) — 2 ay bedava. */
export function annualTl(monthlyTl: number): number {
  return monthlyTl * (12 - ANNUAL_FREE_MONTHS);
}

/** Yıllık abonelikte aya düşen efektif ücret (₺). */
export function annualPerMonthTl(monthlyTl: number): number {
  return Math.round(annualTl(monthlyTl) / 12);
}

/**
 * Salonor Business sistemleri — kanonik liste (dict.pricing.feature1..15 ile aynı sıra).
 * Bu sıra DEĞİL, FEATURE_ORDER görüntüleme sırasını belirler.
 */
export const PLAN_FEATURES: string[] = [
  "Sınırsız Müşteri Kaydı",
  "Sınırsız Hizmet Ekleme",
  "Sınırsız Randevu Yönetimi",
  "SMS Randevu Teyit Sistemi",
  "SMS Gönderimi",
  "Adisyon Sistemi",
  "Paketli Satış Sistemi",
  "Borç / Taksitli Satış Takibi",
  "Gelir – Gider Takibi",
  "Personel Prim Sistemi",
  "Para Puan Sistemi",
  "Hediye Çeki Sistemi",
  "Ürün / Stok Yönetimi",
  "AI Analiz",
  "Raporlama",
];

/**
 * Fiyatlandırma kartlarında sistemlerin GÖRÜNTÜLENME sırası — 1 tabanlı, yani
 * dict.pricing.feature{N} anahtarına denk gelir. Kademeli bir anlatı kurar:
 * önce temel (randevu) sistemler, sonra büyüme araçları, en sonda ileri/ölçek.
 *
 * Paket sınırları (PLANS.featureCount):
 *   Başlangıç  → ilk 5 : müşteri, hizmet, randevu, SMS teyit, raporlama (temel işletim)
 *   Profesyonel→ ilk 11: + toplu SMS, adisyon, gelir-gider, prim, para puan, AI analiz (büyüme)
 *   Kurumsal   → 15    : + paketli satış, borç/taksit, hediye çeki, ürün/stok (ileri & ölçek)
 */
export const FEATURE_ORDER: number[] = [1, 2, 3, 4, 15, 5, 6, 9, 10, 11, 14, 7, 8, 12, 13];

export function isPlanKey(v: string): v is PlanKey {
  return v === "baslangic" || v === "profesyonel" || v === "kurumsal";
}

/** Admin seçicileri için kısa etiket: "Profesyonel — 8 personel · 500 kontör". */
export function planOptionLabel(p: Plan): string {
  return `${p.name} — ${p.staff} personel · ${p.smsBonus} kontör`;
}

/** ₺ biçimleyici (1590 → "1.590"). */
export function formatPlanTl(n: number): string {
  return n.toLocaleString("tr-TR");
}
