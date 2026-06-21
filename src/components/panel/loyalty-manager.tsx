"use client";

import { useState, useTransition } from "react";
import { Plus, Coins, Search, Gift } from "lucide-react";
import { earnPointsAction, redeemPointsAction } from "@/server/actions/loyalty";
import { Button } from "@/components/ui/button";
import { formatPhoneTr } from "@/lib/phone";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

type Account = { id: string; customerName: string; phone: string; points: number };

export function LoyaltyManager({ accounts }: { accounts: Account[] }) {
  const t = useDict().panelFinance.loyalty;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [points, setPoints] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pending, start] = useTransition();

  function addPoints() {
    setError(null);
    const p = Math.round(Number(points));
    if (name.trim().length < 2) return setError(t.errEnterCustomer);
    if (!Number.isFinite(p) || p <= 0) return setError(t.errEnterValidPoints);
    start(async () => {
      const res = await earnPointsAction({ customerName: name.trim(), phone, points: p });
      if (res.ok) {
        setName("");
        setPhone("");
        setPoints("");
      } else setError(res.error);
    });
  }

  const filtered = accounts.filter(
    (a) =>
      a.customerName.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")) ||
      a.phone.includes(query.replace(/\D/g, ""))
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
      {/* Puan ekle */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Plus className="size-5 text-accent" /> {t.addPoints}
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
            placeholder={t.phonePlaceholder}
            inputMode="tel"
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <input
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            type="number"
            min={1}
            placeholder={t.pointsAmount}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          {error && <p className="text-sm font-medium text-rose">{error}</p>}
          <Button variant="accent" size="lg" className="w-full" onClick={addPoints} disabled={pending}>
            {pending ? t.adding : t.addPoints}
          </Button>
          <p className="rounded-xl bg-accent-faint px-3 py-2 text-xs text-ink-soft">
            {t.hint}
          </p>
        </div>
      </section>

      {/* Üye listesi */}
      <section className="rounded-2xl border border-line bg-surface shadow-card">
        <div className="flex items-center gap-2 border-b border-line p-4">
          <Search className="size-4 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-mute"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-cream">
              <Coins className="size-6 text-ink-mute" />
            </span>
            <p className="mt-3 font-semibold text-ink">
              {accounts.length === 0 ? t.emptyNoMembers : t.emptyNoMatch}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{t.emptyDesc}</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((a) => (
              <AccountRow key={a.id} account={a} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AccountRow({ account }: { account: Account }) {
  const t = useDict().panelFinance.loyalty;
  const [redeeming, setRedeeming] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function redeem() {
    setError(null);
    const p = Math.round(Number(amount));
    if (!Number.isFinite(p) || p <= 0) return setError(t.errEnterQuantity);
    start(async () => {
      const res = await redeemPointsAction({ accountId: account.id, points: p });
      if (res.ok) {
        setRedeeming(false);
        setAmount("");
      } else setError(res.error);
    });
  }

  return (
    <li className="p-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{account.customerName}</p>
          <p className="text-xs text-ink-mute">{formatPhoneTr(account.phone)}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-extrabold text-accent-deep">
            {account.points.toLocaleString("tr-TR")}
          </p>
          <p className="text-xs text-ink-mute">{t.points}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRedeeming((v) => !v)}
          disabled={account.points <= 0}
        >
          <Gift className="size-4" /> {t.spend}
        </Button>
      </div>

      {redeeming && (
        <div className="mt-3 flex items-center gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min={1}
            max={account.points}
            placeholder={interpolate(t.redeemMax, { n: account.points })}
            className="h-10 flex-1 rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <Button variant="accent" size="sm" onClick={redeem} disabled={pending}>
            {pending ? "..." : t.use}
          </Button>
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-rose">{error}</p>}
    </li>
  );
}
