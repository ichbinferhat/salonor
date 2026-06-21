import { db } from "@/lib/db";

/**
 * İşletmenin puan ortalaması ve yorum sayısını yeniden hesaplar.
 * GİZLENMİŞ (admin tarafından moderasyona alınmış) yorumlar sayılmaz —
 * hem ortalamadan hem sayıdan düşer. Yorum ekleme/silme/gizleme sonrası çağrılır.
 */
export async function recomputeBusinessRating(businessId: string) {
  const agg = await db.review.aggregate({
    where: { businessId, hidden: false },
    _avg: { rating: true },
    _count: true,
  });
  await db.business.update({
    where: { id: businessId },
    data: {
      ratingAvg: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      ratingCount: agg._count,
    },
  });
}
