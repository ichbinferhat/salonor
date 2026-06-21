"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Flag } from "lucide-react";
import { deleteReviewAction, reportReviewAction } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";

/** İşletme sahibinin kendi salonundaki bir yorumu silmesi (moderasyon). */
export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const t = useDict().panelOther.reviews;
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(t.deleteConfirm)) return;
        start(async () => {
          await deleteReviewAction(reviewId);
          router.refresh();
        });
      }}
      aria-label={t.deleteAria}
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
    >
      <Trash2 className="size-3.5" /> {t.delete}
    </button>
  );
}

/**
 * İşletme sahibi sahte/uygunsuz bulduğu yorumu admin'e şikayet eder (silmeden).
 * Silmek yerine bunu öneririz — gerçek olumsuz yorumu silmek güveni zedeler.
 */
export function ReportReviewButton({
  reviewId,
  reported,
}: {
  reviewId: string;
  reported: boolean;
}) {
  const t = useDict().panelOther.reviews;
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(reported);

  if (done) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-honey-soft px-2.5 py-1 text-xs font-semibold text-honey">
        <Flag className="size-3.5" /> {t.reported}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(t.reportConfirm)) return;
        start(async () => {
          await reportReviewAction(reviewId);
          setDone(true);
          router.refresh();
        });
      }}
      aria-label={t.reportAria}
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-ink-mute transition-colors hover:bg-honey-soft hover:text-honey disabled:opacity-50"
    >
      <Flag className="size-3.5" /> {t.report}
    </button>
  );
}
