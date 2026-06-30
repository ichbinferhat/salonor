"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { FavoriteIcon } from "@/components/salon/favorite-icon";
import { useDict } from "@/i18n/provider";

export type SalonCardData = {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  district: string;
  city: string;
  ratingAvg: number;
  ratingCount: number;
  featured?: boolean;
  category: { name: string };
};

export function SalonCard({
  salon,
  className = "",
  priority = false,
  initialFavorite = false,
}: {
  salon: SalonCardData;
  className?: string;
  priority?: boolean;
  initialFavorite?: boolean;
}) {
  const dict = useDict();
  return (
    // Dış kapsayıcı relative: Favori düğmesi (interaktif <button>) anchor'ın DIŞINDA
    // kardeş olarak konumlanır — HTML anchor içinde etkileşimli içerik yasaktır
    // (erişilebilirlik + iç içe etkileşim hatası). `group` burada ki hover efektleri çalışsın.
    <div className={`group relative ${className}`}>
      <Link href={`/salon/${salon.slug}`} className="block">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-cream shadow-card ring-1 ring-ink/[0.04] transition-all duration-300 group-hover:shadow-pop">
          <Image
            src={salon.coverImage}
            alt={salon.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.045]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          {salon.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-card backdrop-blur-sm">
              {dict.salon.featured}
            </span>
          )}
        </div>

        <div className="px-0.5 pt-3">
          <div className="flex items-start justify-between gap-2.5">
            <h3 className="truncate font-display text-[16px] font-bold text-ink transition-colors group-hover:text-accent-deep">
              {salon.name}
            </h3>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-sm font-bold text-ink ring-1 ring-inset ring-line">
              <Star className="size-3.5 fill-gold text-gold" />
              {salon.ratingAvg.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-ink-soft">
            {salon.district}, {salon.city}
          </p>
          <p className="mt-0.5 truncate text-[13px] text-ink-mute">
            {salon.category.name} · {salon.ratingCount} {dict.salon.reviewWord}
          </p>
        </div>
      </Link>

      {/* Favori düğmesi — anchor dışında, görselin sağ-üstüne hizalı (z-10 ile tıklanabilir) */}
      <span className="absolute right-3 top-3 z-10">
        <FavoriteIcon businessId={salon.id} slug={salon.slug} initial={initialFavorite} />
      </span>
    </div>
  );
}
