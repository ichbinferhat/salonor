"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDict } from "@/i18n/provider";
import { useMounted } from "@/lib/use-mounted";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxW = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxW?: string;
}) {
  const dict = useDict();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // onClose çoğunlukla satır-içi ok fonksiyonu olarak gelir (her render'da yeni kimlik).
  // Onu ref'te güncel tutarız ki ana efekt BAĞIMLILIĞINA koymak zorunda kalmayalım:
  // aksi halde modal AÇIKKEN ebeveynin her render'ında (ör. yıldıza tıklama) efekt
  // temizlenip yeniden çalışır, odağı tetikleyiciye geri verip ilk öğeye zıplatır (odak çalma).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Portal yalnızca tarayıcıda; SSR uyumsuzluğunu önlemek için mount bekle.
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    // Açılış öncesi odaklı öğeyi sakla — kapanışta geri verilecek (klavye/SR kullanıcısı
    // diyalogdan çıkınca tetikleyiciye döner).
    const prevActive = document.activeElement as HTMLElement | null;

    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href],button:not([disabled]),textarea,input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null)
        : [];

    // Açılışta odağı diyaloğun ilk öğesine (yoksa panelin kendisine) taşı.
    (focusables()[0] ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap: Tab/Shift+Tab odağı diyalog içinde döngüye sokar (arka plana kaçmaz).
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevActive?.focus?.();
    };
  }, [open]);

  if (!open || !mounted) return null;

  // Portal ile doğrudan <body>'ye render: hiçbir stacking-context (transform/
  // animasyon yapan kapsayıcı) modalı hapsedemez, alt çubuğun üstünde kalır.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <button
        className="anim-fade absolute inset-0 cursor-default bg-ink-strong/50 backdrop-blur-[2px] [animation-duration:150ms]"
        onClick={onClose}
        aria-label={dict.common.close}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`anim-rise relative z-10 max-h-[92dvh] w-full ${maxW} overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-pop outline-none [animation-duration:220ms] sm:rounded-3xl`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 id={titleId} className="font-display text-xl font-bold tracking-[-0.01em] text-balance text-ink">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label={dict.common.close}
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
