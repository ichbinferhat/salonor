"use client";

import { useActionState } from "react";
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
  const dict = useDict();
  const t = dict.auth;
  return (
    <form action={action} className="space-y-4">
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
