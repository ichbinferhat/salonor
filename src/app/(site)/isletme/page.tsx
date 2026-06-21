import type { Metadata } from "next";
import {
  CalendarCheck2,
  CalendarDays,
  Star,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  Wallet,
  Smartphone,
  MessageSquare,
  Gift,
  Coins,
  Package,
  Receipt,
  Award,
  Wand2,
  TrendingUp,
  Scissors,
  X,
  Zap,
  Headset,
  Store,
  MapPin,
  Clock,
  ChevronLeft,
  CalendarPlus,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.business.meta.title,
    description: dict.business.meta.description,
  };
}

/* ── Renk tonu eşlemeleri (tek yerden) ── */
const CHIP: Record<string, string> = {
  accent: "bg-accent-soft text-accent-deep",
  sea: "bg-sea-soft text-sea",
  mint: "bg-mint-soft text-mint",
  honey: "bg-honey-soft text-honey",
  rose: "bg-rose-soft text-rose",
};
const BLOCK: Record<string, string> = {
  accent: "border-accent bg-accent-soft text-accent-deep",
  sea: "border-sea bg-sea-soft text-sea",
  mint: "border-mint bg-mint-soft text-mint",
  honey: "border-honey bg-honey-soft text-honey",
  rose: "border-rose bg-rose-soft text-rose",
};

type BusinessDict = Awaited<ReturnType<typeof getDictionary>>["business"];

const MODULES: { icon: LucideIcon; nameKey: keyof BusinessDict["modules"] & string; tone: keyof typeof CHIP }[] = [
  { icon: CalendarDays, nameKey: "smartCalendar", tone: "accent" },
  { icon: CalendarCheck2, nameKey: "onlineBooking", tone: "accent" },
  { icon: Receipt, nameKey: "checkoutCashbox", tone: "sea" },
  { icon: Coins, nameKey: "loyaltyPoints", tone: "honey" },
  { icon: Gift, nameKey: "giftCard", tone: "rose" },
  { icon: Package, nameKey: "productStock", tone: "sea" },
  { icon: Award, nameKey: "staffCommission", tone: "mint" },
  { icon: Wallet, nameKey: "debtTracking", tone: "honey" },
  { icon: MessageSquare, nameKey: "smsReminder", tone: "mint" },
  { icon: Wand2, nameKey: "aiAnalysis", tone: "accent" },
  { icon: BarChart3, nameKey: "reports", tone: "sea" },
  { icon: Star, nameKey: "reviewReputation", tone: "honey" },
];

export default async function BusinessLandingPage() {
  const dict = await getDictionary();
  const t = dict.business;

  const STEPS: [string, string, string][] = [
    [t.steps.step1Title, t.steps.step1Desc, t.steps.step1Badge],
    [t.steps.step2Title, t.steps.step2Desc, t.steps.step2Badge],
    [t.steps.step3Title, t.steps.step3Desc, t.steps.step3Badge],
  ];

  const TESTIMONIALS: { quote: string; name: string; role: string; tone: keyof typeof CHIP }[] = [
    { quote: t.testimonials.quote1, name: "Deniz K.", role: t.testimonials.role1, tone: "accent" },
    { quote: t.testimonials.quote2, name: "Burak Y.", role: t.testimonials.role2, tone: "sea" },
    { quote: t.testimonials.quote3, name: "Selin A.", role: t.testimonials.role3, tone: "mint" },
  ];

  const [bizCount, serviceCount, reviewCount] = await Promise.all([
    db.business.count(),
    db.service.count(),
    db.review.count(),
  ]);

  return (
    <div className="overflow-x-clip">
      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-accent-faint via-[#fdf1f8] to-cream" />
          <div className="absolute -left-28 top-4 size-[26rem] rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -right-10 top-44 size-80 rounded-full bg-[#ff5fa2]/12 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(108,77,246,0.05)_1px,_transparent_1px)] [background-size:22px_22px]" />
        </div>

        <div className="container-x grid items-center gap-14 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
          <div>
            <p className="anim-rise mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent-deep shadow-card backdrop-blur">
              <Scissors className="size-3.5" /> {t.hero.badge}
            </p>
            <h1 className="anim-rise d-1 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl">
              {t.hero.titleLine1}
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent via-[#9264ff] to-[#ff5fa2] bg-clip-text text-transparent">
                  {t.hero.titleHighlight}
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full text-accent/35"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 9C60 3 120 3 180 6C220 8 260 8 298 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="anim-rise d-2 mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              {t.hero.subtitle}
            </p>
            <div className="anim-rise d-3 mt-9 flex flex-wrap gap-3">
              <Button href="/iletisim" variant="accent" size="lg">
                {t.hero.ctaStart} <ArrowRight className="size-4" />
              </Button>
              <Button href="/fiyatlandirma" variant="outline" size="lg">
                {t.hero.ctaPackages}
              </Button>
            </div>
            <div className="anim-rise d-4 mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> {t.hero.proofFreeSetup}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> {t.hero.proofNoContract}
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> {t.hero.proofLive}
              </span>
            </div>
          </div>

          {/* Ürün mockup'ı + yüzen kartlar */}
          <div className="anim-rise d-3 relative">
            <div className="absolute -inset-5 -z-10 rounded-[44px] bg-gradient-to-br from-accent/20 via-transparent to-[#ff5fa2]/15 blur-2xl" aria-hidden />
            <CalendarMock dict={t} />

            {/* Yeni randevu bildirimi */}
            <div className="absolute -right-2 -top-4 hidden items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-pop sm:flex">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-mint" />
              </span>
              <div className="text-xs leading-tight">
                <p className="font-bold text-ink">{t.hero.notifNewAppt}</p>
                <p className="text-ink-soft">{t.hero.notifApptDetail}</p>
              </div>
            </div>

            {/* Ciro kartı */}
            <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-pop sm:flex">
              <span className="flex size-10 items-center justify-center rounded-xl bg-mint-soft">
                <Wallet className="size-5 text-mint" />
              </span>
              <div className="text-sm leading-tight">
                <p className="text-xs text-ink-mute">{t.hero.revenueLabel}</p>
                <p className="font-display text-lg font-extrabold text-ink">₺8.450</p>
              </div>
              <span className="flex items-center gap-0.5 self-start rounded-full bg-mint-soft px-1.5 py-0.5 text-[11px] font-bold text-mint">
                <TrendingUp className="size-3" /> 12%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Metrik şeridi ─────────────────────────── */}
      <section className="border-y border-line bg-surface">
        <div className="container-x grid divide-y divide-line py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: Store, num: `${bizCount}`, label: t.stats.selectBusiness },
            { icon: Scissors, num: `${serviceCount}+`, label: t.stats.bookableService },
            { icon: Star, num: `${reviewCount}+`, label: t.stats.verifiedReview },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-center gap-3 py-6 text-center sm:py-7">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
                <s.icon className="size-5" />
              </span>
              <div className="text-left">
                <p className="font-display text-2xl font-extrabold leading-none text-ink sm:text-3xl">
                  {s.num}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────── Modül vitrini ─────────────────────────── */}
      <section className="container-x py-16 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-deep">
            {t.modulesSection.kicker}
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">
            {t.modulesSection.heading}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">
            {t.modulesSection.descBefore}
            <span className="font-semibold text-ink">{t.modulesSection.descBold}</span>
            {t.modulesSection.descAfter}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {MODULES.map((m, i) => (
            <Reveal key={m.nameKey} delay={(i % 4) * 70}>
              <div className="group relative isolate flex h-full items-center gap-3.5 overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-pop">
                <span className="pointer-events-none absolute -right-6 -top-6 -z-10 size-16 rounded-full bg-accent/0 blur-2xl transition-colors duration-300 group-hover:bg-accent/15" aria-hidden />
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${CHIP[m.tone]}`}
                >
                  <m.icon className="size-5" />
                </span>
                <span className="font-semibold text-ink">{t.modules[m.nameKey]}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────────── Showcase: Akıllı takvim ─────────────────────────── */}
      <section className="bg-surface">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-deep">
              <CalendarDays className="size-3.5" /> {t.calendarShowcase.kicker}
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">
              {t.calendarShowcase.heading}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {t.calendarShowcase.descBefore}
              <span className="font-semibold text-ink">{t.calendarShowcase.descBold}</span>
              {t.calendarShowcase.descAfter}
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                [t.calendarShowcase.feat1Title, t.calendarShowcase.feat1Desc],
                [t.calendarShowcase.feat2Title, t.calendarShowcase.feat2Desc],
                [t.calendarShowcase.feat3Title, t.calendarShowcase.feat3Desc],
              ].map(([title, d]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint-soft">
                    <Check className="size-3.5 text-mint" />
                  </span>
                  <span>
                    <span className="font-semibold text-ink">{title}</span>
                    <span className="text-ink-soft"> — {d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <CalendarMock dict={t} />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── Showcase: Online randevu & hatırlatma ─────────────────────────── */}
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <PhoneMock dict={t} />
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-mint">
            <Smartphone className="size-3.5" /> {t.bookingShowcase.kicker}
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">
            {t.bookingShowcase.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {t.bookingShowcase.desc}
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {([
              [CalendarCheck2, t.bookingShowcase.feat1],
              [MessageSquare, t.bookingShowcase.feat2],
              [Star, t.bookingShowcase.feat3],
              [ShieldCheck, t.bookingShowcase.feat4],
            ] as const).map(([Icon, label]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────────── Karşılaştırma ─────────────────────────── */}
      <section className="bg-surface">
        <div className="container-x py-16 lg:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">
              {t.comparison.heading}
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">
              {t.comparison.sub}
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[28px] border border-line bg-gradient-to-b from-cream to-surface/40 p-7">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink-soft">
                  <span className="flex size-7 items-center justify-center rounded-full bg-rose-soft text-rose">
                    <X className="size-4" />
                  </span>
                  {t.comparison.oldTitle}
                </p>
                <ul className="mt-5 space-y-3.5">
                  {[
                    t.comparison.old1,
                    t.comparison.old2,
                    t.comparison.old3,
                    t.comparison.old4,
                    t.comparison.old5,
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-ink-soft">
                      <X className="mt-0.5 size-4 shrink-0 text-rose/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative h-full overflow-hidden rounded-[28px] border-2 border-accent bg-surface p-7 shadow-pop">
                <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/10 blur-2xl" aria-hidden />
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent text-white">
                    <Sparkles className="size-4" />
                  </span>
                  {t.comparison.newTitle}
                </p>
                <ul className="mt-5 space-y-3.5">
                  {[
                    t.comparison.new1,
                    t.comparison.new2,
                    t.comparison.new3,
                    t.comparison.new4,
                    t.comparison.new5,
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-medium text-ink">
                      <Check className="mt-0.5 size-4 shrink-0 text-mint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Referanslar ─────────────────────────── */}
      <section className="container-x py-16 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">
            {t.testimonialsSection.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 90}>
              <figure className="group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface p-7 shadow-card transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-pop">
                <span className="pointer-events-none absolute -left-3 -top-5 -z-10 select-none font-display text-[5rem] leading-none text-accent/[0.07]" aria-hidden>
                  “
                </span>
                <span className="flex text-gold">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="size-4 fill-gold" />
                  ))}
                </span>
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span
                    className={`flex size-10 items-center justify-center rounded-full font-display text-sm font-bold ${CHIP[t.tone]}`}
                  >
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span>
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-mute">{t.role}</p>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────────── 3 adımda yayında ─────────────────────────── */}
      <section className="bg-surface">
        <div className="container-x py-16 lg:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.6rem]">
              {t.stepsSection.heading}
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              {t.stepsSection.sub}
            </p>
          </Reveal>
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block" aria-hidden />
            {STEPS.map(([title, desc, badge], i) => (
              <Reveal key={title} delay={i * 110}>
                <div className="group relative flex h-full flex-col items-center rounded-[24px] border border-line bg-surface p-7 text-center transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-pop">
                  <span className="flex size-14 items-center justify-center rounded-full border-4 border-surface bg-gradient-to-br from-accent to-[#ff5fa2] font-display text-xl font-extrabold text-white shadow-pop transition-transform group-hover:scale-105">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-ink-soft">{desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-mint">
                    <Zap className="size-3" /> {badge}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Final CTA ─────────────────────────── */}
      <section className="container-x py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[36px] bg-ink-strong px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/35 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-[#ff5fa2]/22 blur-3xl" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] [background-size:26px_26px] bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)]"
            aria-hidden
          />
          <p className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            <Headset className="size-3.5" /> {t.finalCta.badge}
          </p>
          <h2 className="relative mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t.finalCta.heading}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/70">
            {t.finalCta.desc}
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/iletisim" variant="accent" size="xl">
              {t.finalCta.ctaStart} <ArrowRight className="size-5" />
            </Button>
            <Button href="/fiyatlandirma" variant="white" size="xl">
              {t.finalCta.ctaPackages}
            </Button>
          </div>
          <p className="relative mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-white/55">
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-mint" /> {t.finalCta.proofNoContract}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-mint" /> {t.finalCta.proofCancel}
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-mint" /> {t.finalCta.proofSupport}
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════ Gerçekçi takvim mockup'ı ════════════════════════ */

const DAY_START = 540; // 09:00
const DAY_END = 900; // 15:00
const MOCK_H = 300; // px
const PPM = MOCK_H / (DAY_END - DAY_START); // px / dakika

type Appt = { t: number; dur: number; time: string; label: string; tone: keyof typeof BLOCK };

const MOCK_STAFF: { name: string; role: string; tone: keyof typeof CHIP; appts: Appt[] }[] = [
  {
    name: "Ayşe K.",
    role: "Kuaför",
    tone: "accent",
    appts: [
      { t: 540, dur: 45, time: "09:00", label: "Saç Kesimi", tone: "accent" },
      { t: 630, dur: 90, time: "10:30", label: "Saç Boyama", tone: "accent" },
      { t: 780, dur: 30, time: "13:00", label: "Fön", tone: "honey" },
    ],
  },
  {
    name: "Mert D.",
    role: "Berber",
    tone: "sea",
    appts: [
      { t: 570, dur: 30, time: "09:30", label: "Sakal", tone: "sea" },
      { t: 660, dur: 60, time: "11:00", label: "Cilt Bakımı", tone: "sea" },
      { t: 810, dur: 45, time: "13:30", label: "Saç Kesimi", tone: "sea" },
    ],
  },
  {
    name: "Elif Ç.",
    role: "Estetisyen",
    tone: "mint",
    appts: [
      { t: 540, dur: 60, time: "09:00", label: "Manikür", tone: "mint" },
      { t: 660, dur: 45, time: "11:00", label: "Ağda", tone: "rose" },
      { t: 780, dur: 90, time: "13:00", label: "Protez Tırnak", tone: "mint" },
    ],
  },
];

const HOURS = [540, 600, 660, 720, 780, 840, 900];
const NOW_MIN = 740; // 12:20 — "şu an" çizgisi

function CalendarMock({ dict }: { dict: BusinessDict }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-pop">
      {/* Pencere başlığı */}
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-rose/40" />
        <span className="size-3 rounded-full bg-honey/50" />
        <span className="size-3 rounded-full bg-mint/50" />
        <span className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-ink-mute">
          <CalendarDays className="size-3.5" /> {dict.calendarMock.windowTitle}
        </span>
        <span className="ml-auto rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold text-ink-soft">
          {dict.calendarMock.today}
        </span>
      </div>

      {/* Gün başlığı */}
      <div className="flex items-center justify-between border-b border-line bg-cream/40 px-4 py-2.5">
        <p className="text-sm font-bold text-ink">{dict.calendarMock.dayTitle}</p>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-mint">
          <span className="size-1.5 rounded-full bg-mint" /> {dict.calendarMock.staffActive}
        </span>
      </div>

      {/* Izgara */}
      <div className="flex px-3 py-3">
        {/* Saat sütunu */}
        <div className="relative w-9 shrink-0" style={{ height: MOCK_H }}>
          {HOURS.map((h) => (
            <span
              key={h}
              className="absolute right-1.5 -translate-y-1/2 text-[10px] font-semibold text-ink-mute"
              style={{ top: (h - DAY_START) * PPM }}
            >
              {String(Math.floor(h / 60)).padStart(2, "0")}:00
            </span>
          ))}
        </div>

        {/* Personel sütunları */}
        <div className="relative flex flex-1 gap-2">
          {/* Saat çizgileri */}
          <div className="pointer-events-none absolute inset-x-0 top-8" style={{ height: MOCK_H }} aria-hidden>
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute inset-x-0 border-t border-dashed border-line"
                style={{ top: (h - DAY_START) * PPM }}
              />
            ))}
          </div>

          {/* "Şu an" çizgisi */}
          <div
            className="pointer-events-none absolute inset-x-0 z-20"
            style={{ top: 32 + (NOW_MIN - DAY_START) * PPM }}
            aria-hidden
          >
            <div className="relative h-px bg-rose">
              <span className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-rose ring-2 ring-surface" />
            </div>
          </div>

          {MOCK_STAFF.map((st) => (
            <div key={st.name} className="min-w-0 flex-1">
              {/* Sütun başlığı */}
              <div className="flex h-8 items-center gap-1.5">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${CHIP[st.tone]}`}
                >
                  {st.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="truncate text-[11px] font-bold text-ink">{st.name}</span>
              </div>
              {/* Randevu blokları */}
              <div className="relative" style={{ height: MOCK_H }}>
                {st.appts.map((a) => (
                  <div
                    key={a.time + a.label}
                    className={`absolute inset-x-0 overflow-hidden rounded-md border-l-2 px-1.5 py-1 ${BLOCK[a.tone]}`}
                    style={{ top: (a.t - DAY_START) * PPM, height: a.dur * PPM - 2 }}
                  >
                    <p className="truncate text-[9px] font-medium opacity-70">{a.time}</p>
                    <p className="truncate text-[10px] font-bold leading-tight">{a.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ Telefon mockup'ları (gerçekçi iPhone + Android) ════════════════════════ */

/** Durum çubuğu sinyal çubukları. */
function SignalBars() {
  return (
    <span className="flex items-end gap-[1.5px]" aria-hidden>
      {[3, 5, 7, 8.5].map((h, i) => (
        <span key={i} className="w-[2px] rounded-[1px] bg-ink" style={{ height: h }} />
      ))}
    </span>
  );
}

/** Durum çubuğu batarya simgesi. */
function Battery() {
  return (
    <span
      className="relative inline-flex h-[9px] w-[17px] items-center rounded-[2.5px] border border-ink/70 p-[1.5px]"
      aria-hidden
    >
      <span className="h-full w-[68%] rounded-[1px] bg-ink" />
      <span className="absolute -right-[2.5px] top-1/2 h-[3px] w-[1.5px] -translate-y-1/2 rounded-r-sm bg-ink/70" />
    </span>
  );
}

/** Gerçekçi iPhone çerçevesi — gerçek 9:19.5 ekran oranı (Dynamic Island + yan tuşlar). */
function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[162px] rounded-[2.9rem] bg-ink-strong p-[6px] shadow-pop ring-1 ring-black/10">
      {/* yan tuşlar */}
      <span className="absolute -left-[2px] top-[80px] h-7 w-[2px] rounded-l bg-ink-strong" aria-hidden />
      <span className="absolute -left-[2px] top-[118px] h-10 w-[2px] rounded-l bg-ink-strong" aria-hidden />
      <span className="absolute -right-[2px] top-[104px] h-14 w-[2px] rounded-r bg-ink-strong" aria-hidden />
      <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.5rem] bg-cream">
        {/* Dynamic Island */}
        <span className="absolute left-1/2 top-[9px] z-30 h-[18px] w-[54px] -translate-x-1/2 rounded-full bg-ink-strong" aria-hidden />
        {/* durum çubuğu */}
        <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-2.5">
          <span className="text-[9px] font-bold text-ink">9:41</span>
          <span className="flex items-center gap-1">
            <SignalBars />
            <Battery />
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {/* home çubuğu */}
        <div className="flex shrink-0 justify-center pb-2 pt-1">
          <span className="h-1 w-1/3 rounded-full bg-ink/25" />
        </div>
      </div>
    </div>
  );
}

/** Gerçekçi Android çerçevesi — gerçek 9:19.7 ekran oranı (punch-hole + gezinme çubuğu). */
function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[150px] rounded-[2.1rem] bg-ink p-[5px] shadow-pop ring-1 ring-black/10">
      <span className="absolute -right-[2px] top-[72px] h-10 w-[2px] rounded-r bg-ink" aria-hidden />
      <div className="relative flex aspect-[9/19.7] flex-col overflow-hidden rounded-[1.8rem] bg-cream">
        {/* punch-hole kamera */}
        <span className="absolute left-1/2 top-[7px] z-30 size-[7px] -translate-x-1/2 rounded-full bg-ink ring-2 ring-ink/30" aria-hidden />
        {/* durum çubuğu */}
        <div className="flex shrink-0 items-center justify-between px-3 pb-1 pt-2">
          <span className="text-[8px] font-bold text-ink">9:41</span>
          <span className="flex items-center gap-1">
            <SignalBars />
            <Battery />
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {/* gezinme çubuğu (geri / ana / son) */}
        <div className="flex shrink-0 items-center justify-center gap-6 py-2.5">
          <span className="size-[6px] rotate-45 border-b-[1.5px] border-l-[1.5px] border-ink/40" aria-hidden />
          <span className="size-2 rounded-full border-[1.5px] border-ink/40" aria-hidden />
          <span className="size-[7px] rounded-[1px] border-[1.5px] border-ink/40" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/** Ekran 1 — salon / randevu alma (iPhone içeriği). Yüksekliği baştan sona doldurur. */
function SalonScreen({ dict }: { dict: BusinessDict }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Kapak banner — degrade */}
      <div className="relative h-[78px] shrink-0 overflow-hidden bg-gradient-to-br from-accent via-[#8a5cff] to-[#ff5fa2]">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] [background-size:9px_9px]" />
        <span className="absolute left-2.5 top-2.5 flex size-[20px] items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
          <ChevronLeft className="size-3 text-white" />
        </span>
        <span className="absolute right-2.5 top-2.5 flex size-[20px] items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
          <Star className="size-2.5 fill-white text-white" />
        </span>
      </div>

      {/* Gövde */}
      <div className="flex min-h-0 flex-1 flex-col px-3 pt-2.5">
        <p className="font-display text-[13px] font-extrabold leading-tight text-ink">
          {dict.phoneMock.salonName}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[8.5px] text-ink-soft">
          <span className="flex items-center gap-0.5 font-semibold text-ink">
            <Star className="size-2.5 fill-gold text-gold" /> {dict.phoneMock.salonMeta}
          </span>
          <span className="flex items-center gap-0.5">
            <MapPin className="size-2.5 text-accent" /> Nişantaşı
          </span>
        </div>

        <div className="mt-2.5 space-y-1.5">
          {[
            [dict.phoneMock.svc1Name, dict.phoneMock.svc1Dur, dict.phoneMock.svc1Price],
            [dict.phoneMock.svc2Name, dict.phoneMock.svc2Dur, dict.phoneMock.svc2Price],
            [dict.phoneMock.svc3Name, dict.phoneMock.svc3Dur, dict.phoneMock.svc3Price],
          ].map(([name, dur, price]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-2.5 py-1.5 shadow-[0_1px_2px_rgb(19_27_46/0.04)]"
            >
              <div className="min-w-0">
                <p className="truncate text-[9.5px] font-semibold text-ink">{name}</p>
                <p className="flex items-center gap-0.5 text-[8px] text-ink-mute">
                  <Clock className="size-2.5" /> {dur}
                </p>
              </div>
              <span className="ml-1.5 shrink-0 text-[10px] font-extrabold text-ink">{price}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="pb-3 pt-2.5">
          <div className="rounded-full bg-accent py-2 text-center text-[10px] font-bold text-white shadow-[0_6px_14px_-4px_rgb(108_77_246/0.6)]">
            {dict.phoneMock.bookCta}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Ekran 2 — onay + WhatsApp hatırlatma (Android içeriği). Yüksekliği baştan sona doldurur. */
function ConfirmScreen({ dict }: { dict: BusinessDict }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-2.5 pt-1.5">
      <div className="flex items-center justify-between pb-2">
        <span className="font-display text-[12px] font-extrabold text-ink">
          salon<span className="text-accent">or</span>
        </span>
        <span className="size-5 rounded-full bg-accent-soft" />
      </div>

      <div className="rounded-2xl border border-mint/30 bg-mint-soft/60 p-2.5 text-center">
        <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-mint shadow-[0_4px_10px_-2px_rgb(14_159_110/0.6)]">
          <Check className="size-4 text-white" />
        </span>
        <p className="mt-1.5 text-[11px] font-bold text-ink">{dict.phoneMock.confirmTitle}</p>
        <p className="text-[8.5px] text-ink-soft">{dict.phoneMock.confirmDate}</p>
        <p className="mt-1 inline-block rounded-md bg-white px-2 py-0.5 font-display text-[10px] font-extrabold tracking-[0.15em] text-mint">
          {dict.phoneMock.confirmCode}
        </p>
      </div>

      {/* WhatsApp hatırlatma balonu */}
      <div className="mt-2.5 ml-3">
        <div className="rounded-2xl rounded-tl-sm bg-[#dcf8c6] p-2 shadow-[0_1px_2px_rgb(19_27_46/0.06)]">
          <p className="text-[8.5px] leading-snug text-[#0b3d1f]">{dict.phoneMock.waMessage}</p>
          <p className="mt-0.5 text-right text-[7px] font-medium text-[#0b3d1f]/50">
            {dict.phoneMock.waLabel}
          </p>
        </div>
      </div>

      <div className="flex-1" />

      {/* WhatsApp sohbet giriş çubuğu (salt görsel) */}
      <div className="flex items-center gap-1.5 pb-2.5" aria-hidden>
        <div className="flex h-6 flex-1 items-center gap-1 rounded-full border border-line bg-cream px-2">
          <CalendarPlus className="size-2.5 text-ink-mute" />
          <span className="h-1 w-10 rounded-full bg-line-strong" />
        </div>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint">
          <ArrowRight className="size-3 text-white" />
        </span>
      </div>
    </div>
  );
}

/** İki gerçekçi telefon (Android + iPhone) yan yana, hafif eğik kompozisyon. */
function PhoneMock({ dict }: { dict: BusinessDict }) {
  return (
    <div className="relative mx-auto flex w-full max-w-[350px] items-center justify-center py-4">
      <div className="absolute inset-0 -z-10 rounded-[60px] bg-gradient-to-br from-mint/15 via-transparent to-accent/15 blur-3xl" aria-hidden />
      {/* Android — arkada, sol, hafif sola eğik */}
      <div className="z-0 mt-10 -mr-7 -rotate-[5deg]">
        <AndroidFrame>
          <ConfirmScreen dict={dict} />
        </AndroidFrame>
      </div>
      {/* iPhone — önde, sağ, hafif sağa eğik */}
      <div className="z-10 -mt-2 rotate-[3deg]">
        <IPhoneFrame>
          <SalonScreen dict={dict} />
        </IPhoneFrame>
      </div>
    </div>
  );
}
