import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { cache } from "react";

const COOKIE_NAME = "salonor_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

export type SessionRole = "CUSTOMER" | "OWNER" | "ADMIN";
export type Session = { userId: string; role: SessionRole; name: string };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  // Fail-fast: tanımsızsa sessizce "undefined" string'iyle (zayıf, tahmin edilebilir
  // anahtar) imzalama/doğrulama yapmak yerine açık hata ver.
  if (!secret) {
    throw new Error(
      "AUTH_SECRET ortam değişkeni tanımlı değil — oturum imzalama/doğrulama yapılamaz."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Oturum JWT'sini imzalar (cookie + native Bearer/Cookie aynı imzayı paylaşsın). */
export async function signSession(session: Session): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

/** Oturumu kurar: JWT'yi imzalar, httpOnly çerez olarak yazar ve jetonu döner. */
export async function createSession(session: Session): Promise<string> {
  const token = await signSession(session);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return token;
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    // algorithms pin: yalnızca HS256 kabul et (algoritma karışıklığı/"alg" değişim
    // saldırılarına karşı savunma-derinliği).
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return {
      userId: payload.userId as string,
      role: payload.role as SessionRole,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
});
