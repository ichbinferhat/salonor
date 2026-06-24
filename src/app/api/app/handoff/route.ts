import { NextResponse } from "next/server";

/**
 * Oturum devri (native → WebView). Native uygulama menüden bir panel sayfası açarken
 * WebView'i bu uca yönlendirir: ?token=<jwt>&to=/panel/raporlar. Burada salonor_session
 * çerezi kurulur (WebView yönlendirme yanıtını alıp çerezi saklar) ve hedef sayfaya
 * yönlenir → sayfa oturum açık halde yüklenir. Geçersiz jeton sonraki istekte panel
 * tarafından /giris'e düşer (forge edilemez — AUTH_SECRET olmadan imzalanamaz).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  let to = url.searchParams.get("to") || "/panel";
  // Açık yönlendirme (open-redirect) koruması: yalnızca site-içi yollar.
  if (!to.startsWith("/") || to.startsWith("//")) to = "/panel";

  // Render/proxy arkasında request.url iç adresi (localhost:10000) gösterir →
  // public host'u x-forwarded-host'tan al, yoksa istek host'una düş.
  const host = request.headers.get("x-forwarded-host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const res = NextResponse.redirect(`${proto}://${host}${to}`);
  if (token) {
    res.cookies.set("salonor_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
