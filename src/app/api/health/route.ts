import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Hafif sağlık kontrolü ucu. Veritabanına basit bir sorgu atar; başarılıysa 200,
 * DB erişilemiyorsa 503 döner. UptimeRobot/Better Uptime gibi harici izleme
 * servisleri bu ucu yoklayarak canlı kesintilerini yakalayabilir.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up", ts: new Date().toISOString() });
  } catch (e) {
    console.error("health check DB hatası:", e);
    return NextResponse.json({ ok: false, db: "down" }, { status: 503 });
  }
}
