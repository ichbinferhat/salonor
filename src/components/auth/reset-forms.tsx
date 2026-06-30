"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordResetAction,
  resetPasswordAction,
  type FormState,
} from "@/server/actions/auth";
import { Input, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { useDict } from "@/i18n/provider";

/** "Şifremi unuttum" — e-posta alır, sıfırlama bağlantısı gönderir. */
export function ForgotPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(
    requestPasswordResetAction,
    undefined
  );
  const dict = useDict();
  const t = dict.auth;

  // Başarılı istek sonrası (enumerasyonu önlemek için her durumda aynı) bilgi notu.
  if (state?.ok && state.notice) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent-faint p-4 text-sm text-ink">
        {state.notice}
        <div className="mt-3">
          <Link href="/giris" className="font-semibold text-accent-deep hover:underline">
            {t.forgotForm.backToLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">{t.fields.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t.placeholders.email}
          required
          autoComplete="email"
        />
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText={t.forgotForm.submitPending}>
        {t.forgotForm.submit}
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        <Link href="/giris" className="font-semibold text-accent-deep hover:underline">
          {t.forgotForm.backToLogin}
        </Link>
      </p>
    </form>
  );
}

/** Yeni şifre belirleme formu (e-posta linkindeki token ile). */
export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState<FormState, FormData>(resetPasswordAction, undefined);
  const dict = useDict();
  const t = dict.auth;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password">{t.resetForm.newPassword}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={t.placeholders.passwordMin}
          required
          autoComplete="new-password"
          minLength={6}
        />
      </div>
      <div>
        <Label htmlFor="password2">{t.resetForm.newPasswordAgain}</Label>
        <Input
          id="password2"
          name="password2"
          type="password"
          placeholder={t.placeholders.passwordMin}
          required
          autoComplete="new-password"
          minLength={6}
        />
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText={t.resetForm.submitPending}>
        {t.resetForm.submit}
      </SubmitButton>
    </form>
  );
}
