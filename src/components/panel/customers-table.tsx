"use client";

import { useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { formatDateTr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type CustomerRow = {
  key: string;
  name: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  visits: number;
  completed: number;
  noShows: number;
  totalTl: number;
  lastDate: string;
};

type SortKey = "lastDate" | "visits" | "totalTl";

export function CustomersTable({ rows }: { rows: CustomerRow[] }) {
  const t = useDict().panelOther.customers;
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("lastDate");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    const digits = query.replace(/\D/g, "");
    const list = q
      ? rows.filter(
          (r) =>
            r.name.toLocaleLowerCase("tr-TR").includes(q) ||
            (r.email?.toLocaleLowerCase("tr-TR").includes(q) ?? false) ||
            (digits.length > 0 && (r.phone ?? "").replace(/\D/g, "").includes(digits))
        )
      : rows;
    const sorted = [...list];
    if (sortBy === "visits") sorted.sort((a, b) => b.visits - a.visits);
    else if (sortBy === "totalTl") sorted.sort((a, b) => b.totalTl - a.totalTl);
    else sorted.sort((a, b) => b.lastDate.localeCompare(a.lastDate));
    return sorted;
  }, [rows, query, sortBy]);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-cream">
          <UserRound className="size-7 text-ink-mute" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
        <p className="mt-2 max-w-sm text-ink-soft">
          {t.emptyDesc}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Arama + sıralama */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface pl-10 pr-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="h-11 shrink-0 rounded-xl border border-line-strong bg-surface px-3 text-sm font-semibold text-ink focus:border-accent focus:outline-none"
        >
          <option value="lastDate">{t.sortLastVisit}</option>
          <option value="visits">{t.sortVisits}</option>
          <option value="totalTl">{t.sortSpend}</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-ink-soft">
          {interpolate(t.noMatch, { q: query })}
        </p>
      ) : (
        <>
          {/* Masaüstü tablo */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface shadow-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cream/50 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3 font-bold">{t.colCustomer}</th>
                  <th className="px-5 py-3 font-bold">{t.colContact}</th>
                  <th className="px-5 py-3 text-center font-bold">{t.colVisit}</th>
                  <th className="px-5 py-3 text-center font-bold">{t.colCompleted}</th>
                  <th className="px-5 py-3 text-center font-bold">{t.colNoShow}</th>
                  <th className="px-5 py-3 text-right font-bold">{t.colSpend}</th>
                  <th className="px-5 py-3 text-right font-bold">{t.colLastVisit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((r) => (
                  <tr key={r.key} className="hover:bg-cream/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={r.image} name={r.name} size="sm" />
                        <span className="font-semibold text-ink">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {r.email ? (
                        <div>
                          <p>{r.email}</p>
                          {r.phone && <p className="text-xs text-ink-mute">{r.phone}</p>}
                        </div>
                      ) : (
                        <span className="text-ink-mute">{t.salonCustomer}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-ink">{r.visits}</td>
                    <td className="px-5 py-3 text-center text-ink-soft">{r.completed}</td>
                    <td className="px-5 py-3 text-center">
                      {r.noShows > 0 ? (
                        <Badge tone="rose">{r.noShows}</Badge>
                      ) : (
                        <span className="text-ink-mute">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-ink">{formatTl(r.totalTl)}</td>
                    <td className="px-5 py-3 text-right text-ink-soft">{formatDateTr(r.lastDate, { day: "numeric", month: "short", year: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil kartlar */}
          <div className="space-y-3 md:hidden">
            {filtered.map((r) => (
              <div key={r.key} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar src={r.image} name={r.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink">{r.name}</p>
                    <p className="truncate text-xs text-ink-soft">{r.email ?? t.salonCustomer}</p>
                  </div>
                  <span className="text-sm font-bold text-ink">{formatTl(r.totalTl)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 border-t border-line pt-3 text-xs text-ink-soft">
                  <span>{interpolate(t.visitsLabel, { n: r.visits })}</span>
                  <span>{interpolate(t.completedLabel, { n: r.completed })}</span>
                  {r.noShows > 0 && <span className="text-rose">{interpolate(t.noShowLabel, { n: r.noShows })}</span>}
                  <span className="ml-auto">{formatDateTr(r.lastDate, { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
