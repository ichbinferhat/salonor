"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

type Category = { slug: string; name: string; emoji: string };

export function SearchControls({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const current = {
    q: params.get("q") ?? "",
    kategori: params.get("kategori") ?? "",
    sehir: params.get("sehir") ?? "",
    sirala: params.get("sirala") ?? "",
  };

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/arama${next.size ? `?${next}` : ""}`, { scroll: false });
  }

  const chip = (active: boolean) =>
    `flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
      active
        ? "border-ink bg-ink text-white"
        : "border-line-strong bg-surface text-ink hover:border-ink/40"
    }`;

  return (
    <div className="space-y-3">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <button className={chip(!current.kategori)} onClick={() => update("kategori", "")}>
          Tümü
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={chip(current.kategori === c.slug)}
            onClick={() => update("kategori", current.kategori === c.slug ? "" : c.slug)}
          >
            <span aria-hidden>{c.emoji}</span> {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {current.q && (
          <button
            onClick={() => update("q", "")}
            className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-2 text-sm font-semibold text-accent-deep"
          >
            "{current.q}" <X className="size-3.5" />
          </button>
        )}
        <select
          value={current.sehir}
          onChange={(e) => update("sehir", e.target.value)}
          className="h-10 cursor-pointer rounded-full border border-line-strong bg-surface px-4 pr-8 text-sm font-semibold text-ink focus:outline-none"
          aria-label="Şehir"
        >
          <option value="">Tüm şehirler</option>
          <option value="İstanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="İzmir">İzmir</option>
        </select>
        <select
          value={current.sirala}
          onChange={(e) => update("sirala", e.target.value)}
          className="h-10 cursor-pointer rounded-full border border-line-strong bg-surface px-4 pr-8 text-sm font-semibold text-ink focus:outline-none"
          aria-label="Sıralama"
        >
          <option value="">Önerilen</option>
          <option value="puan">En yüksek puan</option>
          <option value="yorum">En çok yorum</option>
        </select>
      </div>
    </div>
  );
}
