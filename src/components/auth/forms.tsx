"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  loginAction,
  registerAction,
  registerBusinessAction,
  type FormState,
} from "@/server/actions/auth";
import { Input, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { useDict } from "@/i18n/provider";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, undefined);
  const dict = useDict();
  const t = dict.auth;
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <Label htmlFor="email">{t.fields.email}</Label>
        <Input id="email" name="email" type="email" placeholder={t.placeholders.email} required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">{t.fields.password}</Label>
        <Input id="password" name="password" type="password" placeholder={t.placeholders.password} required autoComplete="current-password" />
      </div>
      <div className="-mt-1 text-right">
        <Link href="/sifremi-unuttum" className="text-sm font-medium text-accent-deep hover:underline">
          {t.loginForm.forgotPassword}
        </Link>
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText={t.loginForm.submitPending}>
        {t.loginForm.submit}
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        {t.loginForm.noAccount}{" "}
        <Link href="/kayit" className="font-semibold text-accent-deep hover:underline">
          {t.registerForm.submit}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(registerAction, undefined);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const dict = useDict();
  const t = dict.auth;

  // Aydınlatma onayı işaretlenmeden gönderimi engelle (istemci kontrolü).
  function guardedAction(formData: FormData) {
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    return action(formData);
  }

  return (
    <form action={guardedAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <Label htmlFor="name">{t.fields.name}</Label>
        <Input id="name" name="name" placeholder={t.placeholders.name} required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">{t.fields.email}</Label>
        <Input id="email" name="email" type="email" placeholder={t.placeholders.email} required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="phone">{t.fields.phoneOptional}</Label>
        <Input id="phone" name="phone" type="tel" placeholder={t.placeholders.phone} autoComplete="tel" />
      </div>
      <div>
        <Label htmlFor="password">{t.fields.password}</Label>
        <Input id="password" name="password" type="password" placeholder={t.placeholders.passwordMin} required autoComplete="new-password" minLength={6} />
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
          {t.registerForm.consentBefore}
          <Link href="/kvkk" className="font-semibold text-accent-deep hover:underline">
            {t.registerForm.consentLink}
          </Link>
          {t.registerForm.consentAfter}
        </span>
      </label>
      {consentError && (
        <p className="text-sm font-medium text-rose">{t.registerForm.consentRequired}</p>
      )}
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText={t.registerForm.submitPending}>
        {t.registerForm.submit}
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        {t.registerForm.haveAccount}{" "}
        <Link href="/giris" className="font-semibold text-accent-deep hover:underline">
          {t.registerForm.signIn}
        </Link>
      </p>
    </form>
  );
}

export function BusinessRegisterForm() {
  const [state, action] = useActionState<FormState, FormData>(
    registerBusinessAction,
    undefined
  );
  const dict = useDict();
  const t = dict.auth;
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">{t.fields.name}</Label>
        <Input id="name" name="name" placeholder={t.placeholders.name} required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">{t.fields.businessEmail}</Label>
        <Input id="email" name="email" type="email" placeholder={t.placeholders.businessEmail} required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">{t.fields.password}</Label>
        <Input id="password" name="password" type="password" placeholder={t.placeholders.passwordMin} required autoComplete="new-password" minLength={6} />
      </div>
      <FormError message={state?.error} />
      <SubmitButton variant="accent" size="lg" className="w-full" pendingText={t.businessForm.submitPending}>
        {t.businessForm.submit}
      </SubmitButton>
      <p className="text-center text-xs text-ink-mute">
        {t.businessForm.termsNotice}
      </p>
    </form>
  );
}
