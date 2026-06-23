import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth";

describe("auth — hashPassword / verifyPassword", () => {
  it("doğru şifre round-trip ile doğrulanır", async () => {
    const hash = await hashPassword("Sifre123!");
    expect(await verifyPassword("Sifre123!", hash)).toBe(true);
  });

  it("yanlış şifre reddedilir", async () => {
    const hash = await hashPassword("Sifre123!");
    expect(await verifyPassword("yanlis", hash)).toBe(false);
    expect(await verifyPassword("Sifre123", hash)).toBe(false); // bir karakter eksik
    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("hash bcrypt formatında ve düz metni içermez", async () => {
    const hash = await hashPassword("gizli-parola");
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // bcrypt prefix
    expect(hash).not.toContain("gizli-parola");
    expect(hash.length).toBeGreaterThan(50);
  });

  it("maliyet faktörü 12 olarak kodlanır", async () => {
    const hash = await hashPassword("x");
    // $2b$12$... -> ikinci alan maliyet
    expect(hash.split("$")[2]).toBe("12");
  });

  it("aynı şifre her seferinde farklı hash üretir (salt)", async () => {
    const a = await hashPassword("ayniSifre");
    const b = await hashPassword("ayniSifre");
    expect(a).not.toBe(b);
    // farklı hash'ler olsa da ikisi de doğrulanmalı
    expect(await verifyPassword("ayniSifre", a)).toBe(true);
    expect(await verifyPassword("ayniSifre", b)).toBe(true);
  });

  it("unicode/Türkçe karakterli şifre korunur", async () => {
    const hash = await hashPassword("şifreÇĞİöü");
    expect(await verifyPassword("şifreÇĞİöü", hash)).toBe(true);
    expect(await verifyPassword("sifreCGIou", hash)).toBe(false);
  });
});
