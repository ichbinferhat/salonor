import Link from "next/link";
import { ShieldCheck, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { SearchBar } from "@/components/search/search-bar";
import { Carousel } from "@/components/home/carousel";
import { StatsBand } from "@/components/home/stats-band";
import { BusinessPromo } from "@/components/home/business-promo";
import { Reviews } from "@/components/home/reviews";
import { AppDownload } from "@/components/home/app-download";
import { ServicesDirectory } from "@/components/home/services-directory";
import { SalonCard } from "@/components/salon-card";
import { RatingStars } from "@/components/ui/rating-stars";

const CATEGORY_ORDER = [
  "kuafor",
  "berber",
  "tirnak",
  "cilt-bakimi",
  "spa-masaj",
  "makyaj",
  "epilasyon",
  "kas-kirpik",
];

const POPULAR_CITIES = ["İstanbul", "Ankara", "İzmir", "Antalya", "Bursa"];

const CARD_CLS =
  "w-[78vw] max-w-[340px] shrink-0 snap-center sm:w-[300px] sm:max-w-none sm:snap-start";

export default async function HomePage() {
  const [categories, featured, newest, bizCount, serviceCount, reviewCount, quotes] =
    await Promise.all([
      db.category.findMany(),
      db.business.findMany({
        where: { featured: true },
        include: { category: true },
        orderBy: { ratingAvg: "desc" },
        take: 8,
      }),
      db.business.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.business.count(),
      db.service.count(),
      db.review.count(),
      db.review.findMany({
        where: { rating: 5 },
        include: {
          customer: { select: { name: true, image: true } },
          business: { select: { name: true, slug: true, district: true, city: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 9,
      }),
    ]);

  const orderedCategories = [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug)
  );

  const searchCategories = orderedCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    emoji: c.emoji,
  }));

  return (
    <div className="overflow-x-clip">
      {/* ───────────────── Hero (tam ekran, ortalanmış) ───────────────── */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-accent-faint via-[#fdf1f8] to-cream" />
          <div className="absolute -top-40 left-1/2 h-[460px] w-[880px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute right-[18%] top-24 size-72 rounded-full bg-[#ff5fa2]/12 blur-3xl" />
        </div>

        <div className="container-x flex min-h-[88svh] flex-col items-center justify-center py-16 text-center">
          <p className="anim-rise mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-semibold text-ink-soft shadow-card backdrop-blur">
            <ShieldCheck className="size-4 text-mint" />
            Türkiye’nin randevu platformu
          </p>

          <h1 className="anim-rise d-1 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Güzellik randevun,{" "}
            <span className="bg-gradient-to-r from-accent to-[#ff5fa2] bg-clip-text text-transparent">
              saniyeler
            </span>{" "}
            içinde.
          </h1>

          <p className="anim-rise d-2 mt-5 max-w-2xl text-lg text-ink-soft sm:text-xl">
            Çevrendeki en iyi kuaför, berber, spa ve güzellik uzmanlarını keşfet;
            uygun saati seç, yerini anında ayırt — ücretsiz ve 7/24.
          </p>

          <div className="anim-rise d-3 mt-9 w-full">
            <SearchBar variant="hero" categories={searchCategories} />
          </div>

          <div className="anim-rise d-4 mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-ink-soft">Popüler:</span>
            {POPULAR_CITIES.map((c) => (
              <Link
                key={c}
                href={`/arama?sehir=${encodeURIComponent(c)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40"
              >
                <MapPin className="size-3.5 text-accent" />
                {c}
              </Link>
            ))}
          </div>

          <div className="anim-rise d-5 mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            <span className="flex items-center gap-1.5">
              <RatingStars value={4.8} size="sm" />
              <strong className="text-ink">4.8</strong> ortalama puan
            </span>
            <span>
              <strong className="text-ink">{reviewCount}+</strong> doğrulanmış yorum
            </span>
            <span>
              <strong className="text-ink">{bizCount}</strong> seçkin salon
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────── Kategoriler ───────────────── */}
      <section className="container-x pb-16">
        <h2 className="sr-only">Kategoriler</h2>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
          {orderedCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/arama?kategori=${c.slug}`}
              className="group flex min-w-28 flex-col items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-card"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-cream text-2xl transition-colors group-hover:bg-accent-soft">
                {c.emoji}
              </span>
              <span className="text-[13px] font-semibold leading-tight text-ink">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── Öne çıkanlar / Yeni ───────────────── */}
      <div className="space-y-16 pb-16">
        <Carousel
          title="Önerilen salonlar"
          subtitle="Yüksek puanlı, en çok tercih edilenler"
          href="/arama?sirala=puan"
        >
          {featured.map((b, i) => (
            <SalonCard key={b.id} salon={b} priority={i < 4} className={CARD_CLS} />
          ))}
        </Carousel>

        <Carousel
          title="Yeni eklenenler"
          subtitle="Salonor’a yeni katılan işletmeler"
          href="/arama"
        >
          {newest.map((b) => (
            <SalonCard key={b.id} salon={b} className={CARD_CLS} />
          ))}
        </Carousel>
      </div>

      {/* ───────────────── İstatistik bandı (gradyan) ───────────────── */}
      <StatsBand bizCount={bizCount} serviceCount={serviceCount} reviewCount={reviewCount} />

      {/* ───────────────── İşletme bölümü ───────────────── */}
      <BusinessPromo />

      {/* ───────────────── Değerlendirmeler ───────────────── */}
      <section className="pb-20">
        <Reviews reviews={quotes} />
      </section>

      {/* ───────────────── Uygulama indir ───────────────── */}
      <AppDownload image={featured[0]?.coverImage} />

      {/* ───────────────── Tüm hizmetler dizini ───────────────── */}
      <ServicesDirectory />
    </div>
  );
}
