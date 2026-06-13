"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="anim-fade absolute inset-0 cursor-default bg-ink-strong/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Kapat"
        tabIndex={-1}
      />
      <div
        className={`anim-rise relative z-10 max-h-[92dvh] w-full ${maxW} overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-pop sm:rounded-3xl`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
