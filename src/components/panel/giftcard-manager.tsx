"use client";

import { useState, useTransition } from "react";
import { Plus, Gift, Copy, Check, Power } from "lucide-react";
import {
  createGiftCardAction,
  redeemGiftCardAction,
  toggleGiftCardAction,
} from "@/server/actions/giftcard";
import { Button } from "@/components/ui/button";
import { formatTl } from "@/lib/format";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

type Card = {
  id: string;
  code: string;
  amountTl: number;
  balanceTl: number;
  buyerName: string | null;
  recipient: string | null;
  active: boolean;
  expiresAt: string | null;
};

export function GiftCardManager({ cards }: { cards: Card[] }) {
  const t = useDict().panelFinance.giftcard;
  const [amount, setAmount] = useState("");
  const [buyer, setBuyer] = useState("");
  const [recipient, setRecipient] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function create() {
    setError(null);
    const a = Math.round(Number(amount));
    if (!Number.isFinite(a) || a <= 0) return setError(t.errEnterValidAmount);
    start(async () => {
      const res = await createGiftCardAction({
        amountTl: a,
        buyerName: buyer || undefined,
        recipient: recipient || undefined,
        expiresAt: expiresAt || undefined,
      });
      if (res.ok) {
        setAmount("");
        setBuyer("");
        setRecipient("");
        setExpiresAt("");
      } else setError(res.error);
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card lg:sticky lg:top-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Plus className="size-5 text-accent" /> {t.newGiftcard}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">{t.amountWithSymbol}</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min={1}
              placeholder={t.amountPlaceholder}
              className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <input
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            placeholder={t.buyerPlaceholder}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={t.recipientPlaceholder}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">{t.expiryOptional}</label>
            <input
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              type="date"
              className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          {error && <p className="text-sm font-medium text-rose">{error}</p>}
          <Button variant="accent" size="lg" className="w-full" onClick={create} disabled={pending}>
            {pending ? t.creating : t.createCard}
          </Button>
        </div>
      </section>

      <section>
        {cards.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-cream">
              <Gift className="size-7 text-ink-mute" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
            <p className="mt-2 max-w-sm text-ink-soft">{t.emptyDesc}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((c) => (
              <CardItem key={c.id} card={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CardItem({ card }: { card: Card }) {
  const t = useDict().panelFinance.giftcard;
  const [copied, setCopied] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const depleted = card.balanceTl <= 0;
  const usedPct = card.amountTl > 0 ? Math.round(((card.amountTl - card.balanceTl) / card.amountTl) * 100) : 0;

  function copy() {
    navigator.clipboard?.writeText(card.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function redeem() {
    setError(null);
    const a = Math.round(Number(amount));
    if (!Number.isFinite(a) || a <= 0) return setError(t.errEnterQuantity);
    start(async () => {
      const res = await redeemGiftCardAction({ id: card.id, amountTl: a });
      if (res.ok) {
        setRedeeming(false);
        setAmount("");
      } else setError(res.error);
    });
  }

  function toggle() {
    start(async () => {
      await toggleGiftCardAction(card.id, !card.active);
    });
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-surface p-4 shadow-card ${
        card.active && !depleted ? "border-line" : "border-line opacity-70"
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={copy}
          className="group flex items-center gap-1.5 rounded-lg bg-ink-strong px-2.5 py-1.5 font-mono text-xs font-bold tracking-wider text-white"
          title={t.copyCode}
        >
          {card.code}
          {copied ? <Check className="size-3.5 text-mint" /> : <Copy className="size-3.5 opacity-60 group-hover:opacity-100" />}
        </button>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            depleted
              ? "bg-cream text-ink-mute"
              : card.active
                ? "bg-mint-soft text-mint"
                : "bg-cream text-ink-mute"
          }`}
        >
          {depleted ? t.depleted : card.active ? t.active : t.passive}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold text-ink">{formatTl(card.balanceTl)}</p>
          <p className="text-xs text-ink-mute">{interpolate(t.balanceOf, { total: formatTl(card.amountTl) })}</p>
        </div>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
        <div className="h-full rounded-full bg-accent" style={{ width: `${usedPct}%` }} />
      </div>

      {(card.buyerName || card.recipient || card.expiresAt) && (
        <p className="mt-2 text-xs text-ink-soft">
          {card.buyerName && interpolate(t.buyerLabel, { name: card.buyerName })}
          {card.recipient && interpolate(t.recipientLabel, { name: card.recipient })}
          {card.expiresAt && interpolate(t.expiryLabel, { date: card.expiresAt })}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <Button variant="outline" size="sm" onClick={() => setRedeeming((v) => !v)} disabled={depleted || !card.active}>
          {t.use}
        </Button>
        <Button variant="ghost" size="sm" onClick={toggle} disabled={pending || depleted}>
          <Power className="size-4" /> {card.active ? t.deactivate : t.activate}
        </Button>
      </div>

      {redeeming && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min={1}
              max={card.balanceTl}
              placeholder={interpolate(t.redeemMax, { n: card.balanceTl })}
              className="h-10 flex-1 rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
            />
            <Button variant="accent" size="sm" onClick={redeem} disabled={pending}>
              {pending ? "..." : t.deduct}
            </Button>
          </div>
          {error && <p className="mt-1.5 text-sm text-rose">{error}</p>}
        </div>
      )}
    </div>
  );
}
