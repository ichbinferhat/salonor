import { describe, it, expect, vi, beforeEach } from "vitest";

// db + session mock'lanır → saf rol-doğrulama mantığını izole test eder.
const findUnique = vi.fn();
let mockSession: { userId: string; role: string; name: string } | null = null;

vi.mock("@/lib/db", () => ({
  db: { user: { findUnique: (...a: unknown[]) => findUnique(...a) } },
}));
vi.mock("@/lib/session", () => ({
  getSession: async () => mockSession,
}));

import { getDbVerifiedSession } from "@/lib/auth-guard";

describe("auth-guard — getDbVerifiedSession (stale-role koruması)", () => {
  beforeEach(() => {
    findUnique.mockReset();
    mockSession = null;
  });

  it("oturum yoksa null döner", async () => {
    mockSession = null;
    expect(await getDbVerifiedSession()).toBeNull();
  });

  it("rolü DB'den okur (JWT eski OWNER, DB CUSTOMER → CUSTOMER döner)", async () => {
    mockSession = { userId: "u1", role: "OWNER", name: "Eski Ad" };
    findUnique.mockResolvedValueOnce({ role: "CUSTOMER", name: "Yeni Ad" });
    const s = await getDbVerifiedSession();
    expect(s).toEqual({ userId: "u1", role: "CUSTOMER", name: "Yeni Ad" });
  });

  it("kullanıcı DB'de yoksa (silinmiş) null döner", async () => {
    mockSession = { userId: "u1", role: "ADMIN", name: "x" };
    findUnique.mockResolvedValueOnce(null);
    expect(await getDbVerifiedSession()).toBeNull();
  });

  it("DB hatasında JWT oturumuna düşer (kullanılabilirlik önceliği)", async () => {
    mockSession = { userId: "u1", role: "OWNER", name: "x" };
    findUnique.mockRejectedValueOnce(new Error("db down"));
    const s = await getDbVerifiedSession();
    expect(s).toEqual({ userId: "u1", role: "OWNER", name: "x" });
  });
});
