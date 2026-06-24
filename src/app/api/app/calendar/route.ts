import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, weekdayOf } from "@/lib/datetime";

/**
 * Gün görünümü takvim verisi (?gun=YYYY-MM-DD, varsayılan bugün). CalendarPage'in
 * sorgularını yansıtır: aktif personel, o günün çalışma saati, günün randevuları
 * (CANCELLED hariç) + hizmet/personel detayı, hizmet kategorileri (walk-in seçimi
 * için). Görünür aralık (dayStart/dayEnd, 30dk hizalı) + closed bayrağı hesaplanır.
 */
export async function GET(request: Request) {
  const business = await getOwnerBusiness();
  if (!business) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(request.url);
  const gun = url.searchParams.get("gun");
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const date = gun && dateRe.test(gun) ? gun : todayStr();
  const weekday = weekdayOf(date);

  const [staff, hours, appointments, serviceCategories] = await Promise.all([
    db.staff.findMany({ where: { businessId: business.id, active: true }, orderBy: { name: "asc" } }),
    db.workingHour.findUnique({ where: { businessId_weekday: { businessId: business.id, weekday } } }),
    db.appointment.findMany({
      where: { businessId: business.id, date, status: { not: "CANCELLED" } },
      include: { items: { select: { name: true } }, customer: { select: { name: true } } },
      orderBy: { startMin: "asc" },
    }),
    db.serviceCategory.findMany({
      where: { businessId: business.id },
      orderBy: { sort: "asc" },
      include: { services: { orderBy: { sort: "asc" } } },
    }),
  ]);

  let dayStart = hours && !hours.closed ? hours.openMin : 540;
  let dayEnd = hours && !hours.closed ? hours.closeMin : 1200;
  for (const a of appointments) {
    dayStart = Math.min(dayStart, a.startMin);
    dayEnd = Math.max(dayEnd, a.endMin);
  }
  dayStart = Math.floor(dayStart / 30) * 30;
  dayEnd = Math.ceil(dayEnd / 30) * 30;

  return NextResponse.json({
    ok: true,
    date,
    dayStart,
    dayEnd,
    closed: !hours || hours.closed,
    staff: staff.map((s) => ({ id: s.id, name: s.name, image: s.image, title: s.title })),
    appointments: appointments.map((a) => ({
      id: a.id,
      staffId: a.staffId,
      startMin: a.startMin,
      endMin: a.endMin,
      status: a.status,
      customerLabel: a.customer?.name ?? a.customerName ?? "Müşteri",
      services: a.items.map((i) => i.name).join(", "),
      totalTl: a.totalTl,
      code: a.code,
      note: a.note,
    })),
    serviceCategories: serviceCategories.map((sc) => ({
      name: sc.name,
      services: sc.services.map((s) => ({ id: s.id, name: s.name, durationMin: s.durationMin, priceTl: s.priceTl })),
    })),
  });
}
