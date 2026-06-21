"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, Loader2, User } from "lucide-react";
import { markAppointmentsSeenAction } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";

export type NewBookingItem = {
  id: string;
  name: string;
  when: string;
  svc: string;
  staff: string;
};

export function NewBookings({ items }: { items: NewBookingItem[] }) {
  const router = useRouter();
  const t = useDict().panelCore;
  const [rows, setRows] = useState(items);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  function approve(id?: string) {
    const prev = rows; // hata olursa geri almak için
    setPendingId(id ?? "all");
    setError(null);
    if (id) setRows((rs) => rs.filter((r) => r.id !== id));
    else setRows([]);
    start(async () => {
      const r = await markAppointmentsSeenAction(id);
      setPendingId(null);
      // Sunucu reddederse (oturum bitti / DB hatası) iyimser güncellemeyi geri al.
      if (!r?.ok) {
        setRows(prev);
        setError(t.approveFailed);
        return;
      }
      router.refresh(); // rozet sayısını güncelle
    });
  }

  // İşlem sürerken bölümü anında kaldırma; yenileme bitene kadar göster.
  if (rows.length === 0 && pendingId === null) return null;

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-accent/30 bg-accent-faint/50 shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-accent/20 px-5 py-3.5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {rows.length}
          </span>
          {t.newBookingRequests}
        </h2>
        <button
          type="button"
          disabled={pendingId !== null}
          aria-busy={pendingId === "all"}
          onClick={() => approve()}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-ink/90 disabled:opacity-50"
        >
          {pendingId === "all" && <Loader2 className="size-3.5 animate-spin" />}
          {t.approveAll}
        </button>
      </div>
      {error && (
        <p className="border-b border-rose/30 bg-rose-soft px-5 py-2.5 text-sm font-medium text-rose">
          {error}
        </p>
      )}
      <ul className="divide-y divide-accent/15">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-semibold text-ink">
                <User className="size-4 text-accent-deep" /> {r.name}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="size-3.5" /> {r.when}
                </span>
                · {r.svc} · {r.staff}
              </p>
            </div>
            <button
              type="button"
              disabled={pendingId !== null}
              aria-busy={pendingId === r.id}
              onClick={() => approve(r.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mint-soft px-3.5 py-1.5 text-xs font-bold text-mint transition-colors hover:bg-mint/15 disabled:opacity-50"
            >
              {pendingId === r.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}{" "}
              {t.approve}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
