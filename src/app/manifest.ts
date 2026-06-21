import type { MetadataRoute } from "next";

// PWA web manifest — TWA kalitesi ve "yüklenebilir uygulama" deneyimi için.
// Next bunu /manifest.webmanifest olarak servis eder ve <link rel="manifest"> ekler.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Salonor — Güzellik & bakım randevusu",
    short_name: "Salonor",
    description:
      "Kuaför, berber, spa ve güzellik salonlarında saniyeler içinde online randevu al, randevularını yönet.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f2fb",
    theme_color: "#131b2e",
    lang: "tr",
    dir: "ltr",
    categories: ["lifestyle", "health", "beauty"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
