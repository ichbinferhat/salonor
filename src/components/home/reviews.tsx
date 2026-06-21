import Link from "next/link";
import { Carousel } from "@/components/home/carousel";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { getDictionary } from "@/i18n";

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  customer: { name: string; image: string | null } | null;
  authorName: string | null;
  business: { name: string; slug: string; district: string; city: string };
};

export async function Reviews({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;
  const dict = await getDictionary();
  return (
    <Carousel
      title={dict.home.reviews.title}
      subtitle={dict.home.reviews.subtitle}
    >
      {reviews.map((r) => (
        <figure
          key={r.id}
          className="flex h-full min-h-[20rem] w-[85%] shrink-0 snap-start flex-col rounded-[28px] border border-line bg-surface p-7 shadow-card transition-shadow hover:shadow-pop sm:w-[calc((100%_-_1.25rem)/2)] sm:p-8 lg:w-[calc((100%_-_2.5rem)/3)]"
        >
          <RatingStars value={r.rating} tone="gold" size="lg" />
          <Link
            href={`/salon/${r.business.slug}`}
            className="mt-4 line-clamp-1 font-display text-xl font-extrabold text-ink transition-colors hover:text-accent-deep"
          >
            {r.business.name}
          </Link>
          <blockquote className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink-soft">
            <span className="line-clamp-5">“{r.comment}”</span>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <Avatar src={r.customer?.image ?? null} name={r.customer?.name ?? r.authorName ?? "Misafir"} size="md" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-ink">{r.customer?.name ?? r.authorName ?? "Misafir"}</p>
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
