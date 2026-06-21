import { UserX, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { todayStr, formatDateTr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { Avatar } from "@/components/ui/avatar";
import { waLink } from "@/lib/contact";

export const metadata = { title: "Kayıp Müşteri — Salonor" };

const THRESHOLD_DAYS = 45;

type Row = {
  key: string;
  name: string;
  image: string | null;
  phone: string | null;
  visits: number;
  totalTl: number;
  lastDate: string;
};

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000);
}

export default async function LostCustomersPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.lost;
  const today = todayStr();

  const appointments = await db.appointment.findMany({
    where: { businessId: business.id, status: { in: ["CONFIRMED", "COMPLETED"] } },
    include: { customer: { select: { id: true, name: true, image: true, phone: true } } },
  });

  const map = new Map<string, Row>();
  for (const a of appointments) {
    const key = a.customer?.id ?? `walk:${a.customerName ?? a.customerPhone ?? "?"}`;
    const name = a.customer?.name ?? a.customerName ?? t.fallbackCustomer;
    const phone = a.customer?.phone ?? a.customerPhone ?? null;
    const existing = map.get(key);
    if (existing) {
      existing.visits += 1;
      existing.totalTl += a.totalTl;
      if (a.date > existing.lastDate) existing.lastDate = a.date;
      if (!existing.phone && phone) existing.phone = phone;
    } else {
      map.set(key, {
        key,
        name,
        image: a.customer?.image ?? null,
        phone,
        visits: 1,
        totalTl: a.totalTl,
        lastDate: a.date,
      });
    }
  }

  const rows = [...map.values()]
    .map((r) => ({ ...r, days: daysBetween(today, r.lastDate) }))
    .filter((r) => r.days >= THRESHOLD_DAYS)
    .sort((a, b) => b.days - a.days);

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={interpolate(t.subtitle, { days: THRESHOLD_DAYS })}
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream">
            <UserX className="size-7 text-ink-mute" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
          <p className="mt-2 text-ink-soft">
            {interpolate(t.emptyDesc, { days: THRESHOLD_DAYS })}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const msg = interpolate(t.waMessage, { name: r.name, business: business.name });
            const wa = waLink(r.phone, msg);
            return (
              <li
                key={r.key}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card"
              >
                <Avatar src={r.image} name={r.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{r.name}</p>
                  <p className="truncate text-sm text-ink-soft">
                    {interpolate(t.lastVisit, { date: formatDateTr(r.lastDate, { day: "numeric", month: "long", year: "numeric" }) })}
                    <span className="font-semibold text-rose">{interpolate(t.daysAgo, { n: r.days })}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-mute">{interpolate(t.visits, { n: r.visits })}</p>
                  <p className="font-bold text-ink">{formatTl(r.totalTl)}</p>
                </div>
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="size-4" /> {t.recover}
                  </a>
                ) : (
                  <span className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-ink-mute">
                    {t.noPhone}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
