"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "./types";
import type { Locale } from "./config";

type I18nValue = { dict: Dictionary; locale: Locale };

const I18nContext = createContext<I18nValue | null>(null);

/** Kök layout'tan aktif dil + sözlüğü tüm istemci bileşenlerine taşır. */
export function I18nProvider({
  dict,
  locale,
  children,
}: I18nValue & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ dict, locale }}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const v = useContext(I18nContext);
  if (!v) throw new Error("useI18n, I18nProvider içinde kullanılmalı.");
  return v;
}

/** İstemci bileşeninde aktif sözlük. */
export function useDict(): Dictionary {
  return useI18n().dict;
}

/** İstemci bileşeninde aktif dil kodu. */
export function useLocale(): Locale {
  return useI18n().locale;
}
