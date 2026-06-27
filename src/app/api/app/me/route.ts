import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signSession } from "@/lib/session";
import { getDbVerifiedSession } from "@/lib/auth-guard";
import { getOwnerBusiness } from "@/lib/owner";

/**
 * Oturum/me probe. Native açılışta çağrılır → rolü + işletmeyi + okunmamış bildirim
 * sayısını döner (cold-start'ta rol tahminini ortadan kaldırır). Yetki, isteğin
 * taşıdığı salonor_session çerezinden (getSession) gelir.
 */
export async function GET() {
  // Rolü DB'den doğrula → kayan jeton taze rol taşır (native'de stale-role kapanır).
  const session = await getDbVerifiedSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const business = session.role === "OWNER" ? await getOwnerBusiness() : null;
  let unseen = 0;
  if (business) {
    try {
      unseen = await db.appointment.count({
        where: { businessId: business.id, seenAt: null, status: "CONFIRMED" },
      });
    } catch {
      /* sayım başarısızsa rozet 0 kalsın — kritik değil */
    }
  }

  // Kayan oturum: her /me çağrısında taze 30 günlük jeton dön → aktif kullanıcı
  // aylık zorla çıkış yaşamaz (native bunu saklar).
  const token = await signSession(session);

  return NextResponse.json({
    ok: true,
    token,
    user: { id: session.userId, name: session.name, role: session.role },
    business: business
      ? { id: business.id, name: business.name, slug: business.slug, coverImage: business.coverImage }
      : null,
    unseen,
  });
}
