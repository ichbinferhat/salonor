"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { setFeaturedAction } from "@/server/actions/admin";

export function FeaturedToggle({
  businessId,
  initial,
}: {
  businessId: string;
  initial: boolean;
}) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = !on;
        setOn(next);
        start(() => {
          setFeaturedAction(businessId, next);
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
      {on ? "Öne çıkan" : "Öne çıkar"}
    </button>
  );
}
