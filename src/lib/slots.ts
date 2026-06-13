import { db } from "./db";
import { todayStr, nowMinutes, weekdayOf } from "./datetime";

const STEP = 15; // dakika cinsinden slot aralığı
const LEAD_TIME = 30; // bugünkü randevular için minimum hazırlık süresi (dk)

export type Slot = { time: number; staffIds: string[] };

/**
 * Bir işletmede verilen gün için uygun başlangıç saatlerini hesaplar.
 * - İşletmenin o günkü çalışma saatleri içinde
 * - Seçilen hizmetlerin TÜMÜNÜ yapabilen personel(ler) için
 * - Mevcut randevularla çakışmayan
 * 15 dakikalık adımlarla slot listesi döner.
 */
export async function getAvailableSlots(opts: {
  businessId: string;
  date: string;
  durationMin: number;
  staffId?: string;
  serviceIds?: string[];
}): Promise<Slot[]> {
  const weekday = weekdayOf(opts.date);

  const hours = await db.workingHour.findUnique({
    where: { businessId_weekday: { businessId: opts.businessId, weekday } },
  });
  if (!hours || hours.closed) return [];

  let staff = await db.staff.findMany({
    where: {
      businessId: opts.businessId,
      active: true,
      ...(opts.staffId ? { id: opts.staffId } : {}),
    },
    include: { services: { select: { serviceId: true } } },
  });

  if (opts.serviceIds?.length) {
    staff = staff.filter((st) =>
      opts.serviceIds!.every((id) => st.services.some((s) => s.serviceId === id))
    );
  }
  if (staff.length === 0) return [];

  const appointments = await db.appointment.findMany({
    where: {
      businessId: opts.businessId,
      date: opts.date,
      status: { in: ["CONFIRMED", "COMPLETED"] },
      staffId: { in: staff.map((s) => s.id) },
    },
    select: { staffId: true, startMin: true, endMin: true },
  });

  const busy = new Map<string, { s: number; e: number }[]>();
  for (const a of appointments) {
    const list = busy.get(a.staffId) ?? [];
    list.push({ s: a.startMin, e: a.endMin });
    busy.set(a.staffId, list);
  }

  const minStart = opts.date === todayStr() ? nowMinutes() + LEAD_TIME : 0;
  const slots: Slot[] = [];

  for (let t = hours.openMin; t + opts.durationMin <= hours.closeMin; t += STEP) {
    if (t < minStart) continue;
    const freeStaff = staff
      .filter((st) => {
        const blocks = busy.get(st.id) ?? [];
        return !blocks.some((b) => t < b.e && t + opts.durationMin > b.s);
      })
      .map((s) => s.id);
    if (freeStaff.length > 0) slots.push({ time: t, staffIds: freeStaff });
  }

  return slots;
}

/** Personelin verilen aralıkta çakışan randevusu var mı? (rezervasyon anında son kontrol) */
export async function hasConflict(opts: {
  staffId: string;
  date: string;
  startMin: number;
  endMin: number;
}): Promise<boolean> {
  const count = await db.appointment.count({
    where: {
      staffId: opts.staffId,
      date: opts.date,
      status: { in: ["CONFIRMED", "COMPLETED"] },
      startMin: { lt: opts.endMin },
      endMin: { gt: opts.startMin },
    },
  });
  return count > 0;
}

export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `SLNR-${code}`;
}
