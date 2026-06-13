"use client";

import { useActionState } from "react";
import { updateBusinessAction, type ActionState } from "@/server/actions/business";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function BusinessProfileForm({
  defaults,
}: {
  defaults: {
    name: string;
    description: string;
    phone: string;
    address: string;
    district: string;
    city: string;
  };
}) {
  const [state, action] = useActionState<ActionState, FormData>(updateBusinessAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="bp-name">İşletme adı</Label>
        <Input id="bp-name" name="name" defaultValue={defaults.name} required />
      </div>
      <div>
        <Label htmlFor="bp-desc">Açıklama</Label>
        <Textarea id="bp-desc" name="description" defaultValue={defaults.description} className="min-h-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="bp-phone">Telefon</Label>
          <Input id="bp-phone" name="phone" defaultValue={defaults.phone} placeholder="0212 000 00 00" />
        </div>
        <div>
          <Label htmlFor="bp-city">Şehir</Label>
          <Input id="bp-city" name="city" defaultValue={defaults.city} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <Label htmlFor="bp-address">Adres</Label>
          <Input id="bp-address" name="address" defaultValue={defaults.address} />
        </div>
        <div>
          <Label htmlFor="bp-district">İlçe</Label>
          <Input id="bp-district" name="district" defaultValue={defaults.district} />
        </div>
      </div>
      <FormError message={state?.error} />
      {state?.ok && <FormSuccess message="İşletme bilgilerin güncellendi." />}
      <SubmitButton>Değişiklikleri kaydet</SubmitButton>
    </form>
  );
}
