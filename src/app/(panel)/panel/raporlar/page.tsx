import { TrendingUp, CalendarDays, Receipt, CheckCircle2, ShoppingBag } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, addDaysStr, formatDateTr, weekdayOf, WEEKDAYS_SHORT_TR } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { Avatar } from "@/components/ui/avatar";

export const metadata = { title: "Raporlar" };

export default async function ReportsPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.reports;
  const business = (await getOwnerBusiness())!;
  const today = todayStr();
  const from = addDaysStr(today, -29);

  const [appts, sales] = await Promise.all([
    db.appointment.findMany({
      where: { businessId: business.id, date: { gte: from, lte: today } },
      include: {
        items: { select: { name: true, priceTl: true } },
        staff: { select: { id: true, name: true, image: true } },
      },
    }),
    // Kasa & Adisyon (POS) satışları
    db.sale.findMany({
      where: { businessId: business.id, date: { gte: from, lte: today } },
      select: { date: true, totalTl: true },
    }),
  ]);

  const realized = appts.filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED");
  // CİRO yalnızca GERÇEKLEŞEN işten sayılır: tamamlanmış + günü geçmiş onaylı randevular.
  // Bugünün henüz yaşanmamış CONFIRMED randevuları "kazanılmış" sayılmaz (gün geçince
  // veya COMPLETED işaretlenince ciroya girer) — böylece gelecek randevu ciroyu şişirmez.
  const earned = appts.filter(
    (a) => a.status === "COMPLETED" || (a.status === "CONFIRMED" && a.date < today)
  );
  const apptRevenue = earned.reduce((s, a) => s + a.totalTl, 0);
  const saleRevenue = sales.reduce((s, sl) => s + sl.totalTl, 0);
  const revenue = apptRevenue + saleRevenue;
  const count = realized.length;
  const avgTicket = earned.length ? Math.round(apptRevenue / earned.length) : 0;

  const completed = appts.filter((a) => a.status === "COMPLETED").length;
  const cancelled = appts.filter((a) => a.status === "CANCELLED").length;
  const noShow = appts.filter((a) => a.status === "NO_SHOW").length;

  // Günlük ciro (son 14 gün) — randevu + kasa satışları
  const daily = Array.from({ length: 14 }, (_, i) => {
    const date = addDaysStr(today, -13 + i);
    const apptTotal = earned.filter((a) => a.date === date).reduce((s, a) => s + a.totalTl, 0);
    const saleTotal = sales.filter((sl) => sl.date === date).reduce((s, sl) => s + sl.totalTl, 0);
    return { date, total: apptTotal + saleTotal };
  });
  const maxDaily = Math.max(...daily.map((d) => d.total), 1);

  // Hizmet bazında gelir
  const svcMap = new Map<string, { count: number; revenue: number }>();
  for (const a of earned)
    for (const it of a.items) {
      const cur = svcMap.get(it.name) ?? { count: 0, revenue: 0 };
      cur.count += 1;
      cur.revenue += it.priceTl;
      svcMap.set(it.name, cur);
    }
  const topServices = [...svcMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxSvc = Math.max(...topServices.map((s) => s.revenue), 1);

  // Personel bazında gelir
  const staffMap = new Map<string, { name: string; image: string; count: number; revenue: number }>();
  for (const a of earned) {
    const cur =
      staffMap.get(a.staff.id) ?? { name: a.staff.name, image: a.staff.image, count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += a.totalTl;
    staffMap.set(a.staff.id, cur);
  }
  const topStaff = [...staffMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Haftanın günlerine göre yoğunluk
  const byWeekday = Array.from({ length: 7 }, () => 0);
  for (const a of realized) byWeekday[weekdayOf(a.date)] += 1;
  const maxWd = Math.max(...byWeekday, 1);
  const wdOrder = [1, 2, 3, 4, 5, 6, 0]; // Pzt..Paz

  const kpis = [
    { label: t.revenue30d, value: formatTl(revenue), icon: TrendingUp, tone: "bg-mint-soft text-mint" },
    { label: t.cashSales, value: formatTl(saleRevenue), icon: ShoppingBag, tone: "bg-sea-soft text-sea" },
    { label: t.appointment, value: String(count), icon: CalendarDays, tone: "bg-accent-soft text-accent-deep" },
    { label: t.avgTicket, value: formatTl(avgTicket), icon: Receipt, tone: "bg-honey-soft text-honey" },
    { label: t.completed, value: String(completed), icon: CheckCircle2, tone: "bg-mint-soft text-mint" },
  ];

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className={`inline-flex size-10 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Günlük ciro grafiği */}
      <section className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.dailyRevenueTitle}</h2>
        <div className="flex h-40 items-end justify-between gap-1.5">
          {daily.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-md transition-all ${d.date === today ? "bg-accent" : "bg-accent/30"}`}
                  style={{ height: d.total === 0 ? "0%" : `${Math.max((d.total / maxDaily) * 100, 3)}%` }}
                  title={`${formatDateTr(d.date, { day: "numeric", month: "short" })} · ${formatTl(d.total)}`}
                />
              </div>
              <span className="text-[10px] font-semibold text-ink-mute">{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* En çok gelir getiren hizmetler */}
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.topServicesTitle}</h2>
          {topServices.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-mute">{dict.panelFinance.noDataYet}</p>
          ) : (
            <ul className="space-y-4">
              {topServices.map((s) => (
                <li key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-ink">{s.name}</span>
                    <span className="shrink-0 font-bold text-ink">{formatTl(s.revenue)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${(s.revenue / maxSvc) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-mute">{interpolate(t.timesUsed, { n: s.count })}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* En çok kazandıran personel */}
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.staffPerformanceTitle}</h2>
          {topStaff.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-mute">{dict.panelFinance.noDataYet}</p>
          ) : (
            <ul className="divide-y divide-line">
              {topStaff.map((s, i) => (
                <li key={s.name} className="flex items-center gap-3 py-3">
                  <span className="w-4 shrink-0 text-center font-display font-extrabold text-ink-mute">
                    {i + 1}
                  </span>
                  <Avatar src={s.image} name={s.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{s.name}</p>
                    <p className="text-xs text-ink-mute">{interpolate(t.appointmentCount, { n: s.count })}</p>
                  </div>
                  <span className="shrink-0 font-bold text-ink">{formatTl(s.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Haftalık yoğunluk */}
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.busyDaysTitle}</h2>
          <div className="flex h-32 items-end justify-between gap-2">
            {wdOrder.map((wd) => (
              <div key={wd} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-md bg-sea/70"
                    style={{ height: byWeekday[wd] === 0 ? "0%" : `${Math.max((byWeekday[wd] / maxWd) * 100, 3)}%` }}
                    title={`${byWeekday[wd]} randevu`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-ink-mute">{WEEKDAYS_SHORT_TR[wd]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Durum dağılımı */}
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.appointmentStatusTitle}</h2>
          <ul className="space-y-3 text-sm">
            <Row label={t.statusCompleted} value={completed} tone="text-mint" />
            <Row label={t.statusConfirmedPending} value={count - completed} tone="text-accent-deep" />
            <Row label={t.statusCancelled} value={cancelled} tone="text-rose" />
            <Row label={t.statusNoShow} value={noShow} tone="text-ink-soft" />
          </ul>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <li className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-ink-soft">{label}</span>
      <span className={`font-display text-lg font-extrabold ${tone}`}>{value}</span>
    </li>
  );
}
