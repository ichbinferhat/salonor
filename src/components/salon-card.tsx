import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { FavoriteIcon } from "@/components/salon/favorite-icon";

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
}: {
  salon: SalonCardData;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href={`/salon/${salon.slug}`} className={`group block ${className}`}>
      <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-cream">
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
            Öne çıkan
          </span>
        )}
        <span className="absolute right-3 top-3">
          <FavoriteIcon businessId={salon.id} slug={salon.slug} />
        </span>
      </div>

      <div className="px-0.5 pt-3">
        <div className="flex items-start justify-between gap-2.5">
          <h3 className="truncate font-display text-[16px] font-bold text-ink transition-colors group-hover:text-accent-deep">
            {salon.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-ink">
            <Star className="size-3.5 fill-gold text-gold" />
            {salon.ratingAvg.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-ink-soft">
          {salon.district}, {salon.city}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-ink-mute">
          {salon.category.name} · {salon.ratingCount} değerlendirme
        </p>
      </div>
    </Link>
  );
}
