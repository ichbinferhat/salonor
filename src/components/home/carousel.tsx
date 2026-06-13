"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export function Carousel({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: "smooth" });

  return (
    <section className="container-x">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="hidden shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-accent-deep transition-colors hover:bg-accent-faint sm:inline-flex"
          >
            Tümünü gör <ArrowRight className="size-4" />
          </Link>
        )}
      </div>

      {/* Oklar kartların sağ/solunda (üstte değil) */}
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          aria-label="Geri kaydır"
          className="absolute left-1 top-[42%] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface text-ink shadow-pop transition-all hover:scale-105 hover:bg-cream active:scale-95 sm:flex"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div
          ref={ref}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5"
        >
          {children}
        </div>

        <button
          onClick={() => scroll(1)}
          aria-label="İleri kaydır"
          className="absolute right-1 top-[42%] z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface text-ink shadow-pop transition-all hover:scale-105 hover:bg-cream active:scale-95 sm:flex"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
