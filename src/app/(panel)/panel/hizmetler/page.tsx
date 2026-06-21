import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { ServicesManager } from "@/components/panel/services-manager";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelCatalog.services.title };
}

export default async function ServicesPage() {
  const business = (await getOwnerBusiness())!;

  const categories = await db.serviceCategory.findMany({
    where: { businessId: business.id },
    orderBy: { sort: "asc" },
    include: { services: { orderBy: { sort: "asc" } } },
  });

  return (
    <div className="p-5 sm:p-8">
      <ServicesManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          services: c.services.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            durationMin: s.durationMin,
            priceTl: s.priceTl,
          })),
        }))}
      />
    </div>
  );
}
