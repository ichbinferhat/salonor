import { NextResponse } from "next/server";
import { markAppointmentsSeenAction } from "@/server/actions/business";

/** Yeni randevu bildirimlerini "görüldü" işaretler (sekme rozetini sıfırlar). */
export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    /* boş gövde de kabul (hepsini görüldü yap) */
  }
  const appointmentId = (body as { appointmentId?: unknown })?.appointmentId;
  const res = await markAppointmentsSeenAction(appointmentId ? String(appointmentId) : undefined);
  return NextResponse.json(res);
}
