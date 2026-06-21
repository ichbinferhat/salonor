import type { Metadata } from "next";
import { Boxes, AlertTriangle, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { ProductForm, ItemDeleteButton, ItemEditButton, StockStepper } from "@/components/panel/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelFinance.products.metaTitle };
}

export default async function ProductsPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.products;
  const business = (await getOwnerBusiness())!;
  const products = await db.product.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
  });
  const lowCount = products.filter((p) => p.stock <= p.lowStockAt).length;
  const stockValue = products.reduce((s, p) => s + p.priceTl * p.stock, 0);

  const stats = [
    { label: t.productTypes, value: String(products.length), icon: Boxes, tone: "bg-accent-soft text-accent-deep" },
    { label: t.lowStock, value: String(lowCount), icon: AlertTriangle, tone: lowCount ? "bg-rose-soft text-rose" : "bg-mint-soft text-mint" },
    { label: t.stockValue, value: formatTl(stockValue), icon: Wallet, tone: "bg-honey-soft text-honey" },
  ];

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />

      <div className="grid gap-4 sm:grid-cols-3">
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
          <h2 className="mb-4 font-display text-lg font-bold text-ink">{t.addProduct}</h2>
          <ProductForm />
        </section>
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
            {t.productsCount} ({products.length})
          </h2>
          {products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-ink">{t.emptyTitle}</p>
              <p className="mt-1 text-sm text-ink-soft">{t.emptyDesc}</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-ink-mute">
                      {formatTl(p.priceTl)}
                      {p.stock <= p.lowStockAt && (
                        <span className="ml-2 font-bold text-rose">{t.lowStockBadge}</span>
                      )}
                    </p>
                  </div>
                  <StockStepper id={p.id} stock={p.stock} low={p.lowStockAt} />
                  <ItemEditButton
                    kind="product"
                    initial={{ id: p.id, name: p.name, priceTl: p.priceTl, stock: p.stock, lowStockAt: p.lowStockAt }}
                  />
                  <ItemDeleteButton kind="product" id={p.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
