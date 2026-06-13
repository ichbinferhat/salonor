import Link from "next/link";
import {
  CalendarDays,
  Wallet,
  Star,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Plus,
} from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, addDaysStr, minToHHMM, formatDateTr, nowMinutes } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const business = (await getOwnerBusiness())!;
  const today = todayStr();
  const weekAgo = addDaysStr(today, -6);

  const [todayAppts, weekAppts, totalUpcoming, staffCount] = await Promise.all([
    db.appointment.findMany({
      where: { businessId: business.id, date: today, status: { in: ["CONFIRMED", "COMPLETED"] } },
      include: { staff: { select: { name: true, image: true } }, items: { select: { name: true } } },
      orderBy: { startMin: "asc" },
    }),
    db.appointment.findMany({
      where: {
        businessId: business.id,
        date: { gte: weekAgo, lte: today },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: { date: true, totalTl: true },
    }),
    db.appointment.count({
      where: { businessId: business.id, date: { gte: today }, status: "CONFIRMED" },
    }),
    db.staff.count({ where: { businessId: business.id, active: true } }),
  ]);

  const todayRevenue = todayAppts.reduce((s, a) => s + a.totalTl, 0);
  const weekRevenue = weekAppts.reduce((s, a) => s + a.totalTl, 0);

  // Haftalık günlük ciro (mini grafik)
  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = addDaysStr(weekAgo, i);
    const total = weekAppts.filter((a) => a.date === date).reduce((s, a) => s + a.totalTl, 0);
    return { date, total };
  });
  const maxDaily = Math.max(...dailyRevenue.map((d) => d.total), 1);

  const now = nowMinutes();
  const nextUp = todayAppts.filter((a) => a.startMin >= now);

  const stats = [
    {
      label: "Bugünkü randevu",
      value: String(todayAppts.length),
      icon: CalendarDays,
      tone: "bg-accent-soft text-accent-deep",
    },
    {
      label: "Bugünkü ciro",
      value: formatTl(todayRevenue),
      icon: Wallet,
      tone: "bg-mint-soft text-mint",
    },
    {
      label: "7 günlük ciro",
      value: formatTl(weekRevenue),
      icon: TrendingUp,
      tone: "bg-sea-soft text-sea",
    },
    {
      label: "Puan",
      value: `${business.ratingAvg.toFixed(1)} ★`,
      icon: Star,
      tone: "bg-honey-soft text-honey",
    },
  ];

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Genel bakış
          </h1>
          <p className="mt-1 capitalize text-ink-soft">{formatDateTr(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <Button href="/panel/takvim" variant="accent">
          <Plus className="size-4" /> Takvime git
        </Button>
      </div>

      {/* KPI kartları */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Bugünün programı */}
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Bugünün programı</h2>
            <Link href="/panel/takvim" className="flex items-center gap-1 text-sm font-semibold text-accent-deep hover:underline">
              Takvim <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          {todayAppts.length === 0 ? (
            <div className="rounded-xl bg-cream py-12 text-center">
              <p className="font-semibold text-ink">Bugün için randevu yok</p>
              <p className="mt-1 text-sm text-ink-soft">Takvimden manuel randevu ekleyebilirsin.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {todayAppts.map((a) => {
                const done = a.status === "COMPLETED" || a.startMin < now;
                return (
                  <li key={a.id} className="flex items-center gap-3 py-3">
                    <div className="w-14 shrink-0 text-center">
                      <p className="font-display font-extrabold text-ink">{minToHHMM(a.startMin)}</p>
                      <p className="text-[11px] text-ink-mute">{minToHHMM(a.endMin)}</p>
                    </div>
                    <span className={`h-10 w-1 shrink-0 rounded-full ${done ? "bg-line-strong" : "bg-accent"}`} />
                    <Avatar src={a.staff.image} name={a.staff.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {a.items.map((i) => i.name).join(" + ")}
                      </p>
                      <p className="truncate text-xs text-ink-soft">{a.staff.name}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-ink">{formatTl(a.totalTl)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Yan panel */}
        <div className="space-y-6">
          {/* Haftalık ciro grafiği */}
          <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-ink">Son 7 gün</h2>
            <div className="flex h-32 items-end justify-between gap-2">
              {dailyRevenue.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-md ${d.date === today ? "bg-accent" : "bg-ink/15"}`}
                      style={{ height: `${Math.max((d.total / maxDaily) * 100, 4)}%` }}
                      title={formatTl(d.total)}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-ink-mute">
                    {formatDateTr(d.date, { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Özet */}
          <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-ink">Özet</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink-soft">
                  <Clock className="size-4" /> Sıradaki randevu
                </span>
                <span className="font-bold text-ink">
                  {nextUp.length > 0 ? minToHHMM(nextUp[0].startMin) : "—"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink-soft">
                  <CalendarDays className="size-4" /> Gelecek randevular
                </span>
                <span className="font-bold text-ink">{totalUpcoming}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink-soft">
                  <Star className="size-4" /> Toplam yorum
                </span>
                <span className="font-bold text-ink">{business.ratingCount}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-ink-soft">
                  <TrendingUp className="size-4" /> Aktif personel
                </span>
                <span className="font-bold text-ink">{staffCount}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
