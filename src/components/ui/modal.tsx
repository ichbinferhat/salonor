"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDict } from "@/i18n/provider";

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

  // Portal yalnızca tarayıcıda; SSR uyumsuzluğunu önlemek için mount bekle.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  // Portal ile doğrudan <body>'ye render: hiçbir stacking-context (transform/
  // animasyon yapan kapsayıcı) modalı hapsedemez, alt çubuğun üstünde kalır.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="anim-fade absolute inset-0 cursor-default bg-ink-strong/50 backdrop-blur-[2px] [animation-duration:150ms]"
        onClick={onClose}
        aria-label={dict.common.close}
        tabIndex={-1}
      />
      <div
        className={`anim-rise relative z-10 max-h-[92dvh] w-full ${maxW} overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-pop [animation-duration:220ms] sm:rounded-3xl`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-balance text-ink">{title}</h2>
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
