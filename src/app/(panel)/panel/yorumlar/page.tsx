import { Star } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { timeAgoTr, ratingLabel } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { ReviewReply } from "@/components/panel/review-reply";
import { DeleteReviewButton, ReportReviewButton } from "@/components/panel/delete-review-button";

export default async function ReviewsPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.reviews;

  const [reviews, dist] = await Promise.all([
    db.review.findMany({
      where: { businessId: business.id },
      include: { customer: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.review.groupBy({
      by: ["rating"],
      where: { businessId: business.id, hidden: false },
      _count: true,
    }),
  ]);

  const distMap = new Map(dist.map((d) => [d.rating, d._count]));
  const total = business.ratingCount || 1;
  // "Yanıtlanmamış" yalnızca görünür yorumlardan sayılır; gizlenmiş yorumlar
  // ratingCount'a girmediği gibi zaten yanıtlanamaz, bu yüzden sayıyı şişirmemeli.
  const unanswered = reviews.filter((r) => !r.hidden && !r.reply).length;

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={interpolate(t.subtitle, { count: business.ratingCount, unanswered })}
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
            <h2 className="font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              {t.emptyDesc}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className={`rounded-2xl border p-5 shadow-card ${
                  r.hidden ? "border-dashed border-line-strong bg-cream/50" : "border-line bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={r.customer?.image ?? null} name={r.customer?.name ?? r.authorName ?? "Misafir"} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-bold text-ink">
                      <span className="truncate">{r.customer?.name ?? r.authorName ?? "Misafir"}</span>
                      {r.hidden && (
                        <span className="shrink-0 rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold text-ink-soft">
                          {t.adminHidden}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <RatingStars value={r.rating} size="sm" />
                      <span className="text-xs text-ink-mute">{timeAgoTr(r.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <ReportReviewButton reviewId={r.id} reported={r.reported} />
                    <DeleteReviewButton reviewId={r.id} />
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
