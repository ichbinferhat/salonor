import type { Metadata } from "next";
import { HeartOff } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { SalonCard } from "@/components/salon-card";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.account.meta.favorites };
}

export default async function FavoritesPage() {
  const session = (await getSession())!;
  const dict = await getDictionary();

  const favorites = await db.favorite.findMany({
    where: { userId: session.userId },
    include: { business: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <div className="relative isolate flex flex-col items-center overflow-hidden rounded-[28px] border border-dashed border-line-strong bg-gradient-to-b from-surface to-cream/40 px-6 py-20 text-center shadow-card">
        <div className="pointer-events-none absolute -top-16 left-1/2 -z-10 size-48 -translate-x-1/2 rounded-full bg-[#ff5fa2]/10 blur-3xl" />
        <span className="flex size-16 items-center justify-center rounded-full bg-cream ring-1 ring-line shadow-card">
          <HeartOff className="size-8 text-ink-mute" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold text-balance text-ink">
          {dict.account.favorites.emptyTitle}
        </h2>
        <p className="mt-2 max-w-sm text-ink-soft">
          {dict.account.favorites.emptyDesc}
        </p>
        <Button href="/arama" variant="accent" className="mt-6">
          {dict.account.favorites.discoverSalons}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((f) => (
        <SalonCard key={f.businessId} salon={f.business} initialFavorite />
      ))}
    </div>
  );
}
