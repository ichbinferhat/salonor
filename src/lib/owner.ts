import { cache } from "react";
import { db } from "./db";
import { getSession } from "./session";

/** Oturumdaki işletme sahibinin işletmesini döner (yoksa null). Request başına cache'li. */
export const getOwnerBusiness = cache(async () => {
  const session = await getSession();
  if (!session || session.role !== "OWNER") return null;
  return db.business.findUnique({
    where: { ownerId: session.userId },
    include: { category: true },
  });
});

/** İşletme sahibinin işletme ID'sini doğrular; başka işletmeye müdahaleyi engeller. */
export async function requireOwnerBusinessId(): Promise<string | null> {
  const business = await getOwnerBusiness();
  return business?.id ?? null;
}
