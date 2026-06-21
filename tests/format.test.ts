import { describe, it, expect } from "vitest";
import { formatDuration, initials, ratingLabel } from "@/lib/format";

describe("format", () => {
  it("formatDuration süreyi okunur biçime çevirir", () => {
    expect(formatDuration(30)).toBe("30 dk");
    expect(formatDuration(60)).toBe("1 sa");
    expect(formatDuration(90)).toBe("1 sa 30 dk");
    expect(formatDuration(45)).toBe("45 dk");
  });

  it("initials baş harfleri verir (en fazla 2)", () => {
    expect(initials("Ayşe Kaya")).toBe("AK");
    expect(initials("mehmet")).toBe("M");
    expect(initials("Ali Veli Deli")).toBe("AV");
  });

  it("ratingLabel puana göre etiket", () => {
    expect(ratingLabel(4.9)).toBe("Olağanüstü");
    expect(ratingLabel(4.6)).toBe("Mükemmel");
    expect(ratingLabel(3.0)).toBe("Ortalama");
  });
});
