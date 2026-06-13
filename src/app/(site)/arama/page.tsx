import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { SalonCard } from "@/components/salon-card";
import { SearchBar } from "@/components/search/search-bar";
import { SearchControls } from "@/components/search/search-controls";
import { SalonMapPanel } from "@/components/search/salon-map-panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Salon ara" };

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

  const where: Prisma.BusinessWhereInput = {
    active: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
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

  const [salons, categories] = await Promise.all([
    db.business.findMany({ where, orderBy, include: { category: true } }),
    db.category.findMany(),
  ]);

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
  const heading = [categoryName ?? "Tüm salonlar", place].filter(Boolean).join(" · ");

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
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {heading}
        </h1>
        <p className="mt-1 text-ink-soft">
          {salons.length} sonuç {q ? `· “${q}” için` : ""}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        {salons.length > 0 ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
            {salons.map((s, i) => (
              <SalonCard key={s.id} salon={s} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-[24px] border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-cream">
              <SearchX className="size-8 text-ink-mute" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold text-ink">
              Sonuç bulunamadı
            </h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              Aramanı genişletmeyi veya filtreleri temizlemeyi deneyebilirsin.
            </p>
            <Button href="/arama" variant="outline" className="mt-6">
              Filtreleri temizle
            </Button>
          </div>
        )}

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
      </div>
    </div>
  );
}
