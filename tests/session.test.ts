import { describe, it, expect, vi, beforeEach } from "vitest";

// AUTH_SECRET secretKey() içinde okunur — modül import edilmeden önce ayarlanmalı.
process.env.AUTH_SECRET = "test-secret-key-for-vitest-only";

// react cache(): test ortamında kimlik (pass-through) olarak mock'lanır.
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return { ...actual, cache: <T>(fn: T) => fn };
});

// next/headers cookies(): bellek içi basit cookie deposu.
type CookieRec = { name: string; value: string };
const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string): CookieRec | undefined =>
      cookieStore.has(name) ? { name, value: cookieStore.get(name)! } : undefined,
    set: (name: string, value: string) => cookieStore.set(name, value),
    delete: (name: string) => cookieStore.delete(name),
  }),
  // getSession artık native Bearer için headers() de okur (session.ts); testte
  // Authorization yok → cookie yoluna düşer.
  headers: async () => ({
    get: (_name: string): string | null => null,
  }),
}));

import { createSession, getSession, destroySession } from "@/lib/session";

describe("session — JWT round-trip ve doğrulama", () => {
  beforeEach(() => {
    cookieStore.clear();
  });

  it("createSession sonrası getSession aynı payload'u döner", async () => {
    await createSession({ userId: "u1", role: "OWNER", name: "Ferhat" });
    const s = await getSession();
    expect(s).toEqual({ userId: "u1", role: "OWNER", name: "Ferhat" });
  });

  it("oturum çerezi yoksa null döner", async () => {
    expect(await getSession()).toBeNull();
  });

  it("destroySession sonrası getSession null döner", async () => {
    await createSession({ userId: "u1", role: "CUSTOMER", name: "Müşteri" });
    expect(await getSession()).not.toBeNull();
    await destroySession();
    expect(await getSession()).toBeNull();
  });

  it("bozuk/geçersiz token reddedilir (null döner, hata fırlatmaz)", async () => {
    cookieStore.set("salonor_session", "bu.gecersiz.token");
    expect(await getSession()).toBeNull();
  });

  it("yanlış imza ile üretilmiş token reddedilir", async () => {
    const { SignJWT } = await import("jose");
    const wrongKey = new TextEncoder().encode("yanlis-anahtar-baska-secret");
    const token = await new SignJWT({ userId: "x", role: "ADMIN", name: "Sahte" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(wrongKey);
    cookieStore.set("salonor_session", token);
    expect(await getSession()).toBeNull();
  });

  it("süresi dolmuş token reddedilir", async () => {
    const { SignJWT } = await import("jose");
    const key = new TextEncoder().encode(process.env.AUTH_SECRET!);
    const token = await new SignJWT({ userId: "x", role: "CUSTOMER", name: "Eski" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600) // 1 saat önce dolmuş
      .sign(key);
    cookieStore.set("salonor_session", token);
    expect(await getSession()).toBeNull();
  });

  it("alg=none ile imzalanmamış token reddedilir (algoritma pin'i)", async () => {
    // Header.payload.<bos imza> — alg:none denemesi
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({ userId: "x", role: "ADMIN", name: "Saldırgan" })
    ).toString("base64url");
    cookieStore.set("salonor_session", `${header}.${payload}.`);
    expect(await getSession()).toBeNull();
  });
});
