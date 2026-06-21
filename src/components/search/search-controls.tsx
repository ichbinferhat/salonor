"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDict } from "@/i18n/provider";

type Category = { slug: string; name: string; emoji: string };

/** /arama ikincil filtreler: kategori çipleri + sıralama (pill'ler). */
export function SearchControls({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const dict = useDict();

  const SORTS: [string, string][] = [
    ["", dict.search.sortRecommended],
    ["puan", dict.search.sortRating],
    ["yorum", dict.search.sortReviews],
  ];

  const kategori = params.get("kategori") ?? "";
  const sirala = params.get("sirala") ?? "";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/arama${next.size ? `?${next}` : ""}`, { scroll: false });
  }

  const chip = (active: boolean) =>
    `flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
      active
        ? "border-ink bg-ink text-white shadow-card"
        : "border-line-strong bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-card"
    }`;

  return (
    <div className="space-y-3">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <button className={chip(!kategori)} onClick={() => update("kategori", "")}>
          {dict.search.filterAll}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={chip(kategori === c.slug)}
            onClick={() => update("kategori", kategori === c.slug ? "" : c.slug)}
          >
            <span aria-hidden>{c.emoji}</span> {c.name}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <span className="shrink-0 text-sm font-semibold text-ink-mute">
          {dict.search.sortLabel}
        </span>
        {SORTS.map(([val, label]) => {
          const active = sirala === val;
          return (
            <button
              key={val || "default"}
              onClick={() => update("sirala", val)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
                active
                  ? "bg-accent-soft text-accent-deep"
                  : "text-ink-soft hover:bg-cream"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
