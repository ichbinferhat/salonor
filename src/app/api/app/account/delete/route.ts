import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { verifyPassword } from "@/lib/auth";

/**
 * Hesap silme (App Store 5.1.1(v) + Google Play şartı). Native uygulamadan çağrılır.
 * İşletme sahibi (OWNER) hesabını silerse User cascade ile İşletmeyi ve tüm verisini
 * (randevular, personel vb.) kaldırır — bu yüzden native tarafta güçlü uyarı + şifre
 * onayı gösterilir. Yetki: salonor_session (cookie/Bearer).
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const password = String((body as { password?: unknown })?.password ?? "");

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ ok: true }); // zaten yok
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { ok: false, error: "Şifre hatalı. Hesabınız silinmedi." },
      { status: 400 }
    );
  }

  // User silinince Business (owner cascade) + bağlı tüm veri silinir.
  await db.user.delete({ where: { id: session.userId } });
  return NextResponse.json({ ok: true });
}
