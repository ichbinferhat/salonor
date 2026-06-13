import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, weekdayOf } from "@/lib/datetime";
import { CalendarBoard } from "@/components/panel/calendar-board";

export default async function CalendarPage(props: {
  searchParams: Promise<{ gun?: string }>;
}) {
  const business = (await getOwnerBusiness())!;
  const { gun } = await props.searchParams;

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const date = gun && dateRe.test(gun) ? gun : todayStr();
  const weekday = weekdayOf(date);

  const [staff, hours, appointments, serviceCategories] = await Promise.all([
    db.staff.findMany({
      where: { businessId: business.id, active: true },
      orderBy: { name: "asc" },
    }),
    db.workingHour.findUnique({
      where: { businessId_weekday: { businessId: business.id, weekday } },
    }),
    db.appointment.findMany({
      where: { businessId: business.id, date, status: { not: "CANCELLED" } },
      include: {
        items: { select: { name: true } },
        customer: { select: { name: true } },
      },
      orderBy: { startMin: "asc" },
    }),
    db.serviceCategory.findMany({
      where: { businessId: business.id },
      orderBy: { sort: "asc" },
      include: { services: { orderBy: { sort: "asc" } } },
    }),
  ]);

  // Görünür zaman aralığı: çalışma saatleri + (varsa) randevuların kapsadığı aralık
  let dayStart = hours && !hours.closed ? hours.openMin : 540;
  let dayEnd = hours && !hours.closed ? hours.closeMin : 1200;
  for (const a of appointments) {
    dayStart = Math.min(dayStart, a.startMin);
    dayEnd = Math.max(dayEnd, a.endMin);
  }
  // 30 dk'lık satırlara hizala
  dayStart = Math.floor(dayStart / 30) * 30;
  dayEnd = Math.ceil(dayEnd / 30) * 30;

  return (
    <div className="p-5 sm:p-8">
      <CalendarBoard
        date={date}
        today={todayStr()}
        dayStart={dayStart}
        dayEnd={dayEnd}
        closed={!hours || hours.closed}
        staff={staff.map((s) => ({ id: s.id, name: s.name, image: s.image, title: s.title }))}
        appointments={appointments.map((a) => ({
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
        }))}
        serviceCategories={serviceCategories.map((sc) => ({
          name: sc.name,
          services: sc.services.map((s) => ({
            id: s.id,
            name: s.name,
            durationMin: s.durationMin,
            priceTl: s.priceTl,
          })),
        }))}
      />
    </div>
  );
}
