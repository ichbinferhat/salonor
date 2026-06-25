import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/admin", "/hesap", "/giris", "/kayit", "/randevu"],
    },
    sitemap: "https://salonor.com/sitemap.xml",
    host: "https://salonor.com",
  };
}
