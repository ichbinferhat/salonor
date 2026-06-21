import { describe, it, expect } from "vitest";
import { normalizePhone, isValidTrMobile, formatPhoneTr } from "@/lib/phone";

describe("phone", () => {
  it("normalizePhone baştaki 0/90'ı ve rakam dışını temizler (son 10 hane)", () => {
    expect(normalizePhone("0532 123 45 67")).toBe("5321234567");
    expect(normalizePhone("+90 532 123 45 67")).toBe("5321234567");
    expect(normalizePhone("905321234567")).toBe("5321234567");
    expect(normalizePhone("5321234567")).toBe("5321234567");
  });

  it("isValidTrMobile: 5 ile başlayan 10 hane şartı", () => {
    expect(isValidTrMobile("0532 123 45 67")).toBe(true);
    expect(isValidTrMobile("532 123 45 67")).toBe(true);
    expect(isValidTrMobile("0212 123 45 67")).toBe(false); // sabit hat
    expect(isValidTrMobile("123")).toBe(false);
    expect(isValidTrMobile("")).toBe(false);
  });

  it("formatPhoneTr geçerliyi biçimler", () => {
    expect(formatPhoneTr("5321234567")).toBe("0532 123 45 67");
  });
});
