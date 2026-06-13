import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/ui/rating-stars";
import { Badge } from "@/components/ui/badge";

export type SalonCardData = {
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
    <Link
      href={`/salon/${salon.slug}`}
      className={`group block overflow-hidden rounded-[20px] border border-line bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-pop ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={salon.coverImage}
          alt={salon.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 280px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {salon.featured && (
          <Badge tone="ink" className="absolute left-3 top-3 shadow-card">
            Öne çıkan
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-display text-[17px] font-bold text-ink">
          {salon.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm">
          <span className="font-bold">{salon.ratingAvg.toFixed(1)}</span>
          <RatingStars value={salon.ratingAvg} size="sm" />
          <span className="text-ink-mute">({salon.ratingCount})</span>
        </div>
        <p className="mt-1 truncate text-sm text-ink-soft">
          {salon.district}, {salon.city}
        </p>
        <Badge tone="line" className="mt-3">
          {salon.category.name}
        </Badge>
      </div>
    </Link>
  );
}
