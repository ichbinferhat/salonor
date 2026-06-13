import Image from "next/image";
import { QrCode, Star, MapPin, Check, Smartphone } from "lucide-react";
import { PhoneMock } from "./phone-mock";
import { StoreBadges } from "./store-badges";

/** "Salonor uygulamasını indirin" bölümü — iki telefon mockup'ı + QR + rozetler. */
export function AppDownload({ image }: { image?: string }) {
  return (
    <section className="container-x pb-20">
      <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface px-6 py-12 shadow-card sm:px-10 lg:px-14 lg:py-0">
        <div
          className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-1/3 size-80 rounded-full bg-[#ff5fa2]/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
          {/* Sol: metin + QR + rozetler */}
          <div className="lg:py-16">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-deep">
              <span className="inline-flex items-center gap-1">
                <Smartphone className="size-4" /> iOS
              </span>
              <span className="text-ink-mute">·</span>
              Android
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Salonor’u cebine al
            </h2>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
              Randevularını yönet, favori salonlarını takip et ve yeni yerleri
              keşfet — hepsi tek dokunuşla, her an yanında.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Tek dokunuşla yeniden randevu",
                "Randevu hatırlatmaları ve bildirimler",
                "Sana özel salon önerileri",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-ink">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mint-soft">
                    <Check className="size-3.5 text-mint" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-3">
                <span className="flex size-20 items-center justify-center rounded-xl bg-surface">
                  <QrCode className="size-16 text-ink" />
                </span>
                <span className="max-w-[7rem] text-sm font-semibold leading-snug text-ink-soft">
                  Kamerayla tara, hemen indir
                </span>
              </div>
              <StoreBadges />
            </div>
          </div>

          {/* Sağ: telefonlar */}
          <div className="relative mx-auto h-[420px] w-full max-w-sm lg:h-[540px]">
            <PhoneMock className="absolute left-1/2 top-6 w-48 -translate-x-[78%] -rotate-6 sm:w-52">
              <MapScreen />
            </PhoneMock>
            <PhoneMock className="absolute left-1/2 top-0 w-52 -translate-x-[12%] rotate-3 sm:w-60">
              <ProfileScreen image={image} />
            </PhoneMock>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Telefon ekranı: salon profili ── */
function ProfileScreen({ image }: { image?: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative h-2/5 w-full bg-cream">
        {image && (
          <Image src={image} alt="" fill sizes="240px" className="object-cover" />
        )}
        <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm">
          <Star className="size-3.5 fill-gold text-gold" />
        </span>
      </div>
      <div className="flex-1 p-3">
        <div className="flex items-center gap-1 text-[11px] font-bold text-ink">
          <Star className="size-3 fill-gold text-gold" /> 4.9
          <span className="font-medium text-ink-mute">(312)</span>
        </div>
        <p className="mt-1 font-display text-sm font-bold leading-tight text-ink">
          Nova Saç Atölyesi
        </p>
        <p className="text-[11px] text-ink-mute">Kadıköy, İstanbul</p>

        <div className="mt-3 space-y-2">
          {[
            ["Saç Kesimi", "₺450"],
            ["Fön & Şekil", "₺300"],
            ["Saç Boyama", "₺900"],
          ].map(([s, p]) => (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg bg-cream px-2.5 py-1.5"
            >
              <span className="text-[11px] font-medium text-ink">{s}</span>
              <span className="text-[11px] font-bold text-ink">{p}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex h-8 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white">
          Hemen rezerve et
        </div>
      </div>
    </div>
  );
}

/* ── Telefon ekranı: harita ── */
function MapScreen() {
  return (
    <div className="relative h-full w-full bg-[#eef1f6]">
      {/* sahte yollar */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-0 right-0 top-1/3 h-2 bg-white" />
        <div className="absolute left-0 right-0 top-2/3 h-1.5 bg-white" />
        <div className="absolute bottom-0 left-1/4 top-0 w-2 bg-white" />
        <div className="absolute bottom-0 right-1/3 top-0 w-1.5 bg-white" />
        <div className="absolute left-2 right-10 top-12 h-10 rounded-md bg-[#dfe6c9]" />
        <div className="absolute bottom-16 right-4 h-12 w-16 rounded-md bg-[#cfe3ef]" />
      </div>
      {/* pinler */}
      {[
        ["left-6 top-10", "bg-accent"],
        ["right-8 top-20", "bg-ink"],
        ["left-1/2 top-1/2 -translate-x-1/2", "bg-accent"],
        ["left-10 bottom-16", "bg-ink"],
      ].map(([pos, color], i) => (
        <span
          key={i}
          className={`absolute ${pos} flex size-7 items-center justify-center rounded-full ${color} text-white shadow-pop ring-2 ring-white`}
        >
          <MapPin className="size-3.5" />
        </span>
      ))}
      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white p-2 shadow-card">
        <p className="text-[11px] font-bold text-ink">Yakınındaki 14 salon</p>
        <p className="text-[10px] text-ink-mute">Haritada keşfet →</p>
      </div>
    </div>
  );
}
