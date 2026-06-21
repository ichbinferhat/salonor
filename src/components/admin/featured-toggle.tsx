"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { setFeaturedAction } from "@/server/actions/admin";
import { useDict } from "@/i18n/provider";

export function FeaturedToggle({
  businessId,
  initial,
}: {
  businessId: string;
  initial: boolean;
}) {
  const dict = useDict();
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = !on;
        setOn(next); // iyimser güncelle
        start(async () => {
          const r = await setFeaturedAction(businessId, next);
          // Sunucu reddederse (oturum bitti / ADMIN değil / DB hatası) geri al.
          if (!r?.ok) {
            setOn(!next);
            alert(dict.admin.featuredUpdateError);
          }
        });
      }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
        on
          ? "bg-accent text-white"
          : "border border-line-strong bg-surface text-ink-soft hover:border-ink/40"
      }`}
      aria-pressed={on}
    >
      <Star className={`size-3.5 ${on ? "fill-white" : ""}`} />
      {on ? dict.admin.featuredOn : dict.admin.featuredOff}
    </button>
  );
}
