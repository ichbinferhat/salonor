import Link from "next/link";
import {
  MessageCircle,
  MessageSquare,
  Check,
  Lock,
  ArrowRight,
  Settings,
  Bell,
  UserX,
  Sparkles,
  Wallet,
} from "lucide-react";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { smsConfigured } from "@/lib/sms";
import { formatPhoneTr } from "@/lib/phone";
import { PanelPageHeader } from "@/components/panel/page-header";

export const metadata = { title: "Mesajlaşma — Salonor" };

export default async function MessagingPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.messaging;
  const smsOn = smsConfigured();

  const waDisplayNumber = business.whatsappPhone
    ? formatPhoneTr(business.whatsappPhone)
    : business.phone;
  const hasDedicatedWa = !!business.whatsappPhone;

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />

      {/* Strateji bandı */}
      <div className="mb-7 overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-ink-strong to-ink p-6 text-white shadow-pop sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80">
          <Sparkles className="size-3.5" /> {t.introBadge}
        </span>
        <h2 className="mt-3 max-w-xl font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t.introTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
          {t.introDesc}
        </p>
      </div>

      {/* Kanal kartları */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* WhatsApp — aktif */}
        <section className="flex flex-col rounded-[24px] border border-[#25D366]/30 bg-surface p-6 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#25D366]/12 text-[#1da851]">
                <MessageCircle className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">{t.waName}</h3>
                <p className="text-xs font-semibold text-ink-mute">{t.waTagline}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-mint">
              <span className="size-1.5 rounded-full bg-mint" /> {t.statusActive}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t.waDesc}</p>

          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {[t.waPoint1, t.waPoint2, t.waPoint3].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-[#1da851]" /> {p}
              </li>
            ))}
          </ul>

          {/* Salon WhatsApp numarası */}
          <div className="mt-5 rounded-2xl border border-line bg-cream/50 p-4">
            <p className="text-xs font-semibold text-ink-mute">{t.waNumberLabel}</p>
            <p className="mt-0.5 font-display text-lg font-bold text-ink">{waDisplayNumber}</p>
            {!hasDedicatedWa && <p className="mt-0.5 text-xs text-ink-mute">{t.waNumberMissing}</p>}
            <Link
              href="/panel/ayarlar"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent-deep hover:underline"
            >
              <Settings className="size-3.5" /> {t.waNumberSet}
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink-mute">{t.waPublicNote}</p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/panel/bildirimler"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <Bell className="size-4" /> {t.waCtaReminders}
            </Link>
            <Link
              href="/panel/kayip-musteri"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-cream"
            >
              <UserX className="size-4" /> {t.waCtaLost}
            </Link>
          </div>
        </section>

        {/* SMS — kilitli / aktif */}
        <section className="flex flex-col rounded-[24px] border border-line bg-surface p-6 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
                <MessageSquare className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">{t.smsName}</h3>
                <p className="text-xs font-semibold text-ink-mute">{t.smsTagline}</p>
              </div>
            </div>
            {smsOn ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-mint">
                <span className="size-1.5 rounded-full bg-mint" /> {t.statusActive}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                <Lock className="size-3" /> {t.statusLocked}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t.smsDesc}</p>

          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {[t.smsPoint1, t.smsPoint2, t.smsPoint3].map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-accent-deep" /> {p}
              </li>
            ))}
          </ul>

          {/* Kontör bakiyesi */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-cream/50 p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-ink-mute">
              <Wallet className="size-4" /> {t.smsCreditLabel}
            </span>
            <span className="font-display text-lg font-bold text-accent-deep">
              {business.smsCredits.toLocaleString("tr-TR")}
            </span>
          </div>

          {/* Bilgi notu */}
          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-300/50 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-800">
            <Lock className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <span>{smsOn ? t.smsTestNote : t.smsLockedNote}</span>
          </div>

          <Link
            href="/panel/sms"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-cream"
          >
            {t.smsCta} <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>

      {/* Karşılaştırma */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-ink">{t.compareTitle}</h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream/50 text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-bold">{t.compareCol}</th>
                <th className="px-4 py-3 font-bold text-[#1da851]">{t.waName}</th>
                <th className="px-4 py-3 font-bold text-accent-deep">{t.smsName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                [t.rowCost, t.rowCostWa, t.rowCostSms],
                [t.rowSetup, t.rowSetupWa, t.rowSetupSms],
                [t.rowAuto, t.rowAutoWa, t.rowAutoSms],
                [t.rowReach, t.rowReachWa, t.rowReachSms],
              ].map(([k, wa, sms]) => (
                <tr key={k} className="hover:bg-cream/40">
                  <td className="px-4 py-3 font-semibold text-ink">{k}</td>
                  <td className="px-4 py-3 text-ink-soft">{wa}</td>
                  <td className="px-4 py-3 text-ink-soft">{sms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Yol haritası */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-ink">{t.roadmapTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/5 p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-display text-base font-bold text-ink">
                <MessageCircle className="size-5 text-[#1da851]" /> {t.roadmapNowTitle}
              </span>
              <span className="rounded-full bg-[#25D366] px-2.5 py-0.5 text-[11px] font-bold text-white">
                {t.recommendedBadge}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.roadmapNowDesc}</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className="flex items-center gap-2 font-display text-base font-bold text-ink">
              <MessageSquare className="size-5 text-accent-deep" /> {t.roadmapNextTitle}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.roadmapNextDesc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
