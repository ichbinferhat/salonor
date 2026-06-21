import "dotenv/config";
import { randomBytes } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

/** Karışıklık yaratan karakterler (0/O, 1/l/I) olmadan güçlü, okunabilir şifre üretir. */
function strongPassword(len = 20) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_";
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

async function main() {
  const email = "admin@salonor.com";
  const newPassword = strongPassword(20);
  const passwordHash = await bcrypt.hash(newPassword, 12); // maliyet 10 -> 12

  const u = await db.user.update({
    where: { email },
    data: { passwordHash },
    select: { email: true, role: true },
  });

  console.log("=== ADMIN ŞİFRESİ DEĞİŞTİRİLDİ ===");
  console.log(`E-posta : ${u.email}`);
  console.log(`Rol     : ${u.role}`);
  console.log(`YENİ ŞİFRE: ${newPassword}`);
  console.log("Bu şifreyi güvenli bir yere kaydet — tekrar gösterilmeyecek.");
}

main()
  .catch((e) => {
    console.error("HATA:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
