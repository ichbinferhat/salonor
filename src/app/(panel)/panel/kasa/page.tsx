import type { Metadata } from "next";
import { Wallet, Receipt } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { KasaPOS } from "@/components/panel/kasa-pos";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelFinance.kasa.metaTitle };
}

const timeFmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
});

const METHOD_TONE: Record<string, string> = {
  Nakit: "bg-mint-soft text-mint",
  Kart: "bg-sea-soft text-sea",
  Havale: "bg-accent-soft text-accent-deep",
};

export default async function KasaPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.kasa;
  const business = (await getOwnerBusiness())!;
  const today = todayStr();

  const [sales, products, services] = await Promise.all([
    db.sale.findMany({
      where: { businessId: business.id, date: today },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      where: { businessId: business.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, priceTl: true, stock: true },
    }),
    db.service.findMany({
      where: { businessId: business.id },
      orderBy: { sort: "asc" },
      select: { id: true, name: true, priceTl: true },
    }),
  ]);

  const todayTotal = sales.reduce((s, x) => s + x.totalTl, 0);

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:max-w-lg">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mint-soft text-mint">
            <Wallet className="size-5" />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold text-ink">{formatTl(todayTotal)}</p>
          <p className="text-sm text-ink-soft">{t.todayCash}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
            <Receipt className="size-5" />
          </span>
          <p className="mt-3 font-display text-2xl font-extrabold text-ink">{sales.length}</p>
          <p className="text-sm text-ink-soft">{t.todayTxns}</p>
        </div>
      </div>

      <KasaPOS products={products} services={services} />

      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
          {t.todaySales} ({sales.length})
        </h2>
        {sales.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-ink-soft">{t.noSalesToday}</div>
        ) : (
          <ul className="divide-y divide-line">
            {sales.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="w-12 shrink-0 font-display font-bold text-ink-mute">
                  {timeFmt.format(s.createdAt)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {s.customerName || t.defaultCustomer}
                  </p>
                  <p className="truncate text-xs text-ink-mute">
                    {s.items.map((i) => `${i.name}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(", ")}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${METHOD_TONE[s.paymentMethod] ?? METHOD_TONE.Nakit}`}>
                  {s.paymentMethod}
                </span>
                <span className="shrink-0 font-bold text-ink">{formatTl(s.totalTl)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
