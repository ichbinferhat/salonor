import { describe, it, expect } from "vitest";

// AUTH_SECRET key() içinde okunur — modül import edilmeden önce ayarlanmalı.
process.env.AUTH_SECRET = "test-secret-key-for-vitest-only";

import { signResetToken, readResetToken, hashFingerprint } from "@/lib/pw-reset-token";

const OLD_HASH = "$2b$12$oldoldoldoldoldoldoldoOQRSTUVWXabcdef0123456";
const NEW_HASH = "$2b$12$newnewnewnewnewnewnewnOQRSTUVWXabcdef0123456";

describe("pw-reset-token — imza ve tek-kullanımlık bağ", () => {
  it("imzalı token okunabilir ve parmak izi mevcut hash ile eşleşir", async () => {
    const token = await signResetToken("user_1", OLD_HASH);
    const claims = await readResetToken(token);
    expect(claims?.uid).toBe("user_1");
    expect(claims?.h).toBe(hashFingerprint(OLD_HASH));
  });

  it("şifre değişince (hash değişince) eski token parmak izi artık eşleşmez", async () => {
    const token = await signResetToken("user_1", OLD_HASH);
    const claims = await readResetToken(token);
    expect(claims).not.toBeNull();
    // Yeni hash'in parmak izi farklıdır → çağıran doğrulamada token reddedilir.
    expect(claims!.h).not.toBe(hashFingerprint(NEW_HASH));
  });

  it("bozuk/geçersiz token null döner (hata fırlatmaz)", async () => {
    expect(await readResetToken("bu.gecersiz.token")).toBeNull();
    expect(await readResetToken("garbage")).toBeNull();
  });

  it("yanlış anahtarla imzalanmış token reddedilir", async () => {
    const { SignJWT } = await import("jose");
    const wrongKey = new TextEncoder().encode("yanlis-anahtar-baska-secret");
    const token = await new SignJWT({ uid: "x", h: "deadbeef", p: "pwreset" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(wrongKey);
    expect(await readResetToken(token)).toBeNull();
  });

  it("yanlış amaçlı (p!=pwreset) token reddedilir", async () => {
    const { SignJWT } = await import("jose");
    const key = new TextEncoder().encode(process.env.AUTH_SECRET!);
    const token = await new SignJWT({ uid: "x", h: "deadbeef", p: "appt" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(key);
    expect(await readResetToken(token)).toBeNull();
  });
});
