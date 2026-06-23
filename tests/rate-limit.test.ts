import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

// rate-limit modülü bellek içi global bir Map kullanır; testler arası karışmaması
// için her test benzersiz key kullanır. Zaman bağımlılığı için sahte zamanlayıcı.
describe("rate-limit — rateLimit(key, limit, windowMs)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-23T10:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("limit altındaki istekler ok=true döner", () => {
    const key = "test:under-limit";
    expect(rateLimit(key, 3, 60_000)).toEqual({ ok: true, retryAfterSec: 0 });
    expect(rateLimit(key, 3, 60_000)).toEqual({ ok: true, retryAfterSec: 0 });
    expect(rateLimit(key, 3, 60_000)).toEqual({ ok: true, retryAfterSec: 0 });
  });

  it("limit aşımında ok=false ve retryAfterSec > 0", () => {
    const key = "test:over-limit";
    rateLimit(key, 2, 60_000); // 1
    rateLimit(key, 2, 60_000); // 2 (limitte)
    const res = rateLimit(key, 2, 60_000); // 3 -> reddedilmeli
    expect(res.ok).toBe(false);
    expect(res.retryAfterSec).toBeGreaterThan(0);
    expect(res.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it("retryAfterSec kalan pencere süresini yansıtır", () => {
    const key = "test:retry-after";
    rateLimit(key, 1, 10_000); // pencere açılır, resetAt = now + 10s
    vi.advanceTimersByTime(3_000); // 3sn geçti -> 7sn kaldı
    const res = rateLimit(key, 1, 10_000);
    expect(res.ok).toBe(false);
    expect(res.retryAfterSec).toBe(7);
  });

  it("pencere bitince sayaç sıfırlanır ve yeniden izin verilir", () => {
    const key = "test:window-reset";
    rateLimit(key, 1, 5_000);
    expect(rateLimit(key, 1, 5_000).ok).toBe(false); // hemen ikinci -> red
    vi.advanceTimersByTime(5_001); // pencere doldu
    expect(rateLimit(key, 1, 5_000)).toEqual({ ok: true, retryAfterSec: 0 });
  });

  it("farklı key'ler birbirinden bağımsız sayılır", () => {
    rateLimit("test:iso-a", 1, 60_000);
    expect(rateLimit("test:iso-a", 1, 60_000).ok).toBe(false);
    // farklı key hâlâ temiz
    expect(rateLimit("test:iso-b", 1, 60_000).ok).toBe(true);
  });

  it("retryAfterSec en az 1 olur (ceil, sıfıra yuvarlanmaz)", () => {
    const key = "test:min-retry";
    rateLimit(key, 1, 1_000); // resetAt = now + 1000ms
    vi.advanceTimersByTime(999); // 1ms kaldı
    const res = rateLimit(key, 1, 1_000);
    expect(res.ok).toBe(false);
    expect(res.retryAfterSec).toBe(1); // Math.max(1, ceil(1/1000)) = 1
  });
});
