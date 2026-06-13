import { ArrowRight, Calendar, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneMock } from "./phone-mock";

/** "İşletmen için Salonor" — panel/takvim önizlemesi + telefon mockup. */
export function BusinessPromo() {
  return (
    <section className="container-x pb-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Sol: metin */}
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent-deep">
            Salonor Business
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            İşletmen için Salonor
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft">
            Salon ve spa merkezleri için tek panelde randevu, takvim, personel ve
            müşteri yönetimi. İşini büyütmenin profesyonel yolu.
          </p>

          <ul className="mt-6 space-y-2.5">
            {[
              "7/24 online randevu — telefon başında beklemek yok",
              "Takvim, personel ve hizmetler tek ekranda",
              "Yorumlarla güven kazan, yeni müşteriye ulaş",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-ink">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <Check className="size-3.5 text-accent-deep" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/isletme" variant="accent" size="lg">
              Daha fazlasını öğren <ArrowRight className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <RatingStarsGold />
              <span className="text-sm">
                <strong className="text-ink">Mükemmel 5/5</strong>
                <span className="block text-xs text-ink-mute">işletme memnuniyeti</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sağ: dashboard + telefon */}
        <div className="relative">
          <DashboardMock />
          <PhoneMock className="absolute -bottom-8 -left-4 hidden w-40 sm:block lg:-left-8">
            <BookingScreen />
          </PhoneMock>
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

type Block = {
  col: number;
  top: number;
  h: number;
  tone: "accent" | "mint" | "honey" | "sea" | "rose";
  title: string;
  time: string;
};

const BLOCKS: Block[] = [
  { col: 0, top: 2, h: 60, tone: "accent", title: "Saç Kesimi", time: "09:00" },
  { col: 0, top: 122, h: 46, tone: "mint", title: "Fön", time: "11:00" },
  { col: 1, top: 36, h: 54, tone: "honey", title: "Sakal Tıraşı", time: "09:40" },
  { col: 1, top: 152, h: 50, tone: "sea", title: "Cilt Bakımı", time: "12:00" },
  { col: 2, top: 12, h: 48, tone: "rose", title: "Manikür", time: "09:10" },
  { col: 2, top: 92, h: 72, tone: "accent", title: "Saç Boyama", time: "10:30" },
];

const TONES: Record<Block["tone"], string> = {
  accent: "bg-accent-soft text-accent-deep border-accent",
  mint: "bg-mint-soft text-mint border-mint",
  honey: "bg-honey-soft text-honey border-honey",
  sea: "bg-sea-soft text-sea border-sea",
  rose: "bg-rose-soft text-rose border-rose",
};

function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-pop">
      {/* üst bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-white">
            <Calendar className="size-4" />
          </span>
          <span className="font-display text-sm font-bold text-ink">Takvim</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-ink px-3 py-1 font-semibold text-white">Bugün</span>
          <span className="hidden font-medium text-ink-soft sm:inline">Cuma, 13 Haziran</span>
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
                <p className="truncate text-[10px] font-bold leading-tight">{b.title}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingScreen() {
  return (
    <div className="flex h-full flex-col bg-surface p-3">
      <p className="font-display text-[13px] font-bold text-ink">Yeni randevu</p>
      <p className="text-[10px] text-ink-mute">Bugün · 14:30</p>
      <div className="mt-2 space-y-1.5">
        {[
          ["Saç Kesimi", "45 dk"],
          ["Fön", "30 dk"],
        ].map(([s, d]) => (
          <div
            key={s}
            className="flex items-center justify-between rounded-lg bg-cream px-2 py-1.5"
          >
            <span className="text-[10px] font-semibold text-ink">{s}</span>
            <span className="text-[10px] text-ink-mute">{d}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto flex h-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
        Onayla
      </div>
    </div>
  );
}
