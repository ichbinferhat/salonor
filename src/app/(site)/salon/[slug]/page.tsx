import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  ChevronRight,
  Clock,
  CalendarCheck2,
  Navigation,
  MessageCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getDictionary, getLocale } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { waChatLink } from "@/lib/contact";
import { todayStr, nowMinutes, weekdayOf, minToHHMM, weekdayName, relativeTime } from "@/lib/datetime";
import { formatTl, formatDuration, ratingLabelKey } from "@/lib/format";
import { Gallery } from "@/components/salon/gallery";
import { FavoriteButton } from "@/components/salon/favorite-button";
import { MiniMap } from "@/components/salon/mini-map";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PublicReviewButton } from "@/components/salon/review-form";

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const [business, dict, locale] = await Promise.all([
    db.business.findUnique({
      where: { slug },
      select: { name: true, district: true, city: true, description: true, coverImage: true },
    }),
    getDictionary(),
    getLocale(),
  ]);
  if (!business) return { title: dict.salon.notFoundTitle };
  const title = `${business.name} — ${business.district}, ${business.city}`;
  const description =
    business.description?.trim() ||
    interpolate(dict.salon.metaDescriptionFallback, { name: business.name });
  const OG_LOCALE: Record<string, string> = {
    tr: "tr_TR", en: "en_US", ru: "ru_RU", ar: "ar_SA",
    de: "de_DE", fr: "fr_FR", fa: "fa_IR", es: "es_ES",
  };
  return {
    title,
    description,
    alternates: { canonical: `/salon/${slug}` },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? "tr_TR",
      title,
      description,
      images: [{ url: business.coverImage, width: 1200, height: 630, alt: business.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [business.coverImage] },
  };
}

export default async function SalonPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  const [business, session] = await Promise.all([
    db.business.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sort: "asc" } },
        serviceCategories: {
          orderBy: { sort: "asc" },
          include: { services: { orderBy: { sort: "asc" } } },
        },
        staff: { where: { active: true } },
        hours: { orderBy: { weekday: "asc" } },
        reviews: {
          where: { hidden: false },
          orderBy: { createdAt: "desc" },
          take: 12,
          include: { customer: { select: { name: true, image: true } } },
        },
      },
    }),
    getSession(),
  ]);

  if (!business || !business.active) notFound();

  const [isFavorite, ratingDist] = await Promise.all([
    session
      ? db.favorite
          .findUnique({
            where: {
              userId_businessId: { userId: session.userId, businessId: business.id },
            },
          })
          .then(Boolean)
      : Promise.resolve(false),
    db.review.groupBy({
      by: ["rating"],
      where: { businessId: business.id, hidden: false },
      _count: true,
    }),
  ]);

  const distMap = new Map(ratingDist.map((d) => [d.rating, d._count]));
  const totalReviews = ratingDist.reduce((s, d) => s + d._count, 0) || 1;
  const galleryImages = business.images.length
    ? business.images.map((i) => i.url)
    : [business.coverImage];

  const today = todayStr();
  const promoActive =
    !!business.promoText && (!business.promoUntil || business.promoUntil >= today);
  const todayHours = business.hours.find((h) => h.weekday === weekdayOf(today));
  const now = nowMinutes();
  const isOpen =
    !!todayHours && !todayHours.closed && now >= todayHours.openMin && now < todayHours.closeMin;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`;
  const waHref = waChatLink(
    business.whatsappPhone || business.phone,
    interpolate(dict.salon.whatsappGreeting, { name: business.name })
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: business.name,
    image: business.coverImage,
    description: business.description,
    url: `https://salonor.vercel.app/salon/${business.slug}`,
    telephone: business.phone || undefined,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address || undefined,
      addressLocality: business.district,
      addressRegion: business.city,
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: business.lat, longitude: business.lng },
    ...(business.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.ratingAvg.toFixed(1),
            reviewCount: business.ratingCount,
          },
        }
      : {}),
    openingHoursSpecification: business.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAYS[h.weekday],
        opens: minToHHMM(h.openMin),
        closes: minToHHMM(h.closeMin),
      })),
  };

  return (
    <div className="container-x py-6 pb-28 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-ink-soft" aria-label={dict.salon.breadcrumbLabel}>
        <Link href="/" className="hover:text-ink">{dict.salon.home}</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/arama?kategori=${business.category.slug}`} className="hover:text-ink">
          {business.category.name}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-semibold text-ink">{business.name}</span>
      </nav>

      {/* Öne çıkan kampanya / duyuru */}
      {promoActive && (
        <div className="anim-rise mb-5 flex items-center gap-3 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent-soft to-[#ffe4f3] px-4 py-3 shadow-card sm:px-5">
          <span className="text-xl" aria-hidden>📣</span>
          <p className="text-sm font-bold text-accent-deep sm:text-[15px]">{business.promoText}</p>
        </div>
      )}

      {/* Başlık */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {business.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <strong className="text-base">{business.ratingAvg.toFixed(1)}</strong>
              <RatingStars value={business.ratingAvg} size="sm" />
              <a href="#yorumlar" className="text-ink-soft underline-offset-2 hover:underline">
                {interpolate(dict.salon.reviewsCountInline, { n: business.ratingCount })}
              </a>
            </span>
            <span className="flex items-center gap-1 text-ink-soft">
              <MapPin className="size-4" />
              {business.address}, {business.district}, {business.city}
            </span>
            {isOpen ? (
              <Badge tone="mint">{dict.salon.openNow}</Badge>
            ) : (
              <Badge tone="rose">{dict.salon.closedNow}</Badge>
            )}
          </div>
        </div>
        <FavoriteButton businessId={business.id} slug={business.slug} initial={isFavorite} />
      </div>

      <Gallery images={galleryImages} name={business.name} />

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          {/* Hizmetler */}
          <section id="hizmetler">
            <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-ink">
              {dict.salon.servicesTitle}
            </h2>
            <div className="space-y-8">
              {business.serviceCategories.map((sc) => (
                <div key={sc.id}>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink-mute">
                    <span className="h-px w-5 bg-gradient-to-r from-accent to-transparent" aria-hidden />
                    {sc.name}
                  </h3>
                  <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface shadow-card">
                    {sc.services.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent-faint sm:p-5">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{s.name}</p>
                          {s.description && (
                            <p className="mt-0.5 text-sm text-ink-soft">{s.description}</p>
                          )}
                          <p className="mt-1 flex items-center gap-1 text-sm text-ink-mute">
                            <Clock className="size-3.5" /> {formatDuration(s.durationMin)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <span className="font-bold text-ink">{formatTl(s.priceTl)}</span>
                          <Button
                            href={`/randevu/${business.slug}?hizmet=${s.id}`}
                            variant="outline"
                            size="sm"
                          >
                            {dict.salon.select}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Ekip */}
          <section id="ekip">
            <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-ink">{dict.salon.teamTitle}</h2>
            <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {business.staff.map((st) => (
                <div
                  key={st.id}
                  className="group flex w-36 shrink-0 flex-col items-center rounded-[20px] border border-line bg-surface p-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-pop"
                >
                  <Avatar src={st.image} name={st.name} size="xl" />
                  <p className="mt-3 text-sm font-bold text-ink">{st.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{st.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Yorumlar */}
          <section id="yorumlar">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                {dict.salon.reviewsTitle}
              </h2>
              <PublicReviewButton slug={business.slug} loggedIn={!!session} />
            </div>
            <div className="mb-6 grid gap-6 rounded-[20px] border border-line bg-gradient-to-br from-surface to-accent-faint p-6 shadow-card sm:grid-cols-[auto_1fr] sm:gap-10">
              <div className="text-center sm:text-left">
                <p className="font-display text-5xl font-extrabold text-ink">
                  {business.ratingAvg.toFixed(1)}
                </p>
                <RatingStars value={business.ratingAvg} className="mt-2" />
                <p className="mt-1 text-sm font-semibold text-ink-soft">
                  {interpolate(dict.salon.ratingSummary, {
                    label: dict.salon[ratingLabelKey(business.ratingAvg)],
                    n: business.ratingCount,
                  })}
                </p>
              </div>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distMap.get(star) ?? 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-3 font-semibold text-ink-soft">{star}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                        <div
                          className="h-full rounded-full bg-ink"
                          style={{ width: `${(count / totalReviews) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-ink-mute">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <ul className="space-y-4">
              {business.reviews.map((r) => (
                <li key={r.id} className="rounded-[20px] border border-line bg-surface p-5 shadow-card">
                  <div className="flex items-center gap-3">
                    <Avatar src={r.customer?.image ?? null} name={r.customer?.name ?? r.authorName ?? dict.salon.guest} size="md" />
                    <div>
                      <p className="text-sm font-bold text-ink">{r.customer?.name ?? r.authorName ?? dict.salon.guest}</p>
                      <div className="flex items-center gap-2">
                        <RatingStars value={r.rating} size="sm" />
                        <span className="text-xs text-ink-mute">{relativeTime(locale, r.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 leading-relaxed text-ink">{r.comment}</p>
                  {r.reply && (
                    <div className="mt-3 rounded-2xl bg-cream p-4">
                      <p className="text-xs font-bold text-ink-soft">
                        {interpolate(dict.salon.businessReplied, { name: business.name })}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">{r.reply}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Hakkında */}
          <section id="hakkinda">
            <h2 className="mb-5 font-display text-2xl font-bold tracking-tight text-ink">
              {dict.salon.aboutTitle}
            </h2>
            <p className="max-w-2xl leading-relaxed text-ink-soft">{business.description}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <MiniMap lat={business.lat} lng={business.lng} name={business.name} />
              <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                <h3 className="mb-3 font-bold text-ink">{dict.salon.openingHours}</h3>
                <ul className="space-y-2 text-sm">
                  {[1, 2, 3, 4, 5, 6, 0].map((wd) => {
                    const h = business.hours.find((x) => x.weekday === wd);
                    const isToday = wd === weekdayOf(today);
                    return (
                      <li
                        key={wd}
                        className={`flex justify-between ${
                          isToday ? "font-bold text-ink" : "text-ink-soft"
                        }`}
                      >
                        <span>
                          {weekdayName(locale, wd)} {isToday && dict.salon.today}
                        </span>
                        <span>
                          {!h || h.closed
                            ? dict.salon.closed
                            : `${minToHHMM(h.openMin)} – ${minToHHMM(h.closeMin)}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Yapışkan randevu kartı */}
        <aside className="sticky top-24 isolate hidden overflow-hidden rounded-[28px] border border-line bg-surface p-6 shadow-pop ring-1 ring-accent/5 lg:block">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-44 rounded-full bg-accent/10 blur-3xl" aria-hidden />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="font-display text-2xl font-extrabold text-ink">
                {business.ratingAvg.toFixed(1)}
              </p>
              <RatingStars value={business.ratingAvg} size="sm" />
            </div>
            <Badge tone={isOpen ? "mint" : "rose"}>
              {isOpen ? dict.salon.openNow : dict.salon.closedNow}
            </Badge>
          </div>
          <Button
            href={`/randevu/${business.slug}`}
            variant="accent"
            size="xl"
            className="mt-5 w-full"
          >
            <CalendarCheck2 className="size-5" /> {dict.salon.book}
          </Button>
          <p className="mt-2 text-center text-xs text-ink-mute">
            {dict.salon.bookNote}
          </p>
          <div className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <p className="flex items-start gap-2.5 text-ink-soft">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {business.address}, {business.district}, {business.city}
            </p>
            <p className="flex items-center gap-2.5 text-ink-soft">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="hover:text-ink">
                {business.phone}
              </a>
            </p>
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 font-semibold text-[#1da851] hover:underline"
              >
                <MessageCircle className="size-4 shrink-0" /> {dict.salon.whatsappChat}
              </a>
            )}
            {todayHours && !todayHours.closed && (
              <p className="flex items-center gap-2.5 text-ink-soft">
                <Clock className="size-4 shrink-0" />
                {interpolate(dict.salon.todayHours, {
                  open: minToHHMM(todayHours.openMin),
                  close: minToHHMM(todayHours.closeMin),
                })}
              </p>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-semibold text-accent-deep hover:underline"
            >
              <Navigation className="size-4 shrink-0" /> {dict.salon.getDirections}
            </a>
          </div>
        </aside>
      </div>

      {/* Mobil sabit CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-3 backdrop-blur-md lg:hidden">
        <div className="container-x flex items-center gap-3 !px-1">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{business.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink-soft">
              ★ {business.ratingAvg.toFixed(1)} ({business.ratingCount})
            </p>
          </div>
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.salon.whatsappChat}
              className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card"
            >
              <MessageCircle className="size-5" />
            </a>
          )}
          <Button
            href={`/randevu/${business.slug}`}
            variant="accent"
            size="lg"
            className={`${waHref ? "" : "ml-auto "}shrink-0`}
          >
            {dict.salon.book}
          </Button>
        </div>
      </div>
    </div>
  );
}
