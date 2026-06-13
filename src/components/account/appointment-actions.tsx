"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import { Star } from "lucide-react";
import {
  cancelAppointmentAction,
  createReviewAction,
} from "@/server/actions/account";
import type { FormState } from "@/server/actions/auth";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function CancelButton({ appointmentId }: { appointmentId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        İptal et
      </Button>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <span className="text-xs font-semibold text-ink-soft">Emin misin?</span>
      <Button
        variant="danger"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => cancelAppointmentAction(appointmentId))}
      >
        {isPending ? "İptal ediliyor..." : "Evet, iptal et"}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
        Vazgeç
      </Button>
    </span>
  );
}

export function ReviewButton({
  appointmentId,
  businessName,
}: {
  appointmentId: string;
  businessName: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [state, action] = useActionState<FormState, FormData>(
    createReviewAction,
    undefined
  );

  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  return (
    <>
      <Button variant="accent" size="sm" onClick={() => setOpen(true)}>
        <Star className="size-3.5" /> Değerlendir
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={businessName}>
        <form action={action} className="space-y-4">
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <input type="hidden" name="rating" value={rating} />
          <div>
            <Label>Puanın</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                  aria-label={`${n} yıldız`}
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
            <Label htmlFor="rv-comment">Deneyimin</Label>
            <Textarea
              id="rv-comment"
              name="comment"
              required
              minLength={5}
              placeholder="Hizmet nasıldı? Diğer kullanıcılara yol göster..."
            />
          </div>
          <FormError message={state?.error} />
          <SubmitButton variant="accent" className="w-full" pendingText="Gönderiliyor...">
            Yorumu gönder
          </SubmitButton>
        </form>
      </Modal>
    </>
  );
}
