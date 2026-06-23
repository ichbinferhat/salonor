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
    // Yapılandırılmış logger ile raporla (logger içinde SENTRY_DSN varsa Sentry'ye gider).
    // Logger yüklenemezse en azından konsola yaz.
    void import("@/lib/logger")
      .then(({ logger }) =>
        logger.error("Segment hata sınırı yakaladı", { error, digest: error.digest }),
      )
      .catch(() => console.error(error));

    // Tarayıcıya enjekte edilmiş Sentry global'i varsa onu da bilgilendir (guard'lı).
    const w = window as unknown as { Sentry?: { captureException?: (e: unknown) => void } };
    w.Sentry?.captureException?.(error);
  }, [error]);

  // Hata sınırı: sözlük sağlayıcısı normalde mevcut, ancak kabuk bozulduysa
  // (provider yoksa) Türkçe varsayılana zarif şekilde düş.
  const c = useSafeCommon();
  // Geliştirme dışında teknik detay (mesaj/digest) sızdırma.
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-6xl font-extrabold tracking-tight text-ink">{c.errorTitle}</p>
      <p className="mt-3 max-w-sm text-ink-soft">{c.errorDesc}</p>
      {isDev && (
        <pre className="mt-5 max-h-40 w-full max-w-md overflow-auto rounded-2xl border border-line bg-surface px-4 py-3 text-left text-xs leading-relaxed text-ink-soft">
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
      )}
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
