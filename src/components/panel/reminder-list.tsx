"use client";

import { useEffect, useState, useTransition } from "react";
import { MessageCircle, Phone, Check, Clock, Undo2 } from "lucide-react";
import { markReminderSentAction } from "@/server/actions/business";
import { nowMinutes } from "@/lib/datetime";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

export type ReminderItem = {
  id: string;
  name: string;
  when: string;
  svc: string;
  wa: string | null;
  sms: string | null;
  tel: string | null;
  sent: boolean;
  due: boolean;
  hasPhone: boolean;
  startMin: number;
  isToday: boolean;
};

export function ReminderList({
  items,
  dueAheadMin,
  dueBehindMin,
}: {
  items: ReminderItem[];
  dueAheadMin: number;
  dueBehindMin: number;
}) {
  const t = useDict().panelCore;
  const [sent, setSent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, i.sent]))
  );
  const [, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  // "due" sunucuda render anında hesaplanır ve donar; sekme açık kalırken
  // canlı bir saatle 60 sn'de bir yeniden hesapla (takvim panosundaki desen).
  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNowMin(nowMinutes());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  function isDue(i: ReminderItem) {
    if (nowMin === null) return i.due; // istemci bağlanana kadar sunucu değeri
    if (!i.isToday) return false;
    const delta = i.startMin - nowMin;
    return delta <= dueAheadMin && delta >= -dueBehindMin;
  }

  function mark(id: string, value: boolean) {
    setSent((m) => ({ ...m, [id]: value }));
    setError(null);
    startTransition(async () => {
      const res = await markReminderSentAction(id, value);
      if (!res?.ok) {
        // Sunucu başarısız olursa iyimser değişikliği geri al ve kullanıcıyı bilgilendir.
        setSent((m) => ({ ...m, [id]: !value }));
        setError(t.reminderSaveFailed);
      }
    });
  }

  const due = items.filter((i) => isDue(i));
  const upcoming = items.filter((i) => !isDue(i));
  const pendingDue = due.filter((i) => !sent[i.id]).length;

  return (
    <div className="space-y-8">
      {error && (
        <p className="rounded-xl border border-rose/30 bg-rose-soft px-4 py-2.5 text-sm font-medium text-rose">
          {error}
        </p>
      )}
      {due.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Clock className="size-5 text-accent" /> {t.remindNow}
            {pendingDue > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                {interpolate(t.pendingCount, { n: pendingDue })}
              </span>
            )}
          </h2>
          <ul className="space-y-3">
            {due.map((i) => (
              <Row key={i.id} item={i} sent={!!sent[i.id]} onMark={mark} highlight />
            ))}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-ink">{t.upcomingSection}</h2>
          <ul className="space-y-3">
            {upcoming.map((i) => (
              <Row key={i.id} item={i} sent={!!sent[i.id]} onMark={mark} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Row({
  item,
  sent,
  onMark,
  highlight = false,
}: {
  item: ReminderItem;
  sent: boolean;
  onMark: (id: string, value: boolean) => void;
  highlight?: boolean;
}) {
  const t = useDict().panelCore;
  return (
    <li
      className={`flex flex-wrap items-center gap-3 rounded-2xl border bg-surface p-4 shadow-card ${
        sent ? "border-line opacity-70" : highlight ? "border-accent/50 ring-1 ring-accent/20" : "border-line"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{item.name}</p>
        <p className="truncate text-sm text-ink-soft">
          {item.when} · {item.svc}
        </p>
      </div>

      {!item.hasPhone || !item.wa || !item.tel ? (
        <span className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-ink-mute">
          {t.noPhone}
        </span>
      ) : sent ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1.5 text-sm font-bold text-mint">
            <Check className="size-4" /> {t.reminded}
          </span>
          <button
            onClick={() => onMark(item.id, false)}
            className="rounded-full p-2 text-ink-mute transition-colors hover:bg-cream hover:text-ink"
            aria-label={t.undo}
            title={t.undo}
          >
            <Undo2 className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <a
            href={item.wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onMark(item.id, true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" /> {t.whatsapp}
          </a>
          <a
            href={item.tel}
            onClick={() => onMark(item.id, true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-sm font-bold text-ink transition-colors hover:bg-cream"
          >
            <Phone className="size-4" /> {t.call}
          </a>
        </div>
      )}
    </li>
  );
}
