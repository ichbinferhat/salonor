// Desteklenen diller. Yeni dil eklemek için: buraya kodu ekle + dictionaries/<kod>.ts
// dosyasını oluştur (tr.ts'i kopyalayıp çevir) + index.ts'teki DICTS'e ekle.
export const locales = ["tr", "en", "ru", "ar", "de", "fr", "fa", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

/** Sağdan-sola yazılan diller (RTL düzen). */
export const rtlLocales: readonly Locale[] = ["ar", "fa"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

/** Dil tercihini saklayan çerez adı. */
export const LOCALE_COOKIE = "salonor_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** İnsan-okur dil adları (dil değiştiricide gösterilir, kendi dilinde). */
export const LOCALE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  ar: "العربية",
  de: "Deutsch",
  fr: "Français",
  fa: "فارسی",
  es: "Español",
};

/** Dil değiştiricide kısa kod (rozet). */
export const LOCALE_SHORT: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ru: "RU",
  ar: "AR",
  de: "DE",
  fr: "FR",
  fa: "FA",
  es: "ES",
};

/** Bayrak emojileri (görsel ipucu). */
export const LOCALE_FLAG: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ru: "🇷🇺",
  ar: "🇸🇦",
  de: "🇩🇪",
  fr: "🇫🇷",
  fa: "🇮🇷",
  es: "🇪🇸",
};
