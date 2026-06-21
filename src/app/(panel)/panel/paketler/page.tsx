import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { getOwnerBusiness } from "@/lib/owner";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { PackageForm, ItemDeleteButton, ItemEditButton, ToggleActiveButton } from "@/components/panel/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelFinance.packages.metaTitle };
}

export default async function PackagesPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.packages;
  const business = (await getOwnerBusiness())!;
  const packages = await db.package.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />
      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">{t.addPackage}</h2>
          <PackageForm />
        </section>
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
            {t.packagesCount} ({packages.length})
          </h2>
          {packages.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-ink">{t.emptyTitle}</p>
              <p className="mt-1 text-sm text-ink-soft">{t.emptyDesc}</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {packages.map((p) => (
                <li key={p.id} className={`flex items-center gap-3 px-5 py-4 ${p.active ? "" : "opacity-60"}`}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{p.name}</p>
                    <p className="truncate text-xs text-ink-mute">
                      {interpolate(t.sessionsValidity, { sessions: p.sessions, days: p.validityDays })}
                      {p.description ? ` · ${p.description}` : ""}
                    </p>
                  </div>
                  <ToggleActiveButton kind="package" id={p.id} active={p.active} />
                  <span className="shrink-0 font-bold text-ink">{formatTl(p.priceTl)}</span>
                  <ItemEditButton
                    kind="package"
                    initial={{
                      id: p.id,
                      name: p.name,
                      description: p.description,
                      priceTl: p.priceTl,
                      sessions: p.sessions,
                      validityDays: p.validityDays,
                    }}
                  />
                  <ItemDeleteButton kind="package" id={p.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
