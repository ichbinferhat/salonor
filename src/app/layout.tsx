import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegistrar } from "@/components/pwa/service-worker-registrar";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { getDictionary, getLocale } from "@/i18n";
import { isRtl, type Locale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";

// OpenGraph `og:locale` için BCP-47 bölge eşlemesi (aktif dilden türetilir).
const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  ru: "ru_RU",
  ar: "ar_SA",
  de: "de_DE",
  fr: "fr_FR",
  fa: "fa_IR",
  es: "es_ES",
};

// Başlıklar: zarif, editoryal serif (premium güzellik markası hissi)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Gövde: ultra-okunur, nötr Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  const ogLocale = OG_LOCALE[locale];
  return {
    metadataBase: new URL("https://salonor.vercel.app"),
    title: {
      default: "Salonor — Güzellik ve bakım randevusu, saniyeler içinde",
      template: "%s | Salonor",
    },
    description:
      "Kuaför, berber, spa ve güzellik salonlarını keşfet; uygun saati seç, randevunu anında ayırt. Türkiye'nin randevu platformu Salonor.",
    applicationName: "Salonor",
    keywords: [
      "kuaför randevu",
      "berber randevu",
      "güzellik salonu randevu",
      "spa randevu",
      "tırnak bakımı",
      "online randevu",
    ],
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== ogLocale),
      siteName: "Salonor",
      title: dict.common.ogTitle,
      description: dict.common.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.common.ogTitle,
      description: dict.common.ogDescription,
    },
    appleWebApp: {
      capable: true,
      title: "Salonor",
      statusBarStyle: "default",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#131b2e",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dict = await getDictionary();
  // Analiz çerezleri yalnızca kullanıcı açıkça kabul ettiyse yüklenir (KVKK).
  const analyticsConsent =
    (await cookies()).get("salonor_cookie_consent")?.value === "accepted";

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider dict={dict} locale={locale}>
          {children}
          <CookieConsent />
        </I18nProvider>
        <ServiceWorkerRegistrar />
        {analyticsConsent && <Analytics />}
      </body>
    </html>
  );
}
