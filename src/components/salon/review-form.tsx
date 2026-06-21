"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, PenLine, CheckCircle2 } from "lucide-react";
import { addPublicReviewAction } from "@/server/actions/account";
import type { FormState } from "@/server/actions/auth";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

/** Salon sayfasında "Yorum ekle" — giriş gerektirmez (Google tarzı). */
export function PublicReviewButton({ slug, loggedIn }: { slug: string; loggedIn: boolean }) {
  const dict = useDict();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PenLine className="size-4" /> {dict.salon.addReview}
      </Button>
      {open && <ReviewModal slug={slug} loggedIn={loggedIn} onClose={() => setOpen(false)} />}
    </>
  );
}

function ReviewModal({
  slug,
  loggedIn,
  onClose,
}: {
  slug: string;
  loggedIn: boolean;
  onClose: () => void;
}) {
  const dict = useDict();
  const router = useRouter();
  const [state, action] = useActionState<FormState, FormData>(addPublicReviewAction, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  if (state?.ok) {
    // Yeni yorumu ve güncel puanı göstermek için kapanırken sayfayı tazele.
    const done = () => {
      router.refresh();
      onClose();
    };
    return (
      <Modal open onClose={done} title={dict.salon.thanksTitle} maxW="max-w-md">
        <div className="py-4 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint-soft ring-8 ring-mint/5">
            <CheckCircle2 className="size-8 text-mint" />
          </span>
          <p className="mt-4 text-ink-soft">
            {dict.salon.reviewPublished}
          </p>
          <Button variant="accent" className="mt-5 w-full" onClick={done}>
            {dict.salon.close}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title={dict.salon.addReview} maxW="max-w-md">
      <form
        action={action}
        onSubmit={(e) => {
          if (rating === 0) {
            e.preventDefault();
            setLocalError(dict.salon.selectRatingFirst);
          }
        }}
        className="space-y-4"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="rating" value={rating} />

        <div>
          <Label>{dict.salon.yourRating}</Label>
          <div className="mt-1.5 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => {
                  setRating(n);
                  setLocalError(null);
                }}
                aria-label={interpolate(dict.salon.starsLabel, { n })}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`size-9 ${
                    (hover || rating) >= n ? "fill-gold text-gold" : "fill-transparent text-line-strong"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {!loggedIn && (
          <div>
            <Label htmlFor="rv-name">{dict.salon.yourName}</Label>
            <Input id="rv-name" name="name" placeholder={dict.salon.yourNamePlaceholder} required autoComplete="name" />
          </div>
        )}

        <div>
          <Label htmlFor="rv-comment">{dict.salon.yourReview}</Label>
          <Textarea
            id="rv-comment"
            name="comment"
            placeholder={dict.salon.yourReviewPlaceholder}
            required
            className="min-h-24"
          />
        </div>

        <FormError message={localError ?? state?.error} />

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            {dict.salon.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1" pendingText={dict.salon.submitting}>
            {dict.salon.submitReview}
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
