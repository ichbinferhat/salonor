import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getDictionary } from "@/i18n";
import { TurkishFlag } from "@/components/ui/turkish-flag";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SearchBar } from "@/components/search/search-bar";
import { Carousel } from "@/components/home/carousel";
import { StatsBand } from "@/components/home/stats-band";
import { BusinessPromo } from "@/components/home/business-promo";
import { Reviews } from "@/components/home/reviews";
import { ServicesDirectory } from "@/components/home/services-directory";
import { SalonCard } from "@/components/salon-card";
import { RatingStars } from "@/components/ui/rating-stars";

// Kendine işaret eden canonical (anasayfa). Salon dışı sayfalarda eksikti.
export const metadata: Metadata = { alternates: { canonical: "/" } };

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
  "shrink-0 snap-start w-[78%] sm:w-[calc((100%_-_1.25rem)/2)] lg:w-[calc((100%_-_3.75rem)/4)]";

/**
 * Düz görünen alt başlığa editoryal bir vurgu katar: tire (—) sonrası gelen
 * fayda cümlesini accent renkte, yarı-kalın gösterir. Tire yoksa metni olduğu
 * gibi döndürür — böylece her dilde güvenli çalışır.
 */
function emphasizeBenefit(text: string) {
  const i = text.lastIndexOf("—");
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i).trimEnd()}{" "}
      <span className="font-semibold text-accent-deep">{text.slice(i + 1).trim()}</span>
    </>
  );
}

export default async function HomePage() {
  const session = await getSession();
  const dict = await getDictionary();

  const [
    categories,
    featured,
    newest,
    bizCount,
    serviceCount,
    reviewCount,
    quotes,
    ratingAgg,
  ] = await Promise.all([
    db.category.findMany(),
    db.business.findMany({
      where: { featured: true, active: true },
      include: { category: true },
      orderBy: { ratingAvg: "desc" },
      take: 8,
    }),
    db.business.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.business.count(),
    db.service.count(),
    db.review.count(),
    db.review.findMany({
      where: { rating: 5, hidden: false },
      include: {
        customer: { select: { name: true, image: true } },
        business: { select: { name: true, slug: true, district: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 9,
    }),
    // Gerçek/dürüst ortalama puan — tüm görünür yorumların ortalaması.
    db.review.aggregate({ where: { hidden: false }, _avg: { rating: true } }),
  ]);

  // Girişli müşterinin favori işletme kimlikleri — kartlardaki kalbin doğru
  // (dolu/boş) görünmesi için. Girişsizse boş küme.
  const favoriteIds =
    session && session.role === "CUSTOMER"
      ? new Set(
          (
            await db.favorite.findMany({
              where: { userId: session.userId },
              select: { businessId: true },
            })
          ).map((f) => f.businessId)
        )
      : new Set<string>();

  // Yeterli yorum yoksa uydurma bir puan göstermeyiz.
  const avgRating =
    reviewCount > 0 && ratingAgg._avg.rating != null ? ratingAgg._avg.rating : null;

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

        <div className="container-x flex flex-col items-center pb-14 pt-10 text-center sm:pb-16 sm:pt-14 lg:pt-16">
          <p className="anim-rise mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-ink-soft shadow-card backdrop-blur">
            <TurkishFlag className="h-5 w-[30px] shadow-sm" />
            {dict.home.heroBadge}
          </p>

          <h1 className="anim-rise d-1 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {dict.home.heroTitleA}
            <span className="bg-gradient-to-r from-accent to-[#ff5fa2] bg-clip-text text-transparent">
              {dict.home.heroTitleHighlight}
            </span>
            {dict.home.heroTitleEnd}
          </h1>

          <p className="anim-rise d-2 mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl">
            {emphasizeBenefit(dict.home.heroSubtitle)}
          </p>

          <div className="anim-rise d-3 mt-9 w-full">
            <SearchBar variant="hero" categories={searchCategories} />
          </div>

          <div className="anim-rise d-4 mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-ink-soft">{dict.home.popular}</span>
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
            {avgRating != null && (
              <span className="flex items-center gap-1.5">
                <RatingStars value={avgRating} size="sm" />
                <strong className="text-ink">{avgRating.toFixed(1)}</strong> {dict.home.ratingAvg}
              </span>
            )}
            <span>
              <strong className="text-ink">{reviewCount}+</strong> {dict.home.verifiedReviews}
            </span>
            <span>
              <strong className="text-ink">{bizCount}</strong> {dict.home.selectSalons}
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────── Kategoriler ───────────────── */}
      <section className="container-x pb-16">
        <h2 className="sr-only">{dict.home.categoriesSr}</h2>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-8">
          {orderedCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/arama?kategori=${c.slug}`}
              className="group flex min-w-28 flex-col items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-pop"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-cream text-2xl ring-1 ring-line transition-all group-hover:scale-110 group-hover:bg-accent-soft group-hover:ring-accent/30">
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
        {featured.length > 0 && (
          <Carousel
            title={dict.home.featuredTitle}
            subtitle={dict.home.featuredSubtitle}
            href="/arama?sirala=puan"
          >
            {featured.map((b, i) => (
              <SalonCard
                key={b.id}
                salon={b}
                priority={i < 4}
                className={CARD_CLS}
                initialFavorite={favoriteIds.has(b.id)}
              />
            ))}
          </Carousel>
        )}

        {newest.length > 0 && (
          <Carousel
            title={dict.home.newestTitle}
            subtitle={dict.home.newestSubtitle}
            href="/arama"
          >
            {newest.map((b) => (
              <SalonCard
                key={b.id}
                salon={b}
                className={CARD_CLS}
                initialFavorite={favoriteIds.has(b.id)}
              />
            ))}
          </Carousel>
        )}
      </div>

      {/* ───────────────── İstatistik bandı (gradyan) ───────────────── */}
      <StatsBand bizCount={bizCount} serviceCount={serviceCount} reviewCount={reviewCount} />

      {/* ───────────────── İşletme bölümü ───────────────── */}
      <BusinessPromo />

      {/* ───────────────── Değerlendirmeler ───────────────── */}
      <section className="pb-20">
        <Reviews reviews={quotes} />
      </section>

      {/* ───────────────── Tüm hizmetler dizini ───────────────── */}
      <ServicesDirectory />
    </div>
  );
}
