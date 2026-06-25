# Salonor — İnşa Durumu (Claude için çalışma notu)

Fresha tarzı kuaför/güzellik randevu pazaryeri. Türkçe içerik, marka: **Salonor**.
Tam yetki: onay beklemeden inşa et, sonunda Vercel'e deploy et (`vercel --prod`, hesap bağlı).

## ✅ DURUM: CANLIDA — https://salonor.com (özel domain; altyapı Render, 2026-06-25)
- Tüm rotalar (public + owner panel + customer hesap) canlıda 200 doğrulandı.
- **DB: Supabase Postgres'e taşındı** (proje `hncfqwyajobywlrshaaz`, ap-northeast-1/Tokyo).
  Kalıcı — eski geçici Prisma Postgres terk edildi, claim derdi yok.
  Vercel app: transaction pooler (6543). Yerel push/seed: session pooler (5432).
  Bağlantı dizesi + şifre yerel `.env`'de (gitignore'lu) ve Vercel env'de — bu dosyaya YAZMA.
  Şifre Ferhat'tan geldi (Supabase Settings→Database→Reset ile yenilenebilir).
- ⚠️ VERCEL ENV NOTU: Bu ortamda `vercel env add` değeri yakalayamıyor (stdin boş gidiyor,
  --value yok sayılıyor → boş kaydediyor). ÇÖZÜM: Vercel REST API ile yaz. Token:
  C:/Users/ASUS/AppData/Roaming/xdg.data/com.vercel.cli/auth.json (.token).
  projectId=prj_b1eLkqmUoMY1YV5H3EfxsG1ptfq5, teamId=team_hC0GLwYVroG9Ima2bmHYocjm.
  POST https://api.vercel.com/v10/projects/{proj}/env?teamId={team} body
  {key,value,type:"encrypted",target:["production","preview","development"]}.

## Kritik bilgiler
- **DB:** Supabase Postgres (proje `hncfqwyajobywlrshaaz`, Tokyo). Bağlantı `.env` (gitignore) + Vercel env'de.
  Tablo değişikliği: `.env`'i session pooler (5432) yapıp `npx prisma db push`. Vercel app 6543 kullanır.
- **Demo hesaplar (seed):** musteri@salonor.com / salonor123 (CUSTOMER), isletme@salonor.com / salonor123 (OWNER — "Nova Saç Atölyesi" Kadıköy)
- **Sürümler:** Next.js 16.2.9 (Turbopack varsayılan, `params`/`cookies` async-only, middleware yerine `src/proxy.ts` + `export function proxy`), Prisma 7.8 (generator `prisma-client`, çıktı `src/generated/prisma`, CLI config `prisma.config.ts` + dotenv), Tailwind v4 (CSS-first `@theme`), zod 4, maplibre-gl 5.
- Build lint çalıştırmaz (sadece TS). `npm run build` Turbopack.

## Konvansiyonlar
- Randevu zamanı: `date` = "YYYY-MM-DD" string + `startMin`/`endMin` (gece yarısından dk). TZ: Europe/Istanbul (lib/datetime.ts yardımcıları).
- Para: `priceTl` Int (TL). `formatTl()` ile yazdır.
- Auth: özel JWT (jose, HS256, cookie `salonor_session`, 30 gün). Roller: CUSTOMER/OWNER/ADMIN. `lib/session.ts` → `getSession()` (React cache'li), `lib/auth.ts` → hash/verify.
- Prisma client: `src/lib/db.ts` global singleton, import `@/generated/prisma/client`.
- Görseller: images.unsplash.com (doğrulanmış ID havuzu seed'de) + i.pravatar.cc (personel/avatar). next.config'te remotePatterns.
- Tasarım: koyu lacivert mürekkep (#10162B ailesi) + canlı mor (#6C4DF6) vurgu, krem-beyaz zemin (#FAFAF8), büyük radius (kart 20px, buton pill), fontlar: Bricolage Grotesque (başlık) + Hanken Grotesk (gövde) via next/font. Yıldızlar mürekkep renginde. Token'lar globals.css `@theme`.

## Rotalar / Durum
- [x] Scaffold (create-next-app, npm)
- [x] prisma/schema.prisma (tam model)
- [ ] prisma generate + db push + seed (prisma/seed.ts, tsx ile)
- [ ] globals.css token'lar + layout.tsx (fontlar, Header/Footer)
- [ ] UI kiti (src/components/ui/*)
- [ ] / (müşteri landing), /isletme (işletme landing)
- [ ] /arama (filtre + liste + MapLibre harita), /salon/[slug] (detay)
- [ ] /randevu/[slug] (4 adımlı sihirbaz, slot motoru lib/slots.ts)
- [ ] /giris, /kayit, /isletme/kayit → /isletme/kurulum (onboarding)
- [ ] /hesap (randevular/favoriler/profil), yorum yazma
- [ ] /panel (dashboard, takvim, hizmetler, personel, müşteriler, yorumlar, ayarlar)
- [ ] src/proxy.ts (rota koruma)
- [ ] npm run build temiz → git commit → vercel env + `vercel --prod`
- [ ] Final rapor: canlı URL + claim linki + demo hesaplar

## Deploy
- vercel.json: `{ "regions": ["fra1"] }` (DB eu-central-1'de)
- Vercel env: DATABASE_URL, AUTH_SECRET (echo ile `vercel env add` non-interaktif)
- package.json: `"postinstall": "prisma generate"` gerekli (Vercel build)
