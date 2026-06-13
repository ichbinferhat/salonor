"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/server/actions/account";

/** Kart üzerindeki küçük dairesel favori (kalp) düğmesi. */
export function FavoriteIcon({
  businessId,
  slug,
  initial = false,
}: {
  businessId: string;
  slug: string;
  initial?: boolean;
}) {
  const [fav, setFav] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFav((v) => !v);
    startTransition(() => {
      toggleFavoriteAction(businessId, slug);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={fav}
      aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
      className="flex size-9 items-center justify-center rounded-full bg-white/85 shadow-card backdrop-blur-sm transition-all hover:scale-110 hover:bg-white active:scale-95"
    >
      <Heart
        className={`size-[18px] transition-colors ${fav ? "fill-rose text-rose" : "text-ink"}`}
      />
    </button>
  );
}
