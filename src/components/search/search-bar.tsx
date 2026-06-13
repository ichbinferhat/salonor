"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
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

export type SearchCategory = { slug: string; name: string; emoji: string };

type Props = {
  categories: SearchCategory[];
  defaults?: { q?: string; kategori?: string; sehir?: string; ilce?: string };
  /** "hero" → ana sayfa; "page" → /arama üstü */
  variant?: "hero" | "page";
  className?: string;
};

type Anchor = { top: number; left?: number; right?: number };

export function SearchBar({
  categories,
  defaults = {},
  variant = "hero",
  className = "",
}: Props) {
  const router = useRouter();

  const [q, setQ] = useState(defaults.q ?? "");
  const [kategori, setKategori] = useState(defaults.kategori ?? "");
  const [sehir, setSehir] = useState(defaults.sehir ?? "");
  const [ilce, setIlce] = useState(defaults.ilce ?? "");

  const [panel, setPanel] = useState<"type" | "loc" | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetView, setSheetView] = useState<"main" | "type" | "loc">("main");
  const [mounted, setMounted] = useState(false);

  const typeBtnRef = useRef<HTMLButtonElement>(null);
  const locBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Masaüstü popover'ın konumunu tetikleyici düğmeye göre hesapla
  useEffect(() => {
    if (!panel) {
      setAnchor(null);
      return;
    }
    const place = () => {
      const btn = panel === "type" ? typeBtnRef.current : locBtnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      if (panel === "type") setAnchor({ top: r.bottom + 10, left: r.left });
      else setAnchor({ top: r.bottom + 10, right: window.innerWidth - r.right });
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
        setSheetOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Mobil sheet açıkken arka plan kaymasın
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const catName = kategori
    ? categories.find((c) => c.slug === kategori)?.name ?? "Tüm hizmetler"
    : "Tüm hizmetler";

  const locLabel = ilce && sehir ? `${ilce}, ${sehir}` : sehir || "Şehir & ilçe";

  function submit() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (kategori) params.set("kategori", kategori);
    if (sehir) params.set("sehir", sehir);
    if (ilce) params.set("ilce", ilce);
    setPanel(null);
    setSheetOpen(false);
    router.push(`/arama${params.size ? `?${params}` : ""}`);
  }

  function pickCategory(slug: string) {
    setKategori(slug);
    setPanel(null);
    setSheetView("main");
  }

  function pickLocation(city: string, district: string) {
    setSehir(city);
    setIlce(district);
    setPanel(null);
    setSheetView("main");
  }

  return (
    <div className={`w-full ${className}`}>
      {/* ───────── Masaüstü: segmentli pill ───────── */}
      <div className="mx-auto hidden w-full max-w-3xl lg:block">
        <div className="flex items-center rounded-full border border-line bg-surface p-2 shadow-pop">
          {/* TÜR */}
          <Segment
            buttonRef={typeBtnRef}
            active={panel === "type"}
            onClick={() => setPanel(panel === "type" ? null : "type")}
            icon={<Scissors className="size-5" />}
            label="Tür"
            value={catName}
            chevron
            className="min-w-[152px]"
          />

          <Divider />

          {/* SALON ADI */}
          <label className="flex min-w-0 flex-1 cursor-text items-center gap-3 rounded-full px-4 py-2 transition-colors hover:bg-cream">
            <Search className="size-5 shrink-0 text-ink-soft" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
                Salon adı
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setPanel(null)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Salon, hizmet ara…"
                className="w-full truncate bg-transparent text-[15px] font-semibold text-ink placeholder:font-medium placeholder:text-ink-mute focus:outline-none"
                aria-label="Salon veya hizmet"
              />
            </span>
          </label>

          <Divider />

          {/* KONUM */}
          <Segment
            buttonRef={locBtnRef}
            active={panel === "loc"}
            onClick={() => setPanel(panel === "loc" ? null : "loc")}
            icon={<MapPin className="size-5" />}
            label="Konum"
            value={locLabel}
            chevron
            className="min-w-[164px]"
          />

          {/* Ara */}
          <button
            type="button"
            onClick={submit}
            className="ml-1.5 flex h-[52px] shrink-0 items-center gap-2 rounded-full bg-accent px-7 font-semibold text-white shadow-card transition-all hover:bg-accent-deep active:scale-[0.98]"
          >
            <Search className="size-5" />
            Ara
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
              aria-label="Kapat"
              onClick={() => setPanel(null)}
              className="absolute inset-0 cursor-default bg-ink/20 backdrop-blur-[2px]"
            />
            {anchor && (
              <div
                className="anim-rise absolute overflow-hidden rounded-3xl border border-line bg-surface py-1.5 shadow-pop"
                style={{
                  top: anchor.top,
                  left: anchor.left,
                  right: anchor.right,
                  width: panel === "type" ? 320 : 372,
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

      {/* ───────── Mobil: tetikleyici ───────── */}
      <button
        type="button"
        onClick={() => {
          setSheetView("main");
          setSheetOpen(true);
        }}
        className="flex w-full items-center gap-3 rounded-full border border-line bg-surface p-2 pl-5 text-left shadow-pop lg:hidden"
      >
        <Search className="size-5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1 py-0.5">
          <span className="block truncate text-[15px] font-bold text-ink">
            {q || catName}
          </span>
          <span className="block truncate text-xs text-ink-mute">
            {sehir ? locLabel : "Tüm Türkiye"} · {catName}
          </span>
        </span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <Search className="size-5" />
        </span>
      </button>

      {/* ───────── Mobil: tam ekran sheet ───────── */}
      {mounted &&
        sheetOpen &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex flex-col bg-cream lg:hidden">
            {/* Başlık */}
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
              {sheetView === "main" ? (
                <span className="font-display text-lg font-bold text-ink">Ara</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setSheetView("main")}
                  className="flex items-center gap-1.5 font-display text-lg font-bold text-ink"
                >
                  <ChevronLeft className="size-5" />
                  {sheetView === "type" ? "Hizmet türü" : "Konum"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
                aria-label="Kapat"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* İçerik */}
            <div className="flex-1 overflow-y-auto">
              {sheetView === "main" && (
                <div className="space-y-3 p-4">
                  <SheetField
                    icon={<Scissors className="size-5" />}
                    label="Tür"
                    value={catName}
                    onClick={() => setSheetView("type")}
                  />
                  <div className="rounded-2xl border border-line bg-surface px-4 py-3">
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
                      Salon adı
                    </span>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Search className="size-5 shrink-0 text-ink-soft" />
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        placeholder="Salon, hizmet ara…"
                        className="w-full bg-transparent text-[15px] font-semibold text-ink placeholder:font-medium placeholder:text-ink-mute focus:outline-none"
                      />
                    </div>
                  </div>
                  <SheetField
                    icon={<MapPin className="size-5" />}
                    label="Konum"
                    value={locLabel}
                    onClick={() => setSheetView("loc")}
                  />
                </div>
              )}

              {sheetView === "type" && (
                <div className="p-2">
                  <CategoryList
                    categories={categories}
                    value={kategori}
                    onSelect={pickCategory}
                  />
                </div>
              )}

              {sheetView === "loc" && (
                <div className="p-2">
                  <LocationList
                    value={{ city: sehir, district: ilce }}
                    onSelect={pickLocation}
                  />
                </div>
              )}
            </div>

            {/* Alt: Ara */}
            {sheetView === "main" && (
              <div className="border-t border-line bg-surface p-4">
                <button
                  type="button"
                  onClick={submit}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-base font-semibold text-white transition-all hover:bg-accent-deep active:scale-[0.99]"
                >
                  <Search className="size-5" />
                  Ara
                </button>
              </div>
            )}
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

function SheetField({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left"
    >
      <span className="shrink-0 text-ink-soft">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-ink-mute">
          {label}
        </span>
        <span className="block truncate text-[15px] font-semibold text-ink">{value}</span>
      </span>
      <ChevronDown className="size-4 shrink-0 -rotate-90 text-ink-mute" />
    </button>
  );
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
  return (
    <ul className="no-scrollbar max-h-[min(58vh,22rem)] overflow-y-auto px-1.5 pb-1.5 pt-1.5">
      <li>
        <button
          type="button"
          onClick={() => onSelect("")}
          className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-cream"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base">
            ✨
          </span>
          <span className="flex-1 font-semibold text-ink">Tüm hizmetler</span>
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
