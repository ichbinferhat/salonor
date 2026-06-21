"use client";

import { useActionState, useEffect, useState } from "react";
import { Reply, Pencil } from "lucide-react";
import { replyReviewAction, type ActionState } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";
import { Textarea, FormError } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

export function ReviewReply({
  reviewId,
  businessName,
  existingReply,
}: {
  reviewId: string;
  businessName: string;
  existingReply: string | null;
}) {
  const t = useDict().panelOther.reviews;
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState<ActionState, FormData>(replyReviewAction, undefined);

  useEffect(() => {
    if (state?.ok) setEditing(false);
  }, [state]);

  if (existingReply && !editing) {
    return (
      <div className="mt-3 rounded-2xl bg-cream p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-ink-soft">{businessName} {t.repliedSuffix}</p>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs font-semibold text-accent-deep hover:underline"
          >
            <Pencil className="size-3" /> {t.edit}
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-soft">{existingReply}</p>
      </div>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-accent-deep hover:underline"
      >
        <Reply className="size-4" /> {t.reply}
      </button>
    );
  }

  return (
    <form action={action} className="mt-3 space-y-2">
      <input type="hidden" name="reviewId" value={reviewId} />
      <Textarea
        name="reply"
        defaultValue={existingReply ?? ""}
        required
        placeholder={t.replyPlaceholder}
        className="min-h-20"
      />
      <FormError message={state?.error} />
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={() => setEditing(false)}>
          {t.cancel}
        </Button>
        <SubmitButton variant="accent" size="sm" pendingText={t.sending}>
          {t.saveReply}
        </SubmitButton>
      </div>
    </form>
  );
}
