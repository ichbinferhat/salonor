import { SignJWT, jwtVerify } from "jose";

/**
 * Randevu eylem token'ı (tek-tık "Geliyorum / İptal" linki için).
 * Giriş gerektirmeden, yalnızca bu randevuyu hedefleyen imzalı kısa-ömürlü bir JWT.
 * AUTH_SECRET ile HS256 imzalanır; oturum token'ından `p:"appt"` amacıyla ayrışır.
 */
function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET tanımlı değil — randevu token'ı üretilemez.");
  return new TextEncoder().encode(secret);
}

export async function signApptToken(appointmentId: string): Promise<string> {
  return new SignJWT({ aid: appointmentId, p: "appt" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

/** Token geçerliyse randevu id'sini, değilse null döner. */
export async function verifyApptToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (payload.p !== "appt" || typeof payload.aid !== "string") return null;
    return payload.aid;
  } catch {
    return null;
  }
}
