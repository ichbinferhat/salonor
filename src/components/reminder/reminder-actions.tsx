"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2, CalendarCheck2 } from "lucide-react";
import { confirmByTokenAction, cancelByTokenAction } from "@/server/actions/reminder";

/** Hatırlatma teyit sayfasındaki "Geliyorum / İptal" butonları (token ile yetkili). */
export function ReminderActions({ token }: { token: string }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState<null | "confirmed" | "cancelled">(null);
  const [error, setError] = useState<string | null>(null);

  function act(kind: "confirm" | "cancel") {
    setError(null);
    start(async () => {
      const r =
        kind === "confirm"
          ? await confirmByTokenAction(token)
          : await cancelByTokenAction(token);
      if (!r.ok) {
        setError(r.error ?? "İşlem yapılamadı, lütfen tekrar dene.");
        return;
      }
      setDone(kind === "confirm" ? "confirmed" : "cancelled");
    });
  }

  if (done === "confirmed")
    return (
      <div className="rounded-2xl bg-mint-soft p-5 text-center">
        <CalendarCheck2 className="mx-auto size-8 text-mint" />
        <p className="mt-2 font-semibold text-ink">Harika, randevunu teyit ettin!</p>
        <p className="mt-1 text-sm text-ink-soft">Seni bekliyoruz. 🎉</p>
      </div>
    );

  if (done === "cancelled")
    return (
      <div className="rounded-2xl bg-cream p-5 text-center">
        <X className="mx-auto size-8 text-ink-mute" />
        <p className="mt-2 font-semibold text-ink">Randevun iptal edildi.</p>
        <p className="mt-1 text-sm text-ink-soft">Dilediğinde tekrar randevu alabilirsin.</p>
      </div>
    );

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-xl bg-rose/10 px-3 py-2 text-sm font-medium text-rose">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => act("confirm")}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
          Geliyorum
        </button>
        <button
          type="button"
          onClick={() => act("cancel")}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-3 font-semibold text-ink transition hover:border-rose/50 hover:text-rose disabled:opacity-50"
        >
          <X className="size-5" />
          İptal et
        </button>
      </div>
    </div>
  );
}
