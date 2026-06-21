import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { PanelPageHeader } from "@/components/panel/page-header";
import { BusinessProfileForm } from "@/components/panel/business-profile-form";
import { HoursEditor } from "@/components/panel/hours-editor";
import { CoverPicker } from "@/components/panel/cover-picker";

export default async function SettingsPage() {
  const dict = await getDictionary();
  const t = dict.panelCatalog.settings;
  const business = (await getOwnerBusiness())!;
  const hours = await db.workingHour.findMany({
    where: { businessId: business.id },
    orderBy: { weekday: "asc" },
  });

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={t.subtitle}
        action={
          <Link
            href={`/salon/${business.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep hover:underline"
          >
            <ExternalLink className="size-4" /> {t.publicPage}
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.businessInfo}</h2>
          <BusinessProfileForm
            defaults={{
              name: business.name,
              description: business.description,
              phone: business.phone,
              whatsappPhone: business.whatsappPhone ?? "",
              address: business.address,
              district: business.district,
              city: business.city,
              lat: business.lat,
              lng: business.lng,
              googlePlaceId: business.googlePlaceId ?? "",
              promoText: business.promoText ?? "",
              promoUntil: business.promoUntil ?? "",
            }}
          />
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.workingHours}</h2>
          <HoursEditor
            initial={hours.map((h) => ({
              weekday: h.weekday,
              openMin: h.openMin,
              closeMin: h.closeMin,
              closed: h.closed,
            }))}
          />
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="mb-1 font-display text-lg font-bold text-ink">{t.coverTitle}</h2>
        <p className="mb-5 text-sm text-ink-soft">{t.coverDesc}</p>
        <CoverPicker current={business.coverImage} />
      </section>
    </div>
  );
}
