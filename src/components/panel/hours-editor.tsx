"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { updateHoursAction } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";
import { WEEKDAYS_TR } from "@/lib/datetime";

type DayHour = { weekday: number; openMin: number; closeMin: number; closed: boolean };

// 00:00–23:30 arası 30 dk seçenekler
const TIME_OPTIONS: number[] = [];
for (let t = 0; t <= 1410; t += 30) TIME_OPTIONS.push(t);
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// Pazartesi başlasın
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function HoursEditor({ initial }: { initial: DayHour[] }) {
  const t = useDict().panelCatalog.hours;
  const [hours, setHours] = useState<Record<number, DayHour>>(() => {
    const map: Record<number, DayHour> = {};
    for (const wd of ORDER) {
      const found = initial.find((h) => h.weekday === wd);
      map[wd] = found ?? { weekday: wd, openMin: 540, closeMin: 1080, closed: wd === 0 };
    }
    return map;
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(wd: number, patch: Partial<DayHour>) {
    setHours((prev) => ({ ...prev, [wd]: { ...prev[wd], ...patch } }));
    setSaved(false);
    setError(null);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await updateHoursAction(ORDER.map((wd) => hours[wd]));
      if (res.ok) setSaved(true);
      else setError(t.invalidError);
    });
  }

  return (
    <div>
      <div className="space-y-2">
        {ORDER.map((wd) => {
          const h = hours[wd];
          return (
            <div
              key={wd}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <span className="w-24 font-semibold text-ink">{WEEKDAYS_TR[wd]}</span>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!h.closed}
                  onChange={(e) => update(wd, { closed: !e.target.checked })}
                  className="size-4 accent-[var(--color-accent)]"
                />
                {h.closed ? <span className="text-ink-mute">{t.closed}</span> : <span className="text-ink-soft">{t.open}</span>}
              </label>
              {!h.closed && (
                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={h.openMin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      // Açılış kapanışa eşit/sonra ise kapanışı bir sonraki geçerli aralığa çek
                      update(wd, {
                        openMin: v,
                        ...(h.closeMin <= v ? { closeMin: Math.min(v + 30, 1410) } : {}),
                      });
                    }}
                    className="h-10 rounded-lg border border-line-strong bg-surface px-2 text-sm focus:border-accent focus:outline-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{fmt(t)}</option>
                    ))}
                  </select>
                  <span className="text-ink-mute">–</span>
                  <select
                    value={h.closeMin}
                    onChange={(e) => update(wd, { closeMin: Number(e.target.value) })}
                    className="h-10 rounded-lg border border-line-strong bg-surface px-2 text-sm focus:border-accent focus:outline-none"
                  >
                    {TIME_OPTIONS.filter((t) => t > h.openMin).map((t) => (
                      <option key={t} value={t}>{fmt(t)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-strong disabled:opacity-50"
        >
          {isPending ? t.saving : t.saveButton}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-mint">
            <Check className="size-4" /> {t.saved}
          </span>
        )}
        {error && <span className="text-sm font-semibold text-rose">{error}</span>}
      </div>
    </div>
  );
}
