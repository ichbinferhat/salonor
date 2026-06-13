import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { PanelPageHeader } from "@/components/panel/page-header";
import { BusinessProfileForm } from "@/components/panel/business-profile-form";
import { HoursEditor } from "@/components/panel/hours-editor";
import { CoverPicker } from "@/components/panel/cover-picker";

export default async function SettingsPage() {
  const business = (await getOwnerBusiness())!;
  const hours = await db.workingHour.findMany({
    where: { businessId: business.id },
    orderBy: { weekday: "asc" },
  });

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title="Ayarlar"
        subtitle="İşletme profilini ve çalışma saatlerini yönet"
        action={
          <Link
            href={`/salon/${business.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep hover:underline"
          >
            <ExternalLink className="size-4" /> Yayındaki sayfam
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">İşletme bilgileri</h2>
          <BusinessProfileForm
            defaults={{
              name: business.name,
              description: business.description,
              phone: business.phone,
              address: business.address,
              district: business.district,
              city: business.city,
            }}
          />
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">Çalışma saatleri</h2>
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
        <h2 className="mb-1 font-display text-lg font-bold text-ink">Kapak fotoğrafı</h2>
        <p className="mb-5 text-sm text-ink-soft">
          Salon sayfanın üst görselini seç. (Demo için hazır görsel seti)
        </p>
        <CoverPicker current={business.coverImage} />
      </section>
    </div>
  );
}
