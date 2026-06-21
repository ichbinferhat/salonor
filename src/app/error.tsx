"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/provider";
import { tr } from "@/i18n/dictionaries/tr";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Hata sınırı: sözlük sağlayıcısı normalde mevcut, ancak kabuk bozulduysa
  // (provider yoksa) Türkçe varsayılana zarif şekilde düş.
  const c = useSafeCommon();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-6xl font-extrabold tracking-tight text-ink">{c.errorTitle}</p>
      <p className="mt-3 max-w-sm text-ink-soft">{c.errorDesc}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button variant="accent" size="lg" onClick={reset}>
          {c.retry}
        </Button>
        <Button href="/" variant="outline" size="lg">
          {c.backHome}
        </Button>
      </div>
    </div>
  );
}

/** Sağlayıcı yoksa throw etmeden Türkçe `common` sözlüğüne düşer. */
function useSafeCommon() {
  try {
    return useDict().common;
  } catch {
    return tr.common;
  }
}
