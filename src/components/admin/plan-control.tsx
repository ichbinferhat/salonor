"use client";

import { useState, useTransition } from "react";
import { Plus, Minus, MessageSquare } from "lucide-react";
import { setBusinessPlanAction, addSmsCreditsAction } from "@/server/actions/admin";
import { PLAN_LIST } from "@/lib/plans";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

const PLAN_OPTIONS = PLAN_LIST.map((p) => ({ value: p.key, label: p.name }));

export function PlanControl({
  businessId,
  plan,
  credits,
}: {
  businessId: string;
  plan: string;
  credits: number;
}) {
  const dict = useDict();
  const [pending, start] = useTransition();
  const [value, setValue] = useState(plan);
  // Kontörü yerel tut: top-up sonrası anında yansısın (sunucu revalidate'ini beklemeden).
  const [creditCount, setCreditCount] = useState(credits);
  const [amount, setAmount] = useState(100);

  function changePlan(next: string) {
    const prev = value;
    setValue(next); // iyimser
    start(async () => {
      const r = await setBusinessPlanAction(businessId, next);
      // Başarısızsa eski plana geri dön (DB değişmedi). Kontör korunur — paket değişimi kontörü ezmez.
      if (!r?.ok) {
        setValue(prev);
        alert(dict.admin.planUpdateError);
      }
    });
  }

  function topUp(inc: number) {
    if (!Number.isFinite(inc) || inc === 0) return;
    setCreditCount((c) => Math.max(0, c + inc)); // iyimser
    start(async () => {
      const r = await addSmsCreditsAction(businessId, inc);
      if (!r?.ok) {
        setCreditCount((c) => Math.max(0, c - inc)); // geri al
        alert(dict.admin.creditUpdateError);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => changePlan(e.target.value)}
        className="h-8 rounded-lg border border-line-strong bg-surface px-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none disabled:opacity-50"
      >
        {PLAN_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1.5 text-xs text-ink-soft">
        <MessageSquare className="size-3.5 text-accent" />
        <span className="font-semibold text-ink">{creditCount.toLocaleString("tr-TR")}</span>
        <input
          type="number"
          min={1}
          step={50}
          value={amount}
          disabled={pending}
          onChange={(e) => setAmount(Math.max(1, Math.round(Number(e.target.value) || 0)))}
          aria-label={dict.admin.creditAmountAria}
          className="h-6 w-16 rounded-md border border-line-strong bg-surface px-1.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => topUp(amount)}
          title={interpolate(dict.admin.addCreditsTitle, { amount })}
          className="inline-flex items-center rounded-md border border-line-strong px-1 py-0.5 text-ink-mute hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => topUp(-amount)}
          title={interpolate(dict.admin.removeCreditsTitle, { amount })}
          className="inline-flex items-center rounded-md border border-line-strong px-1 py-0.5 text-ink-mute hover:border-rose/40 hover:text-rose disabled:opacity-50"
        >
          <Minus className="size-3" />
        </button>
      </div>
    </div>
  );
}
