import type { Metadata } from "next";
import {
  CalendarCheck2,
  Clock,
  Users,
  Bell,
  Star,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  Wallet,
  Smartphone,
} from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "İşletmeniz için Salonor — Salon yönetim yazılımı",
  description:
    "Online randevu, akıllı takvim, personel ve müşteri yönetimi tek panelde. Salonunu büyütmenin en kolay yolu.",
};

const FEATURES = [
  {
    icon: CalendarCheck2,
    title: "7/24 online randevu",
    desc: "Müşterilerin gece gündüz, telefon beklemeden randevu alsın. Sen uyurken takvimin dolsun.",
    tone: "bg-accent-soft text-accent-deep",
  },
  {
    icon: Clock,
    title: "Akıllı takvim",
    desc: "Personel bazlı renkli takvim, çakışma koruması ve tek dokunuşla manuel randevu.",
    tone: "bg-mint-soft text-mint",
  },
  {
    icon: Users,
    title: "Personel & hizmet yönetimi",
    desc: "Ekibini, hizmetlerini ve fiyatlarını saniyeler içinde düzenle. Herkesin programı net.",
    tone: "bg-sea-soft text-sea",
  },
  {
    icon: Bell,
    title: "SMS & WhatsApp hatırlatma",
    desc: "Otomatik hatırlatmalarla gelmeme oranını düşür, koltukların boş kalmasın.",
    tone: "bg-honey-soft text-honey",
  },
  {
    icon: Star,
    title: "Yorumlar & itibar",
    desc: "Gerçek müşteri yorumlarıyla güven oluştur, aramada öne çık, yeni müşteri kazan.",
    tone: "bg-rose-soft text-rose",
  },
  {
    icon: BarChart3,
    title: "Gelir & doluluk raporları",
    desc: "Günlük ciro, doluluk ve en çok tercih edilen hizmetleri tek bakışta gör.",
    tone: "bg-accent-soft text-accent-deep",
  },
];

const STEPS: [string, string][] = [
  ["Ücretsiz kaydol", "5 dakikalık kurulumla işletmeni oluştur."],
  ["Hizmet & saatlerini ekle", "Ekibini, hizmetlerini ve çalışma saatlerini gir."],
  ["Yayına al, randevu topla", "Salon sayfan yayında — müşteriler hemen randevu alsın."],
];

export default async function BusinessLandingPage() {
  const [bizCount, serviceCount, reviewCount] = await Promise.all([
    db.business.count(),
    db.service.count(),
    db.review.count(),
  ]);

  return (
    <div className="overflow-x-clip">
      {/* ───── Hero ───── */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-accent-faint via-[#fdf1f8] to-cream" />
          <div className="absolute -left-24 top-10 size-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute right-0 top-40 size-72 rounded-full bg-[#ff5fa2]/12 blur-3xl" />
        </div>

        <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="anim-rise mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-accent-deep shadow-card">
              <Sparkles className="size-4" /> Salonor Business
            </p>
            <h1 className="anim-rise d-1 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Salonunu büyütmenin{" "}
              <span className="bg-gradient-to-r from-accent to-[#ff5fa2] bg-clip-text text-transparent">
                akıllı yolu
              </span>
            </h1>
            <p className="anim-rise d-2 mt-5 max-w-xl text-lg text-ink-soft">
              Online randevu, akıllı takvim, personel ve müşteri yönetimi — hepsi
              tek panelde. Telefon başında beklemeyi bırak, işine odaklan.
            </p>
            <div className="anim-rise d-3 mt-8 flex flex-wrap gap-3">
              <Button href="/isletme/kayit" variant="accent" size="lg">
                Ücretsiz başla <ArrowRight className="size-4" />
              </Button>
              <Button href="/fiyatlandirma" variant="outline" size="lg">
                Fiyatları gör
              </Button>
            </div>
            <p className="anim-rise d-4 mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> Kurulum ücretsiz
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> Sözleşme yok
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-mint" /> 5 dakikada yayında
              </span>
            </p>
          </div>

          <div className="anim-rise d-3 relative">
            <AppWindow />
            <div className="absolute -bottom-5 -left-3 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-pop sm:-left-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-mint-soft">
                <Wallet className="size-5 text-mint" />
              </span>
              <div className="text-sm">
                <p className="font-bold text-ink">Bugünkü ciro</p>
                <p className="text-ink-soft">₺4.250 · 12 randevu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stat şeridi ───── */}
      <section className="border-y border-line bg-surface">
        <div className="container-x grid gap-6 py-8 text-center sm:grid-cols-3">
          {[
            [`${bizCount}`, "seçkin işletme"],
            [`${serviceCount}+`, "rezerve edilebilir hizmet"],
            [`${reviewCount}+`, "doğrulanmış yorum"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{num}</p>
              <p className="mt-1 text-ink-soft">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Özellikler ───── */}
      <section className="container-x py-16 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            İşini yürütmek için her şey
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Dağınık defterleri ve kaçan aramaları unut. Salonor hepsini tek bir
            akıllı panelde toplar.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <div className="group h-full rounded-[24px] border border-line bg-surface p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-pop">
                <span className={`inline-flex size-12 items-center justify-center rounded-2xl ${f.tone}`}>
                  <f.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Detay: Takvim ───── */}
      <section className="bg-surface">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <AppWindow compact />
          </Reveal>
          <Reveal delay={120}>
            <p className="text-sm font-bold uppercase tracking-widest text-accent-deep">
              Akıllı takvim
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Tüm günün tek ekranda
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Personel bazlı renkli takvimle kim, ne zaman, hangi hizmeti veriyor
              anında gör. Çakışma koruması sayesinde çift rezervasyon olmaz.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Sürükle-bırak kolaylığı",
                "Walk-in (kapıdan gelen) müşteri ekleme",
                "Randevu durumu: onaylı, tamamlandı, gelinmedi",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-ink">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                    <Check className="size-3.5 text-accent-deep" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ───── Detay: Büyüme / itibar ───── */}
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <p className="text-sm font-bold uppercase tracking-widest text-accent-deep">Büyüme</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Yeni müşteriler seni bulsun
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Salonor pazaryerinde aramalarda öne çık. Gerçek yorumlar ve net
            fiyatlarla güven ver; bir kez gelen tekrar gelsin.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {([
              [Smartphone, "Mobil uyumlu salon sayfası"],
              [Star, "Doğrulanmış yorumlarla itibar"],
              [Bell, "Otomatik hatırlatmalar"],
              [ShieldCheck, "Güvenli ve KVKK uyumlu"],
            ] as const).map(([Icon, t]) => (
              <div key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-ink">{t}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 lg:order-2">
          <div className="rounded-[28px] border border-line bg-gradient-to-br from-accent-faint to-[#fdf1f8] p-8 shadow-card">
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-pop">
              <div className="flex items-center gap-2">
                <span className="flex text-honey">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-4 fill-honey" />
                  ))}
                </span>
                <span className="text-sm font-bold text-ink">4.9</span>
              </div>
              <p className="mt-3 leading-relaxed text-ink">
                “Salonor’a geçtikten sonra telefonla randevu kovalamayı bıraktık.
                Takvimimiz kendi kendine doluyor, müşteriler de çok memnun.”
              </p>
              <p className="mt-4 text-sm font-bold text-ink">Deniz K.</p>
              <p className="text-xs text-ink-mute">Salon sahibi · İstanbul</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───── Nasıl başlarım ───── */}
      <section className="bg-surface">
        <div className="container-x py-16 lg:py-24">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              3 adımda yayındasın
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="relative h-full rounded-[24px] border border-line bg-cream p-7">
                  <span className="font-display text-5xl font-extrabold text-accent/25">{i + 1}</span>
                  <h3 className="mt-2 font-display text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-ink-soft">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="container-x py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[32px] bg-ink-strong px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-[#ff5fa2]/20 blur-3xl" aria-hidden />
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Salonunu bugün Salonor’a taşı
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/70">
            Kurulum ücretsiz, başlaması 5 dakika. İlk randevun bu hafta gelebilir.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/isletme/kayit" variant="accent" size="xl">
              Ücretsiz başla <ArrowRight className="size-5" />
            </Button>
            <Button href="/fiyatlandirma" variant="white" size="xl">
              Paketleri incele
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Hero/detay görseli: panel penceresi ─── */
function AppWindow({ compact = false }: { compact?: boolean }) {
  const blocks: [string, string, string][] = [
    ["09:00", "Saç Kesimi", "bg-accent-soft text-accent-deep border-accent"],
    ["10:30", "Sakal Tıraşı", "bg-honey-soft text-honey border-honey"],
    ["11:00", "Manikür", "bg-rose-soft text-rose border-rose"],
    ["12:30", "Cilt Bakımı", "bg-sea-soft text-sea border-sea"],
    ["14:00", "Saç Boyama", "bg-mint-soft text-mint border-mint"],
    ["15:30", "Fön", "bg-accent-soft text-accent-deep border-accent"],
  ];
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-surface shadow-pop">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-3 rounded-full bg-rose/40" />
        <span className="size-3 rounded-full bg-honey/50" />
        <span className="size-3 rounded-full bg-mint/50" />
        <span className="ml-2 text-xs font-semibold text-ink-mute">Salonor Business · Takvim</span>
      </div>
      <div className={`grid grid-cols-2 gap-2.5 p-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {blocks.map(([time, name, tone]) => (
          <div key={time + name} className={`rounded-xl border-l-2 p-2.5 ${tone}`}>
            <p className="text-[11px] font-medium opacity-70">{time}</p>
            <p className="truncate text-sm font-bold">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
