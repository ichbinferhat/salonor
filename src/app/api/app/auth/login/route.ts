import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { clientIpFromHeaders } from "@/lib/client-ip";

/**
 * Native uygulama girişi. loginAction (server action) mantığını yansıtır ama
 * yönlendirme/çerez yerine JSON döner: { ok, token, user }. Ayrıca aynı oturum
 * çerezini (salonor_session) de kurar → WebView sekmeleri (sharedCookies) de
 * tek çağrıyla yetkilenir (çift-yetki). Native, token'ı SecureStore'da saklar ve
 * sonraki /api/app/* çağrılarında `Cookie: salonor_session=<token>` olarak gönderir.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  // Gerçek istemci IP'si: spoof'lanabilir sol-uç XFF / x-real-ip yerine güvenilen
  // son proxy hop'u (lib/client-ip ile tüm kod tabanı tek mantığı paylaşır).
  const ip = clientIpFromHeaders(request.headers);
  if (!rateLimit(`applogin:${ip}`, 10, 10 * 60 * 1000).ok) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const email = String((body as { email?: unknown })?.email ?? "").trim().toLowerCase();
  const password = String((body as { password?: unknown })?.password ?? "");

  if (!EMAIL_RE.test(email) || password.length < 6) {
    return NextResponse.json({ ok: false, error: "E-posta veya şifre hatalı." }, { status: 400 });
  }

  // IP başlığı sahtelenebildiğinden e-posta hedefli ikinci sayaç: tek hesaba karşı
  // IP rotasyonlu brute-force'u da sınırlar.
  if (!rateLimit(`apploginem:${email}`, 10, 10 * 60 * 1000).ok) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ ok: false, error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const token = await createSession({ userId: user.id, role: user.role, name: user.name });
  return NextResponse.json({
    ok: true,
    token,
    user: { id: user.id, name: user.name, role: user.role, email: user.email },
  });
}
