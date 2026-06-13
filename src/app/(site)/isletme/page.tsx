import type { Metadata } from "next";
import {
  CalendarRange,
  Globe2,
  Users2,
  Star,
  BellRing,
  BarChart3,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "İşletmeniz için Salonor — Ücretsiz randevu ve salon yönetimi",
  description:
    "Online randevu, akıllı takvim, personel ve hizmet yönetimi tek panelde. Salonunuzu Salonor'a ücretsiz ekleyin.",
};

const FEATURES = [
  {
    icon: Globe2,
    title: "7/24 online randevu",
    desc: "Siz uyurken bile müşterileriniz randevu alır. Telefon trafiğine ve defter karmaşasına son.",
  },
  {
    icon: CalendarRange,
    title: "Akıllı takvim",
    desc: "Personel bazlı günlük ve haftalık görünüm. Çakışmaları sistem engeller, siz işinize bakın.",
  },
  {
    icon: Users2,
    title: "Personel yönetimi",
    desc: "Ekibinizi ekleyin, hizmet atayın. Herkes kendi programını net görsün.",
  },
  {
    icon: Star,
    title: "Doğrulanmış yorumlar",
    desc: "Sadece gerçek randevular yorum bırakabilir. Güven kazanın, yeni müşteri çekin.",
  },
  {
    icon: BellRing,
    title: "Anlık bildirimler",
    desc: "Yeni randevu, iptal ve değişiklikler panelinize anında düşer.",
  },
  {
    icon: BarChart3,
    title: "Gelir takibi",
    desc: "Günlük doluluk ve ciro özetiyle işletmenizin nabzını tutun.",
  },
];

const FAQS = [
  [
    "Salonor'a katılmak gerçekten ücretsiz mi?",
    "Evet. İşletmenizi eklemek, takvimi kullanmak ve randevu almak tamamen ücretsizdir. İleride isteğe bağlı premium özellikler sunulabilir.",
  ],
  [
    "Kurulum ne kadar sürer?",
    "Ortalama 5 dakika. İşletme bilgilerinizi girin, çalışma saatlerinizi ve ilk hizmetlerinizi ekleyin — profiliniz anında yayında.",
  ],
  [
    "Walk-in (kapıdan gelen) müşterileri işleyebilir miyim?",
    "Elbette. Panelden tek dokunuşla manuel randevu ekleyebilir, takviminizi tek merkezden yönetebilirsiniz.",
  ],
  [
    "Personelim takvimi görebilir mi?",
    "Takvim personel kolonlarıyla çalışır; her personelin günü ayrı sütunda görünür. Personel hesapları yakında geliyor.",
  ],
] as const;

export default function BusinessLandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-strong text-white">
        <div
          className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-accent/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 right-0 size-96 rounded-full bg-accent/20 blur-3xl"
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="anim-rise mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80">
              Salonor Business
            </p>
            <h1 className="anim-rise d-1 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Koltuklarınız dolsun,
              <br />
              <span className="text-accent">telefonunuz sussun.</span>
            </h1>
            <p className="anim-rise d-2 mt-5 max-w-lg text-lg text-white/65">
              Türkiye'nin dört bir yanındaki salonlar randevularını Salonor ile
              yönetiyor. Sıfır maliyet, beş dakikalık kurulum.
            </p>
            <div className="anim-rise d-3 mt-8 flex flex-wrap gap-3">
              <Button href="/isletme/kayit" variant="accent" size="xl">
                İşletmenizi ücretsiz ekleyin <ArrowRight className="size-5" />
              </Button>
              <Button href="/giris" variant="white" size="xl">
                İşletme girişi
              </Button>
            </div>
            <ul className="anim-rise d-4 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              {["Kredi kartı gerekmez", "Komisyon yok", "5 dk kurulum"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-mint" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Stilize takvim mock'u */}
          <div className="anim-rise d-3 relative hidden lg:block" aria-hidden>
            <div className="rounded-[24px] border border-white/10 bg-white p-5 text-ink shadow-pop">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display font-bold">Bugün · Cumartesi</p>
                <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-mint">
                  %86 doluluk
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Elif", [["10:15", "Kadın Kesim", "bg-accent-soft text-accent-deep"], ["12:30", "Balyaj", "bg-sea-soft text-sea"]]],
                  ["Deniz", [["10:30", "Komple Boya", "bg-honey-soft text-honey"], ["14:30", "Kesim + Fön", "bg-accent-soft text-accent-deep"]]],
                  ["Selin", [["11:00", "Fön", "bg-mint-soft text-mint"], ["16:30", "Bakım", "bg-sea-soft text-sea"]]],
                ].map(([name, blocks]) => (
                  <div key={name as string} className="rounded-2xl bg-cream p-3">
                    <p className="mb-2 text-center text-xs font-bold text-ink-soft">
                      {name as string}
                    </p>
                    <div className="space-y-2">
                      {(blocks as [string, string, string][]).map(([t, s, cls]) => (
                        <div key={t} className={`rounded-xl px-3 py-2.5 text-xs font-semibold ${cls}`}>
                          <p>{t}</p>
                          <p className="mt-0.5 truncate font-bold">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-white">
                <span className="text-sm font-semibold">Yeni randevu</span>
                <span className="text-xs text-white/60">az önce · Kadın Kesim, 17:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="container-x py-20">
        <h2 className="mb-3 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          İhtiyacınız olan her şey, tek panelde
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-ink-soft">
          Salonor Business; randevu defterinizi, telefonunuzu ve ajandanızı tek
          bir akıllı panele dönüştürür.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-[24px] border border-line bg-surface p-7 shadow-card transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-soft">
                <f.icon className="size-6 text-accent-deep" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SSS */}
      <section className="container-x pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-display text-3xl font-bold tracking-tight text-ink">
            Sık sorulan sorular
          </h2>
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-line bg-surface px-6 py-4 shadow-card open:pb-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-xl text-ink-mute transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Alt CTA */}
      <section className="container-x pb-24">
        <div className="relative overflow-hidden rounded-[32px] bg-accent px-6 py-16 text-center text-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.25),transparent_50%)]"
            aria-hidden
          />
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bugün katılın, yarın dolu başlayın.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/80">
            5 dakikada profilinizi oluşturun; müşterileriniz sizi Salonor'da bulsun.
          </p>
          <div className="relative mt-8">
            <Button href="/isletme/kayit" variant="white" size="xl">
              Hemen ücretsiz başlayın
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
