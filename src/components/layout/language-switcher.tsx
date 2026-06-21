"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import {
  locales,
  LOCALE_LABELS,
  LOCALE_FLAG,
  LOCALE_SHORT,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { useLocale } from "@/i18n/provider";

/** Dil değiştirici — çerezi ayarlar ve sayfayı yeniler (sunucu yeni dille render eder). */
export function LanguageSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function pick(loc: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${loc}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setOpen(false);
    if (loc !== current) router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Dil seç / Choose language"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
      >
        <Globe className="size-4" />
        <span className="hidden items-center gap-1 sm:inline-flex">
          {LOCALE_FLAG[current]} {LOCALE_SHORT[current]}
        </span>
      </button>
      {open && (
        <div className="anim-rise absolute end-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-2xl border border-line bg-surface/95 py-1.5 shadow-pop ring-1 ring-ink/5 backdrop-blur-xl">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => pick(loc)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-start text-sm transition-colors hover:bg-cream"
            >
              <span className="text-base">{LOCALE_FLAG[loc]}</span>
              <span
                className={`flex-1 ${loc === current ? "font-bold text-accent-deep" : "font-medium text-ink"}`}
              >
                {LOCALE_LABELS[loc]}
              </span>
              {loc === current && <Check className="size-4 text-accent-deep" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
