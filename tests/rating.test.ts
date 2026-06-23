import { describe, it, expect, vi, beforeEach } from "vitest";

const mockReviewAggregate = vi.fn();
const mockBusinessUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    review: { aggregate: (...a: unknown[]) => mockReviewAggregate(...a) },
    business: { update: (...a: unknown[]) => mockBusinessUpdate(...a) },
  },
}));

import { recomputeBusinessRating } from "@/lib/rating";

describe("rating — recomputeBusinessRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBusinessUpdate.mockResolvedValue({});
  });

  it("ortalama bir ondalığa yuvarlanır ve sayı yazılır", async () => {
    mockReviewAggregate.mockResolvedValue({ _avg: { rating: 4.26 }, _count: 3 });
    await recomputeBusinessRating("b1");
    const arg = mockBusinessUpdate.mock.calls[0][0] as {
      where: { id: string };
      data: { ratingAvg: number; ratingCount: number };
    };
    expect(arg.where.id).toBe("b1");
    expect(arg.data.ratingAvg).toBe(4.3); // 4.26 -> 4.3
    expect(arg.data.ratingCount).toBe(3);
  });

  it("yorum yoksa (avg null) ortalama 0 ve sayı 0", async () => {
    mockReviewAggregate.mockResolvedValue({ _avg: { rating: null }, _count: 0 });
    await recomputeBusinessRating("b1");
    const arg = mockBusinessUpdate.mock.calls[0][0] as {
      data: { ratingAvg: number; ratingCount: number };
    };
    expect(arg.data.ratingAvg).toBe(0);
    expect(arg.data.ratingCount).toBe(0);
  });

  it("yalnızca gizlenmemiş (hidden:false) yorumlar sorgulanır", async () => {
    mockReviewAggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: 1 });
    await recomputeBusinessRating("b1");
    const arg = mockReviewAggregate.mock.calls[0][0] as {
      where: { businessId: string; hidden: boolean };
    };
    expect(arg.where.businessId).toBe("b1");
    expect(arg.where.hidden).toBe(false); // gizli yorumlar puana sayılmaz
  });

  it("yuvarlama .x5 sınırında yukarı çıkar", async () => {
    mockReviewAggregate.mockResolvedValue({ _avg: { rating: 3.45 }, _count: 2 });
    await recomputeBusinessRating("b1");
    const arg = mockBusinessUpdate.mock.calls[0][0] as { data: { ratingAvg: number } };
    expect(arg.data.ratingAvg).toBe(3.5);
  });

  it("tam sayı ortalama korunur (5.0 -> 5)", async () => {
    mockReviewAggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: 10 });
    await recomputeBusinessRating("b1");
    const arg = mockBusinessUpdate.mock.calls[0][0] as { data: { ratingAvg: number } };
    expect(arg.data.ratingAvg).toBe(5);
  });
});
