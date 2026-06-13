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
    ref.current?.scrollBy({
      left: dir * ref.current.clientWidth * 0.85,
      behavior: "smooth",
    });

  return (
    <section className="container-x">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link
              href={href}
              className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-accent-deep transition-colors hover:bg-accent-faint sm:inline-flex"
            >
              Tümünü gör <ArrowRight className="size-4" />
            </Link>
          )}
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll(-1)}
              className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-all hover:border-ink/40 hover:bg-cream active:scale-95"
              aria-label="Geri kaydır"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface text-ink transition-all hover:border-ink/40 hover:bg-cream active:scale-95"
              aria-label="İleri kaydır"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Başlıkla aynı sol hizada; yalnızca sağa taşar (peek) */}
      <div
        ref={ref}
        className="no-scrollbar -mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-4 sm:-mr-6 sm:gap-5 sm:pr-6 lg:-mr-8 lg:pr-8"
      >
        {children}
      </div>
    </section>
  );
}
