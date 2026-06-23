import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

/**
 * Mobil uygulama (Expo) cihaz push jetonunu kaydeder.
 *
 * Kimlik doğrulama, WebView'in zaten taşıdığı `salonor_session` çerezi üzerinden
 * yapılır (getSession) — ayrı bir token/anahtar gerekmez. Uygulama, kullanıcı giriş
 * yaptıktan ve bildirim izni alındıktan sonra bu uca POST eder.
 *
 * Body: { token: string ("ExponentPushToken[...]"), platform: "ios" | "android" }
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const token = String((body as { token?: unknown })?.token ?? "").trim();
  const platformRaw = String(
    (body as { platform?: unknown })?.platform ?? "unknown"
  ).toLowerCase();
  const platform =
    platformRaw === "ios" || platformRaw === "android" ? platformRaw : "unknown";

  const looksValid =
    token.startsWith("ExponentPushToken[") ||
    token.startsWith("ExpoPushToken[");
  if (!looksValid) {
    return NextResponse.json({ ok: false, error: "bad_token" }, { status: 400 });
  }

  try {
    await db.deviceToken.upsert({
      where: { token },
      create: { token, platform, userId: session.userId },
      update: { userId: session.userId, platform },
    });
  } catch (e) {
    console.error("push register hatası:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
