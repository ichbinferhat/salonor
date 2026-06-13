import Link from "next/link";
import { Carousel } from "@/components/home/carousel";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  customer: { name: string; image: string | null };
  business: { name: string; slug: string; district: string; city: string };
};

export function Reviews({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;
  return (
    <Carousel
      title="Değerlendirmeler"
      subtitle="Gerçek randevulardan, gerçek deneyimler"
    >
      {reviews.map((r) => (
        <figure
          key={r.id}
          className="flex h-full w-[78vw] max-w-[340px] shrink-0 snap-start flex-col rounded-[24px] border border-line bg-surface p-6 shadow-card sm:w-[330px] sm:max-w-none"
        >
          <RatingStars value={r.rating} tone="gold" size="md" />
          <Link
            href={`/salon/${r.business.slug}`}
            className="mt-3 line-clamp-1 font-display text-[17px] font-bold text-ink transition-colors hover:text-accent-deep"
          >
            {r.business.name}
          </Link>
          <blockquote className="mt-2 flex-1 leading-relaxed text-ink-soft">
            <span className="line-clamp-5">“{r.comment}”</span>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <Avatar src={r.customer.image} name={r.customer.name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{r.customer.name}</p>
              <p className="truncate text-xs text-ink-mute">
                {r.business.district}, {r.business.city}
              </p>
            </div>
          </figcaption>
        </figure>
      ))}
    </Carousel>
  );
}
