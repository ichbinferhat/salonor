"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

async function isAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN";
}

/** İşletmeyi öne çıkan yap/kaldır (yalnızca ADMIN). */
export async function setFeaturedAction(businessId: string, featured: boolean) {
  if (!(await isAdmin())) return { ok: false };
  await db.business.update({ where: { id: businessId }, data: { featured } });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}
