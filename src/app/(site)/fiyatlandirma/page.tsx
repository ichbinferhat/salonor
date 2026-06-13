import type { Metadata } from "next";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Fiyatlandırma — Salonor Business",
  description:
    "Salonor Business paketleri: Başlangıç, Profesyonel ve Kurumsal. İşletmene uygun planı seç, dakikalar içinde yayına al.",
};

type Plan = {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Başlangıç",
    price: 999,
    tagline: "Yeni başlayan ve butik salonlar için",
    features: [
      "Sınırsız online randevu",
      "Akıllı takvim ve günlük program",
      "3 personele kadar",
      "E-posta randevu hatırlatmaları",
      "Müşteri kayıtları ve notlar",
      "Temel gelir istatistikleri",
    ],
  },
  {
    name: "Profesyonel",
    price: 2499,
    tagline: "Büyüyen salonların favorisi",
    popular: true,
    features: [
      "Başlangıç’taki her şey",
      "Sınırsız personel ve hizmet",
      "SMS & WhatsApp hatırlatmaları",
      "Aramada öne çıkan listeleme",
      "Yorum toplama ve yönetimi",
      "Gelişmiş gelir & doluluk raporları",
      "No-show (gelmeme) koruması",
    ],
  },
  {
    name: "Kurumsal",
    price: 4999,
    tagline: "Çok şubeli ve zincir işletmeler",
    features: [
      "Profesyonel’deki her şey",
      "Çoklu şube yönetimi",
      "Özel raporlar ve veri dışa aktarma",
      "Öncelikli 7/24 destek",
      "Özel hesap yöneticisi",
      "API & entegrasyon erişimi",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[420px] bg-gradient-to-b from-accent-faint via-[#fdf1f8] to-cream"
        aria-hidden
      />
      <div className="container-x py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-accent-deep shadow-card">
            <Sparkles className="size-4" /> Salonor Business
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            İşletmene uygun planı seç
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Tüm paketlerde kurulum ücretsiz ve sözleşme yok. İstediğin zaman
            yükselt veya iptal et.{" "}
            <span className="font-semibold text-ink">
              Yıllık ödemede 2 ay hediye.
            </span>
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[28px] border bg-surface p-7 shadow-card transition-transform hover:-translate-y-1 ${
                plan.popular
                  ? "border-accent ring-2 ring-accent lg:-translate-y-3 lg:scale-[1.02]"
                  : "border-line"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-pop">
                  En popüler
                </span>
              )}
              <h2 className="font-display text-xl font-bold text-ink">{plan.name}</h2>
              <p className="mt-1 text-sm text-ink-soft">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1.5">
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink">
                  {plan.price.toLocaleString("tr-TR")}₺
                </span>
                <span className="mb-1 text-sm text-ink-mute">/ ay</span>
              </div>

              <Button
                href="/isletme/kayit"
                variant={plan.popular ? "accent" : "outline"}
                size="lg"
                className="mt-6 w-full"
              >
                Hemen başla <ArrowRight className="size-4" />
              </Button>

              <ul className="mt-7 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      <Check className="size-3.5 text-accent-deep" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ink-mute">
          Fiyatlara KDV dahil değildir. Salonor yalnızca Türkiye’de hizmet
          vermektedir. Soruların için{" "}
          <span className="font-semibold text-accent-deep">isletme@salonor.com</span>.
        </p>
      </div>
    </div>
  );
}
