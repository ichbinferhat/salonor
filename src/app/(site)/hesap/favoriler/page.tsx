import type { Metadata } from "next";
import { HeartOff } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SalonCard } from "@/components/salon-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Favorilerim" };

export default async function FavoritesPage() {
  const session = (await getSession())!;

  const favorites = await db.favorite.findMany({
    where: { userId: session.userId },
    include: { business: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[24px] border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-cream">
          <HeartOff className="size-8 text-ink-mute" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold text-ink">
          Henüz favorin yok
        </h2>
        <p className="mt-2 max-w-sm text-ink-soft">
          Beğendiğin salonları kalbe dokunarak kaydet; hepsi burada seni beklesin.
        </p>
        <Button href="/arama" variant="accent" className="mt-6">
          Salon keşfet
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((f) => (
        <SalonCard key={f.businessId} salon={f.business} />
      ))}
    </div>
  );
}
