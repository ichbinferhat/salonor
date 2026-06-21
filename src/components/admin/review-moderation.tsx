"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Trash2, Flag, ExternalLink, Star } from "lucide-react";
import { setReviewHiddenAction, deleteReviewByAdminAction } from "@/server/actions/admin";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

export type ModReview = {
  id: string;
  businessName: string;
  businessSlug: string;
  author: string;
  rating: number;
  comment: string;
  hidden: boolean;
  reported: boolean;
  createdLabel: string;
};

function RowActions({ r }: { r: ModReview }) {
  const dict = useDict();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => {
            setFailed(false);
            const res = await setReviewHiddenAction(r.id, !r.hidden);
            if (!res?.ok) { setFailed(true); return; }
            router.refresh();
          })}
          className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-ink-soft transition-colors hover:bg-cream disabled:opacity-50"
        >
          {r.hidden ? <><Eye className="size-3.5" /> {dict.admin.reviewShow}</> : <><EyeOff className="size-3.5" /> {dict.admin.reviewHide}</>}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!confirm(dict.admin.reviewDeleteConfirm)) return;
            start(async () => {
              setFailed(false);
              const res = await deleteReviewByAdminAction(r.id);
              if (!res?.ok) { setFailed(true); return; }
              router.refresh();
            });
          }}
          aria-label={dict.admin.reviewDeleteAria}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      {failed && (
        <p className="rounded-full bg-rose-soft px-2.5 py-1 text-[11px] font-semibold text-rose">
          {dict.admin.actionFailed}
        </p>
      )}
    </div>
  );
}

export function ReviewModeration({ items }: { items: ModReview[] }) {
  const dict = useDict();
  const reportedCount = items.filter((r) => r.reported && !r.hidden).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
        <h2 className="font-display text-lg font-bold text-ink">{dict.admin.reviewTitle}</h2>
        {reportedCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-honey-soft px-2.5 py-1 text-xs font-bold text-honey">
            <Flag className="size-3.5" /> {interpolate(dict.admin.reviewReportedBadge, { n: reportedCount })}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-ink-soft">{dict.admin.reviewEmpty}</p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((r) => (
            <li
              key={r.id}
              className={`flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-start sm:gap-4 ${
                r.hidden ? "bg-cream/40" : r.reported ? "bg-honey-soft/30" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-0.5 font-bold text-ink">
                    {r.rating}
                    <Star className="size-3.5 fill-honey text-honey" />
                  </span>
                  <span className="font-semibold text-ink">{r.author}</span>
                  <span className="text-ink-mute">·</span>
                  <Link
                    href={`/salon/${r.businessSlug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent-deep hover:underline"
                  >
                    {r.businessName} <ExternalLink className="size-3" />
                  </Link>
                  <span className="text-xs text-ink-mute">{r.createdLabel}</span>
                  {r.reported && !r.hidden && (
                    <span className="rounded-full bg-honey-soft px-2 py-0.5 text-[11px] font-bold text-honey">
                      {dict.admin.reviewReported}
                    </span>
                  )}
                  {r.hidden && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold text-ink-soft">
                      {dict.admin.reviewHidden}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.comment}</p>
              </div>
              <RowActions r={r} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
