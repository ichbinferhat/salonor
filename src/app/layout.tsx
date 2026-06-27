import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { cookies, headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { getSession } from "@/lib/session";
import { AppBridge } from "@/components/app-bridge";
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
    metadataBase: new URL("https://salonor.com"),
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
  // Mobil uygulama (WebView) içinde çentik/ana-çubuk alanları için env(safe-area-inset-*)
  // değerlerinin gerçek değer döndürmesini sağlar.
  viewportFit: "cover",
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

  // Mobil uygulama tespiti: WebView özel User-Agent'ına "SalonorApp" ekler. İçindeyken
  // web başlık/altbilgisini gizleyip native çubuklara yer açıyoruz (globals.css `.in-app`).
  const ua = (await headers()).get("user-agent") ?? "";
  const inApp = ua.includes("SalonorApp");
  // Köprü için oturum bilgisini yalnızca uygulama içindeyken çek (aksi halde gereksiz).
  const appSession = inApp ? await getSession() : null;

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className={`flex min-h-full flex-col${inApp ? " in-app" : ""}`}>
        {/* Görsel CDN'lerine erken bağlantı (DNS+TLS) — ilk fotoğraflar daha hızlı gelir. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://i.pravatar.cc" />
        <I18nProvider dict={dict} locale={locale}>
          {children}
          <CookieConsent />
        </I18nProvider>
        {inApp && (
          <AppBridge
            session={
              appSession
                ? {
                    userId: appSession.userId,
                    role: appSession.role,
                    name: appSession.name,
                  }
                : null
            }
          />
        )}
        <ServiceWorkerRegistrar />
        {analyticsConsent && <Analytics />}
      </body>
    </html>
  );
}
