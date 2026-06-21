"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/server/actions/account";
import { useDict } from "@/i18n/provider";

export function FavoriteButton({
  businessId,
  slug,
  initial,
}: {
  businessId: string;
  slug: string;
  initial: boolean;
}) {
  const dict = useDict();
  const [isPending, startTransition] = useTransition();
  const [fav, setFav] = useOptimistic(initial);

  function toggle() {
    startTransition(async () => {
      setFav(!fav);
      await toggleFavoriteAction(businessId, slug);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all ${
        fav
          ? "border-rose/30 bg-rose-soft text-rose"
          : "border-line-strong bg-surface text-ink hover:border-ink/40"
      }`}
      aria-pressed={fav}
    >
      <Heart className={`size-4 ${fav ? "fill-rose" : ""}`} />
      {fav ? dict.salon.inFavorites : dict.salon.addToFavorites}
    </button>
  );
}
