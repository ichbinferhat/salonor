import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  AlertTriangle,
  Scissors,
} from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { PanelPageHeader } from "@/components/panel/page-header";
import { AiInsights } from "@/components/panel/ai-insights";
import { todayStr, addDaysStr, WEEKDAYS_TR, minToHHMM } from "@/lib/datetime";
import { formatTl } from "@/lib/format";

export const metadata = { title: "AI Analiz — Salonor" };

export default async function AiAnalysisPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.ai;
  const today = todayStr();
  const d30 = addDaysStr(today, -30);
  const d60 = addDaysStr(today, -60);

  const [appts, sales, products] = await Promise.all([
    db.appointment.findMany({
      where: { businessId: business.id, date: { gte: d60 } },
      include: { items: true, staff: { select: { name: true } } },
    }),
    db.sale.findMany({ where: { businessId: business.id, date: { gte: d60 } } }),
    db.product.findMany({ where: { businessId: business.id } }),
  ]);

  // --- Gelir trendi (son 30 gün vs önceki 30 gün) ---
  const revInRange = (from: string, to: string) => {
    const a = appts
      .filter((x) => x.status === "COMPLETED" && x.date >= from && x.date < to)
      .reduce((s, x) => s + x.totalTl, 0);
    const s = sales.filter((x) => x.date >= from && x.date < to).reduce((sum, x) => sum + x.totalTl, 0);
    return a + s;
  };
  const last30 = revInRange(d30, addDaysStr(today, 1));
  const prev30 = revInRange(d60, d30);
  const trendPct = prev30 > 0 ? Math.round(((last30 - prev30) / prev30) * 100) : last30 > 0 ? 100 : 0;

  // --- En yoğun gün & saat (son 60 gün, iptal hariç) ---
  const activeAppts = appts.filter((a) => a.status !== "CANCELLED");
  const byWeekday = new Array(7).fill(0);
  const byHour = new Map<number, number>();
  for (const a of activeAppts) {
    const wd = new Date(a.date + "T00:00:00").getDay();
    byWeekday[wd] += 1;
    const hour = Math.floor(a.startMin / 60);
    byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
  }
  // "En yoğun gün/saat" yalnızca anlamlı veri varken gösterilir. Seyrek/eşit veride
  // (tüm günler 0 veya beraberlik) indexOf hep 0 = Pazar döndürür; bunu önlemek için
  // en az birkaç randevu eşiği ararız, yoksa "—" gösteririz.
  const MIN_BUSY = 3; // anlamlı "en yoğun" için minimum randevu sayısı
  const maxWeekday = Math.max(...byWeekday);
  const busiestWeekday = maxWeekday >= MIN_BUSY ? byWeekday.indexOf(maxWeekday) : -1;
  const topHourEntry = [...byHour.entries()].sort((a, b) => b[1] - a[1])[0];
  const busiestHour = topHourEntry && topHourEntry[1] >= MIN_BUSY ? topHourEntry[0] : undefined;

  // --- En çok gelir getiren hizmetler ---
  const serviceRev = new Map<string, { name: string; count: number; rev: number }>();
  for (const a of activeAppts) {
    for (const it of a.items) {
      const cur = serviceRev.get(it.name) ?? { name: it.name, count: 0, rev: 0 };
      cur.count += 1;
      cur.rev += it.priceTl;
      serviceRev.set(it.name, cur);
    }
  }
  const topServices = [...serviceRev.values()].sort((a, b) => b.rev - a.rev).slice(0, 5);

  // --- Personel performansı (tamamlanan randevu + gelir) ---
  const staffPerf = new Map<string, { name: string; done: number; rev: number }>();
  for (const a of appts) {
    if (a.status !== "COMPLETED") continue;
    const name = a.staff?.name ?? "—";
    const cur = staffPerf.get(name) ?? { name, done: 0, rev: 0 };
    cur.done += 1;
    cur.rev += a.totalTl;
    staffPerf.set(name, cur);
  }
  const topStaff = [...staffPerf.values()].sort((a, b) => b.rev - a.rev).slice(0, 5);

  // --- Riskli (kaybolan) müşteriler: son 60 günde gelmiş ama son 30 günde gelmemiş ---
  const lastVisit = new Map<string, string>();
  for (const a of activeAppts) {
    const key = a.customerId ?? a.customerPhone ?? a.customerName ?? "?";
    if (!lastVisit.has(key) || a.date > lastVisit.get(key)!) lastVisit.set(key, a.date);
  }
  const atRisk = [...lastVisit.values()].filter((d) => d < d30).length;

  // --- Düşük stok ---
  const lowStock = products.filter((p) => p.stock <= p.lowStockAt);

  // --- No-show oranı ---
  const totalForShow = appts.filter((a) => ["COMPLETED", "NO_SHOW"].includes(a.status)).length;
  const noShows = appts.filter((a) => a.status === "NO_SHOW").length;
  const noShowPct = totalForShow > 0 ? Math.round((noShows / totalForShow) * 100) : 0;

  // --- Ortalama sepet ---
  const completedCount = appts.filter((a) => a.status === "COMPLETED").length + sales.length;
  const avgTicket = completedCount > 0 ? Math.round((last30 + prev30) / Math.max(1, completedCount)) : 0;

  // --- AI önerileri (kurallı içgörü motoru) ---
  const tips: string[] = [];
  if (trendPct < 0)
    tips.push(
      interpolate(t.tipRevenueDown, { pct: Math.abs(trendPct) }) +
        (atRisk > 0 ? interpolate(t.tipRevenueDownAtRisk, { n: atRisk }) : t.tipRevenueDownLoyal)
    );
  else if (trendPct > 0)
    tips.push(interpolate(t.tipRevenueUp, { pct: trendPct }));
  if (busiestHour !== undefined)
    tips.push(interpolate(t.tipBusiestHour, { time: minToHHMM(busiestHour * 60) }));
  if (byWeekday.some((v) => v === 0) || Math.min(...byWeekday.filter((v) => v > 0)) < Math.max(...byWeekday) / 3)
    tips.push(t.tipQuietDays);
  if (atRisk > 0)
    tips.push(interpolate(t.tipAtRisk, { n: atRisk }));
  if (lowStock.length > 0)
    tips.push(interpolate(t.tipLowStock, { n: lowStock.length, names: lowStock.slice(0, 3).map((p) => p.name).join(", ") }));
  if (noShowPct >= 15)
    tips.push(interpolate(t.tipNoShow, { pct: noShowPct }));
  if (topServices[0])
    tips.push(interpolate(t.tipTopService, { name: topServices[0].name }));
  if (tips.length === 0)
    tips.push(t.tipNoData);

  const hasData = activeAppts.length > 0 || sales.length > 0;

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={t.subtitle}
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-[#ff5fa2] px-3 py-1.5 text-xs font-bold text-white shadow-pop">
            <Sparkles className="size-3.5" /> {t.smartBadge}
          </span>
        }
      />

      {!hasData ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent-faint">
            <Sparkles className="size-7 text-accent" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.collectingTitle}</h2>
          <p className="mt-2 max-w-sm text-ink-soft">
            {t.collectingDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Üst metrikler */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              icon={trendPct >= 0 ? TrendingUp : TrendingDown}
              tone={trendPct >= 0 ? "up" : "down"}
              label={t.metricRevenue}
              value={formatTl(last30)}
              sub={interpolate(t.metricRevenueSub, { pct: `${trendPct >= 0 ? "+" : ""}${trendPct}` })}
            />
            <Metric
              icon={Clock}
              label={t.metricBusiest}
              value={busiestWeekday >= 0 ? WEEKDAYS_TR[busiestWeekday] : t.none}
              sub={busiestHour !== undefined ? interpolate(t.metricBusiestSub, { time: minToHHMM(busiestHour * 60) }) : ""}
            />
            <Metric icon={Award} label={t.metricAvgTicket} value={formatTl(avgTicket)} sub={t.metricAvgTicketSub} />
            <Metric
              icon={AlertTriangle}
              tone={atRisk > 0 ? "down" : undefined}
              label={t.metricAtRisk}
              value={atRisk.toString()}
              sub={t.metricAtRiskSub}
            />
          </div>

          {/* AI öneriler (gerçek Gemini; yoksa kural-tabanlı fallback) */}
          <AiInsights fallback={tips} />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* En çok kazandıran hizmetler */}
            <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Scissors className="size-5 text-accent" /> {t.topServicesTitle}
              </h2>
              {topServices.length === 0 ? (
                <p className="text-sm text-ink-mute">{t.notEnoughData}</p>
              ) : (
                <ul className="space-y-3">
                  {topServices.map((s, i) => {
                    const max = topServices[0].rev || 1;
                    return (
                      <li key={s.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-ink">
                            {i + 1}. {s.name}
                          </span>
                          <span className="font-bold text-ink">{formatTl(s.rev)}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${(s.rev / max) * 100}%` }} />
                        </div>
                        <p className="mt-0.5 text-xs text-ink-mute">{interpolate(t.transactions, { n: s.count })}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Personel performansı */}
            <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Award className="size-5 text-mint" /> {t.staffPerfTitle}
              </h2>
              {topStaff.length === 0 ? (
                <p className="text-sm text-ink-mute">{t.notEnoughData}</p>
              ) : (
                <ul className="space-y-3">
                  {topStaff.map((s, i) => {
                    const max = topStaff[0].rev || 1;
                    return (
                      <li key={s.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-ink">
                            {i + 1}. {s.name}
                          </span>
                          <span className="font-bold text-ink">{formatTl(s.rev)}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream">
                          <div className="h-full rounded-full bg-mint" style={{ width: `${(s.rev / max) * 100}%` }} />
                        </div>
                        <p className="mt-0.5 text-xs text-ink-mute">{interpolate(t.staffCompleted, { n: s.done })}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <Icon
          className={`size-4 ${tone === "up" ? "text-mint" : tone === "down" ? "text-rose" : "text-ink-mute"}`}
        />
        {label}
      </div>
      <p className="mt-1.5 font-display text-2xl font-extrabold text-ink">{value}</p>
      {sub && (
        <p className={`mt-0.5 text-xs ${tone === "up" ? "text-mint" : tone === "down" ? "text-rose" : "text-ink-mute"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
