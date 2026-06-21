import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { formatDateTr, todayStr } from "@/lib/datetime";
import { PanelPageHeader } from "@/components/panel/page-header";
import { Badge } from "@/components/ui/badge";
import { CampaignForm, ItemDeleteButton, ItemEditButton, ToggleActiveButton } from "@/components/panel/catalog";

export const metadata = { title: "Kampanyalar — Salonor" };

export default async function CampaignsPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.campaigns;
  const today = todayStr();
  const campaigns = await db.campaign.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title={t.title} subtitle={t.subtitle} />
      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">{t.createTitle}</h2>
          <CampaignForm />
        </section>
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
            {interpolate(t.listTitle, { n: campaigns.length })}
          </h2>
          {campaigns.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-ink">{t.emptyTitle}</p>
              <p className="mt-1 text-sm text-ink-soft">{t.emptyDesc}</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {campaigns.map((c) => {
                const expired = !!c.expiresAt && c.expiresAt < today;
                const dateStr = c.expiresAt
                  ? formatDateTr(c.expiresAt, { day: "numeric", month: "short", year: "numeric" })
                  : null;
                return (
                  <li key={c.id} className={`flex items-center gap-3 px-5 py-4 ${c.active && !expired ? "" : "opacity-60"}`}>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-display font-extrabold tracking-wide text-ink">
                        <span className={expired ? "line-through decoration-rose/60" : ""}>{c.code}</span>
                        {expired && <Badge tone="rose">{t.expired}</Badge>}
                      </p>
                      <p className="truncate text-xs text-ink-mute">
                        {interpolate(t.usedCount, { n: c.usedCount })}
                        {dateStr
                          ? expired
                            ? interpolate(t.endedOn, { date: dateStr })
                            : interpolate(t.endsOn, { date: dateStr })
                          : t.noExpiry}
                        {c.description ? ` · ${c.description}` : ""}
                      </p>
                    </div>
                    <ToggleActiveButton kind="campaign" id={c.id} active={c.active} />
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-sm font-bold text-accent-deep">
                      %{c.discountPct}
                    </span>
                    <ItemEditButton
                      kind="campaign"
                      initial={{
                        id: c.id,
                        code: c.code,
                        description: c.description,
                        discountPct: c.discountPct,
                        expiresAt: c.expiresAt,
                      }}
                    />
                    <ItemDeleteButton kind="campaign" id={c.id} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
