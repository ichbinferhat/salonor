"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { updateCoverAction } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";

const PRESETS = [
  "1560066984-138dadb4c035",
  "1521590832167-7bcbfaa6381f",
  "1604654894610-df63bc536371",
  "1544161515-4ab6ce6db874",
  "1487412720507-e7ab37603c6f",
  "1570172619644-dfd03ed5d881",
  "1633681926022-84c23e8cb2d6",
  "1522335789203-aabd1fc54bc9",
].map((id) => `https://images.unsplash.com/photo-${id}?q=80&w=1200&auto=format&fit=crop`);

export function CoverPicker({ current }: { current: string }) {
  const t = useDict().panelCatalog.cover;
  const [selected, setSelected] = useState(current);
  const [isPending, startTransition] = useTransition();

  function pick(url: string) {
    setSelected(url);
    startTransition(() => updateCoverAction(url));
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PRESETS.map((url) => {
        const active = url === selected;
        return (
          <button
            key={url}
            onClick={() => pick(url)}
            disabled={isPending}
            className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
              active ? "border-accent ring-2 ring-accent/30" : "border-transparent hover:border-ink/30"
            }`}
          >
            <Image src={url} alt={t.optionAlt} fill sizes="200px" className="object-cover" />
            {active && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-white">
                  <Check className="size-5" />
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
