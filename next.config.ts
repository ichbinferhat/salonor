import type { NextConfig } from "next";

// İçerik Güvenlik Politikası (CSP). Next App Router satır-içi (inline) bootstrap
// script'leri ürettiği için nonce'suz kurulumda script-src 'unsafe-inline' gerekir;
// yine de script/bağlantı/görsel KAYNAKLARINI kısıtlamak XSS sızdırma yüzeyini,
// clickjacking'i ve karışık içeriği azaltır. Harita (maplibre) blob worker + carto
// tile, görseller unsplash/pravatar, analytics aynı-köken üzerinden çalışır.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://i.pravatar.cc https://*.basemaps.cartocdn.com",
  "connect-src 'self' https://*.basemaps.cartocdn.com",
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // Özel yükleyici: görsel küçültmeyi Render'ın zayıf CPU'sundaki yerleşik
    // optimizatör yerine doğrudan kaynak CDN'e (Unsplash) yaptırır → fotoğraflar
    // 2-3 sn gecikme olmadan hızlıca gelir. Detay: ./image-loader.js
    loader: "custom",
    loaderFile: "./image-loader.js",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  // Public self-registration kapalı: hesaplar admin paneli üzerinden açılır.
  // Eski kayıt rotaları edge seviyesinde kalıcı olarak yönlendirilir.
  async redirects() {
    return [
      { source: "/kayit", destination: "/giris", permanent: true },
      { source: "/isletme/kayit", destination: "/iletisim", permanent: true },
    ];
  },
  // Güvenlik başlıkları (production sağlamlaştırma — düşük riskli, evrensel güvenli set).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
