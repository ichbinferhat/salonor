import { Coins } from "lucide-react";
import { db } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getOwnerBusiness } from "@/lib/owner";
import { PanelPageHeader } from "@/components/panel/page-header";
import { LoyaltyManager } from "@/components/panel/loyalty-manager";

export const metadata = { title: "Para Puan — Salonor" };

export default async function LoyaltyPage() {
  const dict = await getDictionary();
  const t = dict.panelFinance.loyalty;
  const business = (await getOwnerBusiness())!;

  const accounts = await db.loyaltyAccount.findMany({
    where: { businessId: business.id },
    orderBy: { points: "desc" },
  });

  const totalPoints = accounts.reduce((s, a) => s + a.points, 0);
  const memberCount = accounts.length;

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label={t.totalMembers} value={memberCount.toString()} />
        <Stat label={t.circulatingPoints} value={totalPoints.toLocaleString("tr-TR")} accent />
        <Stat label={t.pointValue} value={`${totalPoints.toLocaleString("tr-TR")} ₺`} hint={t.pointValueHint} />
      </div>

      <LoyaltyManager
        accounts={accounts.map((a) => ({
          id: a.id,
          customerName: a.customerName,
          phone: a.phone,
          points: a.points,
        }))}
      />
    </div>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <Coins className={`size-4 ${accent ? "text-accent" : "text-ink-mute"}`} />
        {label}
      </div>
      <p className={`mt-1.5 font-display text-2xl font-extrabold ${accent ? "text-accent-deep" : "text-ink"}`}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}
