"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  fetchSlotsAction,
  createAppointmentAction,
  validateCampaignAction,
} from "@/server/actions/booking";
import type { Slot } from "@/lib/slots";
import { minToHHMM } from "@/lib/datetime";
import { formatTl, formatDuration } from "@/lib/format";
import { isValidTrMobile } from "@/lib/phone";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";
import { StyleAdvisor } from "@/components/booking/style-advisor";
import { useDict, useLocale } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

// "YYYY-MM-DD" tarih dizesini, kayıt edildiği gün koruyacak şekilde (öğle UTC) Date'e çevirir.
function parseDay(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00Z");
}

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

export function BookingWizard({
  business,
  categories,
  staff,
  days,
  initialServiceId,
  isAuthed,
  userName: initialUserName,
}: Props) {
  const dict = useDict();
  const locale = useLocale();
  const b = dict.booking;
  const STEPS = [b.steps.services, b.steps.staff, b.steps.dateTime, b.steps.confirm];

  // Aktif dile göre tarih biçimlendiriciler (8 dilli; sabit TR biçim kullanılmaz).
  const fmt = useMemo(() => {
    const opt = (o: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, { ...o, timeZone: "UTC" });
    const full = opt({ day: "numeric", month: "long", weekday: "long" });
    const short = opt({ day: "numeric", month: "short" });
    const weekdayShort = opt({ weekday: "short" });
    const monthShort = opt({ month: "short" });
    return {
      // "14 Haziran Cumartesi" gibi tam tarih
      date: (d: string) => full.format(parseDay(d)),
      // "14 Haz" gibi kısa tarih
      dateShort: (d: string) => short.format(parseDay(d)),
      // Gün seçici: kısa hafta günü ("Cmt")
      weekdayShort: (d: string) => weekdayShort.format(parseDay(d)),
      // Gün seçici: kısa ay ("Haz")
      monthShort: (d: string) => monthShort.format(parseDay(d)),
    };
  }, [locale]);

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
  // Tüm günler kapalıysa seçilebilir gün yok — tarih/saat adımı kullanıcıyı kilitler.
  const hasOpenDay = days.some((d) => !d.closed);
  const [date, setDate] = useState(() => days.find((d) => !d.closed)?.date ?? days[0].date);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [custName, setCustName] = useState(initialUserName ?? "");
  const [custPhone, setCustPhone] = useState("");
  // KVKK aydınlatma onayı — yalnızca misafir (girişsiz) rezervasyonda zorunlu.
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ code: string; couponDropped?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isBooking, startBooking] = useTransition();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);
  const [couponErr, setCouponErr] = useState<string | null>(null);
  const [couponPending, startCoupon] = useTransition();

  const selectedServices = allServices.filter((s) => selected.has(s.id));
  const totalDur = selectedServices.reduce((s, x) => s + x.durationMin, 0);
  const totalTl = selectedServices.reduce((s, x) => s + x.priceTl, 0);
  const discountedTotal = applied
    ? Math.round((totalTl * (100 - applied.pct)) / 100)
    : totalTl;

  // Seçilen hizmetlerin tümünü verebilen personeller
  const eligibleStaff = staff.filter((st) =>
    selectedServices.every((s) => st.serviceIds.includes(s.id))
  );

  // Slot getir — hatada (ağ/sunucu) yükleme iskeletinde takılı kalmamak için
  // hata durumunu işaretle ki kullanıcıya tekrar dene düğmesi gösterilsin.
  function loadSlots() {
    setSlots(null);
    setSlotsError(false);
    setTime(null);
    startTransition(async () => {
      try {
        const result = await fetchSlotsAction({
          businessId: business.id,
          date,
          durationMin: totalDur,
          staffId: staffChoice ?? undefined,
          serviceIds: [...selected],
        });
        setSlots(result);
      } catch {
        setSlotsError(true);
      }
    });
  }

  // Tarih/personel/hizmet değişince slotları yenile (sunucudan slot verisi çekme —
  // dış sistemle senkronizasyon; loadSlots içeride setSlots/setSlotsError yapar).
  useEffect(() => {
    if (step !== 2 || selected.size === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSlots();
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

  function applyCoupon() {
    setCouponErr(null);
    const code = coupon.trim();
    if (!code) return;
    startCoupon(async () => {
      const res = await validateCampaignAction(business.id, code);
      if (res.ok) {
        setApplied({ code: res.code, pct: res.discountPct });
      } else {
        setApplied(null);
        setCouponErr(res.error);
      }
    });
  }

  function confirm() {
    if (time === null) return;
    // İsim yalnızca misafirde zorunlu; girişli kullanıcı boş bırakırsa sunucu
    // hesap adına düşer (booking.ts ile aynı davranış).
    if (!isAuthed && custName.trim().length < 3) {
      setError(b.errors.nameRequired);
      return;
    }
    // Telefon misafirde zorunlu; girişli kullanıcıda opsiyonel ama doluysa geçerli olmalı.
    if (!isAuthed && !isValidTrMobile(custPhone)) {
      setError(b.errors.phoneRequired);
      return;
    }
    if (custPhone.trim() && !isValidTrMobile(custPhone)) {
      setError(b.errors.phoneRequired);
      return;
    }
    // Misafir rezervasyonda KVKK aydınlatma onayı zorunlu (girişli kullanıcı
    // kayıt sırasında zaten onay vermiştir; server action'a dokunulmaz).
    if (!isAuthed && !consent) {
      setError(b.errors.consentRequired);
      return;
    }
    setError(null);
    startBooking(async () => {
      try {
        const res = await createAppointmentAction({
          businessId: business.id,
          serviceIds: [...selected],
          staffId: staffChoice,
          date,
          startMin: time,
          note,
          customerName: custName,
          customerPhone: custPhone,
          campaignCode: applied?.code,
        });
        if (res.ok) setSuccess({ code: res.code, couponDropped: res.couponDropped });
        else setError(res.error);
      } catch {
        setError(b.errors.connection);
      }
    });
  }

  // Erişilebilirlik: adım ilerleyince "Devam" düğmesini içeren blok DOM'dan kalkar ve
  // odak body'ye düşer. Yeni adımın içerik kapsayıcısına programatik odak vererek
  // klavye/ekran-okuyucu kullanıcısının kaldığı yerden devam etmesini sağla.
  // (Koşulsuz hook — erken return'lardan ÖNCE tanımlanır.)
  const stepWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step > 0) stepWrapRef.current?.focus();
  }, [step]);

  /* ─── Başarı ekranı ─── */
  if (success) {
    return (
      <div className="container-x flex justify-center py-16">
        <div className="anim-rise relative isolate w-full max-w-md overflow-hidden rounded-[28px] border border-line bg-surface p-8 text-center shadow-pop">
          <div className="pointer-events-none absolute inset-x-0 -top-16 -z-10 mx-auto h-40 w-40 rounded-full bg-mint/25 blur-3xl" aria-hidden />
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-mint-soft ring-4 ring-mint/15">
            <CheckCircle2 className="size-9 text-mint" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
            {b.success.title}
          </h1>
          <p className="mt-2 text-ink-soft">
            {fmt.date(date)} · {minToHHMM(time!)}
          </p>
          <p className="font-semibold text-ink">{business.name}</p>
          {success.couponDropped && (
            <p className="mt-4 rounded-2xl bg-honey-soft p-3 text-sm font-medium text-honey">
              {b.couponDropped}
            </p>
          )}
          <div className="mt-5 rounded-2xl bg-cream p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-mute">
              {b.success.codeLabel}
            </p>
            <p className="mt-1 font-display text-2xl font-extrabold tracking-wider text-ink">
              {success.code}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            {isAuthed && (
              <Button href="/hesap" variant="accent" size="lg">
                {b.success.viewAppointments}
              </Button>
            )}
            <Button href="/" variant={isAuthed ? "ghost" : "accent"} size="lg">
              {b.success.backHome}
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
          className="group mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> {business.name}
        </Link>
        <ol className="flex flex-wrap items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-label={label}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold transition-all ${
                  i === step
                    ? "bg-gradient-to-r from-accent to-[#8b5cf6] text-white shadow-pop"
                    : i < step
                      ? "bg-mint-soft text-mint hover:-translate-y-0.5"
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
        <div className="min-w-0 outline-none" ref={stepWrapRef} tabIndex={-1}>
          {/* ─── Adım 1: Hizmetler ─── */}
          {step === 0 && (
            <div className="anim-rise space-y-7">
              <h1 className="font-display text-2xl font-extrabold text-ink">{b.services.heading}</h1>
              <StyleAdvisor
                businessId={business.id}
                services={allServices.map((s) => ({ id: s.id, name: s.name, priceTl: s.priceTl }))}
                onApply={(ids) => setSelected(new Set(ids))}
              />
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
                              : "border-line hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-card"
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
                {b.staff.heading}
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
                    <p className="font-bold text-ink">{b.staff.anyTitle}</p>
                    <p className="text-sm text-ink-soft">{b.staff.anyDesc}</p>
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
                  {b.staff.noEligible}
                </p>
              )}
            </div>
          )}

          {/* ─── Adım 3: Tarih & Saat ─── */}
          {step === 2 && (
            <div className="anim-rise">
              <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">
                {b.dateTime.heading}
              </h1>
              {!hasOpenDay ? (
                <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
                  <p className="font-semibold text-ink">{b.dateTime.noOpenDays}</p>
                  <p className="mt-1 text-sm text-ink-soft">{b.dateTime.noOpenDaysHint}</p>
                </div>
              ) : (
                <>
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
                          ? "border-accent bg-gradient-to-b from-accent to-accent-deep text-white shadow-pop"
                          : "border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-card"
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase opacity-70">
                        {fmt.weekdayShort(d.date)}
                      </span>
                      <span className="font-display text-lg font-extrabold">
                        {d.date.slice(8)}
                      </span>
                      <span className="text-[11px] opacity-70">
                        {fmt.monthShort(d.date)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 min-h-48">
                {slotsError ? (
                  <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
                    <p className="font-semibold text-ink">{b.dateTime.slotLoadError}</p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="mt-4"
                      onClick={loadSlots}
                    >
                      {b.dateTime.retry}
                    </Button>
                  </div>
                ) : isPending || slots === null ? (
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-11 animate-pulse rounded-full bg-ink/8" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-8 text-center">
                    {staffChoice === null && eligibleStaff.length === 0 && selectedServices.length > 1 ? (
                      <>
                        <p className="font-semibold text-ink">
                          {b.dateTime.noStaffForCombo}
                        </p>
                        <p className="mt-1 text-sm text-ink-soft">
                          {b.dateTime.noStaffForComboHint}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-ink">{b.dateTime.noSlots}</p>
                        <p className="mt-1 text-sm text-ink-soft">{b.dateTime.noSlotsHint}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <SlotGroups
                    slots={slots}
                    time={time}
                    onPick={setTime}
                    labels={{
                      morning: b.dateTime.morning,
                      afternoon: b.dateTime.afternoon,
                      evening: b.dateTime.evening,
                    }}
                  />
                )}
              </div>
                </>
              )}
            </div>
          )}

          {/* ─── Adım 4: Onay ─── */}
          {step === 3 && (
            <div className="anim-rise max-w-xl">
              <h1 className="mb-5 font-display text-2xl font-extrabold text-ink">
                {b.confirm.heading}
              </h1>

              <div className="space-y-5">
                <div className="rounded-[20px] border border-line bg-surface p-5 shadow-card">
                  <p className="font-bold text-ink">{fmt.date(date)}</p>
                  <p className="text-ink-soft">
                    {time !== null && minToHHMM(time)} ·{" "}
                    {staffChoice
                      ? eligibleStaff.find((s) => s.id === staffChoice)?.name
                      : b.confirm.anyStaff}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
                    {selectedServices.map((s) => (
                      <li key={s.id} className="flex justify-between text-ink-soft">
                        <span>{s.name}</span>
                        <span className="font-semibold text-ink">{formatTl(s.priceTl)}</span>
                      </li>
                    ))}
                    {applied && (
                      <li className="flex justify-between font-semibold text-mint">
                        <span>{interpolate(b.confirm.discountLine, { pct: applied.pct })}</span>
                        <span>-{formatTl(totalTl - discountedTotal)}</span>
                      </li>
                    )}
                    <li className="flex justify-between border-t border-line pt-2 font-bold text-ink">
                      <span>{interpolate(b.confirm.totalLabel, { duration: formatDuration(totalDur) })}</span>
                      <span>{formatTl(discountedTotal)}</span>
                    </li>
                  </ul>
                </div>

                {/* İndirim kodu */}
                <div className="rounded-[20px] border border-line bg-surface p-5 shadow-card">
                  <p className="text-sm font-bold text-ink">{b.confirm.couponQuestion}</p>
                  {applied ? (
                    <div className="mt-2.5 flex items-center justify-between rounded-xl bg-mint-soft px-3.5 py-2.5">
                      <span className="text-sm font-bold text-mint">
                        {interpolate(b.confirm.couponApplied, { code: applied.code, pct: applied.pct })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setApplied(null);
                          setCoupon("");
                          setCouponErr(null);
                        }}
                        className="text-xs font-semibold text-ink-soft hover:text-rose"
                      >
                        {b.confirm.couponRemove}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex gap-2">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder={b.confirm.couponPlaceholder}
                        className="h-11 flex-1 rounded-xl border border-line-strong bg-surface px-4 text-sm font-semibold uppercase text-ink placeholder:font-normal placeholder:text-ink-mute focus:border-accent focus:outline-none"
                      />
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={applyCoupon}
                        disabled={couponPending || !coupon.trim()}
                      >
                        {couponPending ? b.ellipsis : b.confirm.couponApply}
                      </Button>
                    </div>
                  )}
                  {couponErr && <p className="mt-1.5 text-xs font-medium text-rose">{couponErr}</p>}
                </div>

                <div className="space-y-3.5 rounded-[20px] border border-line bg-surface p-5 shadow-card">
                  <p className="text-sm font-bold text-ink">{b.confirm.contactHeading}</p>
                  <div>
                    <Label htmlFor="cust-name">{b.confirm.nameLabel}</Label>
                    <Input
                      id="cust-name"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder={b.confirm.namePlaceholder}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cust-phone">
                      {isAuthed ? b.confirm.phoneLabelOptional : b.confirm.phoneLabel}
                    </Label>
                    <Input
                      id="cust-phone"
                      type="tel"
                      inputMode="tel"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder={b.confirm.phonePlaceholder}
                    />
                    <p className="mt-1.5 text-xs text-ink-mute">
                      {b.confirm.phoneHint}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="note">{b.confirm.noteLabel}</Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={b.confirm.notePlaceholder}
                    />
                  </div>
                </div>

                {!isAuthed && (
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (e.target.checked) setError(null);
                      }}
                      className="mt-0.5 size-4 shrink-0 rounded border-line-strong accent-accent"
                    />
                    <span>
                      {b.confirm.consentBefore}
                      <Link href="/kvkk" className="font-semibold text-accent-deep hover:underline">
                        {b.confirm.consentLink}
                      </Link>
                      {b.confirm.consentAfter}
                    </span>
                  </label>
                )}

                <FormError message={error} />

                <Button
                  variant="accent"
                  size="xl"
                  className="w-full"
                  onClick={confirm}
                  disabled={isBooking}
                >
                  {isBooking
                    ? b.confirm.submitting
                    : interpolate(b.confirm.submitBooking, { total: formatTl(discountedTotal) })}
                </Button>
                <p className="text-center text-xs text-ink-mute">
                  {b.confirm.paymentNote}
                </p>
              </div>
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
              <p className="text-sm text-ink-mute">{b.summary.noServices}</p>
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
                <span>{formatTl(discountedTotal)}</span>
              </div>
            )}
            {time !== null && step >= 2 && (
              <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-sm font-bold text-accent-deep">
                {fmt.dateShort(date)} · {minToHHMM(time)}
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
              {b.summary.continue}
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
                {interpolate(b.summary.servicesCount, {
                  count: selectedServices.length,
                  total: formatTl(totalTl),
                })}
              </p>
              <p className="text-ink-soft">
                {time !== null ? `${fmt.dateShort(date)} · ${minToHHMM(time)}` : formatDuration(totalDur)}
              </p>
            </div>
            <Button variant="primary" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>
              {b.summary.continue}
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
  labels,
}: {
  slots: Slot[];
  time: number | null;
  onPick: (t: number) => void;
  labels: { morning: string; afternoon: string; evening: string };
}) {
  const groups: [string, Slot[]][] = [
    [labels.morning, slots.filter((s) => s.time < 720)],
    [labels.afternoon, slots.filter((s) => s.time >= 720 && s.time < 1020)],
    [labels.evening, slots.filter((s) => s.time >= 1020)],
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
