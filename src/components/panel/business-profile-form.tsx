"use client";

import { useActionState, useState } from "react";
import { updateBusinessAction, type ActionState } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";
import { Input, Label, Textarea, FormError, FormSuccess } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { LocationPicker } from "@/components/onboarding/location-picker";

export function BusinessProfileForm({
  defaults,
}: {
  defaults: {
    name: string;
    description: string;
    phone: string;
    whatsappPhone: string;
    address: string;
    district: string;
    city: string;
    lat: number;
    lng: number;
    googlePlaceId: string;
    promoText: string;
    promoUntil: string;
  };
}) {
  const t = useDict().panelCatalog.profile;
  const [state, action] = useActionState<ActionState, FormData>(updateBusinessAction, undefined);
  const [coords, setCoords] = useState({ lat: defaults.lat, lng: defaults.lng });

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="bp-name">{t.nameLabel}</Label>
        <Input id="bp-name" name="name" defaultValue={defaults.name} required />
      </div>
      <div>
        <Label htmlFor="bp-desc">{t.descLabel}</Label>
        <Textarea id="bp-desc" name="description" defaultValue={defaults.description} className="min-h-24" />
      </div>

      {/* Öne çıkan kampanya / duyuru */}
      <div className="rounded-2xl border border-accent/30 bg-accent-faint/40 p-4">
        <Label htmlFor="bp-promo">{t.promoLabel}</Label>
        <Input
          id="bp-promo"
          name="promoText"
          defaultValue={defaults.promoText}
          placeholder={t.promoPlaceholder}
          maxLength={120}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Label htmlFor="bp-promo-until" className="!mb-0 text-sm">
            {t.promoUntilLabel}
          </Label>
          <Input
            id="bp-promo-until"
            name="promoUntil"
            type="date"
            defaultValue={defaults.promoUntil}
            className="!w-auto"
          />
        </div>
        <p className="mt-2 text-xs text-ink-mute">{t.promoHint}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="bp-phone">{t.phoneLabel}</Label>
          <Input id="bp-phone" name="phone" defaultValue={defaults.phone} placeholder={t.phonePlaceholder} />
        </div>
        <div>
          <Label htmlFor="bp-city">{t.cityLabel}</Label>
          <Input id="bp-city" name="city" defaultValue={defaults.city} />
        </div>
      </div>

      <div className="rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-4">
        <Label htmlFor="bp-whatsapp">
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="size-4 fill-[#25D366]" aria-hidden>
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.738-.979zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            {t.whatsappLabel}
          </span>
        </Label>
        <Input
          id="bp-whatsapp"
          name="whatsappPhone"
          defaultValue={defaults.whatsappPhone}
          placeholder={t.whatsappPlaceholder}
        />
        <p className="mt-2 text-xs text-ink-mute">{t.whatsappHint}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <Label htmlFor="bp-address">{t.addressLabel}</Label>
          <Input id="bp-address" name="address" defaultValue={defaults.address} />
        </div>
        <div>
          <Label htmlFor="bp-district">{t.districtLabel}</Label>
          <Input id="bp-district" name="district" defaultValue={defaults.district} />
        </div>
      </div>

      <div>
        <Label>{t.mapLabel}</Label>
        <LocationPicker
          lat={coords.lat}
          lng={coords.lng}
          onChange={(lat, lng) => setCoords({ lat, lng })}
        />
        <p className="mt-1.5 text-xs text-ink-mute">{t.mapHint}</p>
      </div>
      <input type="hidden" name="lat" value={coords.lat} />
      <input type="hidden" name="lng" value={coords.lng} />

      <div>
        <Label htmlFor="bp-gplace">{t.placeIdLabel}</Label>
        <Input
          id="bp-gplace"
          name="googlePlaceId"
          defaultValue={defaults.googlePlaceId}
          placeholder={t.placeIdPlaceholder}
        />
        <p className="mt-1.5 text-xs text-ink-mute">
          {t.placeIdHintBefore}<strong>{t.placeIdHintGoogle}</strong>{t.placeIdHintMid}
          <a
            href="https://developers.google.com/maps/documentation/places/web-service/place-id"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            {t.placeIdHintLink}
          </a>
          {t.placeIdHintAfter}
        </p>
      </div>

      <FormError message={state?.error} />
      {state?.ok && <FormSuccess message={t.saveSuccess} />}
      <SubmitButton>{t.saveButton}</SubmitButton>
    </form>
  );
}
