import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { cache } from "react";

const COOKIE_NAME = "salonor_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

export type SessionRole = "CUSTOMER" | "OWNER" | "ADMIN";
export type Session = { userId: string; role: SessionRole; name: string };

function secretKey() {
  return new TextEncoder().encode(process.env.AUTH_SECRET!);
}

export async function createSession(session: Session) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      userId: payload.userId as string,
      role: payload.role as SessionRole,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
});
