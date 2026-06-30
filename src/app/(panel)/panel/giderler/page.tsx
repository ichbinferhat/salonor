import { Wallet, TrendingDown, TrendingUp, Receipt, ShoppingBag } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, formatDateTr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { ExpenseForm, DeleteExpenseButton } from "@/components/panel/expenses";

export const metadata = { title: "Giderler" };

const CAT_TONE: Record<string, string> = {
  Kira: "bg-accent-soft text-accent-deep",
  Maaş: "bg-sea-soft text-sea",
  Malzeme: "bg-mint-soft text-mint",
  Fatura: "bg-honey-soft text-honey",
  Pazarlama: "bg-rose-soft text-rose",
  Diğer: "bg-cream text-ink-soft",
};

export default async function ExpensesPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.expenses;
  const business = (await getOwnerBusiness())!;
  const today = todayStr();
  const month = today.slice(0, 7); // YYYY-MM

  const [expenses, completedAgg, confirmedPastAgg, saleAgg] = await Promise.all([
    db.expense.findMany({
      where: { businessId: business.id, date: { startsWith: month } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    // CİRO yalnızca GERÇEKLEŞEN işten: tamamlanmış (ayın tamamı) + günü geçmiş onaylı
    // randevular. Bugünün henüz yaşanmamış CONFIRMED randevuları kâra yazılmaz
    // (Raporlar sayfasındaki `earned` mantığıyla birebir tutarlı — gelecek randevu
    // ciroyu/net kârı şişirmesin).
    db.appointment.aggregate({
      where: { businessId: business.id, date: { startsWith: month }, status: "COMPLETED" },
      _sum: { totalTl: true },
    }),
    db.appointment.aggregate({
      where: { businessId: business.id, date: { gte: `${month}-01`, lt: today }, status: "CONFIRMED" },
      _sum: { totalTl: true },
    }),
    // Kasa & Adisyon (POS) satışları da ciroya dahil
    db.sale.aggregate({
      where: { businessId: business.id, date: { startsWith: month } },
      _sum: { totalTl: true },
    }),
  ]);

  const expenseTotal = expenses.reduce((s, e) => s + e.amountTl, 0);
  const apptRevenue = (completedAgg._sum.totalTl ?? 0) + (confirmedPastAgg._sum.totalTl ?? 0);
  const saleRevenue = saleAgg._sum.totalTl ?? 0;
  const revenue = apptRevenue + saleRevenue;
  const net = revenue - expenseTotal;
  const monthLabel = formatDateTr(`${month}-01`, { month: "long", year: "numeric" });

  const stats = [
    {
      label: interpolate(t.revenueOfMonth, { month: monthLabel }),
      value: formatTl(revenue),
      icon: TrendingUp,
      tone: "bg-mint-soft text-mint",
    },
    { label: t.cashSales, value: formatTl(saleRevenue), icon: ShoppingBag, tone: "bg-sea-soft text-sea" },
    { label: t.monthExpense, value: formatTl(expenseTotal), icon: TrendingDown, tone: "bg-rose-soft text-rose" },
    {
      label: t.netProfit,
      value: formatTl(net),
      icon: Wallet,
      tone: net >= 0 ? "bg-accent-soft text-accent-deep" : "bg-rose-soft text-rose",
    },
  ];

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">{t.addExpense}</h2>
          <ExpenseForm defaultDate={today} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
            {interpolate(t.expensesOfMonth, { month: monthLabel })} ({expenses.length})
          </h2>
          {expenses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream">
                <Receipt className="size-7 text-ink-mute" />
              </span>
              <p className="mt-4 font-semibold text-ink">{t.emptyTitle}</p>
              <p className="mt-1 text-sm text-ink-soft">{t.emptyDesc}</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {expenses.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{e.title}</p>
                    <p className="truncate text-xs text-ink-mute">
                      {formatDateTr(e.date, { day: "numeric", month: "short", year: "numeric" })}
                      {e.note ? ` · ${e.note}` : ""}
                    </p>
                  </div>
                  <span
                    className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline ${
                      CAT_TONE[e.category] ?? CAT_TONE["Diğer"]
                    }`}
                  >
                    {e.category}
                  </span>
                  <span className="shrink-0 font-bold text-ink">{formatTl(e.amountTl)}</span>
                  <DeleteExpenseButton id={e.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
