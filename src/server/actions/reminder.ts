"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifyApptToken } from "@/lib/appt-token";
import { todayStr } from "@/lib/datetime";

/**
 * Tek-tık teyit/iptal akışı (hatırlatma mesajındaki linkten gelir).
 * Yetki imzalı token ile sağlanır — giriş gerekmez, yalnızca o randevu hedeflenir.
 */

export async function confirmByTokenAction(
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const aid = await verifyApptToken(token);
  if (!aid) return { ok: false, error: "Bağlantı geçersiz veya süresi dolmuş." };
  const appt = await db.appointment.findUnique({ where: { id: aid }, select: { status: true } });
  if (!appt) return { ok: false, error: "Randevu bulunamadı." };
  if (appt.status === "CANCELLED") return { ok: false, error: "Bu randevu daha önce iptal edilmiş." };
  // Randevu zaten onaylı durumda; "Geliyorum" yalnızca müşteriye geri bildirimdir.
  return { ok: true };
}

export async function cancelByTokenAction(
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const aid = await verifyApptToken(token);
  if (!aid) return { ok: false, error: "Bağlantı geçersiz veya süresi dolmuş." };
  const appt = await db.appointment.findUnique({
    where: { id: aid },
    select: { status: true, date: true },
  });
  if (!appt) return { ok: false, error: "Randevu bulunamadı." };
  if (appt.status === "CANCELLED") return { ok: true };
  if (appt.status === "COMPLETED")
    return { ok: false, error: "Tamamlanmış randevu iptal edilemez." };
  // Günü geçmiş randevu, token 7 gün geçerli olsa bile iptal edilemez: raporlarda
  // ciroya/prim'e sayılan geçmiş randevuyu silmesini engeller (müşteri-iptal
  // guard'ı account.ts:55 ile simetrik).
  if (appt.date < todayStr())
    return { ok: false, error: "Geçmiş randevu iptal edilemez." };
  await db.appointment.update({ where: { id: aid }, data: { status: "CANCELLED" } });
  revalidatePath("/panel/takvim");
  revalidatePath("/panel");
  return { ok: true };
}
