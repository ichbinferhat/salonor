import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("Türkçe karakterleri çevirir ve kebab-case yapar", () => {
    expect(slugify("Güzellik Salonu")).toBe("guzellik-salonu");
    expect(slugify("Ayşe'nin Yeri")).toBe("ayse-nin-yeri");
    expect(slugify("  Çift   Boşluk  ")).toBe("cift-bosluk");
    expect(slugify("İstanbul Kuaför")).toBe("istanbul-kuafor");
  });
});
