"use client";

import { useEffect } from "react";
import "./globals.css";

// Kök layout'un kendisi hata fırlatırsa error.tsx onu yakalayamaz; bu sınır
// (global-error) layout'un yerini alır, bu yüzden kendi <html>/<body>'sini ve
// global stillerini içermek zorundadır. i18n sağlayıcısı da burada yoktur.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Yapılandırılmış logger ile raporla (logger içinde SENTRY_DSN varsa Sentry'ye gider).
    void import("@/lib/logger")
      .then(({ logger }) =>
        logger.error("Kök layout hata sınırı (global-error) yakaladı", {
          error,
          digest: error.digest,
        }),
      )
      .catch(() => console.error(error));

    // Tarayıcıya enjekte edilmiş Sentry global'i varsa onu da bilgilendir (guard'lı).
    const w = window as unknown as { Sentry?: { captureException?: (e: unknown) => void } };
    w.Sentry?.captureException?.(error);
  }, [error]);

  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center">
          <p className="font-display text-6xl font-extrabold tracking-tight text-ink">Bir aksilik oldu</p>
          <p className="mt-3 max-w-sm text-ink-soft">
            Beklenmeyen bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 select-none items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-accent px-6 text-base font-semibold text-white transition-all duration-150 hover:bg-accent-deep active:scale-[0.98]"
            >
              Tekrar dene
            </button>
            <a
              href="/"
              className="inline-flex h-12 select-none items-center justify-center whitespace-nowrap rounded-full border border-line-strong bg-surface px-6 text-base font-semibold text-ink transition-all duration-150 hover:border-ink/40 hover:bg-cream"
            >
              Ana sayfaya dön
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
