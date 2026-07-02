"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifyApptShort } from "@/lib/appt-token";
import { todayStr, nowMinutes } from "@/lib/datetime";

/**
 * Tek-tık teyit/iptal akışı (hatırlatma mesajındaki linkten gelir).
 * Yetki imzalı token ile sağlanır — giriş gerekmez, yalnızca o randevu hedeflenir.
 */

export async function confirmByTokenAction(
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const code = verifyApptShort(token);
  if (!code) return { ok: false, error: "Bağlantı geçersiz veya süresi dolmuş." };
  const appt = await db.appointment.findUnique({ where: { code }, select: { status: true } });
  if (!appt) return { ok: false, error: "Randevu bulunamadı." };
  if (appt.status === "CANCELLED") return { ok: false, error: "Bu randevu daha önce iptal edilmiş." };
  // Randevu zaten onaylı durumda; "Geliyorum" yalnızca müşteriye geri bildirimdir.
  return { ok: true };
}

export async function cancelByTokenAction(
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const code = verifyApptShort(token);
  if (!code) return { ok: false, error: "Bağlantı geçersiz veya süresi dolmuş." };
  const appt = await db.appointment.findUnique({
    where: { code },
    select: { status: true, date: true, startMin: true },
  });
  if (!appt) return { ok: false, error: "Randevu bulunamadı." };
  if (appt.status === "CANCELLED") return { ok: true };
  if (appt.status === "COMPLETED")
    return { ok: false, error: "Tamamlanmış randevu iptal edilemez." };
  // Geçmiş randevu iptal edilemez: raporlarda ciroya/prim'e sayılan gerçekleşmiş işi
  // silmeyi engeller. GÜN değil SAAT hassasiyetinde (müşteri-iptal guard'ı account.ts ile simetrik).
  const today = todayStr();
  if (appt.date < today || (appt.date === today && appt.startMin <= nowMinutes()))
    return { ok: false, error: "Geçmiş randevu iptal edilemez." };
  await db.appointment.update({ where: { code }, data: { status: "CANCELLED" } });
  revalidatePath("/panel/takvim");
  revalidatePath("/panel");
  return { ok: true };
}
