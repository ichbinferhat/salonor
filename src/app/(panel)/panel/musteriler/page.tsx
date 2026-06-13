import { UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { formatDateTr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { PanelPageHeader } from "@/components/panel/page-header";
import { Avatar } from "@/components/ui/avatar";

type Row = {
  key: string;
  name: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  visits: number;
  completed: number;
  totalTl: number;
  lastDate: string;
};

export default async function CustomersPage() {
  const business = (await getOwnerBusiness())!;

  const appointments = await db.appointment.findMany({
    where: { businessId: business.id, status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] } },
    include: { customer: { select: { id: true, name: true, image: true, email: true, phone: true } } },
    orderBy: { date: "desc" },
  });

  const map = new Map<string, Row>();
  for (const a of appointments) {
    const key = a.customer?.id ?? `walk:${a.customerName ?? "Misafir"}`;
    const existing = map.get(key);
    const name = a.customer?.name ?? a.customerName ?? "Salon müşterisi";
    if (existing) {
      existing.visits += 1;
      if (a.status === "COMPLETED") {
        existing.completed += 1;
        existing.totalTl += a.totalTl;
      }
      if (a.date > existing.lastDate) existing.lastDate = a.date;
    } else {
      map.set(key, {
        key,
        name,
        image: a.customer?.image ?? null,
        email: a.customer?.email ?? null,
        phone: a.customer?.phone ?? null,
        visits: 1,
        completed: a.status === "COMPLETED" ? 1 : 0,
        totalTl: a.status === "COMPLETED" ? a.totalTl : 0,
        lastDate: a.date,
      });
    }
  }

  const rows = [...map.values()].sort((a, b) => b.lastDate.localeCompare(a.lastDate));

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader title="Müşteriler" subtitle={`${rows.length} müşteri`} />

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-cream">
            <UserRound className="size-7 text-ink-mute" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">Henüz müşterin yok</h2>
          <p className="mt-2 max-w-sm text-ink-soft">
            Randevular geldikçe müşterilerin burada listelenecek.
          </p>
        </div>
      ) : (
        <>
          {/* Masaüstü tablo */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface shadow-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cream/50 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3 font-bold">Müşteri</th>
                  <th className="px-5 py-3 font-bold">İletişim</th>
                  <th className="px-5 py-3 text-center font-bold">Ziyaret</th>
                  <th className="px-5 py-3 text-center font-bold">Tamamlanan</th>
                  <th className="px-5 py-3 text-right font-bold">Harcama</th>
                  <th className="px-5 py-3 text-right font-bold">Son ziyaret</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.key} className="hover:bg-cream/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={r.image} name={r.name} size="sm" />
                        <span className="font-semibold text-ink">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {r.email ? (
                        <div>
                          <p>{r.email}</p>
                          {r.phone && <p className="text-xs text-ink-mute">{r.phone}</p>}
                        </div>
                      ) : (
                        <span className="text-ink-mute">Salon müşterisi</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-ink">{r.visits}</td>
                    <td className="px-5 py-3 text-center text-ink-soft">{r.completed}</td>
                    <td className="px-5 py-3 text-right font-bold text-ink">{formatTl(r.totalTl)}</td>
                    <td className="px-5 py-3 text-right text-ink-soft">{formatDateTr(r.lastDate, { day: "numeric", month: "short", year: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil kartlar */}
          <div className="space-y-3 md:hidden">
            {rows.map((r) => (
              <div key={r.key} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar src={r.image} name={r.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink">{r.name}</p>
                    <p className="truncate text-xs text-ink-soft">{r.email ?? "Salon müşterisi"}</p>
                  </div>
                  <span className="text-sm font-bold text-ink">{formatTl(r.totalTl)}</span>
                </div>
                <div className="mt-3 flex gap-4 border-t border-line pt-3 text-xs text-ink-soft">
                  <span>{r.visits} ziyaret</span>
                  <span>{r.completed} tamamlanan</span>
                  <span className="ml-auto">{formatDateTr(r.lastDate, { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
