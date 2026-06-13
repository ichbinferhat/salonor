import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = "admin@salonor.com";
  const passwordHash = await bcrypt.hash("salonor123", 10);
  const u = await db.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
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
