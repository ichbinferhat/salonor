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

type Category = { slug: string; name: string; emoji: string };
type DraftService = { name: string; durationMin: number; priceTl: number };

const STEPS = [
  { icon: Store, label: "İşletme" },
  { icon: Tag, label: "Kategori" },
  { icon: MapPin, label: "Konum" },
  { icon: Clock, label: "Saatler" },
  { icon: Scissors, label: "Hizmetler" },
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
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-line bg-surface/80 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo />
          <span className="text-sm text-ink-soft">Merhaba, {ownerName.split(" ")[0]} 👋</span>
        </div>
      </header>

      <div className="container-x max-w-2xl py-10">
        {/* Adım göstergesi */}
        <ol className="mb-8 flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={s.label} className="flex flex-1 flex-col items-center gap-2">
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
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="rounded-[24px] border border-line bg-surface p-6 shadow-card sm:p-8">
          {/* Adım 1: İşletme */}
          {step === 0 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  İşletmeni tanıtalım
                </h1>
                <p className="mt-1 text-ink-soft">Müşterilerin seni nasıl görecek?</p>
              </div>
              <div>
                <Label htmlFor="ob-name">İşletme adı</Label>
                <Input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn. Nova Saç Atölyesi" autoFocus />
              </div>
              <div>
                <Label htmlFor="ob-phone">Telefon</Label>
                <Input id="ob-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0212 000 00 00" />
              </div>
              <div>
                <Label htmlFor="ob-desc">Kısa açıklama (isteğe bağlı)</Label>
                <Textarea id="ob-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Salonunu birkaç cümleyle anlat..." />
              </div>
            </div>
          )}

          {/* Adım 2: Kategori */}
          {step === 1 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  Hangi alandasın?
                </h1>
                <p className="mt-1 text-ink-soft">İşletmene en uygun kategoriyi seç.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => chooseCategory(c.slug)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                      categorySlug === c.slug ? "border-accent bg-accent-soft" : "border-line hover:border-ink/30"
                    }`}
                  >
                    <span className="text-3xl">{c.emoji}</span>
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
                  Neredesin?
                </h1>
                <p className="mt-1 text-ink-soft">Müşterilerin seni haritada bulabilsin.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ob-city">Şehir</Label>
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
                  <Label htmlFor="ob-district">İlçe</Label>
                  <Input id="ob-district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Örn. Kadıköy" />
                </div>
              </div>
              <div>
                <Label htmlFor="ob-address">Açık adres</Label>
                <Input id="ob-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mahalle, cadde, no" />
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
                  Çalışma saatlerin
                </h1>
                <p className="mt-1 text-ink-soft">Açık olduğun saatleri ve günleri belirle.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ob-open">Açılış</Label>
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
                  <Label htmlFor="ob-close">Kapanış</Label>
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
                <Label>Kapalı günler</Label>
                <div className="flex flex-wrap gap-2">
                  {ORDER.map((wd) => {
                    const closed = closedDays.includes(wd);
                    return (
                      <button
                        key={wd}
                        onClick={() => toggleClosed(wd)}
                        className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                          closed
                            ? "border-rose/40 bg-rose-soft text-rose"
                            : "border-line bg-surface text-ink hover:border-ink/30"
                        }`}
                      >
                        {WEEKDAYS_TR[wd]}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-ink-mute">
                  Kapalı işaretlenmeyen günlerde {fmt(openMin)}–{fmt(closeMin)} arası açıksın.
                </p>
              </div>
            </div>
          )}

          {/* Adım 5: Hizmetler */}
          {step === 4 && (
            <div className="anim-rise space-y-5">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                  İlk hizmetlerin
                </h1>
                <p className="mt-1 text-ink-soft">
                  Birkaç hizmet ekle — sonra panelden istediğin kadar değiştirebilirsin.
                </p>
              </div>
              <div className="space-y-2.5">
                {services.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-line bg-cream/40 p-2.5">
                    <input
                      value={s.name}
                      onChange={(e) => updateService(i, { name: e.target.value })}
                      placeholder="Hizmet adı"
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
                      <span className="text-xs text-ink-mute">dk</span>
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
                      <span className="text-xs text-ink-mute">₺</span>
                    </div>
                    <button
                      onClick={() => removeService(i)}
                      className="rounded-lg p-2 text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose"
                      aria-label="Kaldır"
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
                <Plus className="size-4" /> Hizmet ekle
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
                <ChevronLeft className="size-4" /> Geri
              </Button>
            ) : (
              <span />
            )}
            <Button variant="accent" size="lg" onClick={next} disabled={!canProceed || isPending}>
              {isPending ? (
                "Oluşturuluyor..."
              ) : step === STEPS.length - 1 ? (
                <>
                  <PartyPopper className="size-4" /> İşletmemi yayınla
                </>
              ) : (
                "Devam et"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
