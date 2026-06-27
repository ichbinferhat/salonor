import { describe, it, expect, vi, beforeEach } from "vitest";

// db mock'lanır → gerçek Prisma bağlantısı kurmadan sağlık ucu mantığını test eder.
const queryRaw = vi.fn();
vi.mock("@/lib/db", () => ({
  db: { $queryRaw: (...a: unknown[]) => queryRaw(...a) },
}));

import { GET } from "@/app/api/health/route";

describe("health endpoint", () => {
  beforeEach(() => queryRaw.mockReset());

  it("DB erişilebilir → 200, ok:true, db:up", async () => {
    queryRaw.mockResolvedValueOnce([{ ok: 1 }]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.db).toBe("up");
  });

  it("DB erişilemez → 503, ok:false, db:down", async () => {
    queryRaw.mockRejectedValueOnce(new Error("no db"));
    const res = await GET();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.db).toBe("down");
  });
});
