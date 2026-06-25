import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

/**
 * Oturum devri (native → WebView). Native uygulama menüden bir panel sayfası açarken
 * WebView'i bu uca yönlendirir: ?token=<jwt>&to=/panel/raporlar. Jeton DOĞRULANIR
 * (geçersiz/forge → /giris, çerez kurulmaz), rolü OWNER/ADMIN olmalı ve hedef yalnızca
 * /panel altı olabilir. Geçerliyse salonor_session çerezi kurulup hedefe yönlenir.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  let to = url.searchParams.get("to") || "/panel";
  // Public yasal sayfalar (mobil menüdeki Gizlilik/Kullanım Şartları) oturum/çerez
  // gerektirmeden açılabilmeli. Gerisi yalnızca /panel altı olabilir; bilinmeyen hedef
  // /panel'e ezilir (open-redirect koruması).
  const PUBLIC_PATHS = ["/kvkk", "/kullanim-sartlari"];
  const isPublicTarget = PUBLIC_PATHS.includes(to);
  if (!to.startsWith("/panel") && !isPublicTarget) to = "/panel";

  // Render/proxy arkasında request.url iç adresi (localhost:10000) gösterir →
  // public host'u x-forwarded-host'tan al, yoksa istek host'una düş.
  const host = request.headers.get("x-forwarded-host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");

  // Public hedef: oturum/çerez gerekmez → doğrudan yönlen (eskiden /panel'e eziliyordu;
  // yasal sayfa linkleri kırıktı → mağaza inceleme riski).
  if (isPublicTarget) {
    return NextResponse.redirect(`${proto}://${host}${to}`);
  }

  // Jetonu doğrula + rol kontrolü. Geçersizse çerez KURMA, girişe yönlen.
  const session = await verifySessionToken(token);
  if (!session || (session.role !== "OWNER" && session.role !== "ADMIN")) {
    return NextResponse.redirect(`${proto}://${host}/giris`);
  }

  const res = NextResponse.redirect(`${proto}://${host}${to}`);
  res.cookies.set("salonor_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
