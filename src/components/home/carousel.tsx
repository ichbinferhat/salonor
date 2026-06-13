"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Carousel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section className="container-x">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            className="rounded-full border border-line-strong bg-surface p-2.5 text-ink transition-all hover:border-ink/40 hover:bg-cream"
            aria-label="Geri kaydır"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="rounded-full border border-line-strong bg-surface p-2.5 text-ink transition-all hover:border-ink/40 hover:bg-cream"
            aria-label="İleri kaydır"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {children}
      </div>
    </section>
  );
}
