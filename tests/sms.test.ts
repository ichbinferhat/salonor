import { describe, it, expect } from "vitest";
import { smsCreditCost } from "@/lib/sms";

describe("smsCreditCost", () => {
  it("ASCII metinde 160 karakter = 1 kontör", () => {
    expect(smsCreditCost("merhaba")).toBe(1);
    expect(smsCreditCost("a".repeat(160))).toBe(1);
    expect(smsCreditCost("a".repeat(161))).toBe(2);
  });

  it("Türkçe karakter varsa 70'lik blok", () => {
    expect(smsCreditCost("ş")).toBe(1);
    expect(smsCreditCost("ş" + "a".repeat(70))).toBe(2); // 71 karakter
    expect(smsCreditCost("İ" + "a".repeat(140))).toBe(3); // 141 karakter
  });
});
