"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  Clock,
  UserX,
  CalendarOff,
} from "lucide-react";
import {
  createWalkInAction,
  setAppointmentStatusAction,
} from "@/server/actions/business";
import {
  minToHHMM,
  formatDateTr,
  addDaysStr,
  WEEKDAYS_SHORT_TR,
  weekdayOf,
  nowMinutes,
} from "@/lib/datetime";
import { formatTl, formatDuration } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/form";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

type Staff = { id: string; name: string; image: string; title: string };
type Appt = {
  id: string;
  staffId: string;
  startMin: number;
  endMin: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  customerLabel: string;
  services: string;
  totalTl: number;
  code: string;
  note: string | null;
};
type ServiceItem = { id: string; name: string; durationMin: number; priceTl: number };

const PPM = 1.5; // dakika başına piksel
const STATUS_STYLE: Record<Appt["status"], string> = {
  CONFIRMED: "bg-accent-soft border-accent/40 text-accent-deep",
  COMPLETED: "bg-mint-soft border-mint/40 text-mint",
  NO_SHOW: "bg-honey-soft border-honey/40 text-honey",
  CANCELLED: "bg-cream border-line text-ink-mute",
};

// Çakışan randevuları yan yana yerleştir (Google Calendar mantığı). Aynı zaman
// aralığını paylaşan randevular örtüşme kümelerine ayrılır; kümedeki her randevu
// bir "şeride" (lane) atanır. Böylece alttaki randevu gizlenmez.
type LaidOut = Appt & { lane: number; lanes: number };
function layoutAppts(list: Appt[]): LaidOut[] {
  const sorted = [...list].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const out: LaidOut[] = [];
  let i = 0;
  while (i < sorted.length) {
    // Bir örtüşme kümesi topla: yeni randevu kümedeki herhangi biriyle çakıştığı sürece
    const cluster: Appt[] = [sorted[i]];
    let clusterEnd = sorted[i].endMin;
    let j = i + 1;
    while (j < sorted.length && sorted[j].startMin < clusterEnd) {
      cluster.push(sorted[j]);
      clusterEnd = Math.max(clusterEnd, sorted[j].endMin);
      j++;
    }
    // Küme içinde şerit ata: ilk uygun (boş) şeride yerleştir
    const laneEnds: number[] = [];
    const assigned = cluster.map((a) => {
      let lane = laneEnds.findIndex((end) => end <= a.startMin);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(a.endMin);
      } else {
        laneEnds[lane] = a.endMin;
      }
      return { appt: a, lane };
    });
    const lanes = laneEnds.length;
    for (const { appt, lane } of assigned) out.push({ ...appt, lane, lanes });
    i = j;
  }
  return out;
}

export function CalendarBoard({
  date,
  today,
  dayStart,
  dayEnd,
  closed,
  staff,
  appointments,
  serviceCategories,
}: {
  date: string;
  today: string;
  dayStart: number;
  dayEnd: number;
  closed: boolean;
  staff: Staff[];
  appointments: Appt[];
  serviceCategories: { name: string; services: ServiceItem[] }[];
}) {
  const router = useRouter();
  const t = useDict().panelCore;
  const [newSlot, setNewSlot] = useState<{ staffId: string; startMin: number } | null>(null);
  const [detail, setDetail] = useState<Appt | null>(null);

  // "Şu an" çizgisi — yalnızca bugün görüntülenirken
  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    if (date !== today) {
      setNowMin(null);
      return;
    }
    const tick = () => setNowMin(nowMinutes());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [date, today]);
  const showNow = nowMin !== null && nowMin >= dayStart && nowMin <= dayEnd;

  const rows: number[] = [];
  for (let t = dayStart; t <= dayEnd; t += 30) rows.push(t);
  const gridHeight = (dayEnd - dayStart) * PPM;

  // Seçili günü içeren hafta (Pazartesi başlangıçlı)
  const weekStart = addDaysStr(date, -((weekdayOf(date) + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => addDaysStr(weekStart, i));
  const monthLabel = formatDateTr(date, { month: "long", year: "numeric" });

  function go(deltaDays: number) {
    router.push(`/panel/takvim?gun=${addDaysStr(date, deltaDays)}`);
  }
  function goToday() {
    router.push(`/panel/takvim?gun=${today}`);
  }

  function handleColumnClick(e: React.MouseEvent<HTMLDivElement>, staffId: string) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const raw = dayStart + y / PPM;
    const snapped = Math.floor(raw / 15) * 15;
    setNewSlot({ staffId, startMin: Math.max(dayStart, Math.min(snapped, dayEnd - 15)) });
  }

  // Klavye eşdeğeri: fare konumu yok, bu yüzden sütun için makul bir başlangıç
  // saatiyle (bugünse "şu an", aksi halde gün başı) modalı aç.
  function handleColumnKeyDown(e: React.KeyboardEvent<HTMLDivElement>, staffId: string) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const base =
      date === today && nowMin !== null
        ? Math.max(dayStart, Math.ceil(nowMin / 15) * 15)
        : dayStart;
    setNewSlot({ staffId, startMin: Math.min(base, dayEnd - 15) });
  }

  return (
    <div>
      {/* Başlık + ana eylem */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t.calendarTitle}
          </h1>
          <p className="mt-0.5 truncate text-sm capitalize text-ink-soft">
            {formatDateTr(date, { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Button
          variant="accent"
          onClick={() => {
            if (!staff[0]) return;
            // Bugünse "şu an"a (15 dk'ya yuvarlanmış) başla, aksi halde gün başına
            const base =
              date === today && nowMin !== null
                ? Math.max(dayStart, Math.ceil(nowMin / 15) * 15)
                : dayStart;
            setNewSlot({ staffId: staff[0].id, startMin: Math.min(base, dayEnd - 15) });
          }}
        >
          <Plus className="size-4" /> {t.newAppt}
        </Button>
      </div>

      {/* Hafta gezgini — tek, sade tarih seçici */}
      <div className="mb-5 rounded-2xl border border-line bg-surface p-2.5 shadow-card">
        <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
          <button
            onClick={() => go(-1)}
            className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
            aria-label={t.prevDay}
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold capitalize text-ink">{monthLabel}</span>
            {date !== today && (
              <button
                onClick={goToday}
                className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-ink-soft transition-colors hover:text-ink"
              >
                {t.today}
              </button>
            )}
          </div>
          <button
            onClick={() => go(1)}
            className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
            aria-label={t.nextDay}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {week.map((d) => {
            const active = d === date;
            const isToday = d === today;
            return (
              <button
                key={d}
                onClick={() => router.push(`/panel/takvim?gun=${d}`)}
                className={`flex flex-col items-center rounded-xl py-2 transition-colors ${
                  active ? "bg-ink text-white" : "text-ink hover:bg-cream"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase ${active ? "text-white/70" : "text-ink-mute"}`}
                >
                  {WEEKDAYS_SHORT_TR[weekdayOf(d)]}
                </span>
                <span className="mt-0.5 font-display text-base font-extrabold sm:text-lg">
                  {Number(d.slice(8))}
                </span>
                <span
                  className={`mt-1 size-1.5 rounded-full ${
                    isToday ? (active ? "bg-white" : "bg-accent") : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          title={t.noStaffTitle}
          desc={t.noStaffDesc}
          href="/panel/personel"
          cta={t.addStaff}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {closed && (
            <div className="flex items-center gap-2 border-b border-line bg-honey-soft px-4 py-2.5 text-sm font-semibold text-honey">
              <CalendarOff className="size-4" /> {t.closedNotice}
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="relative flex min-w-max">
              {/* Saat sütunu */}
              <div className="sticky left-0 z-10 w-16 shrink-0 border-r border-line bg-surface">
                <div className="h-12 border-b border-line" />
                <div className="relative" style={{ height: gridHeight }}>
                  {rows.map((t) => (
                    <div
                      key={t}
                      className="absolute right-2 -translate-y-1/2 text-[11px] font-semibold text-ink-mute"
                      style={{ top: (t - dayStart) * PPM }}
                    >
                      {minToHHMM(t)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personel sütunları */}
              {staff.map((st) => {
                const appts = layoutAppts(appointments.filter((a) => a.staffId === st.id));
                return (
                  <div key={st.id} className="w-48 shrink-0 border-r border-line last:border-r-0">
                    {/* Başlık */}
                    <div className="flex h-12 items-center gap-2 border-b border-line bg-cream/50 px-3">
                      <Avatar src={st.image} name={st.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{st.name}</p>
                        <p className="truncate text-[11px] text-ink-soft">{st.title}</p>
                      </div>
                    </div>
                    {/* Izgara — fareyle saat seçip randevu açılır; klavye için
                        Enter/Space ile makul bir başlangıç saatiyle modal açılır.
                        Üstteki "Yeni randevu" düğmesi tam erişilebilir alternatiftir. */}
                    <div
                      className="relative cursor-copy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                      style={{ height: gridHeight }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${st.name} · ${t.newAppt}`}
                      onClick={(e) => handleColumnClick(e, st.id)}
                      onKeyDown={(e) => handleColumnKeyDown(e, st.id)}
                    >
                      {rows.map((t) => (
                        <div
                          key={t}
                          className="absolute inset-x-0 border-b border-line/60"
                          style={{ top: (t - dayStart) * PPM, height: 30 * PPM }}
                        />
                      ))}
                      {appts.map((a) => {
                        // Şerit (lane) bazlı yan yana yerleşim: çakışan randevular
                        // bölünür, böylece hiçbiri tamamen gizlenmez.
                        const widthPct = 100 / a.lanes;
                        return (
                          <button
                            key={a.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetail(a);
                            }}
                            className={`absolute overflow-hidden rounded-lg border-l-4 px-2 py-1 text-left transition-shadow hover:z-10 hover:shadow-card ${STATUS_STYLE[a.status]} ${a.lanes > 1 ? "ring-1 ring-surface" : ""}`}
                            style={{
                              top: (a.startMin - dayStart) * PPM + 1,
                              height: (a.endMin - a.startMin) * PPM - 2,
                              left: `calc(${a.lane * widthPct}% + 4px)`,
                              width: `calc(${widthPct}% - 8px)`,
                            }}
                          >
                            <p className="truncate text-[11px] font-bold leading-tight">
                              {minToHHMM(a.startMin)} · {a.customerLabel}
                            </p>
                            <p className="truncate text-[11px] leading-tight opacity-80">{a.services}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* "Şu an" çizgisi */}
              {showNow && (
                <div
                  className="pointer-events-none absolute left-16 right-0 z-20"
                  style={{ top: 48 + (nowMin! - dayStart) * PPM }}
                >
                  <div className="relative h-0.5 bg-rose">
                    <span className="absolute -left-1 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-rose ring-2 ring-surface" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lejant */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        {[
          [t.legendConfirmed, "bg-accent"],
          [t.legendCompleted, "bg-mint"],
          [t.legendNoShow, "bg-honey"],
        ].map(([label, c]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`size-3 rounded-full ${c}`} /> {label}
          </span>
        ))}
      </div>

      {/* Yeni randevu modalı */}
      {newSlot && (
        <NewAppointmentModal
          slot={newSlot}
          date={date}
          dayStart={dayStart}
          dayEnd={dayEnd}
          // Bugün görüntüleniyorsa "şu an"dan önceki saatleri seçtirme
          minMin={date === today && nowMin !== null ? nowMin : null}
          staff={staff}
          serviceCategories={serviceCategories}
          onClose={() => setNewSlot(null)}
          onSaved={() => {
            setNewSlot(null);
            router.refresh();
          }}
        />
      )}

      {/* Randevu detay modalı */}
      {detail && (
        <AppointmentDetailModal
          appt={detail}
          staffName={staff.find((s) => s.id === detail.staffId)?.name ?? ""}
          onClose={() => setDetail(null)}
          onChanged={() => {
            setDetail(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function EmptyState({ title, desc, href, cta }: { title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-ink-soft">{desc}</p>
      <Button href={href} variant="accent" className="mt-5">{cta}</Button>
    </div>
  );
}

function NewAppointmentModal({
  slot,
  date,
  dayStart,
  dayEnd,
  minMin,
  staff,
  serviceCategories,
  onClose,
  onSaved,
}: {
  slot: { staffId: string; startMin: number };
  date: string;
  dayStart: number;
  dayEnd: number;
  minMin: number | null;
  staff: Staff[];
  serviceCategories: { name: string; services: ServiceItem[] }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useDict().panelCore;
  const allServices = serviceCategories.flatMap((c) => c.services);

  // Saat seçenekleri: sabit 08–22 yerine takvimin gerçek aralığına (çalışma saati +
  // randevuların kapsadığı aralık) göre üret. Bugün görüntüleniyorsa "şu an"dan önceki
  // saatleri gizle. 15 dk adım.
  const lowerBound = minMin !== null ? Math.max(dayStart, Math.ceil(minMin / 15) * 15) : dayStart;
  const timeOptions: number[] = [];
  for (let t = lowerBound; t <= dayEnd - 15; t += 15) timeOptions.push(t);
  // Hiç geçerli saat yoksa (gün bitmiş) en azından gün sonu öncesi tek seçenek bırak
  if (timeOptions.length === 0) timeOptions.push(Math.max(dayStart, dayEnd - 15));

  // Seçili başlangıç listede yoksa en yakın geçerli değere yuvarla (kontrollü select'in
  // gösterilen ↔ kaydedilen saat tutarsızlığını önler).
  const clampStart = (v: number) =>
    timeOptions.includes(v) ? v : timeOptions.reduce((best, t) => (Math.abs(t - v) < Math.abs(best - v) ? t : best), timeOptions[0]);

  const [staffId, setStaffId] = useState(slot.staffId);
  const [startMin, setStartMin] = useState(() => clampStart(slot.startMin));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const chosen = allServices.filter((s) => selected.has(s.id));
  const totalDur = chosen.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = chosen.reduce((s, x) => s + x.priceTl, 0);
  const overflowsDay = totalDur > 0 && startMin + totalDur > dayEnd;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function save() {
    if (selected.size === 0) {
      setError(t.selectAtLeastOneService);
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await createWalkInAction({
        staffId,
        date,
        startMin,
        serviceIds: [...selected],
        customerName,
        customerPhone,
      });
      if (res.ok) onSaved();
      else setError(res.error);
    });
  }

  return (
    <Modal open onClose={onClose} title={t.newApptTitle} maxW="max-w-lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="na-staff">{t.staffField}</Label>
            <select
              id="na-staff"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="h-12 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] focus:border-accent focus:outline-none"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="na-time">{t.startField}</Label>
            <select
              id="na-time"
              value={startMin}
              onChange={(e) => setStartMin(Number(e.target.value))}
              className="h-12 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] focus:border-accent focus:outline-none"
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>{minToHHMM(t)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="na-customer">{t.customerNameField}</Label>
            <Input
              id="na-customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t.customerNamePlaceholder}
            />
          </div>
          <div>
            <Label htmlFor="na-phone">{t.phoneField}</Label>
            <Input
              id="na-phone"
              type="tel"
              inputMode="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
            />
          </div>
        </div>

        <div>
          <Label>{t.servicesField}</Label>
          <div className="max-h-56 space-y-3 overflow-y-auto rounded-xl border border-line bg-cream/40 p-3">
            {serviceCategories.map((cat) => (
              <div key={cat.name}>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
                  {cat.name}
                </p>
                <div className="space-y-1.5">
                  {cat.services.map((s) => {
                    const active = selected.has(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggle(s.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          active ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-ink/30"
                        }`}
                      >
                        <span className="font-semibold text-ink">{s.name}</span>
                        <span className="flex items-center gap-2 text-xs text-ink-soft">
                          {formatDuration(s.durationMin)} · {formatTl(s.priceTl)}
                          <span className={`flex size-5 items-center justify-center rounded-full border ${active ? "border-accent bg-accent text-white" : "border-line-strong"}`}>
                            {active && <Check className="size-3" />}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {chosen.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-white">
            <span className="text-sm">
              {minToHHMM(startMin)}–{minToHHMM(startMin + totalDur)} · {formatDuration(totalDur)}
            </span>
            <span className="font-bold">{formatTl(totalTl)}</span>
          </div>
        )}

        {overflowsDay && (
          <p className="rounded-xl bg-honey-soft px-4 py-2.5 text-sm font-medium text-honey">
            {interpolate(t.overflowsDay, { end: minToHHMM(dayEnd) })}
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-rose-soft px-4 py-2.5 text-sm font-medium text-rose">{error}</p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="accent" className="flex-1" onClick={save} disabled={isPending}>
            {isPending ? t.adding : t.addAppt}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AppointmentDetailModal({
  appt,
  staffName,
  onClose,
  onChanged,
}: {
  appt: Appt;
  staffName: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const t = useDict().panelCore;
  const [isPending, startTransition] = useTransition();

  function setStatus(status: "COMPLETED" | "NO_SHOW" | "CANCELLED") {
    startTransition(async () => {
      const r = await setAppointmentStatusAction(appt.id, status);
      if (r && !r.ok) {
        alert(r.error ?? "İşlem yapılamadı, lütfen tekrar dene.");
        return;
      }
      onChanged();
    });
  }

  const STATUS_LABEL: Record<Appt["status"], { tone: "mint" | "accent" | "honey" | "rose"; label: string }> = {
    CONFIRMED: { tone: "accent", label: t.statusConfirmed },
    COMPLETED: { tone: "mint", label: t.statusCompleted },
    NO_SHOW: { tone: "honey", label: t.statusNoShow },
    CANCELLED: { tone: "rose", label: t.statusCancelled },
  };
  const badge = STATUS_LABEL[appt.status];

  return (
    <Modal open onClose={onClose} title={appt.customerLabel} maxW="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge tone={badge.tone}>{badge.label}</Badge>
          <span className="text-sm font-mono text-ink-mute">{appt.code}</span>
        </div>

        <div className="rounded-xl bg-cream p-4">
          <p className="flex items-center gap-2 font-bold text-ink">
            <Clock className="size-4" /> {minToHHMM(appt.startMin)} – {minToHHMM(appt.endMin)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{interpolate(t.withStaff, { staff: staffName })}</p>
          <p className="mt-2 border-t border-line pt-2 text-sm text-ink">{appt.services}</p>
          <p className="mt-1 font-bold text-ink">{formatTl(appt.totalTl)}</p>
          {appt.note && (
            <p className="mt-2 rounded-lg bg-surface p-2 text-sm text-ink-soft">{t.noteLabel} {appt.note}</p>
          )}
        </div>

        {appt.status === "CONFIRMED" ? (
          <div className="grid grid-cols-1 gap-2">
            <Button variant="accent" onClick={() => setStatus("COMPLETED")} disabled={isPending}>
              <Check className="size-4" /> {t.markCompleted}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setStatus("NO_SHOW")} disabled={isPending}>
                <UserX className="size-4" /> {t.markNoShow}
              </Button>
              <Button variant="danger" onClick={() => setStatus("CANCELLED")} disabled={isPending}>
                <X className="size-4" /> {t.cancelAppt}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-ink-soft">
            {interpolate(t.apptStatusInfo, { status: badge.label.toLowerCase() })}
          </p>
        )}
      </div>
    </Modal>
  );
}
