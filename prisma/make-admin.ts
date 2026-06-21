import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = "admin@salonor.com";

  // GÜVENLİK: Şifre asla sabit kodlanmaz. Şifre yalnızca ADMIN_PASSWORD ortam
  // değişkeninden okunur; tanımlı değilse script güvenli biçimde durur (zayıf
  // varsayılana DÜŞMEZ). Örn:  ADMIN_PASSWORD='...' npx tsx prisma/make-admin.ts
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    console.error(
      "HATA: ADMIN_PASSWORD ortam değişkeni tanımlı değil veya 12 karakterden kısa.\n" +
        "Kullanım: ADMIN_PASSWORD='güçlü-bir-şifre' npx tsx prisma/make-admin.ts\n" +
        "(Mevcut admin şifresini döndürmek için: npx tsx prisma/rotate-admin.ts)"
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const u = await db.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: { name: "Salonor Yönetim", email, passwordHash, role: "ADMIN" },
  });
  console.log("ADMIN hazir:", u.email, u.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
