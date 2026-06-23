import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

/**
 * Cihaz push jetonunu siler (uygulamada çıkış yapılırken çağrılabilir).
 * Kötüye kullanımı (başkasının jetonunu silerek bildirimini kapatma) önlemek için
 * oturum şartı aranır ve yalnızca oturum sahibinin kendi jetonu silinir.
 *
 * Body: { token: string }
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
  if (!token) {
    return NextResponse.json({ ok: false, error: "bad_token" }, { status: 400 });
  }

  try {
    await db.deviceToken.deleteMany({
      where: { token, userId: session.userId },
    });
  } catch (e) {
    console.error("push unregister hatası:", e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
