/**
 * Şema dışı (raw SQL) veritabanı garantilerini kurar/yeniler.
 *
 * Çalıştır:  npx tsx prisma/ensure-indexes.ts
 *
 * Şu an tek garanti: ÇİFT REZERVASYON KORUMASI.
 * Aynı personele (staffId) aynı tarih (date) ve aynı başlangıç saatinde (startMin)
 * ikinci bir AKTİF randevu (CONFIRMED/COMPLETED) yazılmasını DB seviyesinde engeller.
 * İptal/Gelinmedi randevular index dışında kaldığından o slot tekrar açılabilir.
 *
 * Prisma şeması "partial unique index" ifade edemediği için burada raw SQL ile kurulur.
 * `prisma db push` bu indeksi düşürürse bu script'i tekrar çalıştır.
 */
import "dotenv/config";
import { Client } from "pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL tanımlı değil.");

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS appt_no_double_book
        ON "Appointment" ("staffId", date, "startMin")
        WHERE status IN ('CONFIRMED','COMPLETED')
    `);
    const res = await client.query(
      `SELECT 1 FROM pg_indexes WHERE tablename = 'Appointment' AND indexname = 'appt_no_double_book'`
    );
    console.log(
      res.rowCount === 1
        ? "✓ appt_no_double_book indeksi hazır (çift rezervasyon koruması aktif)."
        : "✗ İndeks oluşturulamadı!"
    );
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("ensure-indexes hatası:", e);
  process.exit(1);
});
