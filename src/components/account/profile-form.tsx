"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/server/actions/account";
import type { FormState } from "@/server/actions/auth";
import { Input, Label, FieldHint, FormError, FormSuccess } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function ProfileForm({
  defaults,
}: {
  defaults: { name: string; email: string; phone: string };
}) {
  const [state, action] = useActionState<FormState, FormData>(
    updateProfileAction,
    undefined
  );

  return (
    <form action={action} className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="pf-name">Ad Soyad</Label>
        <Input id="pf-name" name="name" defaultValue={defaults.name} required />
      </div>
      <div>
        <Label htmlFor="pf-email">E-posta</Label>
        <Input id="pf-email" value={defaults.email} disabled />
        <FieldHint>E-posta adresi değiştirilemez.</FieldHint>
      </div>
      <div>
        <Label htmlFor="pf-phone">Telefon</Label>
        <Input id="pf-phone" name="phone" defaultValue={defaults.phone} placeholder="05xx xxx xx xx" />
      </div>

      <div className="rounded-2xl border border-line bg-cream/60 p-5">
        <p className="mb-4 font-bold text-ink">Şifre değiştir (isteğe bağlı)</p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pf-current">Mevcut şifre</Label>
            <Input id="pf-current" name="currentPassword" type="password" autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="pf-new">Yeni şifre</Label>
            <Input id="pf-new" name="newPassword" type="password" autoComplete="new-password" minLength={6} />
          </div>
        </div>
      </div>

      <FormError message={state?.error} />
      {state?.ok && <FormSuccess message="Profilin güncellendi." />}
      <SubmitButton size="lg">Değişiklikleri kaydet</SubmitButton>
    </form>
  );
}
