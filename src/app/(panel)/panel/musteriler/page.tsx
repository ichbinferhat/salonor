import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { PanelPageHeader } from "@/components/panel/page-header";
import { CustomersTable, type CustomerRow } from "@/components/panel/customers-table";

export default async function CustomersPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.customers;

  const appointments = await db.appointment.findMany({
    where: { businessId: business.id, status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] } },
    include: { customer: { select: { id: true, name: true, image: true, email: true, phone: true } } },
    orderBy: { date: "desc" },
  });

  const map = new Map<string, CustomerRow>();
  for (const a of appointments) {
    const key = a.customer?.id ?? `walk:${a.customerName ?? "Misafir"}`;
    const existing = map.get(key);
    const name = a.customer?.name ?? a.customerName ?? t.salonCustomer;
    // "Ziyaret" yalnızca gerçekten gelinen (CONFIRMED/COMPLETED) randevuları sayar;
    // NO_SHOW (gelinmedi) ayrı bir "Gelmedi" metriğinde tutulur.
    const isVisit = a.status === "CONFIRMED" || a.status === "COMPLETED";
    if (existing) {
      if (isVisit) existing.visits += 1;
      if (a.status === "NO_SHOW") existing.noShows += 1;
      if (a.status === "COMPLETED") {
        existing.completed += 1;
        existing.totalTl += a.totalTl;
      }
      if (a.date > existing.lastDate) existing.lastDate = a.date;
    } else {
      map.set(key, {
        key,
        name,
        image: a.customer?.image ?? null,
        email: a.customer?.email ?? null,
        phone: a.customer?.phone ?? null,
        visits: isVisit ? 1 : 0,
        completed: a.status === "COMPLETED" ? 1 : 0,
        noShows: a.status === "NO_SHOW" ? 1 : 0,
        totalTl: a.status === "COMPLETED" ? a.totalTl : 0,
        lastDate: a.date,
      });
    }
  }

  const rows = [...map.values()].sort((a, b) => b.lastDate.localeCompare(a.lastDate));

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={interpolate(t.subtitle, { n: rows.length })} />
      <CustomersTable rows={rows} />
    </div>
  );
}
