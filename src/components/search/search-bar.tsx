"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/use-mounted";
import {
  ChevronDown,
  ChevronLeft,
  Check,
  MapPin,
  Scissors,
  Search,
  X,
} from "lucide-react";
import { LocationList } from "./location-list";
import { useDict } from "@/i18n/provider";

export type SearchCategory = { slug: string; name: string; emoji: string };

type Props = {
  categories: SearchCategory[];
  defaults?: { q?: string; kategori?: string; sehir?: string; ilce?: string };
  /** "hero" → ana sayfa; "page" → /arama üstü */
  variant?: "hero" | "page";
  className?: string;
};

type Anchor = { top: number; left?: number; right?: number; maxHeight: number };

export function SearchBar({
  categories,
  defaults = {},
  // `variant` prop'u API uyumluluğu için Props'ta tutulur ama şu an render'ı
  // etkilemiyor (hero/page aynı bileşeni paylaşıyor) — destructure edilmez.
  className = "",
}: Props) {
  const router = useRouter();
  const dict = useDict();

  const [q, setQ] = useState(defaults.q ?? "");
  const [kategori, setKategori] = useState(defaults.kategori ?? "");
  const [sehir, setSehir] = useState(defaults.sehir ?? "");
  const [ilce, setIlce] = useState(defaults.ilce ?? "");

  const [panel, setPanel] = useState<"type" | "loc" | null>(null); // masaüstü popover
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [picker, setPicker] = useState<"type" | "loc" | null>(null); // mobil tam ekran seçici
  const mounted = useMounted();

  const typeBtnRef = useRef<HTMLButtonElement>(null);
  const locBtnRef = useRef<HTMLButtonElement>(null);

  // Masaüstü popover'ın konumunu tetikleyici düğmeye göre hesapla. Panel kapalıyken
  // popover hiç render edilmediğinden (aşağıda `panel &&` ile gated) anchor'ı ayrıca
  // sıfırlamaya gerek yok; açılınca place() anında taze konumu yazar.
  useEffect(() => {
    if (!panel) return;
    const place = () => {
      const btn = panel === "type" ? typeBtnRef.current : locBtnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const top = r.bottom + 10;
      const maxHeight = window.innerHeight - top - 16;
      if (panel === "type") setAnchor({ top, left: r.left, maxHeight });
      else setAnchor({ top, right: window.innerWidth - r.right, maxHeight });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [panel]);

  // Esc ile kapat
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPanel(null);
        setPicker(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Mobil seçici açıkken arka plan kaymasın
  useEffect(() => {
    document.body.style.overflow = picker ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [picker]);

  const catName = kategori
    ? categories.find((c) => c.slug === kategori)?.name ?? dict.search.allServices
    : dict.search.allServices;

  const locLabel =
    ilce && sehir ? `${ilce}, ${sehir}` : sehir || dict.search.locationPlaceholder;

  function submit() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (kategori) params.set("kategori", kategori);
    if (sehir) params.set("sehir", sehir);
    if (ilce) params.set("ilce", ilce);
    setPanel(null);
    setPicker(null);
    router.push(`/arama${params.size ? `?${params}` : ""}`);
  }

  function pickCategory(slug: string) {
    setKategori(slug);
    setPanel(null);
    setPicker(null);
  }

  function pickLocation(city: string, district: string) {
    setSehir(city);
    setIlce(district);
    setPanel(null);
    setPicker(null);
  }

  return (
    <div className={`w-full ${className}`}>
      {/* ───────── Masaüstü: segmentli pill ───────── */}
      <div className="mx-auto hidden w-full max-w-3xl lg:block">
        <div className="flex items-center rounded-full border border-line bg-surface/90 p-2 shadow-pop ring-1 ring-inset ring-white/40 backdrop-blur-sm transition-shadow hover:shadow-card">
          <Segment
            buttonRef={typeBtnRef}
            active={panel === "type"}
            onClick={() => setPanel(panel === "type" ? null : "type")}
            icon={<Scissors className="size-5" />}
            label={dict.search.typeLabel}
            value={catName}
            chevron
            className="min-w-[152px]"
          />

          <Divider />

          <label className="flex min-w-0 flex-1 cursor-text items-center gap-3 rounded-full px-4 py-2 transition-colors hover:bg-cream focus-within:bg-cream">
            <Search className="size-5 shrink-0 text-ink-soft" />
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-left text-[11px] font-bold uppercase tracking-wide text-ink-mute">
                {dict.search.salonNameLabel}
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setPanel(null)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={dict.search.salonNamePlaceholder}
                className="w-full truncate bg-transparent text-left text-[15px] font-semibold text-ink placeholder:font-medium placeholder:text-ink-mute focus:outline-none focus-visible:outline-none"
                aria-label={dict.search.salonNameAria}
              />
            </span>
          </label>

          <Divider />

          <Segment
            buttonRef={locBtnRef}
            active={panel === "loc"}
            onClick={() => setPanel(panel === "loc" ? null : "loc")}
            icon={<MapPin className="size-5" />}
            label={dict.search.locationLabel}
            value={locLabel}
            chevron
            className="min-w-[164px]"
          />

          <button
            type="button"
            onClick={submit}
            className="ml-1.5 flex h-[52px] shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-accent via-[#8b5cf6] to-[#ff5fa2] px-7 font-semibold text-white shadow-pop ring-1 ring-inset ring-white/20 transition-all hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0 active:scale-[0.98]"
          >
            <Search className="size-5" />
            {dict.search.searchButton}
          </button>
        </div>
      </div>

      {/* Masaüstü popover (portal + backdrop) */}
      {mounted &&
        panel &&
        createPortal(
          <div className="fixed inset-0 z-[70] hidden lg:block">
            <button
              type="button"
              aria-label={dict.search.close}
              onClick={() => setPanel(null)}
              className="absolute inset-0 cursor-default"
            />
            {anchor && (
              <div
                className="anim-rise absolute overflow-y-auto rounded-3xl border border-line bg-surface py-1.5 shadow-pop"
                style={{
                  top: anchor.top,
                  left: anchor.left,
                  right: anchor.right,
                  width: panel === "type" ? 320 : 372,
                  maxHeight: anchor.maxHeight,
                }}
              >
                {panel === "type" ? (
                  <CategoryList
                    categories={categories}
                    value={kategori}
                    onSelect={pickCategory}
                  />
                ) : (
                  <LocationList
                    value={{ city: sehir, district: ilce }}
                    onSelect={pickLocation}
                  />
                )}
              </div>
            )}
          </div>,
          document.body
        )}

      {/* ───────── Mobil: 3 alan da görünür ───────── */}
      <div className="overflow-hidden rounded-3xl border border-line bg-surface text-left shadow-pop lg:hidden">
        <button
          type="button"
          onClick={() => setPicker("type")}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-cream"
        >
          <Scissors className="size-5 shrink-0 text-ink-soft" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
              {dict.search.typeLabel}
            </span>
            <span className="block truncate text-[15px] font-semibold text-ink">
              {catName}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 -rotate-90 text-ink-mute" />
        </button>

        <label className="flex items-center gap-3 border-t border-line px-4 py-3">
          <Search className="size-5 shrink-0 text-ink-soft" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
              {dict.search.salonNameLabel}
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={dict.search.salonNamePlaceholder}
              className="w-full bg-transparent text-[15px] font-semibold text-ink placeholder:font-medium placeholder:text-ink-mute focus:outline-none"
              aria-label={dict.search.salonNameAria}
            />
          </span>
        </label>

        <button
          type="button"
          onClick={() => setPicker("loc")}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-left transition-colors active:bg-cream"
        >
          <MapPin className="size-5 shrink-0 text-ink-soft" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
              {dict.search.locationLabel}
            </span>
            <span className="block truncate text-[15px] font-semibold text-ink">
              {locLabel}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 -rotate-90 text-ink-mute" />
        </button>

        <div className="border-t border-line p-2">
          <button
            type="button"
            onClick={submit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent font-semibold text-white transition-all hover:bg-accent-deep active:scale-[0.99]"
          >
            <Search className="size-5" />
            {dict.search.searchButton}
          </button>
        </div>
      </div>

      {/* ───────── Mobil: tam ekran seçici (Tür / Konum) ───────── */}
      {mounted &&
        picker &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex flex-col bg-cream lg:hidden">
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
              <button
                type="button"
                onClick={() => setPicker(null)}
                className="flex items-center gap-1.5 font-display text-lg font-bold text-ink"
              >
                <ChevronLeft className="size-5" />
                {picker === "type"
                  ? dict.search.serviceTypeTitle
                  : dict.search.locationLabel}
              </button>
              <button
                type="button"
                onClick={() => setPicker(null)}
                className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
                aria-label={dict.search.close}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {picker === "type" ? (
                <CategoryList
                  categories={categories}
                  value={kategori}
                  onSelect={pickCategory}
                />
              ) : (
                <LocationList
                  value={{ city: sehir, district: ilce }}
                  onSelect={pickLocation}
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ───────── Yardımcı bileşenler ───────── */

function Segment({
  active,
  onClick,
  icon,
  label,
  value,
  chevron = false,
  className = "",
  buttonRef,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  value: string;
  chevron?: boolean;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-full px-4 py-2 text-left transition-colors ${
        active ? "bg-accent-faint" : "hover:bg-cream"
      } ${className}`}
    >
      <span className="shrink-0 text-ink-soft">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
          {label}
        </span>
        <span className="block truncate text-[15px] font-semibold text-ink">{value}</span>
      </span>
      {chevron && (
        <ChevronDown
          className={`size-4 shrink-0 text-ink-mute transition-transform ${active ? "rotate-180" : ""}`}
        />
      )}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-9 w-px shrink-0 bg-line" aria-hidden />;
}

function CategoryList({
  categories,
  value,
  onSelect,
}: {
  categories: SearchCategory[];
  value: string;
  onSelect: (slug: string) => void;
}) {
  const dict = useDict();
  return (
    <ul className="no-scrollbar overflow-y-auto px-1.5 pb-1.5 pt-1.5">
      <li>
        <button
          type="button"
          onClick={() => onSelect("")}
          className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base">
            ✨
          </span>
          <span className="flex-1 font-semibold text-ink">
            {dict.search.allServices}
          </span>
          {!value && <Check className="size-4 text-accent-deep" />}
        </button>
      </li>
      {categories.map((c) => {
        const active = value === c.slug;
        return (
          <li key={c.slug}>
            <button
              type="button"
              onClick={() => onSelect(c.slug)}
              className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-base">
                {c.emoji}
              </span>
              <span
                className={`flex-1 ${active ? "font-bold text-accent-deep" : "font-medium text-ink"}`}
              >
                {c.name}
              </span>
              {active && <Check className="size-4 text-accent-deep" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
