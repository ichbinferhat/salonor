"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { submitContactRequestAction, type ContactState } from "@/server/actions/contact";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { useDict } from "@/i18n/provider";

export function ContactForm() {
  const t = useDict().legal.contactForm;
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [state, action] = useActionState<ContactState, FormData>(
    submitContactRequestAction,
    undefined
  );

  if (state && "ok" in state && state.ok) {
    return (
      <div className="rounded-2xl border border-mint/40 bg-mint-soft/60 p-6 text-center shadow-card ring-1 ring-mint/10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-mint/15 ring-4 ring-mint/10">
          <CheckCircle2 className="size-7 text-mint" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-ink">{t.successTitle}</h3>
        <p className="mt-2 text-ink-soft">{t.successBody}</p>
      </div>
    );
  }

  // Onay kutusu işaretlenmeden gönderimi engelle (istemci kontrolü). İşaretliyse
  // sunucu aksiyonuna devam et; değilse hata göster ve aksiyonu hiç çağırma.
  function guardedAction(formData: FormData) {
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    return action(formData);
  }

  return (
    <form action={guardedAction} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card ring-1 ring-accent/5">
      <div>
        <Label htmlFor="cf-name">{t.nameLabel}</Label>
        <Input id="cf-name" name="name" placeholder={t.namePlaceholder} required autoComplete="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cf-email">{t.emailLabel}</Label>
          <Input
            id="cf-email"
            name="email"
            type="email"
            placeholder={t.emailPlaceholder}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="cf-phone">{t.phoneLabel}</Label>
          <Input id="cf-phone" name="phone" type="tel" placeholder={t.phonePlaceholder} autoComplete="tel" />
        </div>
      </div>
      <div>
        <Label htmlFor="cf-message">{t.messageLabel}</Label>
        <Textarea
          id="cf-message"
          name="message"
          placeholder={t.messagePlaceholder}
          className="min-h-24"
        />
      </div>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setConsentError(false);
          }}
          className="mt-0.5 size-4 shrink-0 rounded border-line-strong accent-accent"
        />
        <span>
          {t.consentBefore}
          <Link href="/kvkk" className="font-semibold text-accent-deep hover:underline">
            {t.consentLink}
          </Link>
          {t.consentAfter}
        </span>
      </label>
      {consentError && <p className="text-sm font-medium text-rose">{t.consentRequired}</p>}
      <FormError message={state && "error" in state ? state.error : undefined} />
      <SubmitButton variant="accent" size="lg" className="w-full" pendingText={t.pendingText}>
        {t.submit}
      </SubmitButton>
      <p className="text-center text-xs text-ink-mute">{t.disclaimer}</p>
    </form>
  );
}
