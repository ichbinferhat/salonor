import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, addDaysStr, nowMinutes } from "@/lib/datetime";

/**
 * Gün Özeti (Dashboard) verisi — DashboardPage'in 4 paralel sorgusunu tek JSON'da
 * toplar. Yetki: salonor_session çerezi (getOwnerBusiness). Ham sayılar döner;
 * biçimlendirme native tarafta yapılır.
 */
export async function GET() {
  const business = await getOwnerBusiness();
  if (!business) return NextResponse.json({ ok: false }, { status: 401 });

  const today = todayStr();
  const weekAgo = addDaysStr(today, -6);

  const [todayAppts, weekAppts, upcoming, staffCount] = await Promise.all([
    db.appointment.findMany({
      where: { businessId: business.id, date: today, status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] } },
      include: { staff: { select: { name: true, image: true } }, items: { select: { name: true } } },
      orderBy: { startMin: "asc" },
    }),
    db.appointment.findMany({
      where: { businessId: business.id, date: { gte: weekAgo, lte: today }, status: { in: ["CONFIRMED", "COMPLETED"] } },
      select: { date: true, totalTl: true },
    }),
    db.appointment.count({ where: { businessId: business.id, date: { gte: today }, status: "CONFIRMED" } }),
    db.staff.count({ where: { businessId: business.id, active: true } }),
  ]);

  const todayRevenue = todayAppts.filter((a) => a.status !== "NO_SHOW").reduce((s, a) => s + a.totalTl, 0);
  const weekRevenue = weekAppts.reduce((s, a) => s + a.totalTl, 0);

  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = addDaysStr(weekAgo, i);
    const total = weekAppts.filter((a) => a.date === date).reduce((s, a) => s + a.totalTl, 0);
    return { date, total };
  });

  const now = nowMinutes();
  const nextUp = todayAppts.filter((a) => a.startMin >= now && a.status === "CONFIRMED");

  return NextResponse.json({
    ok: true,
    today,
    business: { name: business.name, ratingAvg: business.ratingAvg, ratingCount: business.ratingCount },
    stats: {
      todayCount: todayAppts.length,
      todayRevenue,
      weekRevenue,
      upcoming,
      staffCount,
      nextStartMin: nextUp.length ? nextUp[0].startMin : null,
    },
    daily,
    schedule: todayAppts.map((a) => ({
      id: a.id,
      startMin: a.startMin,
      endMin: a.endMin,
      status: a.status,
      staffName: a.staff.name,
      staffImage: a.staff.image,
      services: a.items.map((i) => i.name).join(" + "),
      totalTl: a.totalTl,
    })),
  });
}
