import { NextResponse } from "next/server";

/**
 * Native çıkışta WebView'in paylaşılan salonor_session çerezini temizler. Native
 * uygulama çıkış yapınca gizli bir WebView bu ucu yükler → çerez sıfırlanır, böylece
 * aynı cihazda misafir taraması eski sahip oturumunu DEVRALMAZ (paylaşılan-cihaz gizliliği).
 */
export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("salonor_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
