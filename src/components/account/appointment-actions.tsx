"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import { Star, CheckCircle2, ExternalLink } from "lucide-react";
import {
  cancelAppointmentAction,
  createReviewAction,
} from "@/server/actions/account";
import type { FormState } from "@/server/actions/auth";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function CancelButton({ appointmentId }: { appointmentId: string }) {
  const t = useDict().account.cancel;
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        {t.cancel}
      </Button>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span className="text-xs font-semibold text-ink-soft">{t.confirm}</span>
      <Button
        variant="danger"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => cancelAppointmentAction(appointmentId))}
      >
        {isPending ? t.cancelling : t.yesCancel}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        {t.dismiss}
      </Button>
    </span>
  );
}

function googleReviewUrl(placeId: string) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

export function ReviewButton({
  appointmentId,
  businessName,
  googlePlaceId,
  alreadyReviewed = false,
}: {
  appointmentId: string;
  businessName: string;
  googlePlaceId?: string | null;
  alreadyReviewed?: boolean;
}) {
  const t = useDict().account.review;
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [state, action] = useActionState<FormState, FormData>(
    createReviewAction,
    undefined
  );

  // Başarılı gönderimde modalı kapatma; teşekkür + Google adımını göster.
  useEffect(() => {
    if (state?.ok) setSubmitted(true);
  }, [state]);

  // Önceki oturumda zaten değerlendirilmiş: sadece (varsa) Google'da paylaş.
  if (alreadyReviewed && !submitted) {
    if (!googlePlaceId) return null;
    return (
      <Button
        href={googleReviewUrl(googlePlaceId)}
        target="_blank"
        rel="noreferrer"
        variant="outline"
        size="sm"
      >
        <ExternalLink className="size-3.5" /> {t.shareOnGoogle}
      </Button>
    );
  }

  return (
    <>
      <Button variant="accent" size="sm" onClick={() => setOpen(true)}>
        <Star className="size-3.5" /> {t.rate}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={businessName}>
        {submitted ? (
          <div className="text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-mint-soft">
              <CheckCircle2 className="size-8 text-mint" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">{t.thanksTitle}</h3>
            <p className="mt-1.5 text-ink-soft">
              {t.thanksDesc}
            </p>
            {googlePlaceId ? (
              <div className="mt-5 rounded-2xl bg-cream p-4">
                <p className="text-sm font-semibold text-ink">
                  {t.alsoGoogleTitle}
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  {interpolate(t.alsoGoogleDesc, { name: businessName })}
                </p>
                <Button
                  href={googleReviewUrl(googlePlaceId)}
                  target="_blank"
                  rel="noreferrer"
                  variant="accent"
                  className="mt-3 w-full"
                >
                  <ExternalLink className="size-4" /> {t.rateOnGoogle}
                </Button>
              </div>
            ) : null}
            <Button variant="ghost" className="mt-4 w-full" onClick={() => setOpen(false)}>
              {t.close}
            </Button>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <input type="hidden" name="appointmentId" value={appointmentId} />
            <input type="hidden" name="rating" value={rating} />
            <div>
              <Label>{t.ratingLabel}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    className="p-1"
                    aria-label={interpolate(t.starsAria, { n })}
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        n <= (hover || rating)
                          ? "fill-ink text-ink"
                          : "text-line-strong"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="rv-comment">{t.experienceLabel}</Label>
              <Textarea
                id="rv-comment"
                name="comment"
                required
                minLength={5}
                placeholder={t.commentPlaceholder}
              />
            </div>
            <FormError message={state?.error} />
            <SubmitButton variant="accent" className="w-full" pendingText={t.submitting}>
              {t.submitReview}
            </SubmitButton>
          </form>
        )}
      </Modal>
    </>
  );
}
