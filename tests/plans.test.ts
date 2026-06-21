import { describe, it, expect } from "vitest";
import { annualTl, annualPerMonthTl, isPlanKey, PLANS } from "@/lib/plans";

describe("plans", () => {
  it("annualTl 2 ay bedava verir (aylık × 10)", () => {
    expect(annualTl(1590)).toBe(15900);
    expect(annualTl(2490)).toBe(24900);
    expect(annualTl(3490)).toBe(34900);
  });

  it("annualPerMonthTl yıllığı 12'ye böler (yuvarlanmış)", () => {
    expect(annualPerMonthTl(1590)).toBe(1325);
    expect(annualPerMonthTl(2490)).toBe(2075);
    expect(annualPerMonthTl(3490)).toBe(2908);
  });

  it("isPlanKey geçerli paket anahtarlarını doğrular", () => {
    expect(isPlanKey("baslangic")).toBe(true);
    expect(isPlanKey("profesyonel")).toBe(true);
    expect(isPlanKey("kurumsal")).toBe(true);
    expect(isPlanKey("xxx")).toBe(false);
  });

  it("PLANS fiyat/limit tutarlı", () => {
    expect(PLANS.profesyonel.monthlyTl).toBe(2490);
    expect(PLANS.profesyonel.popular).toBe(true);
    expect(PLANS.kurumsal.staff).toBe(12);
  });
});
