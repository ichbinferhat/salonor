"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContactRequestAction, type ContactState } from "@/server/actions/contact";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { useDict } from "@/i18n/provider";

export function ContactForm() {
  const t = useDict().legal.contactForm;
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

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card ring-1 ring-accent/5">
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
      <FormError message={state && "error" in state ? state.error : undefined} />
      <SubmitButton variant="accent" size="lg" className="w-full" pendingText={t.pendingText}>
        {t.submit}
      </SubmitButton>
      <p className="text-center text-xs text-ink-mute">{t.disclaimer}</p>
    </form>
  );
}
