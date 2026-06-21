"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/server/actions/account";
import type { FormState } from "@/server/actions/auth";
import { useDict } from "@/i18n/provider";
import { Input, Label, FieldHint, FormError, FormSuccess } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function ProfileForm({
  defaults,
}: {
  defaults: { name: string; email: string; phone: string };
}) {
  const dict = useDict();
  const t = dict.account.profile;
  const [state, action] = useActionState<FormState, FormData>(
    updateProfileAction,
    undefined
  );

  return (
    <form action={action} className="max-w-lg space-y-5">
      <div>
        <Label htmlFor="pf-name">{t.nameLabel}</Label>
        <Input id="pf-name" name="name" defaultValue={defaults.name} required />
      </div>
      <div>
        <Label htmlFor="pf-email">{t.emailLabel}</Label>
        <Input id="pf-email" value={defaults.email} disabled />
        <FieldHint>{t.emailHint}</FieldHint>
      </div>
      <div>
        <Label htmlFor="pf-phone">{t.phoneLabel}</Label>
        <Input id="pf-phone" name="phone" defaultValue={defaults.phone} placeholder={t.phonePlaceholder} />
      </div>

      <div className="rounded-[20px] border border-line bg-gradient-to-b from-cream/70 to-cream/30 p-5 ring-1 ring-line/60">
        <p className="mb-4 font-display font-bold text-ink">{t.passwordSectionTitle}</p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pf-current">{t.currentPasswordLabel}</Label>
            <Input id="pf-current" name="currentPassword" type="password" autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="pf-new">{t.newPasswordLabel}</Label>
            <Input id="pf-new" name="newPassword" type="password" autoComplete="new-password" minLength={6} />
          </div>
        </div>
      </div>

      <FormError message={state?.error} />
      {state?.ok && <FormSuccess message={t.updated} />}
      <SubmitButton size="lg">{t.save}</SubmitButton>
    </form>
  );
}
