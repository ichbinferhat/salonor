"use client";

import { useState } from "react";
import { Check, Lock, ArrowRight, Users, MessageSquare, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/provider";
import {
  PLAN_LIST,
  FEATURE_ORDER,
  annualTl,
  annualPerMonthTl,
  formatPlanTl,
  type Plan,
} from "@/lib/plans";

type Billing = "monthly" | "annual";

export function PricingPlans() {
  const dict = useDict();
  const [billing, setBilling] = useState<Billing>("monthly");
  const annual = billing === "annual";

  return (
    <>
      {/* Aylık / Yıllık faturalandırma geçişi */}
      <div className="mt-9 flex justify-center">
        <div
          role="tablist"
          aria-label={dict.pricing.billingAriaLabel}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1 shadow-card"
        >
          <ToggleBtn active={!annual} onClick={() => setBilling("monthly")}>
            {dict.pricing.monthly}
          </ToggleBtn>
          <ToggleBtn active={annual} onClick={() => setBilling("annual")}>
            {dict.pricing.annual}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                annual ? "bg-white/20 text-white" : "bg-mint-soft text-mint"
              }`}
            >
              {dict.pricing.annualBadge}
            </span>
          </ToggleBtn>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
        {PLAN_LIST.map((plan) => (
          <PlanCard key={plan.key} plan={plan} annual={annual} />
        ))}
      </div>
    </>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-bold transition-colors ${
        active ? "bg-ink text-white shadow-card" : "text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const dict = useDict();
  const perMonth = annual ? annualPerMonthTl(plan.monthlyTl) : plan.monthlyTl;

  // Görüntülenen metin (paket adı/açıklaması/özellikler) sözlükten gelir;
  // sayısal veriler (fiyat, limitler) plans.ts'ten okunur.
  const planText: Record<Plan["key"], { name: string; tagline: string }> = {
    baslangic: { name: dict.pricing.planBaslangicName, tagline: dict.pricing.planBaslangicTagline },
    profesyonel: {
      name: dict.pricing.planProfesyonelName,
      tagline: dict.pricing.planProfesyonelTagline,
    },
    kurumsal: { name: dict.pricing.planKurumsalName, tagline: dict.pricing.planKurumsalTagline },
  };
  const { name, tagline } = planText[plan.key];

  const allFeatures = [
    dict.pricing.feature1,
    dict.pricing.feature2,
    dict.pricing.feature3,
    dict.pricing.feature4,
    dict.pricing.feature5,
    dict.pricing.feature6,
    dict.pricing.feature7,
    dict.pricing.feature8,
    dict.pricing.feature9,
    dict.pricing.feature10,
    dict.pricing.feature11,
    dict.pricing.feature12,
    dict.pricing.feature13,
    dict.pricing.feature14,
    dict.pricing.feature15,
  ];
  // Kademeli anlatı sırasıyla diz; ilk `featureCount` tanesi bu pakette AÇIK.
  const features = FEATURE_ORDER.map((n) => allFeatures[n - 1]);

  return (
    <div
      className={`relative flex flex-col rounded-[28px] border p-7 transition-transform hover:-translate-y-1 ${
        plan.popular
          ? "border-accent bg-gradient-to-b from-accent-faint to-surface shadow-pop ring-1 ring-accent lg:-translate-y-3 lg:scale-[1.02]"
          : "border-line bg-surface shadow-card"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-pop">
          {dict.pricing.mostPopular}
        </span>
      )}
      <h2 className="font-display text-xl font-bold text-ink">{name}</h2>
      <p className="mt-1 text-sm text-ink-soft">{tagline}</p>

      <div className="mt-5 flex items-end gap-1.5">
        <span className="font-display text-4xl font-extrabold tracking-tight text-ink">
          {formatPlanTl(perMonth)}₺
        </span>
        <span className="mb-1 text-sm text-ink-mute">{dict.pricing.perMonth}</span>
      </div>
      <p className="mt-1.5 min-h-[34px] text-xs font-medium text-ink-soft">
        {annual ? (
          <>
            {dict.pricing.annualBilledPrefix}
            <span className="font-bold text-ink">{formatPlanTl(annualTl(plan.monthlyTl))}₺</span>
            {dict.pricing.annualBilledSuffix}
            <span className="ml-1 font-semibold text-mint">
              {dict.pricing.annualSavingsPrefix}
              {formatPlanTl(plan.monthlyTl * 2)}₺{dict.pricing.annualSavingsSuffix}
            </span>
          </>
        ) : (
          dict.pricing.monthlyBilled
        )}
      </p>

      {/* Paket ayırt edici limitler */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Stat icon={Users} tone="text-accent" value={plan.staff} label={dict.pricing.staffLabel} />
        <Stat
          icon={MessageSquare}
          tone="text-mint"
          value={plan.smsBonus}
          label={dict.pricing.smsBonusLabel}
        />
      </div>

      <Button
        href="/iletisim"
        variant={plan.popular ? "accent" : "outline"}
        size="lg"
        className="mt-6 w-full"
      >
        {dict.pricing.contactCta} <ArrowRight className="size-4" />
      </Button>

      <ul className="mt-7 space-y-2.5">
        {features.map((f, i) => {
          const included = i < plan.featureCount;
          return (
            <li
              key={f}
              className={`flex items-start gap-2.5 text-sm ${included ? "text-ink" : "text-ink-mute"}`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  included ? "bg-accent-soft" : "bg-cream"
                }`}
              >
                {included ? (
                  <Check className="size-3.5 text-accent-deep" />
                ) : (
                  <Lock className="size-2.5 text-ink-mute" />
                )}
              </span>
              {f}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stat({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: LucideIcon;
  tone: string;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-cream/50 p-3 text-center">
      <Icon className={`mx-auto size-5 ${tone}`} />
      <p className="mt-1 font-display text-lg font-extrabold text-ink">
        {value.toLocaleString("tr-TR")}
      </p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}
