import { SignJWT, jwtVerify } from "jose";
import { createHash } from "node:crypto";

/**
 * Şifre sıfırlama token'ı (giriş gerekmeden, e-posta linkiyle).
 *
 * AUTH_SECRET ile HS256 imzalı, 1 saat ömürlü bir JWT. Token, kullanıcının O ANKİ
 * passwordHash'inin parmak izine (`h`) bağlıdır: şifre değişince parmak izi de
 * değişeceğinden eski/ kullanılmış token OTOMATİK geçersiz olur (tek-kullanımlık).
 * Böylece ayrı bir DB tablosu/migration gerekmez. Oturum token'ından `p:"pwreset"`
 * amacıyla ayrışır.
 */
function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil — sıfırlama token'ı üretilemez.");
  return new TextEncoder().encode(secret);
}

/** passwordHash'ten kısa, geri-döndürülemez parmak izi (sha256'nın ilk 16 hex'i). */
export function hashFingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}

export async function signResetToken(userId: string, passwordHash: string): Promise<string> {
  return new SignJWT({ uid: userId, h: hashFingerprint(passwordHash), p: "pwreset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key());
}

/**
 * İmza + yapı geçerliyse token iddialarını döner; değilse null.
 * NOT: Parmak izinin (`h`) kullanıcının GÜNCEL passwordHash'iyle eşleştiği,
 * çağıran tarafça `hashFingerprint(user.passwordHash)` ile doğrulanmalıdır.
 */
export async function readResetToken(token: string): Promise<{ uid: string; h: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (payload.p !== "pwreset" || typeof payload.uid !== "string" || typeof payload.h !== "string")
      return null;
    return { uid: payload.uid, h: payload.h };
  } catch {
    return null;
  }
}
