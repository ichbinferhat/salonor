"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Plus,
  Trash2,
  Store,
  Tag,
  MapPin,
  Clock,
  Scissors,
  PartyPopper,
} from "lucide-react";
import { createBusinessAction, type OnboardingData } from "@/server/actions/business";
import { LocationPicker, CITY_CENTERS } from "./location-picker";
import { WEEKDAYS_TR } from "@/lib/datetime";
import { Logo } from "@/components/logo";
import { Input, Label, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

type Category = { slug: string; name: string; emoji: string };
type DraftService = { name: string; durationMin: number; priceTl: number };

type StepKey = "business" | "category" | "location" | "hours" | "services";
const STEPS: { icon: typeof Store; key: StepKey }[] = [
  { icon: Store, key: "business" },
  { icon: Tag, key: "category" },
  { icon: MapPin, key: "location" },
  { icon: Clock, key: "hours" },
  { icon: Scissors, key: "services" },
];

const TIME_OPTIONS: number[] = [];
for (let t = 360; t <= 1410; t += 30) TIME_OPTIONS.push(t);
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const ORDER = [1, 2, 3, 4, 5, 6, 0];

const STARTER_SERVICES: Record<string, DraftService[]> = {
  kuafor: [
    { name: "Kadın Saç Kesimi", durationMin: 60, priceTl: 600 },
    { name: "Fön", durationMin: 40, priceTl: 350 },
    { name: "Komple Boya", durationMin: 120, priceTl: 1800 },
  ],
  berber: [
    { name: "Saç Kesimi", durationMin: 40, priceTl: 350 },
    { name: "Sakal Tıraşı", durationMin: 25, priceTl: 200 },
    { name: "Saç + Sakal", durationMin: 60, priceTl: 500 },
  ],
  tirnak: [
    { name: "Klasik Manikür", durationMin: 45, priceTl: 400 },
    { name: "Kalıcı Oje", durationMin: 60, priceTl: 600 },
  ],
  "cilt-bakimi": [{ name: "Klasik Cilt Bakımı", durationMin: 60, priceTl: 900 }],
  "spa-masaj": [{ name: "Klasik Masaj", durationMin: 60, priceTl: 1200 }],
  makyaj: [{ name: "Gündüz Makyajı", durationMin: 45, priceTl: 800 }],
  epilasyon: [{ name: "Bacak Komple Lazer", durationMin: 45, priceTl: 900 }],
  "kas-kirpik": [{ name: "Kaş Tasarımı", durationMin: 30, priceTl: 350 }],
};

export function OnboardingWizard({
  categories,
  ownerName,
}: {
  categories: Category[];
  ownerName: string;
}) {
  const router = useRouter();
  const t = useDict().onboarding;
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [city, setCity] = useState("İstanbul");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: CITY_CENTERS["İstanbul"][1],
    lng: CITY_CENTERS["İstanbul"][0],
  });
  const [openMin, setOpenMin] = useState(540);
  const [closeMin, setCloseMin] = useState(1080);
  const [closedDays, setClosedDays] = useState<number[]>([0]);
  const [services, setServices] = useState<DraftService[]>([]);

  function changeCity(c: string) {
    setCity(c);
    const center = CITY_CENTERS[c];
    if (center) setCoords({ lat: center[1], lng: center[0] });
  }

  function chooseCategory(slug: string) {
    setCategorySlug(slug);
    if (services.length === 0 && STARTER_SERVICES[slug]) {
      setServices(STARTER_SERVICES[slug].map((s) => ({ ...s })));
    }
  }

  function toggleClosed(wd: number) {
    setClosedDays((prev) => (prev.includes(wd) ? prev.filter((d) => d !== wd) : [...prev, wd]));
  }

  function addService() {
    setServices((prev) => [...prev, { name: "", durationMin: 30, priceTl: 0 }]);
  }
  function updateService(i: number, patch: Partial<DraftService>) {
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function removeService(i: number) {
    setServices((prev) => prev.filter((_, idx) => idx !== i));
  }

  const canProceed =
    step === 0
      ? name.trim().length >= 2 && phone.trim().length >= 7
      : step === 1
        ? !!categorySlug
        : step === 2
          ? district.trim().length >= 2 && address.trim().length >= 3
          : step === 3
            ? closeMin > openMin && closedDays.length < 7
            : services.filter((s) => s.name.trim()).length > 0;

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    // Son adım: gönder
    setError(null);
    const cleanServices = services
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        durationMin: Math.max(5, s.durationMin || 30),
        priceTl: Math.max(0, s.priceTl || 0),
      }));

    const data: OnboardingData = {
      name, description, phone, categorySlug,
      address, district, city, lat: coords.lat, lng: coords.lng,
      openMin, closeMin, closedDays, services: cleanServices,
    };

    startTransition(async () => {
      const res = await createBusinessAction(data);
      if (res.ok) router.push("/panel");
      else setError(res.error);
    });
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-40 -z-10 size-[34rem] rounded-full bg-accent-soft/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 -z-10 size-[30rem] rounded-full bg-[#ff5fa2]/10 blur-3xl" />
      <header className="border-b border-line bg-surface/80 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />
          <span className="text-sm text-ink-soft">
            {interpolate(t.greeting, { name: ownerName.split(" ")[0] })}
          </span>
        </div>
      </header>

      <div className="container-x max-w-2xl py-10">
        {/* Adım göstergesi */}
        <ol className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done || active ? "bg-accent" : "bg-line-strong"}`} />
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      done
                        ? "border-accent bg-accent text-white"
                        : active
                          ? "border-accent bg-surface text-accent-deep"
                          : "border-line-strong bg-surface text-ink-mute"
                    }`}
                  >
                    {done ? <Check className="size-5" /> : <s.icon className="size-5" />}
                  </span>
                  <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "opacity-0" : done ? "bg-accent" : "bg-line-strong"}`} />
                </div>
                <span className={`text-xs font-semibold ${active ? "text-ink" : "text-ink-mute"}`}>
                  {t.steps[s.key]}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="rounded-[28px] border border-line bg-surface/95 p-6 shadow-pop ring-1 ring-line/60 backdrop-blur-sm sm:p-8">
          {/* Adım 1: İşletme */}
          {step === 0 && (
            <div className="anim-rise space-y-5">
              <div>
                <span className="mb-3 inline-flex h-1.5 w-12 rounded-full bg-gradient-to-r from-accent via-[#8b5cf6] to-[#ff5fa2]" />
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-balance text-ink">
                  {t.step1.title}
                </h1>
                <p className="mt-1 text-pretty text-ink-soft">{t.step1.subtitle}</p>
              </div>
              <div>
                <Label htmlFor="ob-name">{t.step1.nameLabel}</Label>
                <Input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.step1.namePlaceholder} autoFocus />
              </div>
              <div>
                <Label htmlFor="ob-phone">{t.step1.phoneLabel}</Label>
                <Input id="ob-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.step1.phonePlaceholder} />
              </div>
              <div>
                <Label htmlFor="ob-desc">{t.step1.descLabel}</Label>
                <Textarea id="ob-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.step1.descPlaceholder} />
              </div>
            </div>
          )}

          {/* Adım 2: Kategori */}
          {step === 1 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  {t.step2.title}
                </h1>
                <p className="mt-1 text-ink-soft">{t.step2.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => chooseCategory(c.slug)}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-card ${
                      categorySlug === c.slug ? "border-accent bg-accent-soft shadow-card" : "border-line hover:border-accent/40"
                    }`}
                  >
                    <span className="text-3xl transition-transform group-hover:scale-110">{c.emoji}</span>
                    <span className="text-center text-sm font-semibold text-ink">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Adım 3: Konum */}
          {step === 2 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  {t.step3.title}
                </h1>
                <p className="mt-1 text-ink-soft">{t.step3.subtitle}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ob-city">{t.step3.cityLabel}</Label>
                  <select
                    id="ob-city"
                    value={city}
                    onChange={(e) => changeCity(e.target.value)}
                    className="h-12 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] focus:border-accent focus:outline-none"
                  >
                    {Object.keys(CITY_CENTERS).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="ob-district">{t.step3.districtLabel}</Label>
                  <Input id="ob-district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder={t.step3.districtPlaceholder} />
                </div>
              </div>
              <div>
                <Label htmlFor="ob-address">{t.step3.addressLabel}</Label>
                <Input id="ob-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.step3.addressPlaceholder} />
              </div>
              <LocationPicker
                lat={coords.lat}
                lng={coords.lng}
                onChange={(lat, lng) => setCoords({ lat, lng })}
              />
            </div>
          )}

          {/* Adım 4: Saatler */}
          {step === 3 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  {t.step4.title}
                </h1>
                <p className="mt-1 text-ink-soft">{t.step4.subtitle}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ob-open">{t.step4.openLabel}</Label>
                  <select
                    id="ob-open"
                    value={openMin}
                    onChange={(e) => setOpenMin(Number(e.target.value))}
                    className="h-12 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] focus:border-accent focus:outline-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{fmt(t)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="ob-close">{t.step4.closeLabel}</Label>
                  <select
                    id="ob-close"
                    value={closeMin}
                    onChange={(e) => setCloseMin(Number(e.target.value))}
                    className="h-12 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] focus:border-accent focus:outline-none"
                  >
                    {TIME_OPTIONS.filter((t) => t > openMin).map((t) => (
                      <option key={t} value={t}>{fmt(t)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>{t.step4.closedDaysLabel}</Label>
                <div className="flex flex-wrap gap-2">
                  {ORDER.map((wd) => {
                    const closed = closedDays.includes(wd);
                    return (
                      <button
                        key={wd}
                        onClick={() => toggleClosed(wd)}
                        className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                          closed
                            ? "border-rose/40 bg-rose-soft text-rose"
                            : "border-line bg-surface text-ink hover:border-accent/40 hover:shadow-card"
                        }`}
                      >
                        {WEEKDAYS_TR[wd]}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-ink-mute">
                  {interpolate(t.step4.hoursHint, { open: fmt(openMin), close: fmt(closeMin) })}
                </p>
              </div>
            </div>
          )}

          {/* Adım 5: Hizmetler */}
          {step === 4 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  {t.step5.title}
                </h1>
                <p className="mt-1 text-ink-soft">
                  {t.step5.subtitle}
                </p>
              </div>
              <div className="space-y-2.5">
                {services.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-line bg-cream/40 p-2.5">
                    <input
                      value={s.name}
                      onChange={(e) => updateService(i, { name: e.target.value })}
                      placeholder={t.step5.servicePlaceholder}
                      className="h-10 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 text-sm focus:border-accent focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={s.durationMin || ""}
                        onChange={(e) => updateService(i, { durationMin: Number(e.target.value) })}
                        className="h-10 w-16 rounded-lg border border-line-strong bg-surface px-2 text-sm focus:border-accent focus:outline-none"
                        min={5}
                        step={5}
                      />
                      <span className="text-xs text-ink-mute">{t.step5.minUnit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={s.priceTl || ""}
                        onChange={(e) => updateService(i, { priceTl: Number(e.target.value) })}
                        className="h-10 w-20 rounded-lg border border-line-strong bg-surface px-2 text-sm focus:border-accent focus:outline-none"
                        min={0}
                        step={10}
                      />
                      <span className="text-xs text-ink-mute">{t.step5.priceUnit}</span>
                    </div>
                    <button
                      onClick={() => removeService(i)}
                      className="rounded-lg p-2 text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose"
                      aria-label={t.step5.removeService}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addService}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-accent hover:text-accent-deep"
              >
                <Plus className="size-4" /> {t.step5.addService}
              </button>
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-xl bg-rose-soft px-4 py-3 text-sm font-medium text-rose">
              {error}
            </p>
          )}

          {/* Navigasyon */}
          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={isPending}>
                <ChevronLeft className="size-4" /> {t.back}
              </Button>
            ) : (
              <span />
            )}
            <Button variant="accent" size="lg" onClick={next} disabled={!canProceed || isPending}>
              {isPending ? (
                t.creating
              ) : step === STEPS.length - 1 ? (
                <>
                  <PartyPopper className="size-4" /> {t.publish}
                </>
              ) : (
                t.continue
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
