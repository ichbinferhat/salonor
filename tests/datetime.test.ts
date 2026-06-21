import { describe, it, expect } from "vitest";
import { addDaysStr, weekdayOf, minToHHMM } from "@/lib/datetime";

describe("datetime", () => {
  it("addDaysStr ay/yıl sınırını doğru aşar", () => {
    expect(addDaysStr("2026-06-19", 1)).toBe("2026-06-20");
    expect(addDaysStr("2026-06-30", 1)).toBe("2026-07-01");
    expect(addDaysStr("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDaysStr("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("weekdayOf 0-6 aralığında ve döngüsel/tutarlı", () => {
    const w = weekdayOf("2026-06-19");
    expect(w).toBeGreaterThanOrEqual(0);
    expect(w).toBeLessThanOrEqual(6);
    expect(weekdayOf(addDaysStr("2026-06-19", 7))).toBe(w);
    expect(weekdayOf(addDaysStr("2026-06-19", 1))).toBe((w + 1) % 7);
  });

  it("minToHHMM dakikayı saate çevirir", () => {
    expect(minToHHMM(540)).toBe("09:00");
    expect(minToHHMM(0)).toBe("00:00");
    expect(minToHHMM(1439)).toBe("23:59");
    expect(minToHHMM(750)).toBe("12:30");
  });
});
