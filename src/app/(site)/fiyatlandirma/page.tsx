import type { Metadata } from "next";
import { Sparkles, ShieldCheck, Zap, Headset } from "lucide-react";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.pricing.metaTitle,
    description: dict.pricing.metaDescription,
  };
}

export default async function PricingPage() {
  const dict = await getDictionary();

  const TRUST = [
    { icon: ShieldCheck, text: dict.pricing.trust.noContract },
    { icon: Zap, text: dict.pricing.trust.freeSetup },
    { icon: Headset, text: dict.pricing.trust.liveSupport },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[420px] bg-gradient-to-b from-accent-faint via-[#fdf1f8] to-cream"
        aria-hidden
      />
      <div className="container-x py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-accent-deep shadow-card">
            <Sparkles className="size-4" /> {dict.pricing.badge}
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {dict.pricing.title}
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            {dict.pricing.subtitlePrefix}
            <span className="font-semibold text-ink">{dict.pricing.subtitleEmphasis}</span>
            {dict.pricing.subtitleSuffix}
          </p>
        </div>

        <PricingPlans />

        {/* Güven şeridi */}
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST.map((t) => (
            <span key={t.text} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <t.icon className="size-4 text-mint" /> {t.text}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-mute">
          {dict.pricing.footnotePrefix}
          <span className="font-semibold text-accent-deep">{dict.pricing.footnoteEmail}</span>.
        </p>
      </div>
    </div>
  );
}
