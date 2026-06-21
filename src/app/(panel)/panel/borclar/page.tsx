import { Receipt } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { PanelPageHeader } from "@/components/panel/page-header";
import { DebtManager } from "@/components/panel/debt-manager";

export const metadata = { title: "Borç & Taksit — Salonor" };

export default async function DebtsPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.debt;
  const business = (await getOwnerBusiness())!;

  const debts = await db.debt.findMany({
    where: { businessId: business.id },
    include: { payments: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  const open = debts.filter((d) => d.paidTl < d.totalTl);
  const totalOutstanding = open.reduce((s, d) => s + (d.totalTl - d.paidTl), 0);
  const totalCollected = debts.reduce((s, d) => s + d.paidTl, 0);

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label={t.openAccounts} value={open.length.toString()} />
        <Stat label={t.totalReceivable} value={`${totalOutstanding.toLocaleString("tr-TR")} ₺`} danger />
        <Stat label={t.collected} value={`${totalCollected.toLocaleString("tr-TR")} ₺`} accent />
      </div>

      <DebtManager
        debts={debts.map((d) => ({
          id: d.id,
          customerName: d.customerName,
          phone: d.phone,
          totalTl: d.totalTl,
          paidTl: d.paidTl,
          installments: d.installments,
          note: d.note,
          date: d.date,
          payments: d.payments.map((p) => ({
            id: p.id,
            amountTl: p.amountTl,
            method: p.method,
            date: p.date,
          })),
        }))}
      />
    </div>
  );
}

function Stat({ label, value, accent, danger }: { label: string; value: string; accent?: boolean; danger?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <Receipt className={`size-4 ${accent ? "text-mint" : danger ? "text-rose" : "text-ink-mute"}`} />
        {label}
      </div>
      <p
        className={`mt-1.5 font-display text-2xl font-extrabold ${
          accent ? "text-mint" : danger ? "text-rose" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
