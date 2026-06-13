import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { StaffManager } from "@/components/panel/staff-manager";

export default async function StaffPage() {
  const business = (await getOwnerBusiness())!;

  const staff = await db.staff.findMany({
    where: { businessId: business.id },
    orderBy: [{ active: "desc" }, { name: "asc" }],
    include: {
      _count: { select: { appointments: true, services: true } },
    },
  });

  return (
    <div className="p-5 sm:p-8">
      <StaffManager
        staff={staff.map((s) => ({
          id: s.id,
          name: s.name,
          title: s.title,
          image: s.image,
          active: s.active,
          appointmentCount: s._count.appointments,
          serviceCount: s._count.services,
        }))}
      />
    </div>
  );
}
