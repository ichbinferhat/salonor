import { db } from "@/lib/db";
import { getSession, type Session, type SessionRole } from "@/lib/session";

/**
 * Oturumu VERİTABANIYLA doğrular: kullanıcı hâlâ var mı ve yetkili rol JWT'den
 * değil DB'deki GÜNCEL rolden mi okunuyor? Böylece "stale-role" kapanır — bir admin
 * birinin rolünü düşürdüğünde, kurban 30 günlük JWT süresi boyunca değil, BİR SONRAKİ
 * istekte erişimini kaybeder.
 *
 * Yalnızca DÜŞÜK TRAFİKLİ, ayrıcalıklı yüzeylerde kullanılır (admin/panel layout,
 * /api/app/me) — her istekte değil; ek tek bir `user` sorgusunun maliyeti burada önemsiz.
 *
 * DB geçici erişilemezse kullanıcıyı kilitlemek yerine JWT oturumuna düşülür
 * (kullanılabilirlik önceliği; stale-role yalnızca o kısa pencerede geçerli kalır).
 */
export async function getDbVerifiedSession(): Promise<Session | null> {
  const session = await getSession();
  if (!session) return null;
  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { role: true, name: true },
    });
    if (!user) return null; // kullanıcı silinmiş → erişim yok
    return { userId: session.userId, role: user.role as SessionRole, name: user.name };
  } catch {
    return session;
  }
}
