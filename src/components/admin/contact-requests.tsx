"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, Check, Trash2, Inbox, RotateCcw } from "lucide-react";
import {
  setContactHandledAction,
  deleteContactRequestAction,
} from "@/server/actions/contact";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

export type ContactRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  handled: boolean;
  createdLabel: string;
};

export function ContactRequests({ items }: { items: ContactRequestRow[] }) {
  const dict = useDict();
  const [rows, setRows] = useState(items);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [, start] = useTransition();

  function toggleHandled(id: string, handled: boolean) {
    setPendingId(id);
    setFailed(false);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, handled } : r)));
    start(async () => {
      const res = await setContactHandledAction(id, handled);
      if (!res?.ok) {
        // Sunucu reddetti: iyimser değişikliği geri al ve uyar.
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, handled: !handled } : r)));
        setFailed(true);
      }
      setPendingId(null);
    });
  }

  function remove(id: string) {
    if (!confirm(dict.admin.contactDeleteConfirm)) return;
    const removed = rows.find((r) => r.id === id);
    setPendingId(id);
    setFailed(false);
    setRows((rs) => rs.filter((r) => r.id !== id));
    start(async () => {
      const res = await deleteContactRequestAction(id);
      if (!res?.ok && removed) {
        // Sunucu reddetti: silineni geri getir ve uyar.
        setRows((rs) => (rs.some((r) => r.id === id) ? rs : [...rs, removed]));
        setFailed(true);
      }
      setPendingId(null);
    });
  }

  const pendingCount = rows.filter((r) => !r.handled).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Inbox className="size-5 text-accent" /> {dict.admin.contactTitle}
        </h2>
        {pendingCount > 0 && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            {interpolate(dict.admin.contactNewBadge, { n: pendingCount })}
          </span>
        )}
      </div>

      {failed && (
        <p className="border-b border-line bg-rose-soft px-5 py-2.5 text-sm font-semibold text-rose">
          {dict.admin.actionFailed}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-ink-mute">
          {dict.admin.contactEmpty}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li
              key={r.id}
              className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                r.handled ? "opacity-60" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink">{r.name}</p>
                  {r.handled ? (
                    <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[11px] font-bold text-mint">
                      {dict.admin.contactHandled}
                    </span>
                  ) : (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent-deep">
                      {dict.admin.contactNew}
                    </span>
                  )}
                  <span className="text-xs text-ink-mute">{r.createdLabel}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                  <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 hover:text-accent-deep">
                    <Mail className="size-3.5" /> {r.email}
                  </a>
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 hover:text-accent-deep">
                      <Phone className="size-3.5" /> {r.phone}
                    </a>
                  )}
                </div>
                {r.message && <p className="mt-1.5 text-sm text-ink">{r.message}</p>}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  disabled={pendingId === r.id}
                  onClick={() => toggleHandled(r.id, !r.handled)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
                    r.handled
                      ? "border border-line-strong bg-surface text-ink-soft hover:text-ink"
                      : "bg-mint-soft text-mint hover:bg-mint/15"
                  }`}
                >
                  {r.handled ? (
                    <>
                      <RotateCcw className="size-3.5" /> {dict.admin.contactUndo}
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" /> {dict.admin.contactMarkHandled}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={pendingId === r.id}
                  onClick={() => remove(r.id)}
                  aria-label={dict.admin.contactDeleteAria}
                  className="grid size-8 place-items-center rounded-full text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
