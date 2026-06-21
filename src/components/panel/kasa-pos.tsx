"use client";

import { useState, useTransition } from "react";
import { Plus, Minus, Trash2, ShoppingCart, Check, ScissorsSquare, Package2 } from "lucide-react";
import { createSaleAction, type SaleLine } from "@/server/actions/sale";
import { formatTl } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

type Cat = { id: string; name: string; priceTl: number; stock?: number };
type CartLine = SaleLine & { key: string };

const METHODS = ["Nakit", "Kart", "Havale"] as const;

export function KasaPOS({ products, services }: { products: Cat[]; services: Cat[] }) {
  const t = useDict().panelFinance.kasa;
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [method, setMethod] = useState<string>("Nakit");
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cName, setCName] = useState("");
  const [cPrice, setCPrice] = useState("");

  const total = cart.reduce((s, l) => s + l.priceTl * l.qty, 0);
  // Telefon girildiyse tahmini puan (her 100 ₺ = 5 puan) — server ile aynı formül
  const estPoints = customerPhone.trim() ? Math.floor(total / 100) * 5 : 0;
  const stockById = new Map(products.map((p) => [p.id, p.stock ?? 0]));

  function addLine(name: string, priceTl: number, kind: SaleLine["kind"], productId?: string) {
    setDone(false);
    setError(null);
    setCart((prev) => {
      const idx = prev.findIndex(
        (l) => l.kind === kind && l.name === name && (l.productId ?? null) === (productId ?? null)
      );
      if (idx >= 0) {
        // Üründe sepetteki adet stoku aşamasın
        if (productId) {
          const stock = stockById.get(productId) ?? 0;
          if (prev[idx].qty >= stock) {
            setError(interpolate(t.stockLimit, { name, n: stock }));
            return prev;
          }
        }
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      if (productId && (stockById.get(productId) ?? 0) <= 0) {
        setError(interpolate(t.stockExactNone, { name }));
        return prev;
      }
      return [
        ...prev,
        { key: crypto.randomUUID(), name, priceTl, kind, qty: 1, productId: productId ?? null },
      ];
    });
  }

  function setQty(key: string, delta: number) {
    setError(null);
    setCart((prev) =>
      prev.map((l) => {
        if (l.key !== key) return l;
        const target = l.qty + delta;
        // Ürünlerde stok üst sınırını aşma
        if (delta > 0 && l.productId) {
          const stock = stockById.get(l.productId) ?? 0;
          if (target > stock) {
            setError(interpolate(t.stockLimit, { name: l.name, n: stock }));
            return l;
          }
        }
        return { ...l, qty: Math.max(1, target) };
      })
    );
  }
  function setLinePrice(key: string, raw: string) {
    const p = Math.round(Number(raw));
    if (!Number.isFinite(p) || p < 0) return;
    setCart((prev) => prev.map((l) => (l.key === key ? { ...l, priceTl: p } : l)));
  }
  function remove(key: string) {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }
  function addCustom() {
    const p = Math.round(Number(cPrice));
    if (cName.trim().length < 2 || !Number.isFinite(p) || p <= 0) return;
    setDone(false);
    setError(null);
    // Manuel kalem her zaman yeni satır olarak eklenir (aynı isimle farklı fiyat
    // birleşmesin); fiyatı sepette ayrıca düzenlenebilir.
    setCart((prev) => [
      ...prev,
      { key: crypto.randomUUID(), name: cName.trim(), priceTl: p, kind: "other", qty: 1, productId: null },
    ]);
    setCName("");
    setCPrice("");
  }

  function checkout() {
    if (cart.length === 0) return;
    setError(null);
    start(async () => {
      const res = await createSaleAction({
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        paymentMethod: method,
        items: cart.map(({ name, kind, priceTl, qty, productId }) => ({ name, kind, priceTl, qty, productId })),
      });
      if (res.ok) {
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        setDone(true);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
      {/* Katalog */}
      <div className="space-y-5">
        {services.length > 0 && (
          <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <ScissorsSquare className="size-4 text-accent" /> {t.services}
            </h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addLine(s.name, s.priceTl, "service")}
                  className="rounded-xl border border-line-strong bg-surface px-3 py-2 text-left text-sm transition-colors hover:border-accent hover:bg-accent-faint"
                >
                  <span className="font-semibold text-ink">{s.name}</span>
                  <span className="ml-2 text-ink-soft">{formatTl(s.priceTl)}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <Package2 className="size-4 text-mint" /> {t.products}
          </h3>
          {products.length === 0 ? (
            <p className="text-sm text-ink-mute">{t.noProductsHint}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {products.map((p) => {
                const oos = (p.stock ?? 0) <= 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addLine(p.name, p.priceTl, "product", p.id)}
                    disabled={oos}
                    className="rounded-xl border border-line-strong bg-surface px-3 py-2 text-left text-sm transition-colors hover:border-accent hover:bg-accent-faint disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line-strong disabled:hover:bg-surface"
                  >
                    <span className="font-semibold text-ink">{p.name}</span>
                    <span className="ml-2 text-ink-soft">{formatTl(p.priceTl)}</span>
                    <span className={`ml-2 text-xs ${oos ? "font-semibold text-rose" : "text-ink-mute"}`}>
                      {oos ? t.outOfStock : interpolate(t.stockCount, { n: p.stock ?? 0 })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-ink">{t.manualLine}</h3>
          <div className="flex gap-2">
            <input
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder={t.descriptionPlaceholder}
              className="h-11 flex-1 rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <input
              value={cPrice}
              onChange={(e) => setCPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              type="number"
              min={1}
              step={1}
              placeholder={t.priceTlSymbol}
              className="h-11 w-24 rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <Button variant="outline" size="lg" onClick={addCustom} disabled={cName.trim().length < 2 || !cPrice}>
              <Plus className="size-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-ink-mute">{t.manualHint}</p>
        </section>
      </div>

      {/* Sepet */}
      <aside className="rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <ShoppingCart className="size-5" /> {t.receipt}
        </h3>

        {cart.length === 0 ? (
          <p className="rounded-xl bg-cream py-8 text-center text-sm text-ink-soft">
            {done ? t.saleSaved : t.emptyCart}
          </p>
        ) : (
          <ul className="space-y-2">
            {cart.map((l) => (
              <li key={l.key} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{l.name}</p>
                  {l.kind === "other" ? (
                    <label className="mt-0.5 flex items-center gap-1 text-xs text-ink-mute">
                      <input
                        value={l.priceTl}
                        onChange={(e) => setLinePrice(l.key, e.target.value)}
                        type="number"
                        min={0}
                        className="h-6 w-16 rounded-md border border-line-strong bg-surface px-1.5 text-xs text-ink focus:border-accent focus:outline-none"
                        aria-label={t.unitPriceAria}
                      />
                      <span>{t.perUnit}</span>
                    </label>
                  ) : (
                    <p className="text-xs text-ink-mute">{formatTl(l.priceTl)}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setQty(l.key, -1)} className="flex size-6 items-center justify-center rounded-md border border-line-strong hover:bg-cream" aria-label={t.decrease}>
                    <Minus className="size-3" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-ink">{l.qty}</span>
                  <button onClick={() => setQty(l.key, +1)} className="flex size-6 items-center justify-center rounded-md border border-line-strong hover:bg-cream" aria-label={t.increase}>
                    <Plus className="size-3" />
                  </button>
                </div>
                <span className="w-16 shrink-0 text-right text-sm font-bold text-ink">{formatTl(l.priceTl * l.qty)}</span>
                <button onClick={() => remove(l.key)} className="text-ink-mute hover:text-rose" aria-label={t.remove}>
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={t.customerNamePlaceholder}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <div>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder={t.customerPhonePlaceholder}
              inputMode="tel"
              className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
            />
            {estPoints > 0 && (
              <p className="mt-1 text-xs font-medium text-accent-deep">
                {interpolate(t.earnPointsNote, { n: estPoints })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-colors ${
                  method === m ? "border-accent bg-accent text-white" : "border-line-strong text-ink hover:bg-cream"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-ink-soft">{t.total}</span>
            <span className="font-display font-extrabold text-ink">{formatTl(total)}</span>
          </div>
          {error && <p className="text-sm font-medium text-rose">{error}</p>}
          <Button variant="accent" size="lg" className="w-full" onClick={checkout} disabled={cart.length === 0 || pending}>
            {pending ? t.saving : (<><Check className="size-4" /> {t.charge}</>)}
          </Button>
        </div>
      </aside>
    </div>
  );
}
