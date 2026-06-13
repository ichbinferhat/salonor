"use client";

import { useState, useTransition } from "react";
import { Pause, Play } from "lucide-react";
import { setBusinessActiveAction } from "@/server/actions/admin";

export function ActiveToggle({
  businessId,
  initial,
}: {
  businessId: string;
  initial: boolean;
}) {
  const [active, setActive] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = !active;
        setActive(next);
        start(() => {
          setBusinessActiveAction(businessId, next);
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
          <Pause className="size-3.5" /> Askıya al
        </>
      ) : (
        <>
          <Play className="size-3.5" /> Aktifleştir
        </>
      )}
    </button>
  );
}
