import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE = "https://salonor.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [businesses, categories] = await Promise.all([
    db.business.findMany({
      where: { active: true },
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/arama",
    "/isletme",
    "/fiyatlandirma",
    "/hakkimizda",
    "/kullanim-sartlari",
    "/kvkk",
    "/iletisim",
    "/sss",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/arama?kategori=${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const salonRoutes: MetadataRoute.Sitemap = businesses.map((b) => ({
    url: `${BASE}/salon/${b.slug}`,
    lastModified: b.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...salonRoutes];
}
