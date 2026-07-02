# Salonor — Operasyon Kılavuzu (RUNBOOK)

Bu belge Salonor'un canlı işletilmesi için operasyon/DevOps başvurusudur:
deploy, veritabanı, yedekleme/kurtarma, ortam değişkenleri, izleme ve hesaplar.

---

## 1. Mimari Özet

- **Uygulama:** Next.js 16 (App Router), TypeScript, Vitest. npm ile yönetilir.
- **Hosting:** Vercel — bölge **fra1 (Frankfurt)**.
- **Veritabanı:** Supabase Postgres — bölge **eu-central-1 (Frankfurt)**.
  - Uygulama → **Transaction pooler (port 6543)** üzerinden bağlanır (serverless'a uygun).
  - Migration/seed → **Session pooler (port 5432)** üzerinden yapılır.
- **ORM:** Prisma 7. `generator prisma-client` çıktısı → `src/generated/prisma`.
- **AI:** Google Gemini (`gemini-2.5-flash`) — stil danışmanı + analiz paneli.
- **Mobil:** Expo (App Store + Play Store) + TWA Android; push Expo altyapısıyla.

Uygulama ve veritabanı aynı bölgede (Frankfurt) olduğundan ağ gecikmesi düşüktür.

---

## 2. Deploy

> **KRİTİK:** Sadece `git push` canlıya çıkmaz! Bir Vercel git entegrasyonu
> otomatik deploy tetiklemediği sürece, canlı yayın için aşağıdaki komut ŞART.

```bash
# 1) Değişiklikleri commit + push et (kaynak kontrolü için)
git add -A && git commit -m "..." && git push

# 2) Canlıya çık (ZORUNLU — commit tek başına yeterli DEĞİL)
vercel --prod --yes
```

### Vercel ortam değişkeni ekleme/güncelleme

> **UYARI:** `vercel env add` BU ortamda BOZUK — değeri **boş** kaydeder.
> Bunun yerine aşağıdaki iki yöntemden birini kullan:

1. **Vercel Web Paneli:** Project → Settings → Environment Variables (en güvenli).
2. **Vercel REST API:** `POST /v10/projects/{projectId}/env` ile değeri doğrudan yaz.

Değişken ekledikten/değiştirdikten sonra **yeniden deploy** gerekir
(`vercel --prod --yes`), aksi halde eski değer kullanılmaya devam eder.

---

## 3. Veritabanı (Şema Değişikliği)

Şema değişikliği yaparken sıralama **çok önemli**:

```bash
# 1) .env içindeki DATABASE_URL'i SESSION POOLER (port 5432) yap
#    (migration/DDL transaction pooler 6543 üzerinden güvenilir değil).

# 2) Şemayı veritabanına uygula
npx prisma db push

# 3) ÇOK ÖNEMLİ — indexleri TEKRAR garanti altına al
npm run db:ensure-indexes

# 4) İş bitince .env'i tekrar TRANSACTION POOLER (6543) yap (uygulama bunu kullanır).
```

> **NEDEN `db:ensure-indexes` ZORUNLU?**
> `prisma db push`, Prisma şemasında ifade edilemeyen **çift-rezervasyon
> partial unique index'ini DÜŞÜREBİLİR**. Bu index, aynı personel/zamana
> ikinci randevu alınmasını engelleyen booking güvencesidir. `db push`
> sonrası `db:ensure-indexes` koşulmazsa çift rezervasyon riski doğar.

- **Uygulama runtime:** Transaction pooler (6543).
- **Migration/seed/index:** Session pooler (5432).

---

## 4. Yedekleme & Kurtarma (Disaster Recovery)

### Mevcut durum
- Supabase **yönetilen günlük yedek** alır (Free/Pro plana göre saklama süresi değişir).
- **PITR (Point-in-Time Recovery)** için **Supabase Pro** planı gerekir.

### Önerilen ek koruma (kendi yedeğin)
Supabase yönetilen yedeğe ek olarak, **dış depoya** (Cloudflare R2 / AWS S3)
günlük `pg_dump` alan bir cron önerilir (tek nokta bağımlılığını azaltır):

```bash
# Günlük mantıksal yedek (session pooler / 5432 üzerinden)
pg_dump "$DATABASE_URL" -Fc -f "salonor-$(date +%F).dump"
# Ardından dump dosyasını R2/S3'e yükle (rclone / aws s3 cp).
```

### Restore (Kurtarma) prosedürü
- **Supabase yönetilen yedekten:** Supabase Dashboard → Database → Backups →
  ilgili yedeği seç → Restore. (Pro'da PITR ile belirli ana dönüş mümkün.)
- **Kendi pg_dump'ından:**
  ```bash
  pg_restore --clean --if-exists -d "$DATABASE_URL" salonor-YYYY-MM-DD.dump
  ```
- Restore sonrası **MUTLAKA** `npm run db:ensure-indexes` koş (booking güvencesi).

### Hedefler
- **RPO (kabul edilebilir veri kaybı):** ~24 saat (günlük yedek modeliyle).
  pg_dump cron sıklığı artırılarak (örn. 6 saatte bir) düşürülebilir.
- **RTO (kurtarma süresi hedefi):** birkaç saat (yedek boyutuna ve restore yöntemine göre).

### ⚠️ KRİTİK UYARI — `db:seed`
> `npm run db:seed` **TÜM tabloları siler** ve örnek veriyle doldurur.
> **CANLI veritabanında ASLA çalıştırma!** Yalnızca yerel/geliştirme ortamında.
> (Üretim guard'ı ekleniyor; yine de manuel çalıştırmaya dikkat.)

---

## 5. Ortam Değişkenleri

Ayrıntılı açıklamalar ve örnek değerler için: **`.env.example`**.

| Değişken         | Durum     | Açıklama                                                            |
|------------------|-----------|--------------------------------------------------------------------|
| `DATABASE_URL`   | Mevcut    | Supabase Postgres bağlantısı (uygulama: 6543, migration: 5432).    |
| `AUTH_SECRET`    | Mevcut    | Oturum/JWT imzalama anahtarı (uzun rastgele).                      |
| `GEMINI_API_KEY` | Mevcut    | Google Gemini API anahtarı (model: gemini-2.5-flash).             |
| `SMS_PROVIDER`   | Gelecek   | `netgsm` ise SMS gerçek; boşsa mock mod.                           |
| `NETGSM_USER`    | Gelecek   | NetGSM kullanıcı adı (SMS_PROVIDER=netgsm ile zorunlu).           |
| `NETGSM_PASS`    | Gelecek   | NetGSM şifresi.                                                    |
| `NETGSM_HEADER`  | Gelecek   | Onaylı SMS gönderici başlığı.                                      |
| `RESEND_API_KEY` | Gelecek   | E-posta gönderimi (Resend). Yoksa e-posta atlanır.                |
| `SENTRY_DSN`     | Gelecek   | Hata izleme. Yoksa Sentry kapalı.                                  |
| `CRON_SECRET`    | Mevcut    | Cron uç noktalarını koruyan gizli anahtar (Render'da tanımlı).    |
| `WHATSAPP_PROVIDER` | Mevcut | `wamessage` → otomatik WhatsApp aktif; boşsa mock.               |
| `WAMESSAGE_API_URL` | Mevcut | WhatsApp API taban host (`https://api.toplusms.app`).            |
| `WAMESSAGE_API_KEY` | Mevcut | WaMessage `x-api-key` (panel → API Key Göster).                  |
| `WAMESSAGE_REG_ID`  | Mevcut | Bağlı WhatsApp cihazının `registration_id`'si.                   |

> Vercel'de değişken eklerken Bölüm 2'deki uyarıya dikkat
> (`vercel env add` bozuk → panel/REST API).

---

## 5b. Hatırlatma / bildirim cron'ları (Supabase pg_cron ile)

Render'da yerleşik cron YOK (`vercel.json` crons Render'da çalışmaz). Tetikleme, zaten
var olan **Supabase veritabanının** `pg_cron` + `pg_net` uzantılarıyla yapılır — dış cron
servisi/hesabı GEREKMEZ. İki iş `cron.schedule` ile kayıtlı (pg_cron **UTC** kullanır):

| İş adı                     | Zamanlama (UTC) | Uç / İş                                              |
|----------------------------|-----------------|------------------------------------------------------|
| `salonor-reminders-daily`  | `0 16 * * *` (=19:00 TR) | ERTESİ GÜN randevularına hatırlatma.          |
| `salonor-reminders-3h`     | `*/10 * * * *`  | Bugün ~3 saat içindeki randevulara 2. hatırlatma.    |

Her iş `net.http_get('https://salonor.com/api/cron/reminders[-3h]?key=<CRON_SECRET>')` çağırır.
- **Yönetim (SQL):** liste `select jobname,schedule,active from cron.job;` · log
  `select * from cron.job_run_details order by start_time desc limit 20;` · çıktı
  `select id,status_code,error_msg from net._http_response order by id desc;` · sil
  `select cron.unschedule('salonor-reminders-3h');`
- **Yan fayda:** 10 dk'lık ping Render'ı uyanık tutar (cold-start biter) + Supabase'i aktif tutar.
- Anlık **randevu onayı** cron DEĞİL — booking anında (`createAppointmentAction`) WhatsApp gider.
- WhatsApp mesaj biçimi tek yerde: `src/lib/appt-message.ts` (onay + iki hatırlatma ortak).
- Aynı gün <3 saat rezervasyonda 3s-hatırlatma booking'de `reminder3hSentAt` ile bastırılır.

---

## 6. İzleme

- **Sağlık kontrolü:** `/api/health` uç noktası (ekleniyor) — DB erişilebilirliğini döner.
- **Uptime izleme:** `/api/health` adresini **UptimeRobot** ile 1–5 dk aralıkla
  izle; düşüşte e-posta/Telegram bildirimi al.
- **Deploy bildirimi:** Vercel → Settings → Notifications ile "deploy failed"
  bildirimlerini aç (e-posta).
- **Hata izleme (opsiyonel):** `SENTRY_DSN` tanımlanırsa Sentry ile runtime hataları.

---

## 7. Demo Hesaplar ve Roller

| Rol         | Açıklama                                                          |
|-------------|------------------------------------------------------------------|
| Müşteri     | Salon arar, randevu alır, yorum yazar.                            |
| İşletme     | Salon/hizmet/personel yönetir, randevuları görür.                |
| Admin       | Platform yönetimi (admin paneli).                                |

> Güncel demo hesap e-posta/şifreleri proje hafızasında tutulur
> (gizli bilgi olduğu için bu belgeye yazılmaz). Admin şifresi gerektiğinde
> döndürülür — bkz. güvenlik notları.

---

## 8. Hızlı Komut Referansı

```bash
npm run dev                 # geliştirme sunucusu
npm run build               # üretim derlemesi (yerel kontrol)
npm run lint                # ESLint
npx tsc --noEmit            # tip kontrolü
npm test                    # Vitest
npm run db:seed             # ⚠️ SADECE yerel — tabloları siler!
npm run db:ensure-indexes   # booking index güvencesi (db push sonrası ŞART)
vercel --prod --yes         # canlıya deploy
```
