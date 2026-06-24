import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";

/**
 * Müşteri listesi — CustomersPage'in bellek-içi toplulaştırmasını yansıtır:
 * randevular müşteriye göre indirgenir (ziyaret/tamamlanan/gelmedi/ömür boyu ciro/son
 * tarih). Kayıtsız (walk-in) müşteriler `walk:<ad>` anahtarıyla gruplanır.
 */
export async function GET() {
  const business = await getOwnerBusiness();
  if (!business) return NextResponse.json({ ok: false }, { status: 401 });

  const appointments = await db.appointment.findMany({
    where: { businessId: business.id, status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] } },
    include: { customer: { select: { id: true, name: true, image: true, email: true, phone: true } } },
    orderBy: { date: "desc" },
  });

  type Row = {
    key: string; name: string; image: string | null; email: string | null; phone: string | null;
    visits: number; completed: number; noShows: number; totalTl: number; lastDate: string;
  };
  const map = new Map<string, Row>();
  for (const a of appointments) {
    const key = a.customer?.id ?? `walk:${a.customerName ?? "Misafir"}`;
    const name = a.customer?.name ?? a.customerName ?? "Müşteri";
    const isVisit = a.status === "CONFIRMED" || a.status === "COMPLETED";
    const ex = map.get(key);
    if (ex) {
      if (isVisit) ex.visits += 1;
      if (a.status === "NO_SHOW") ex.noShows += 1;
      if (a.status === "COMPLETED") { ex.completed += 1; ex.totalTl += a.totalTl; }
      if (a.date > ex.lastDate) ex.lastDate = a.date;
    } else {
      map.set(key, {
        key, name,
        image: a.customer?.image ?? null,
        email: a.customer?.email ?? null,
        phone: a.customer?.phone ?? a.customerPhone ?? null,
        visits: isVisit ? 1 : 0,
        completed: a.status === "COMPLETED" ? 1 : 0,
        noShows: a.status === "NO_SHOW" ? 1 : 0,
        totalTl: a.status === "COMPLETED" ? a.totalTl : 0,
        lastDate: a.date,
      });
    }
  }

  const rows = [...map.values()].sort((x, y) => y.lastDate.localeCompare(x.lastDate));
  return NextResponse.json({ ok: true, rows });
}
