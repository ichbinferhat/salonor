import Image from "next/image";
import { ArrowRight, Calendar, Star, Check, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import type { Dictionary } from "@/i18n/types";

const PROMO_SALON_IMG =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=70";

/** Bugünün tarihini "14 Haziran Cmt" biçiminde Türkçe döndürür (mockup için). */
function todayLabel() {
  const fmt = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "short",
  });
  // "Cmt, 19 Haziran" → "19 Haziran Cmt" düzenine getir.
  const parts = fmt.formatToParts(new Date());
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")} ${get("month")} ${get("weekday")}`;
}

/** "İşletmen için Salonor" — panel/takvim önizlemesi + telefon mockup. */
export async function BusinessPromo() {
  const dict = await getDictionary();
  const p = dict.home.bizPromo;
  return (
    <section className="container-x pb-20">
      <div className="relative isolate overflow-hidden rounded-[40px] border border-line bg-surface px-6 py-12 shadow-card sm:px-10 sm:py-14 lg:px-14">
        {/* Premium atmosfer — degrade ışıltılar */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute -right-24 -top-28 size-[32rem] rounded-full bg-gradient-to-br from-mint/20 via-accent/12 to-[#ff5fa2]/18 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 size-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Sol: metin */}
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-deep shadow-card backdrop-blur">
              <Sparkles className="size-3.5" /> {p.kicker}
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.5rem] sm:leading-[1.04]">
              {p.heading}
            </h2>
            <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-ink-soft">
              {p.desc}
            </p>

            <ul className="mt-6 space-y-3">
              {[p.feat1, p.feat2, p.feat3].map((t) => (
                <li key={t} className="flex items-center gap-3 font-medium text-ink">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint-soft ring-1 ring-mint/15">
                    <Check className="size-3.5 text-mint" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button href="/isletme" variant="accent" size="lg">
                {p.learnMore} <ArrowRight className="size-4" />
              </Button>
              <div className="flex items-center gap-2">
                <RatingStarsGold />
                <span className="text-sm">
                  <strong className="text-ink">{p.perfect}</strong>
                  <span className="block text-xs text-ink-mute">{p.satisfaction}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sağ: panel — Fresha tarzı degrade sahne üzerinde */}
          <div className="relative">
            {/* Degrade sahne (renk geçişi) — panelin arkasından taşar */}
            <div
              className="absolute -inset-5 -z-10 rounded-[34px] bg-gradient-to-br from-[#dcfce9] via-accent-soft to-[#ffe1ef] sm:-inset-7"
              aria-hidden
            />
            <div className="absolute -right-8 -top-6 -z-10 size-44 rounded-full bg-mint/30 blur-2xl" aria-hidden />
            <div className="absolute -bottom-8 -left-6 -z-10 size-44 rounded-full bg-accent/25 blur-2xl" aria-hidden />
            <DashboardMock dateLabel={todayLabel()} dict={dict} />
            <FloatingSalonCard dict={dict} />
          </div>
        </div>
      </div>
    </section>
  );
}

function RatingStarsGold() {
  return (
    <span className="flex text-gold" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="size-4 fill-gold" />
      ))}
    </span>
  );
}

/* ── Takvim/panel önizlemesi ── */
const STAFF = [
  { name: "Elif", color: "bg-accent" },
  { name: "Mert", color: "bg-mint" },
  { name: "Zeynep", color: "bg-honey" },
];

type BlockTitleKey =
  | "blockHaircut"
  | "blockBlowDry"
  | "blockBeard"
  | "blockSkincare"
  | "blockManicure"
  | "blockColor";

type Block = {
  col: number;
  top: number;
  h: number;
  tone: "accent" | "mint" | "honey" | "sea" | "rose";
  titleKey: BlockTitleKey;
  time: string;
};

const BLOCKS: Block[] = [
  { col: 0, top: 2, h: 60, tone: "accent", titleKey: "blockHaircut", time: "09:00" },
  { col: 0, top: 122, h: 46, tone: "mint", titleKey: "blockBlowDry", time: "11:00" },
  { col: 1, top: 36, h: 54, tone: "honey", titleKey: "blockBeard", time: "09:40" },
  { col: 1, top: 152, h: 50, tone: "sea", titleKey: "blockSkincare", time: "12:00" },
  { col: 2, top: 12, h: 48, tone: "rose", titleKey: "blockManicure", time: "09:10" },
  { col: 2, top: 92, h: 72, tone: "accent", titleKey: "blockColor", time: "10:30" },
];

const TONES: Record<Block["tone"], string> = {
  accent: "bg-accent-soft text-accent-deep border-accent",
  mint: "bg-mint-soft text-mint border-mint",
  honey: "bg-honey-soft text-honey border-honey",
  sea: "bg-sea-soft text-sea border-sea",
  rose: "bg-rose-soft text-rose border-rose",
};

function DashboardMock({ dateLabel, dict }: { dateLabel: string; dict: Dictionary }) {
  const p = dict.home.bizPromo;
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-pop">
      {/* üst bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1 sm:flex" aria-hidden>
            <span className="size-2 rounded-full bg-rose/40" />
            <span className="size-2 rounded-full bg-honey/50" />
            <span className="size-2 rounded-full bg-mint/50" />
          </span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-white">
            <Calendar className="size-4" />
          </span>
          <span className="font-display text-sm font-bold text-ink">{p.calendar}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-ink px-3 py-1 font-semibold text-white">{p.today}</span>
          <span className="hidden font-medium text-ink-soft sm:inline">{dateLabel}</span>
        </div>
      </div>

      {/* personel başlıkları */}
      <div className="grid grid-cols-[2.6rem_repeat(3,1fr)] border-b border-line bg-cream/60">
        <div />
        {STAFF.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 px-2 py-2.5">
            <span
              className={`flex size-5 items-center justify-center rounded-full ${s.color} text-[9px] font-bold text-white`}
            >
              {s.name[0]}
            </span>
            <span className="truncate text-[11px] font-semibold text-ink">{s.name}</span>
          </div>
        ))}
      </div>

      {/* zaman ızgarası */}
      <div className="grid grid-cols-[2.6rem_repeat(3,1fr)]">
        <div>
          {["09:00", "10:00", "11:00", "12:00"].map((t) => (
            <div
              key={t}
              className="h-14 border-b border-line px-1.5 pt-1 text-right text-[9px] font-medium text-ink-mute"
            >
              {t}
            </div>
          ))}
        </div>
        {STAFF.map((_, col) => (
          <div key={col} className="relative h-56 border-l border-line">
            {[0, 1, 2, 3].map((r) => (
              <div key={r} className="h-14 border-b border-line" />
            ))}
            {BLOCKS.filter((b) => b.col === col).map((b, i) => (
              <div
                key={i}
                className={`absolute inset-x-1 rounded-lg border-l-2 px-1.5 py-1 ${TONES[b.tone]}`}
                style={{ top: b.top, height: b.h }}
              >
                <p className="text-[9px] font-medium opacity-70">{b.time}</p>
                <p className="truncate text-[10px] font-bold leading-tight">{p[b.titleKey]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Öne çıkan salon kartı (takvimin üzerine binen) ── */
function FloatingSalonCard({ dict }: { dict: Dictionary }) {
  const p = dict.home.bizPromo;
  return (
    <div className="absolute -bottom-7 -left-3 hidden w-60 overflow-hidden rounded-[22px] border border-line bg-surface shadow-pop sm:block lg:-left-10 lg:w-64">
      <div className="relative h-28 w-full">
        <Image
          src={PROMO_SALON_IMG}
          alt="Salon"
          fill
          sizes="256px"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink shadow-card">
          {p.featured}
        </span>
      </div>
      <div className="p-4">
        <p className="font-display text-[15px] font-bold text-ink">Glow Studio</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <RatingStars value={5} tone="gold" size="sm" />
          <span className="font-bold text-ink">4.9</span>
          <span className="text-ink-mute">{interpolate(p.reviewsCount, { n: 320 })}</span>
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-mint-soft px-3 py-2.5">
          <CheckCircle2 className="size-5 shrink-0 text-mint" />
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight text-ink">{p.apptConfirmed}</p>
            <p className="text-[11px] leading-tight text-ink-soft">
              {p.apptDetail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
