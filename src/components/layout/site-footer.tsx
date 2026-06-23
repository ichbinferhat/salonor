import Link from "next/link";
import { Logo } from "@/components/logo";
import { getDictionary } from "@/i18n";

const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.95c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.42-.35 1.04-.4 2.18-.06 1.24-.07 1.6-.07 4.74s0 3.5.07 4.74c.05 1.14.24 1.76.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.42.16 1.04.35 2.18.4 1.24.06 1.6.07 4.74.07s3.5 0 4.74-.07c1.14-.05 1.76-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.42.35-1.04.4-2.18.06-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.18-.4-1.24-.06-1.6-.07-4.74-.07Zm0 3.32a4.53 4.53 0 1 1 0 9.06 4.53 4.53 0 0 1 0-9.06Zm0 7.47a2.94 2.94 0 1 0 0-5.88 2.94 2.94 0 0 0 0 5.88Zm5.77-7.67a1.06 1.06 0 1 1-2.12 0 1.06 1.06 0 0 1 2.12 0Z",
  },
  {
    label: "X",
    href: "#",
    path: "M17.53 3h3.07l-6.7 7.66L21.75 21h-6.17l-4.83-6.32L5.22 21H2.15l7.17-8.2L2.25 3h6.32l4.37 5.78L17.53 3Zm-1.08 16.17h1.7L7.62 4.74H5.8l10.65 14.43Z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z",
  },
];

const SOCIAL_TINT: Record<string, string> = {
  Instagram: "text-[#E1306C] hover:bg-[#E1306C] hover:text-white",
  X: "text-white hover:bg-white hover:text-ink",
  Facebook: "text-[#1877F2] hover:bg-[#1877F2] hover:text-white",
  YouTube: "text-[#FF0000] hover:bg-[#FF0000] hover:text-white",
};

export async function SiteFooter() {
  const dict = await getDictionary();

  const COLUMNS: { title: string; links: [label: string, href: string][] }[] = [
    {
      title: dict.footer.exploreTitle,
      links: [
        [dict.footer.hairdressers, "/arama?kategori=kuafor"],
        [dict.footer.barbers, "/arama?kategori=berber"],
        [dict.footer.spaMassage, "/arama?kategori=spa-masaj"],
        [dict.footer.nailStudios, "/arama?kategori=tirnak"],
        [dict.footer.skincare, "/arama?kategori=cilt-bakimi"],
      ],
    },
    {
      title: dict.footer.forBusinessesTitle,
      links: [
        [dict.footer.salonorBusiness, "/isletme"],
        [dict.footer.pricing, "/fiyatlandirma"],
        [dict.footer.addBusiness, "/isletme"],
        [dict.footer.businessLogin, "/giris"],
      ],
    },
    {
      title: dict.footer.companyTitle,
      links: [
        [dict.footer.about, "/hakkimizda"],
        [dict.footer.helpFaq, "/sss"],
        [dict.footer.privacy, "/kvkk"],
        [dict.footer.terms, "/kullanim-sartlari"],
        [dict.footer.contact, "/iletisim"],
      ],
    },
    {
      title: dict.footer.legalTitle,
      links: [
        [dict.footer.distanceSales, "/mesafeli-satis-sozlesmesi"],
        [dict.footer.preInfo, "/on-bilgilendirme"],
        [dict.footer.withdrawal, "/cayma-iade"],
        [dict.footer.cookiePolicy, "/cerez-politikasi"],
      ],
    },
  ];

  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-ink-strong text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div>
          <Logo tone="white" />
          <p className="mt-4 max-w-56 text-pretty text-sm leading-relaxed text-white/55">
            {dict.footer.tagline}
          </p>
          <div className="mt-5 flex gap-2">
            {/* Yalnızca gerçek (geçerli) hesap bağlantısı olan sosyal ikonları
                göster — "#" yer tutucular ölü link olmasın diye gizlenir. */}
            {SOCIALS.filter((s) => s.href && s.href !== "#").map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className={`flex size-10 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 ${
                  SOCIAL_TINT[s.label] ?? "text-white"
                }`}
              >
                {s.label === "Instagram" ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[18px]"
                    aria-hidden
                  >
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
                    <circle cx="12" cy="12" r="4.1" />
                    <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
                    <path d={s.path} />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-white/90">
              <span aria-hidden className="h-3.5 w-0.5 rounded-full bg-gradient-to-b from-accent to-[#ff5fa2]" />
              {col.title}
            </h3>
            <ul className="space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <span>{dict.footer.rights}</span>
          <span>{dict.footer.designedIn}</span>
        </div>
      </div>
    </footer>
  );
}
