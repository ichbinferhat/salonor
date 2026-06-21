import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { StaffManager } from "@/components/panel/staff-manager";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelCatalog.staff.title };
}

export default async function StaffPage() {
  const business = (await getOwnerBusiness())!;

  const [staff, categories] = await Promise.all([
    db.staff.findMany({
      where: { businessId: business.id },
      orderBy: [{ active: "desc" }, { name: "asc" }],
      include: {
        _count: { select: { appointments: true, services: true } },
        services: { select: { serviceId: true } },
      },
    }),
    db.serviceCategory.findMany({
      where: { businessId: business.id },
      orderBy: { sort: "asc" },
      include: { services: { orderBy: { sort: "asc" }, select: { id: true, name: true } } },
    }),
  ]);

  // Hizmetleri bölümlere göre gruplu ver (boş bölümleri ele); StaffManager hizmet
  // seçicisinde personelin yapabileceği hizmetleri işaretlemek için kullanır.
  const serviceGroups = categories
    .filter((c) => c.services.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      services: c.services.map((s) => ({ id: s.id, name: s.name })),
    }));

  return (
    <div className="p-5 sm:p-8">
      <StaffManager
        serviceGroups={serviceGroups}
        staff={staff.map((s) => ({
          id: s.id,
          name: s.name,
          title: s.title,
          image: s.image,
          active: s.active,
          appointmentCount: s._count.appointments,
          serviceCount: s._count.services,
          serviceIds: s.services.map((ss) => ss.serviceId),
        }))}
      />
    </div>
  );
}
