"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDict } from "@/i18n/provider";

const CONSENT_COOKIE = "salonor_cookie_consent";

/** KVKK çerez onay bandı — analiz çerezleri yalnızca "Kabul et" sonrası yüklenir
 *  (kök layout, bu çerezi okuyup Analytics'i koşullu render eder). */
export function CookieConsent() {
  const t = useDict().consent;
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Native uygulamada (WebView, body.in-app) gösterme — bandın `fixed bottom-0`
    // konumu panel içeriğinin altını örtüyor. Analytics zaten onaysız yüklenmez
    // (kök layout consent çerezini kontrol eder), bu yüzden KVKK açısından güvenli.
    if (document.body.classList.contains("in-app")) return;
    const decided = document.cookie
      .split("; ")
      .some((c) => c.startsWith(CONSENT_COOKIE + "="));
    setShow(!decided);
  }, []);

  function choose(value: "accepted" | "rejected") {
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
    setShow(false);
    // Kabul edilince Analytics'in yüklenmesi için sunucuyu yeniden render et.
    if (value === "accepted") router.refresh();
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4">
      <div className="container-x">
        <div className="anim-rise flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-pop sm:flex-row sm:items-center sm:gap-4 sm:p-5">
          <span className="text-2xl" aria-hidden>
            🍪
          </span>
          <p className="flex-1 text-sm leading-relaxed text-ink-soft">
            {t.message}{" "}
            <Link href="/kvkk" className="font-semibold text-accent-deep hover:underline">
              {t.learnMore}
            </Link>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => choose("rejected")}
              className="rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream"
            >
              {t.reject}
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-accent-deep"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
