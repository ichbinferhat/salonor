import { Gift } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { PanelPageHeader } from "@/components/panel/page-header";
import { GiftCardManager } from "@/components/panel/giftcard-manager";

export const metadata = { title: "Hediye Çeki — Salonor" };

export default async function GiftCardPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.giftcard;
  const business = (await getOwnerBusiness())!;

  const cards = await db.giftCard.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  const activeCards = cards.filter((c) => c.active && c.balanceTl > 0);
  const outstanding = activeCards.reduce((s, c) => s + c.balanceTl, 0);
  const totalIssued = cards.reduce((s, c) => s + c.amountTl, 0);

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label={t.activeCards} value={activeCards.length.toString()} />
        <Stat label={t.unusedBalance} value={`${outstanding.toLocaleString("tr-TR")} ₺`} accent />
        <Stat label={t.totalIssued} value={`${totalIssued.toLocaleString("tr-TR")} ₺`} />
      </div>

      <GiftCardManager
        cards={cards.map((c) => ({
          id: c.id,
          code: c.code,
          amountTl: c.amountTl,
          balanceTl: c.balanceTl,
          buyerName: c.buyerName,
          recipient: c.recipient,
          active: c.active,
          expiresAt: c.expiresAt,
        }))}
      />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <Gift className={`size-4 ${accent ? "text-accent" : "text-ink-mute"}`} />
        {label}
      </div>
      <p className={`mt-1.5 font-display text-2xl font-extrabold ${accent ? "text-accent-deep" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
