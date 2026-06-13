"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check, MapPin, Search } from "lucide-react";
import { TURKEY_PROVINCES, normalizeTr } from "@/lib/turkey-geo";

type Value = { city: string; district: string };

/** İki seviyeli konum seçici (il → ilçe). Hem popover hem mobil sheet içinde kullanılır. */
export function LocationList({
  value,
  onSelect,
}: {
  value: Value;
  onSelect: (city: string, district: string) => void;
}) {
  const [province, setProvince] = useState<string | null>(value.city || null);
  const [query, setQuery] = useState("");

  const provinces = useMemo(() => {
    const q = normalizeTr(query);
    const list = [...TURKEY_PROVINCES].sort((a, b) =>
      a.name.localeCompare(b.name, "tr")
    );
    return q ? list.filter((p) => normalizeTr(p.name).includes(q)) : list;
  }, [query]);

  const districts = useMemo(() => {
    if (!province) return [];
    const p = TURKEY_PROVINCES.find((x) => x.name === province);
    if (!p) return [];
    const q = normalizeTr(query);
    const list = [...p.districts].sort((a, b) => a.localeCompare(b, "tr"));
    return q ? list.filter((d) => normalizeTr(d).includes(q)) : list;
  }, [province, query]);

  // ── İl listesi ──
  if (!province) {
    return (
      <div className="flex flex-col">
        <SearchBox
          query={query}
          setQuery={setQuery}
          placeholder="İl ara… (ör. İstanbul)"
        />
        <ul className="no-scrollbar max-h-[min(58vh,21rem)] overflow-y-auto px-1.5 pb-1.5">
          <li>
            <button
              type="button"
              onClick={() => onSelect("", "")}
              className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                <MapPin className="size-4" />
              </span>
              <span className="flex-1 font-semibold text-ink">Tüm Türkiye</span>
              {!value.city && <Check className="size-4 text-accent-deep" />}
            </button>
          </li>
          {provinces.map((p) => {
            const active = value.city === p.name;
            return (
              <li key={p.plate}>
                <button
                  type="button"
                  onClick={() => {
                    setProvince(p.name);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-[11px] font-bold text-ink-soft tabular-nums">
                    {String(p.plate).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 ${active ? "font-bold text-accent-deep" : "font-medium text-ink"}`}
                  >
                    {p.name}
                  </span>
                  <span className="text-xs text-ink-mute">{p.districts.length} ilçe</span>
                  <ChevronRight className="size-4 shrink-0 text-ink-mute" />
                </button>
              </li>
            );
          })}
          {provinces.length === 0 && <Empty />}
        </ul>
      </div>
    );
  }

  // ── İlçe listesi ──
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pt-2">
        <button
          type="button"
          onClick={() => {
            setProvince(null);
            setQuery("");
          }}
          className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
          aria-label="İllere dön"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="font-display text-[15px] font-bold text-ink">{province}</span>
      </div>
      <SearchBox
        query={query}
        setQuery={setQuery}
        placeholder={`${province} içinde ilçe ara…`}
      />
      <ul className="no-scrollbar max-h-[min(52vh,19rem)] overflow-y-auto px-1.5 pb-1.5">
        <li>
          <button
            type="button"
            onClick={() => onSelect(province, "")}
            className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
              <MapPin className="size-4" />
            </span>
            <span className="flex-1 font-semibold text-ink">Tüm {province}</span>
            {value.city === province && !value.district && (
              <Check className="size-4 text-accent-deep" />
            )}
          </button>
        </li>
        {districts.map((d) => {
          const active = value.city === province && value.district === d;
          return (
            <li key={d}>
              <button
                type="button"
                onClick={() => onSelect(province, d)}
                className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
              >
                <span
                  className={`flex-1 pl-12 ${active ? "font-bold text-accent-deep" : "font-medium text-ink"}`}
                >
                  {d}
                </span>
                {active && <Check className="size-4 text-accent-deep" />}
              </button>
            </li>
          );
        })}
        {districts.length === 0 && <Empty />}
      </ul>
    </div>
  );
}

function SearchBox({
  query,
  setQuery,
  placeholder,
}: {
  query: string;
  setQuery: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="px-3 pb-2 pt-2">
      <div className="flex items-center gap-2 rounded-full bg-cream px-3.5 py-2.5">
        <Search className="size-4 shrink-0 text-ink-mute" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-ink-mute focus:outline-none"
        />
      </div>
    </div>
  );
}

function Empty() {
  return (
    <li className="px-3 py-8 text-center text-sm text-ink-mute">Sonuç bulunamadı</li>
  );
}
