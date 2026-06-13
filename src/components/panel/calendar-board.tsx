"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
} from "@/lib/datetime";
import { formatTl, formatDuration } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/form";

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
  const [newSlot, setNewSlot] = useState<{ staffId: string; startMin: number } | null>(null);
  const [detail, setDetail] = useState<Appt | null>(null);

  const rows: number[] = [];
  for (let t = dayStart; t <= dayEnd; t += 30) rows.push(t);
  const gridHeight = (dayEnd - dayStart) * PPM;

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

  return (
    <div>
      {/* Üst kontrol çubuğu */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Takvim
          </h1>
          <p className="mt-1 capitalize text-ink-soft">
            {formatDateTr(date, { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-line-strong bg-surface">
            <button onClick={() => go(-1)} className="rounded-l-full p-2.5 text-ink hover:bg-cream" aria-label="Önceki gün">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={goToday} className="border-x border-line px-4 py-2 text-sm font-bold text-ink hover:bg-cream">
              Bugün
            </button>
            <button onClick={() => go(1)} className="rounded-r-full p-2.5 text-ink hover:bg-cream" aria-label="Sonraki gün">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <Button variant="accent" onClick={() => staff[0] && setNewSlot({ staffId: staff[0].id, startMin: dayStart })}>
            <Plus className="size-4" /> Randevu
          </Button>
        </div>
      </div>

      {/* Hafta gün şeridi */}
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {Array.from({ length: 14 }, (_, i) => addDaysStr(today, i)).map((d) => {
          const active = d === date;
          return (
            <button
              key={d}
              onClick={() => router.push(`/panel/takvim?gun=${d}`)}
              className={`flex w-14 shrink-0 flex-col items-center rounded-2xl border-2 py-2 transition-all ${
                active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink/40"
              }`}
            >
              <span className="text-[10px] font-bold uppercase opacity-70">
                {WEEKDAYS_SHORT_TR[weekdayOf(d)]}
              </span>
              <span className="font-display text-lg font-extrabold">{d.slice(8)}</span>
            </button>
          );
        })}
      </div>

      {staff.length === 0 ? (
        <EmptyState
          title="Henüz personel yok"
          desc="Takvimi kullanmak için önce ekibini eklemelisin."
          href="/panel/personel"
          cta="Personel ekle"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {closed && (
            <div className="flex items-center gap-2 border-b border-line bg-honey-soft px-4 py-2.5 text-sm font-semibold text-honey">
              <CalendarOff className="size-4" /> Bu gün çalışma saatlerinde kapalı görünüyor — yine de randevu ekleyebilirsin.
            </div>
          )}
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
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
                const appts = appointments.filter((a) => a.staffId === st.id);
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
                    {/* Izgara */}
                    <div
                      className="relative cursor-copy"
                      style={{ height: gridHeight }}
                      onClick={(e) => handleColumnClick(e, st.id)}
                    >
                      {rows.map((t) => (
                        <div
                          key={t}
                          className="absolute inset-x-0 border-b border-line/60"
                          style={{ top: (t - dayStart) * PPM, height: 30 * PPM }}
                        />
                      ))}
                      {appts.map((a) => (
                        <button
                          key={a.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetail(a);
                          }}
                          className={`absolute inset-x-1 overflow-hidden rounded-lg border-l-4 px-2 py-1 text-left transition-shadow hover:shadow-card ${STATUS_STYLE[a.status]}`}
                          style={{
                            top: (a.startMin - dayStart) * PPM + 1,
                            height: (a.endMin - a.startMin) * PPM - 2,
                          }}
                        >
                          <p className="truncate text-[11px] font-bold leading-tight">
                            {minToHHMM(a.startMin)} · {a.customerLabel}
                          </p>
                          <p className="truncate text-[11px] leading-tight opacity-80">{a.services}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lejant */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        {[
          ["Onaylı", "bg-accent"],
          ["Tamamlandı", "bg-mint"],
          ["Gelinmedi", "bg-honey"],
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
  staff,
  serviceCategories,
  onClose,
  onSaved,
}: {
  slot: { staffId: string; startMin: number };
  date: string;
  staff: Staff[];
  serviceCategories: { name: string; services: ServiceItem[] }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const allServices = serviceCategories.flatMap((c) => c.services);
  const [staffId, setStaffId] = useState(slot.staffId);
  const [startMin, setStartMin] = useState(slot.startMin);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const chosen = allServices.filter((s) => selected.has(s.id));
  const totalDur = chosen.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = chosen.reduce((s, x) => s + x.priceTl, 0);

  // Saat seçenekleri (15 dk adım, 08:00–22:00)
  const timeOptions: number[] = [];
  for (let t = 480; t <= 1320; t += 15) timeOptions.push(t);

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
      setError("En az bir hizmet seç.");
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
      });
      if (res.ok) onSaved();
      else setError(res.error);
    });
  }

  return (
    <Modal open onClose={onClose} title="Yeni randevu" maxW="max-w-lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="na-staff">Personel</Label>
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
            <Label htmlFor="na-time">Başlangıç</Label>
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

        <div>
          <Label htmlFor="na-customer">Müşteri adı</Label>
          <Input
            id="na-customer"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Örn. Ayşe K. (boş bırakılabilir)"
          />
        </div>

        <div>
          <Label>Hizmetler</Label>
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

        {error && (
          <p className="rounded-xl bg-rose-soft px-4 py-2.5 text-sm font-medium text-rose">{error}</p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Vazgeç
          </Button>
          <Button variant="accent" className="flex-1" onClick={save} disabled={isPending}>
            {isPending ? "Ekleniyor..." : "Randevu ekle"}
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
  const [isPending, startTransition] = useTransition();

  function setStatus(status: "COMPLETED" | "NO_SHOW" | "CANCELLED") {
    startTransition(async () => {
      await setAppointmentStatusAction(appt.id, status);
      onChanged();
    });
  }

  const STATUS_LABEL: Record<Appt["status"], { tone: "mint" | "accent" | "honey" | "rose"; label: string }> = {
    CONFIRMED: { tone: "accent", label: "Onaylı" },
    COMPLETED: { tone: "mint", label: "Tamamlandı" },
    NO_SHOW: { tone: "honey", label: "Gelinmedi" },
    CANCELLED: { tone: "rose", label: "İptal" },
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
          <p className="mt-1 text-sm text-ink-soft">{staffName} ile</p>
          <p className="mt-2 border-t border-line pt-2 text-sm text-ink">{appt.services}</p>
          <p className="mt-1 font-bold text-ink">{formatTl(appt.totalTl)}</p>
          {appt.note && (
            <p className="mt-2 rounded-lg bg-surface p-2 text-sm text-ink-soft">Not: {appt.note}</p>
          )}
        </div>

        {appt.status === "CONFIRMED" ? (
          <div className="grid grid-cols-1 gap-2">
            <Button variant="accent" onClick={() => setStatus("COMPLETED")} disabled={isPending}>
              <Check className="size-4" /> Tamamlandı olarak işaretle
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setStatus("NO_SHOW")} disabled={isPending}>
                <UserX className="size-4" /> Gelinmedi
              </Button>
              <Button variant="danger" onClick={() => setStatus("CANCELLED")} disabled={isPending}>
                <X className="size-4" /> İptal et
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-ink-soft">
            Bu randevu {badge.label.toLowerCase()} durumunda.
          </p>
        )}
      </div>
    </Modal>
  );
}
