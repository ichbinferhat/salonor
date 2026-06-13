"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  fetchSlotsAction,
  createAppointmentAction,
  inlineLoginAction,
  inlineRegisterAction,
} from "@/server/actions/booking";
import type { Slot } from "@/lib/slots";
import { minToHHMM, formatDateTr, formatDateShortTr, WEEKDAYS_SHORT_TR, weekdayOf } from "@/lib/datetime";
import { formatTl, formatDuration } from "@/lib/format";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";

type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceTl: number;
};

type Props = {
  business: {
    id: string;
    slug: string;
    name: string;
    coverImage: string;
    district: string;
    city: string;
    ratingAvg: number;
    ratingCount: number;
  };
  categories: { id: string; name: string; services: ServiceItem[] }[];
  staff: { id: string; name: string; title: string; image: string; serviceIds: string[] }[];
  days: { date: string; closed: boolean }[];
  initialServiceId: string | null;
  isAuthed: boolean;
  userName: string | null;
};

const STEPS = ["Hizmetler", "Personel", "Tarih & Saat", "Onay"];

export function BookingWizard({
  business,
  categories,
  staff,
  days,
  initialServiceId,
  isAuthed: initialAuthed,
  userName: initialUserName,
}: Props) {
  const allServices = useMemo(
    () => categories.flatMap((c) => c.services),
    [categories]
  );

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(
    () =>
      new Set(
        initialServiceId && allServices.some((s) => s.id === initialServiceId)
          ? [initialServiceId]
          : []
      )
  );
  const [staffChoice, setStaffChoice] = useState<string | null>(null); // null = farketmez
  const [date, setDate] = useState(() => days.find((d) => !d.closed)?.date ?? days[0].date);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(initialAuthed);
  const [userName, setUserName] = useState(initialUserName);
  const [success, setSuccess] = useState<{ code: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isBooking, startBooking] = useTransition();

  const selectedServices = allServices.filter((s) => selected.has(s.id));
  const totalDur = selectedServices.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = selectedServices.reduce((s, x) => s + x.priceTl, 0);

  // Seçilen hizmetlerin tümünü verebilen personeller
  const eligibleStaff = staff.filter((st) =>
    selectedServices.every((s) => st.serviceIds.includes(s.id))
  );

  // Tarih/personel/hizmet değişince slotları yenile
  useEffect(() => {
    if (step !== 2 || selected.size === 0) return;
    setSlots(null);
    setTime(null);
    startTransition(async () => {
      const result = await fetchSlotsAction({
        businessId: business.id,
        date,
        durationMin: totalDur,
        staffId: staffChoice ?? undefined,
        serviceIds: [...selected],
      });
      setSlots(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, date, staffChoice, selected, totalDur, business.id]);

  function toggleService(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setStaffChoice(null);
    setTime(null);
  }

  function confirm() {
    if (time === null) return;
    setError(null);
    startBooking(async () => {
      const res = await createAppointmentAction({
        businessId: business.id,
        serviceIds: [...selected],
        staffId: staffChoice,
        date,
        startMin: time,
        note,
      });
      if (res.ok) setSuccess({ code: res.code });
      else setError(res.error);
    });
  }

  /* ─── Başarı ekranı ─── */
  if (success) {
    return (
      <div className="container-x flex justify-center py-16">
        <div className="anim-rise w-full max-w-md rounded-[28px] border border-line bg-surface p-8 text-center shadow-pop">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint-soft">
            <CheckCircle2 className="size-9 text-mint" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
            Randevun onaylandı!
          </h1>
          <p className="mt-2 text-ink-soft">
            {formatDateTr(date)} · {minToHHMM(time!)}
          </p>
          <p className="font-semibold text-ink">{business.name}</p>
          <div className="mt-5 rounded-2xl bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-mute">
              Randevu kodun
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-wider text-ink">
              {success.code}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            <Button href="/hesap" variant="accent" size="lg">
              Randevularımı gör
            </Button>
            <Button href="/" variant="ghost">
              Ana sayfaya dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canNext =
    step === 0 ? selected.size > 0 : step === 1 ? true : step === 2 ? time !== null : false;

  return (
    <div className="container-x py-8 pb-32 lg:pb-12">
      {/* Adım başlığı */}
      <div className="mb-8">
        <Link
          href={`/salon/${business.slug}`}
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ChevronLeft className="size-4" /> {business.name}
        </Link>
        <ol className="flex flex-wrap items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
                  i === step
                    ? "bg-ink text-white"
                    : i < step
                      ? "bg-mint-soft text-mint"
                      : "bg-surface text-ink-mute border border-line"
                }`}
              >
                {i < step ? <Check className="size-3.5" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-4 bg-line-strong" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {/* ─── Adım 1: Hizmetler ─── */}
          {step === 0 && (
            <div className="anim-rise space-y-7">
              <h1 className="font-display text-2xl font-extrabold text-ink">Hizmet seç</h1>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-ink-mute">
                    {cat.name}
                  </h2>
                  <div className="space-y-2.5">
                    {cat.services.map((s) => {
                      const active = selected.has(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          className={`flex w-full items-center justify-between gap-4 rounded-2xl border-2 bg-surface p-4 text-left transition-all ${
                            active
                              ? "border-accent shadow-card"
                              : "border-line hover:border-ink/30"
                          }`}
                          aria-pressed={active}
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">{s.name}</p>
                            <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-mute">
                              <Clock className="size-3.5" /> {formatDuration(s.durationMin)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className="font-bold text-ink">{formatTl(s.priceTl)}</span>
                            <span
                              className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                                active
                                  ? "border-accent bg-accent text-white"
                                  : "border-line-strong"
                              }`}
                            >
                              {active && <Check className="size-4" />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Adım 2: Personel ─── */}
          {step === 1 && (
            <div className="anim-rise">
              <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">
                Personel seç
              </h1>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setStaffChoice(null)}
                  className={`flex items-center gap-4 rounded-2xl border-2 bg-surface p-4 text-left transition-all ${
                    staffChoice === null ? "border-accent shadow-card" : "border-line hover:border-ink/30"
                  }`}
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-accent-soft">
                    <Sparkles className="size-6 text-accent-deep" />
                  </span>
                  <div>
                    <p className="font-bold text-ink">Farketmez</p>
                    <p className="text-sm text-ink-soft">Müsait olan ilk personel</p>
                  </div>
                </button>
                {eligibleStaff.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStaffChoice(st.id)}
                    className={`flex items-center gap-4 rounded-2xl border-2 bg-surface p-4 text-left transition-all ${
                      staffChoice === st.id ? "border-accent shadow-card" : "border-line hover:border-ink/30"
                    }`}
                  >
                    <Avatar src={st.image} name={st.name} size="lg" />
                    <div>
                      <p className="font-bold text-ink">{st.name}</p>
                      <p className="text-sm text-ink-soft">{st.title}</p>
                    </div>
                  </button>
                ))}
              </div>
              {eligibleStaff.length === 0 && (
                <p className="mt-4 rounded-2xl bg-honey-soft p-4 text-sm font-medium text-honey">
                  Seçtiğin hizmet kombinasyonunu tek başına verebilen personel yok.
                  "Farketmez" ile devam edebilir veya hizmet seçimini değiştirebilirsin.
                </p>
              )}
            </div>
          )}

          {/* ─── Adım 3: Tarih & Saat ─── */}
          {step === 2 && (
            <div className="anim-rise">
              <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">
                Tarih ve saat seç
              </h1>
              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                {days.map((d) => {
                  const active = d.date === date;
                  return (
                    <button
                      key={d.date}
                      disabled={d.closed}
                      onClick={() => setDate(d.date)}
                      className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border-2 py-3 transition-all disabled:opacity-35 ${
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-line bg-surface text-ink hover:border-ink/40"
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase opacity-70">
                        {WEEKDAYS_SHORT_TR[weekdayOf(d.date)]}
                      </span>
                      <span className="font-display text-lg font-extrabold">
                        {d.date.slice(8)}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {formatDateShortTr(d.date).split(" ")[1]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 min-h-48">
                {isPending || slots === null ? (
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-11 animate-pulse rounded-full bg-ink/8" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
                    <p className="font-semibold text-ink">Bu günde uygun saat kalmamış.</p>
                    <p className="mt-1 text-sm text-ink-soft">Başka bir gün seçmeyi dene.</p>
                  </div>
                ) : (
                  <SlotGroups slots={slots} time={time} onPick={setTime} />
                )}
              </div>
            </div>
          )}

          {/* ─── Adım 4: Onay ─── */}
          {step === 3 && (
            <div className="anim-rise max-w-xl">
              <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">
                {authed ? "Randevunu onayla" : "Az kaldı — giriş yap"}
              </h1>

              {!authed ? (
                <InlineAuth
                  onDone={(name) => {
                    setAuthed(true);
                    setUserName(name);
                  }}
                />
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[20px] border border-line bg-surface p-5 shadow-card">
                    <p className="text-sm text-ink-soft">
                      <UserRound className="mr-1.5 inline size-4" />
                      {userName} adına rezervasyon
                    </p>
                    <div className="mt-3 border-t border-line pt-3">
                      <p className="font-bold text-ink">{formatDateTr(date)}</p>
                      <p className="text-ink-soft">
                        {time !== null && minToHHMM(time)} ·{" "}
                        {staffChoice
                          ? eligibleStaff.find((s) => s.id === staffChoice)?.name
                          : "Müsait personel"}
                      </p>
                    </div>
                    <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
                      {selectedServices.map((s) => (
                        <li key={s.id} className="flex justify-between text-ink-soft">
                          <span>{s.name}</span>
                          <span className="font-semibold text-ink">{formatTl(s.priceTl)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between border-t border-line pt-2 font-bold text-ink">
                        <span>Toplam · {formatDuration(totalDur)}</span>
                        <span>{formatTl(totalTl)}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <Label htmlFor="note">Not (isteğe bağlı)</Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Salona iletmek istediğin bir not var mı?"
                    />
                  </div>

                  <FormError message={error} />

                  <Button
                    variant="accent"
                    size="xl"
                    className="w-full"
                    onClick={confirm}
                    disabled={isBooking}
                  >
                    {isBooking ? "Onaylanıyor..." : `Randevuyu onayla — ${formatTl(totalTl)}`}
                  </Button>
                  <p className="text-center text-xs text-ink-mute">
                    Ödeme salonda yapılır. Ücretsiz iptal hakkın var.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Özet kartı ─── */}
        <aside className="sticky top-20 hidden rounded-[24px] border border-line bg-surface p-5 shadow-card lg:block">
          <div className="flex gap-3.5">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
              <Image src={business.coverImage} alt={business.name} fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-ink">{business.name}</p>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <strong>{business.ratingAvg.toFixed(1)}</strong>
                <RatingStars value={business.ratingAvg} size="sm" />
              </div>
              <p className="mt-0.5 truncate text-sm text-ink-soft">
                {business.district}, {business.city}
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-line pt-4">
            {selectedServices.length === 0 ? (
              <p className="text-sm text-ink-mute">Henüz hizmet seçilmedi.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {selectedServices.map((s) => (
                  <li key={s.id} className="flex justify-between gap-3">
                    <span className="text-ink-soft">{s.name}</span>
                    <span className="shrink-0 font-semibold text-ink">{formatTl(s.priceTl)}</span>
                  </li>
                ))}
              </ul>
            )}
            {selectedServices.length > 0 && (
              <div className="mt-3 flex justify-between border-t border-line pt-3 font-bold text-ink">
                <span>{formatDuration(totalDur)}</span>
                <span>{formatTl(totalTl)}</span>
              </div>
            )}
            {time !== null && step >= 2 && (
              <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-sm font-bold text-accent-deep">
                {formatDateShortTr(date)} · {minToHHMM(time)}
              </p>
            )}
          </div>
          {step < 3 && (
            <Button
              variant="primary"
              size="lg"
              className="mt-5 w-full"
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
            >
              Devam et
            </Button>
          )}
        </aside>
      </div>

      {/* Mobil alt bar */}
      {step < 3 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-3 backdrop-blur-md lg:hidden">
          <div className="container-x flex items-center justify-between gap-3 !px-1">
            <div className="text-sm">
              <p className="font-bold text-ink">
                {selectedServices.length} hizmet · {formatTl(totalTl)}
              </p>
              <p className="text-ink-soft">
                {time !== null ? `${formatDateShortTr(date)} · ${minToHHMM(time)}` : formatDuration(totalDur)}
              </p>
            </div>
            <Button variant="primary" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Devam et
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Saat grupları ─── */
function SlotGroups({
  slots,
  time,
  onPick,
}: {
  slots: Slot[];
  time: number | null;
  onPick: (t: number) => void;
}) {
  const groups: [string, Slot[]][] = [
    ["Sabah", slots.filter((s) => s.time < 720)],
    ["Öğleden sonra", slots.filter((s) => s.time >= 720 && s.time < 1020)],
    ["Akşam", slots.filter((s) => s.time >= 1020)],
  ];
  return (
    <div className="space-y-5">
      {groups.map(
        ([label, list]) =>
          list.length > 0 && (
            <div key={label}>
              <h3 className="mb-2.5 text-sm font-bold text-ink-soft">{label}</h3>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {list.map((s) => (
                  <button
                    key={s.time}
                    onClick={() => onPick(s.time)}
                    className={`h-11 rounded-full border-2 text-sm font-bold transition-all ${
                      time === s.time
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-surface text-ink hover:border-accent/60"
                    }`}
                  >
                    {minToHHMM(s.time)}
                  </button>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}

/* ─── Akış içi giriş/kayıt ─── */
function InlineAuth({ onDone }: { onDone: (name: string) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res =
        tab === "login"
          ? await inlineLoginAction({
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
            })
          : await inlineRegisterAction({
              name: String(formData.get("name") ?? ""),
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
            });
      if (res.ok) onDone(res.name);
      else setError(res.error);
    });
  }

  return (
    <div className="rounded-[20px] border border-line bg-surface p-6 shadow-card">
      <div className="mb-5 grid grid-cols-2 rounded-full bg-cream p-1">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full py-2 text-sm font-bold transition-colors ${
              tab === t ? "bg-ink text-white" : "text-ink-soft"
            }`}
          >
            {t === "login" ? "Giriş yap" : "Hızlı kayıt"}
          </button>
        ))}
      </div>
      <form action={submit} className="space-y-3.5">
        {tab === "register" && (
          <div>
            <Label htmlFor="ba-name">Ad Soyad</Label>
            <Input id="ba-name" name="name" required placeholder="Adın Soyadın" />
          </div>
        )}
        <div>
          <Label htmlFor="ba-email">E-posta</Label>
          <Input id="ba-email" name="email" type="email" required placeholder="ornek@eposta.com" />
        </div>
        <div>
          <Label htmlFor="ba-password">Şifre</Label>
          <Input id="ba-password" name="password" type="password" required minLength={6} placeholder="••••••••" />
        </div>
        <FormError message={error} />
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Lütfen bekle..." : tab === "login" ? "Giriş yap ve devam et" : "Kayıt ol ve devam et"}
        </Button>
      </form>
      <p className="mt-3 text-center text-xs text-ink-mute">
        Demo: musteri@salonor.com · salonor123
      </p>
    </div>
  );
}
