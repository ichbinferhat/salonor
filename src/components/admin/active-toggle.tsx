"use client";

import { useState, useTransition } from "react";
import { Pause, Play } from "lucide-react";
import { setBusinessActiveAction } from "@/server/actions/admin";
import { useDict } from "@/i18n/provider";

export function ActiveToggle({
  businessId,
  initial,
}: {
  businessId: string;
  initial: boolean;
}) {
  const dict = useDict();
  const [active, setActive] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = !active;
        setActive(next); // iyimser güncelle
        start(async () => {
          const r = await setBusinessActiveAction(businessId, next);
          // Sunucu reddederse (oturum bitti / ADMIN değil / DB hatası) geri al.
          if (!r?.ok) {
            setActive(!next);
            alert(dict.admin.activeUpdateError);
          }
        });
      }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
        active
          ? "border border-line-strong bg-surface text-ink-soft hover:border-rose/40 hover:text-rose"
          : "bg-honey-soft text-honey"
      }`}
    >
      {active ? (
        <>
          <Pause className="size-3.5" /> {dict.admin.suspend}
        </>
      ) : (
        <>
          <Play className="size-3.5" /> {dict.admin.activate}
        </>
      )}
    </button>
  );
}
