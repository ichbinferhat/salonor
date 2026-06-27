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

/** "Şifremi unuttum" — e-posta alır, sıfırlama bağlantısı gönderir. */
export function ForgotPasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(
    requestPasswordResetAction,
    undefined
  );

  // Başarılı istek sonrası (enumerasyonu önlemek için her durumda aynı) bilgi notu.
  if (state?.ok && state.notice) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent-faint p-4 text-sm text-ink">
        {state.notice}
        <div className="mt-3">
          <Link href="/giris" className="font-semibold text-accent-deep hover:underline">
            Girişe dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ornek@eposta.com"
          required
          autoComplete="email"
        />
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Gönderiliyor...">
        Sıfırlama bağlantısı gönder
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        <Link href="/giris" className="font-semibold text-accent-deep hover:underline">
          Girişe dön
        </Link>
      </p>
    </form>
  );
}

/** Yeni şifre belirleme formu (e-posta linkindeki token ile). */
export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState<FormState, FormData>(resetPasswordAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Label htmlFor="password">Yeni şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="En az 6 karakter"
          required
          autoComplete="new-password"
          minLength={6}
        />
      </div>
      <div>
        <Label htmlFor="password2">Yeni şifre (tekrar)</Label>
        <Input
          id="password2"
          name="password2"
          type="password"
          placeholder="En az 6 karakter"
          required
          autoComplete="new-password"
          minLength={6}
        />
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Kaydediliyor...">
        Şifreyi güncelle
      </SubmitButton>
    </form>
  );
}
