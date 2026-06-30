import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Prisma } from "@/generated/prisma/client";
import { SalonCard } from "@/components/salon-card";
import { SearchBar } from "@/components/search/search-bar";
import { SearchControls } from "@/components/search/search-controls";
import { SalonMapPanel } from "@/components/search/salon-map-panel";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.search.metaTitle, alternates: { canonical: "/arama" } };
}

type SearchParams = {
  q?: string;
  sehir?: string;
  ilce?: string;
  kategori?: string;
  sirala?: string;
};

export default async function SearchPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, sehir, ilce, kategori, sirala } = await props.searchParams;
  const dict = await getDictionary();

  const where: Prisma.BusinessWhereInput = {
    active: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { district: { contains: q, mode: "insensitive" } },
            { services: { some: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
    ...(sehir ? { city: sehir } : {}),
    ...(ilce ? { district: ilce } : {}),
    ...(kategori ? { category: { slug: kategori } } : {}),
  };

  const orderBy: Prisma.BusinessOrderByWithRelationInput[] =
    sirala === "puan"
      ? [{ ratingAvg: "desc" }, { ratingCount: "desc" }]
      : sirala === "yorum"
        ? [{ ratingCount: "desc" }, { ratingAvg: "desc" }]
        : [{ featured: "desc" }, { ratingAvg: "desc" }];

  // Ölçek koruması: pazaryeri büyüdükçe TÜM aktif işletmeleri (ve harita marker'larını)
  // tek seferde çekmek ağırlaşır. Üst sınır koy — mevcut ölçeği fazlasıyla kapsar;
  // bu sınır aşılırsa sayfalama (cursor/offset) eklenmelidir.
  const SEARCH_LIMIT = 60;
  const [salons, categories, session] = await Promise.all([
    db.business.findMany({ where, orderBy, include: { category: true }, take: SEARCH_LIMIT }),
    db.category.findMany(),
    getSession(),
  ]);

  // Girişli müşterinin favori işletmeleri — kartlardaki kalbin doğru görünmesi için.
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

  const orderedCategories = [...categories];
  const searchCategories = orderedCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    emoji: c.emoji,
  }));

  const categoryName = kategori
    ? categories.find((c) => c.slug === kategori)?.name
    : undefined;

  const place = [ilce, sehir].filter(Boolean).join(", ");
  const heading = [categoryName ?? dict.search.allSalons, place]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="container-x py-6 sm:py-8">
      {/* Premium arama çubuğu */}
      <div className="mb-7">
        <SearchBar
          key={`${q ?? ""}|${sehir ?? ""}|${ilce ?? ""}|${kategori ?? ""}`}
          variant="page"
          categories={searchCategories}
          defaults={{ q, sehir, ilce, kategori }}
        />
      </div>

      <div className="mb-5">
        <SearchControls categories={searchCategories} />
      </div>

      <div className="mb-6">
        <h1 className="font-display text-[28px] font-extrabold leading-[1.1] tracking-tight text-balance text-ink sm:text-[34px]">
          {heading}
        </h1>
        <p className="mt-1.5 flex items-center gap-2 text-pretty text-ink-soft">
          <span className="inline-flex items-center rounded-full bg-accent-faint px-2.5 py-0.5 text-[13px] font-bold tabular-nums text-accent-deep ring-1 ring-inset ring-accent-soft">
            {interpolate(dict.search.resultsCount, { n: salons.length })}
          </span>
          {q ? interpolate(dict.search.resultsForQuery, { q }) : ""}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        {salons.length > 0 ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
            {salons.map((s, i) => (
              <SalonCard
                key={s.id}
                salon={s}
                priority={i < 4}
                initialFavorite={favoriteIds.has(s.id)}
              />
            ))}
          </div>
        ) : (
          <div className="relative flex flex-col items-center overflow-hidden rounded-[28px] border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
            <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-accent-faint blur-3xl" />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-cream ring-1 ring-line-strong/60 shadow-card">
              <SearchX className="size-8 text-ink-mute" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-ink">
              {dict.search.emptyTitle}
            </h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              {dict.search.emptyDesc}
            </p>
            <Button href="/arama" variant="outline" className="mt-6">
              {dict.search.clearFilters}
            </Button>
          </div>
        )}

        {salons.length > 0 && (
          <SalonMapPanel
            salons={salons.map((s) => ({
              slug: s.slug,
              name: s.name,
              lat: s.lat,
              lng: s.lng,
              ratingAvg: s.ratingAvg,
              district: s.district,
            }))}
          />
        )}
      </div>
    </div>
  );
}
