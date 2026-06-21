"use client";

import { useState, useTransition } from "react";
import { Plus, Receipt, Trash2, ChevronDown } from "lucide-react";
import {
  createDebtAction,
  addDebtPaymentAction,
  deleteDebtAction,
} from "@/server/actions/debt";
import { Button } from "@/components/ui/button";
import { formatTl } from "@/lib/format";
import { formatPhoneTr } from "@/lib/phone";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

type Payment = { id: string; amountTl: number; method: string; date: string };
type Debt = {
  id: string;
  customerName: string;
  phone: string | null;
  totalTl: number;
  paidTl: number;
  installments: number;
  note: string | null;
  date: string;
  payments: Payment[];
};

const METHODS = ["Nakit", "Kart", "Havale"] as const;

export function DebtManager({ debts }: { debts: Debt[] }) {
  const t = useDict().panelFinance.debt;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState("");
  const [installments, setInstallments] = useState("1");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function create() {
    setError(null);
    const amt = Math.round(Number(total));
    if (name.trim().length < 2) return setError(t.errEnterCustomer);
    if (!Number.isFinite(amt) || amt <= 0) return setError(t.errEnterValidAmount);
    start(async () => {
      const res = await createDebtAction({
        customerName: name.trim(),
        phone: phone || undefined,
        totalTl: amt,
        installments: Math.max(1, Math.round(Number(installments) || 1)),
        note: note || undefined,
      });
      if (res.ok) {
        setName("");
        setPhone("");
        setTotal("");
        setInstallments("1");
        setNote("");
      } else setError(res.error);
    });
  }

  const open = debts.filter((d) => d.paidTl < d.totalTl);
  const closed = debts.filter((d) => d.paidTl >= d.totalTl);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Plus className="size-5 text-accent" /> {t.newDebt}
        </h3>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.customerName}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.phoneOptional}
            inputMode="tel"
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-semibold text-ink-soft">{t.amountWithSymbol}</label>
              <input
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                type="number"
                min={1}
                placeholder="0"
                className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div className="w-24">
              <label className="mb-1 block text-xs font-semibold text-ink-soft">{t.installment}</label>
              <input
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                type="number"
                min={1}
                className="h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.noteOptional}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          {error && <p className="text-sm font-medium text-rose">{error}</p>}
          <Button variant="accent" size="lg" className="w-full" onClick={create} disabled={pending}>
            {pending ? t.saving : t.addDebtRecord}
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        {debts.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-cream">
              <Receipt className="size-7 text-ink-mute" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
            <p className="mt-2 max-w-sm text-ink-soft">{t.emptyDesc}</p>
          </div>
        ) : (
          <>
            {open.map((d) => (
              <DebtRow key={d.id} debt={d} />
            ))}
            {closed.length > 0 && (
              <p className="px-1 pt-2 text-xs font-bold uppercase tracking-wide text-ink-mute">
                {t.closedAccounts}
              </p>
            )}
            {closed.map((d) => (
              <DebtRow key={d.id} debt={d} />
            ))}
          </>
        )}
      </section>
    </div>
  );
}

function DebtRow({ debt }: { debt: Debt }) {
  const t = useDict().panelFinance.debt;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("Nakit");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const remaining = debt.totalTl - debt.paidTl;
  const paid = remaining <= 0;
  const pct = debt.totalTl > 0 ? Math.round((debt.paidTl / debt.totalTl) * 100) : 0;

  function pay() {
    setError(null);
    const a = Math.round(Number(amount));
    if (!Number.isFinite(a) || a <= 0) return setError(t.errEnterAmount);
    start(async () => {
      const res = await addDebtPaymentAction({ debtId: debt.id, amountTl: a, method });
      if (res.ok) setAmount("");
      else setError(res.error);
    });
  }

  function del() {
    if (!confirm(t.deleteConfirm)) return;
    start(async () => {
      await deleteDebtAction(debt.id);
    });
  }

  return (
    <div className={`rounded-2xl border bg-surface p-4 shadow-card ${paid ? "border-line opacity-75" : "border-line"}`}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{debt.customerName}</p>
          <p className="text-xs text-ink-mute">
            {debt.phone ? formatPhoneTr(debt.phone) + " · " : ""}
            {debt.date}
            {debt.installments > 1 ? ` · ${interpolate(t.installmentCount, { n: debt.installments })}` : ""}
          </p>
        </div>
        <div className="text-right">
          {paid ? (
            <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-mint">{t.closed}</span>
          ) : (
            <>
              <p className="font-display text-lg font-extrabold text-rose">{formatTl(remaining)}</p>
              <p className="text-xs text-ink-mute">{t.remaining}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-cream">
        <div className="h-full rounded-full bg-mint" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        {interpolate(t.paidOf, { paid: formatTl(debt.paidTl), total: formatTl(debt.totalTl) })}
        {debt.note ? ` · ${debt.note}` : ""}
      </p>

      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        {!paid && (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min={1}
              max={remaining}
              placeholder={interpolate(t.collectMax, { n: remaining })}
              className="h-10 flex-1 rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <Button variant="accent" size="sm" onClick={pay} disabled={pending}>
              {pending ? "..." : t.collect}
            </Button>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
        <Button variant="ghost" size="sm" onClick={del} disabled={pending}>
          <Trash2 className="size-4 text-rose" />
        </Button>
      </div>

      {!paid && (
        <div className="mt-2 flex gap-1.5">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors ${
                method === m ? "border-accent bg-accent text-white" : "border-line-strong text-ink hover:bg-cream"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-rose">{error}</p>}

      {open && (
        <div className="mt-3 border-t border-line pt-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-mute">{t.paymentHistory}</p>
          {debt.payments.length === 0 ? (
            <p className="text-sm text-ink-mute">{t.noPaymentsYet}</p>
          ) : (
            <ul className="space-y-1.5">
              {debt.payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">
                    {p.date} · {p.method}
                  </span>
                  <span className="font-semibold text-ink">{formatTl(p.amountTl)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
