import { Star } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { timeAgoTr, ratingLabel } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { ReviewReply } from "@/components/panel/review-reply";

export default async function ReviewsPage() {
  const business = (await getOwnerBusiness())!;

  const [reviews, dist] = await Promise.all([
    db.review.findMany({
      where: { businessId: business.id },
      include: { customer: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.review.groupBy({
      by: ["rating"],
      where: { businessId: business.id },
      _count: true,
    }),
  ]);

  const distMap = new Map(dist.map((d) => [d.rating, d._count]));
  const total = business.ratingCount || 1;
  const unanswered = reviews.filter((r) => !r.reply).length;

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title="Yorumlar"
        subtitle={`${business.ratingCount} yorum · ${unanswered} yanıtlanmamış`}
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Özet */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 shadow-card lg:sticky lg:top-8">
          <div className="text-center">
            <p className="font-display text-5xl font-extrabold text-ink">
              {business.ratingAvg.toFixed(1)}
            </p>
            <RatingStars value={business.ratingAvg} className="mt-2 justify-center" />
            <p className="mt-1 text-sm font-semibold text-ink-soft">
              {ratingLabel(business.ratingAvg)}
            </p>
          </div>
          <div className="mt-5 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distMap.get(star) ?? 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-3 font-semibold text-ink-soft">{star}</span>
                  <Star className="size-3.5 fill-ink text-ink" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full bg-ink"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-ink-mute">{count}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Liste */}
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <h2 className="font-display text-xl font-bold text-ink">Henüz yorum yok</h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              Tamamlanan randevulardan sonra müşterilerin yorumları burada görünecek.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar src={r.customer.image} name={r.customer.name} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink">{r.customer.name}</p>
                    <div className="flex items-center gap-2">
                      <RatingStars value={r.rating} size="sm" />
                      <span className="text-xs text-ink-mute">{timeAgoTr(r.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 leading-relaxed text-ink">{r.comment}</p>
                <ReviewReply reviewId={r.id} businessName={business.name} existingReply={r.reply} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
