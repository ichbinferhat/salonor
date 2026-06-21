import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/** /panel, /hesap ve /admin rotalarını oturum/rol kontrolüyle korur (Next 16 proxy). */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("salonor_session")?.value;

  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.AUTH_SECRET!),
        { algorithms: ["HS256"] } // yalnızca HS256 — algoritma karışıklığına karşı
      );
      role = (payload.role as string) ?? null;
    } catch {
      role = null;
    }
  }

  if (!role) {
    const url = new URL("/giris", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/panel") && role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/hesap/:path*", "/admin/:path*"],
};
