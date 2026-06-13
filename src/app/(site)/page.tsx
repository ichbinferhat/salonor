import Image from "next/image";
import Link from "next/link";
import { Search, CalendarCheck2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { todayStr } from "@/lib/datetime";
import { HeroSearch } from "@/components/home/hero-search";
import { Carousel } from "@/components/home/carousel";
import { SalonCard } from "@/components/salon-card";
import { RatingStars } from "@/components/ui/rating-stars";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const CATEGORY_ORDER = [
  "kuafor",
  "berber",
  "tirnak",
  "cilt-bakimi",
  "spa-masaj",
  "makyaj",
  "epilasyon",
  "kas-kirpik",
];

export default async function HomePage() {
  const [categories, featured, newest, bizCount, serviceCount, reviewCount, quotes] =
    await Promise.all([
      db.category.findMany(),
      db.business.findMany({
        where: { featured: true },
        include: { category: true },
        orderBy: { ratingAvg: "desc" },
        take: 8,
      }),
      db.business.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.business.count(),
      db.service.count(),
      db.review.count(),
      db.review.findMany({
        where: { rating: 5 },
        include: {
          customer: { select: { name: true, image: true } },
          business: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const orderedCategories = [...categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug)
  );

  const heroImages = [
    featured[0]?.coverImage,
    featured[1]?.coverImage,
    featured[2]?.coverImage,
  ].filter(Boolean) as string[];

  return (
    <div className="overflow-x-clip">
      {/* ───────────────── Hero ───────────────── */}
      <section className="relative">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className="container-x grid items-center gap-10 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-20">
          <div>
            <p className="anim-rise mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-ink-soft shadow-card">
              <ShieldCheck className="size-4 text-mint" />
              Türkiye'nin randevu platformu
            </p>
            <h1 className="anim-rise d-1 font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Güzellik randevun,
              <br />
              <span className="text-accent">saniyeler</span> içinde.
            </h1>
            <p className="anim-rise d-2 mt-5 max-w-xl text-lg text-ink-soft">
              Çevrendeki en iyi kuaför, berber, spa ve güzellik salonlarını
              keşfet; uygun saati seç, yerini anında ayırt. Ücretsiz ve 7/24.
            </p>
            <div className="anim-rise d-3 mt-8">
              <HeroSearch today={todayStr()} />
            </div>
            <div className="anim-rise d-4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5">
                <RatingStars value={4.8} size="sm" />
                <strong className="text-ink">4.8</strong> ortalama puan
              </span>
              <span>
                <strong className="text-ink">{reviewCount}+</strong> doğrulanmış yorum
              </span>
              <span>
                <strong className="text-ink">{bizCount}</strong> seçkin salon
              </span>
            </div>
          </div>

          {/* Görsel kolaj */}
          <div className="relative hidden h-[480px] lg:block" aria-hidden>
            <div className="anim-rise d-2 absolute right-0 top-0 h-64 w-56 overflow-hidden rounded-[28px] shadow-pop rotate-2">
              {heroImages[0] && (
                <Image src={heroImages[0]} alt="" fill sizes="224px" className="object-cover" priority />
              )}
            </div>
            <div className="anim-rise d-3 absolute left-4 top-28 h-72 w-60 overflow-hidden rounded-[28px] shadow-pop -rotate-3">
              {heroImages[1] && (
                <Image src={heroImages[1]} alt="" fill sizes="240px" className="object-cover" priority />
              )}
            </div>
            <div className="anim-rise d-4 absolute bottom-0 right-10 h-56 w-52 overflow-hidden rounded-[28px] shadow-pop rotate-1">
              {heroImages[2] && (
                <Image src={heroImages[2]} alt="" fill sizes="208px" className="object-cover" />
              )}
            </div>
            <div className="anim-rise d-5 absolute bottom-24 -left-2 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-pop">
              <span className="flex size-9 items-center justify-center rounded-full bg-mint-soft">
                <CalendarCheck2 className="size-5 text-mint" />
              </span>
              <div className="text-sm">
                <p className="font-bold text-ink">Randevu onaylandı</p>
                <p className="text-ink-soft">Bugün 14:30 · Kalıcı Oje</p>
              </div>
            </div>
            <div className="anim-rise d-5 absolute right-0 top-72 flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2.5 shadow-pop">
              <RatingStars value={5} size="sm" />
              <span className="text-sm font-bold text-ink">5.0</span>
              <span className="text-sm text-ink-soft">"Harika!"</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Kategoriler ───────────────── */}
      <section className="container-x pb-16">
        <h2 className="sr-only">Kategoriler</h2>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
          {orderedCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/arama?kategori=${c.slug}`}
              className="group flex min-w-28 flex-col items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-card"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-cream text-2xl transition-colors group-hover:bg-accent-soft">
                {c.emoji}
              </span>
              <span className="text-[13px] font-semibold leading-tight text-ink">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── Öne çıkanlar ───────────────── */}
      <div className="space-y-16 pb-16">
        <Carousel title="Öne çıkan salonlar" subtitle="Yüksek puanlı, en çok tercih edilenler">
          {featured.map((b, i) => (
            <SalonCard
              key={b.id}
              salon={b}
              priority={i < 4}
              className="w-[260px] shrink-0 snap-start sm:w-[280px]"
            />
          ))}
        </Carousel>

        <Carousel title="Yeni eklenenler" subtitle="Salonor'a yeni katılan işletmeler">
          {newest.map((b) => (
            <SalonCard
              key={b.id}
              salon={b}
              className="w-[260px] shrink-0 snap-start sm:w-[280px]"
            />
          ))}
        </Carousel>
      </div>

      {/* ───────────────── İstatistik bandı ───────────────── */}
      <section className="container-x pb-16">
        <div className="relative overflow-hidden rounded-[32px] bg-ink-strong px-6 py-14 text-center sm:px-12">
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-accent/15 blur-3xl"
            aria-hidden
          />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Randevu almanın en kolay yolu
          </h2>
          <div className="relative mt-10 grid gap-8 sm:grid-cols-3">
            {[
              [String(bizCount), "seçkin işletme"],
              [`${serviceCount}+`, "rezerve edilebilir hizmet"],
              [`${reviewCount}+`, "doğrulanmış yorum"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-5xl font-extrabold text-white">
                  {num}
                </p>
                <p className="mt-2 text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Nasıl çalışır ───────────────── */}
      <section className="container-x pb-20">
        <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Üç adımda hazır
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Keşfet",
              desc: "Konumuna ve ihtiyacına göre salonları karşılaştır; fotoğraflara ve gerçek yorumlara göz at.",
            },
            {
              icon: CalendarCheck2,
              title: "Saatini seç",
              desc: "Takvimden sana uyan boş saati seç, istersen favori personelinle çalış.",
            },
            {
              icon: Sparkles,
              title: "Arkana yaslan",
              desc: "Randevun anında onaylanır. Tek yapman gereken zamanında orada olmak.",
            },
          ].map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-[24px] border border-line bg-surface p-7 shadow-card"
            >
              <span className="absolute right-6 top-5 font-display text-5xl font-extrabold text-ink/5">
                {i + 1}
              </span>
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent-soft">
                <s.icon className="size-6 text-accent-deep" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── İşletme CTA ───────────────── */}
      <section className="container-x pb-20">
        <div className="grid overflow-hidden rounded-[32px] border border-line bg-surface shadow-card lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent-deep">
              Salonor Business
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Salonunuzu büyütmenin akıllı yolu
            </h2>
            <ul className="mt-6 space-y-3 text-ink-soft">
              {[
                "7/24 online randevu — telefon başında beklemeyin",
                "Takvim, personel ve hizmet yönetimi tek panelde",
                "Yorumlarla güven oluşturun, yeni müşteri kazanın",
                "Kurulum 5 dakika, başlangıç tamamen ücretsiz",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/isletme/kayit" variant="accent" size="lg">
                Ücretsiz başlayın <ArrowRight className="size-4" />
              </Button>
              <Button href="/isletme" variant="outline" size="lg">
                Daha fazla bilgi
              </Button>
            </div>
          </div>
          <div className="relative min-h-72 lg:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop"
              alt="Salonor Business panelini kullanan bir salon"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ───────────────── Yorumlar ───────────────── */}
      <section className="container-x pb-24">
        <h2 className="mb-2 text-center font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Müşterilerimiz ne diyor?
        </h2>
        <p className="mb-10 text-center text-ink-soft">
          Gerçek randevulardan, gerçek deneyimler.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-[24px] border border-line bg-surface p-6 shadow-card"
            >
              <RatingStars value={r.rating} size="sm" />
              <blockquote className="mt-3 flex-1 leading-relaxed text-ink">
                "{r.comment}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <Avatar src={r.customer.image} name={r.customer.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{r.customer.name}</p>
                  <Link
                    href={`/salon/${r.business.slug}`}
                    className="truncate text-xs text-ink-soft hover:text-accent-deep"
                  >
                    {r.business.name}
                  </Link>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
