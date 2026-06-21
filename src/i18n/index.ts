// Sunucu tarafı i18n — aktif dili çerezden okur, ilgili sözlüğü döner.
// (cookies() kullandığı için yalnızca sunucu bileşenleri/aksiyonlarında çağrılır.)
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import type { Dictionary } from "./types";
import { tr } from "./dictionaries/tr";
import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import { ar } from "./dictionaries/ar";
import { de } from "./dictionaries/de";
import { fr } from "./dictionaries/fr";
import { fa } from "./dictionaries/fa";
import { es } from "./dictionaries/es";

const DICTS: Record<Locale, Dictionary> = { tr, en, ru, ar, de, fr, fa, es };

/** Çerezdeki aktif dil (yoksa varsayılan: Türkçe). */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Aktif dilin sözlüğü. */
export async function getDictionary(): Promise<Dictionary> {
  return DICTS[await getLocale()];
}
