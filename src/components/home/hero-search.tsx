"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, CalendarDays, Clock } from "lucide-react";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export function HeroSearch({ today }: { today: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("sehir", city);
    if (date) params.set("tarih", date);
    if (time) params.set("saat", time);
    router.push(`/arama${params.size ? `?${params}` : ""}`);
  }

  const cell =
    "flex items-center gap-2.5 px-4 py-3 lg:py-0 bg-transparent";
  const input =
    "w-full bg-transparent text-[15px] font-medium text-ink placeholder:text-ink-mute focus:outline-none";

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl rounded-3xl border border-line bg-surface p-2 shadow-pop lg:h-[72px] lg:rounded-full"
    >
      <div className="grid divide-y divide-line lg:h-full lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] lg:divide-x lg:divide-y-0">
        <label className={cell}>
          <Search className="size-5 shrink-0 text-ink-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hizmet veya salon ara"
            className={input}
            aria-label="Hizmet veya salon"
          />
        </label>

        <label className={cell}>
          <MapPin className="size-5 shrink-0 text-ink-soft" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`${input} cursor-pointer appearance-none`}
            aria-label="Şehir"
          >
            <option value="">Tüm şehirler</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
          </select>
        </label>

        <label className={cell}>
          <CalendarDays className="size-5 shrink-0 text-ink-soft" />
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${input} cursor-pointer`}
            aria-label="Tarih"
          />
        </label>

        <label className={cell}>
          <Clock className="size-5 shrink-0 text-ink-soft" />
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`${input} cursor-pointer appearance-none`}
            aria-label="Saat"
          >
            <option value="">Her saat</option>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-stretch p-1.5 lg:p-0 lg:pr-1.5 lg:pl-2">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 font-semibold text-white transition-colors hover:bg-ink-strong lg:size-[52px] lg:px-0"
            aria-label="Ara"
          >
            <Search className="size-5" />
            <span className="lg:hidden">Ara</span>
          </button>
        </div>
      </div>
    </form>
  );
}
