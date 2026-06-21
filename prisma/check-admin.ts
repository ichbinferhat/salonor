import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, email: true, name: true, passwordHash: true, createdAt: true },
  });

  console.log(`ADMIN rolündeki kullanıcı sayısı: ${admins.length}`);
  for (const a of admins) {
    const weak = await bcrypt.compare("salonor123", a.passwordHash);
    console.log(
      `- ${a.email} | ${a.name} | şifre 'salonor123' mi? => ${weak ? "EVET (ZAYIF!)" : "hayır"} | oluşturma: ${a.createdAt.toISOString()}`
    );
  }

  // Demo hesaplarını da kontrol et (bilgi amaçlı — bunlar kasıtlı demo)
  const demos = ["musteri@salonor.com", "isletme@salonor.com"];
  for (const email of demos) {
    const u = await db.user.findUnique({
      where: { email },
      select: { email: true, role: true, passwordHash: true },
    });
    if (u) {
      const weak = await bcrypt.compare("salonor123", u.passwordHash);
      console.log(`(demo) ${u.email} | rol ${u.role} | 'salonor123' mi? => ${weak ? "evet" : "hayır"}`);
    } else {
      console.log(`(demo) ${email} | YOK`);
    }
  }
}

main()
  .catch((e) => {
    console.error("HATA:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
