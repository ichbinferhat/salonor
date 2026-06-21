import type { Metadata } from "next";
import { TrendingUp, Coins } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, addDaysStr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { CommissionRow } from "@/components/panel/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelFinance.commission.metaTitle };
}

export default async function CommissionPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.commission;
  const business = (await getOwnerBusiness())!;
  const today = todayStr();
  const from = addDaysStr(today, -29);

  const [staff, appts] = await Promise.all([
    db.staff.findMany({ where: { businessId: business.id, active: true }, orderBy: { name: "asc" } }),
    db.appointment.findMany({
      where: {
        businessId: business.id,
        date: { gte: from, lte: today },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: { staffId: true, totalTl: true },
    }),
  ]);

  const agg = new Map<string, { count: number; revenue: number }>();
  for (const a of appts) {
    const c = agg.get(a.staffId) ?? { count: 0, revenue: 0 };
    c.count += 1;
    c.revenue += a.totalTl;
    agg.set(a.staffId, c);
  }

  const rows = staff.map((s) => {
    const a = agg.get(s.id) ?? { count: 0, revenue: 0 };
    return { id: s.id, name: s.name, image: s.image, pct: s.commissionPct, count: a.count, revenue: a.revenue };
  });

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCommission = rows.reduce((s, r) => s + Math.round((r.revenue * r.pct) / 100), 0);

  const stats = [
    { label: t.revenue30d, value: formatTl(totalRevenue), icon: TrendingUp, tone: "bg-mint-soft text-mint" },
    { label: t.commissionDue, value: formatTl(totalCommission), icon: Coins, tone: "bg-accent-soft text-accent-deep" },
  ];

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 lg:max-w-lg">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className={`inline-flex size-10 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-ink">{t.emptyTitle}</p>
            <p className="mt-1 text-sm text-ink-soft">{t.emptyDesc}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line bg-cream/50 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3 text-left font-bold">{t.colStaff}</th>
                  <th className="px-5 py-3 text-center font-bold">{t.colAppointment}</th>
                  <th className="px-5 py-3 text-right font-bold">{t.colRevenue30d}</th>
                  <th className="px-5 py-3 text-center font-bold">{t.colCommissionPct}</th>
                  <th className="px-5 py-3 text-right font-bold">{t.colCommissionAmount}</th>
                  <th className="px-5 py-3 text-right font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <CommissionRow key={r.id} {...r} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="mt-3 text-xs text-ink-mute">
        {t.footnote}
      </p>
    </div>
  );
}
