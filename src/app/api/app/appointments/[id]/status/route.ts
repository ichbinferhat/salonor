import { NextResponse } from "next/server";
import { setAppointmentStatusAction } from "@/server/actions/business";

type Status = "COMPLETED" | "CANCELLED" | "NO_SHOW" | "CONFIRMED";
const ALLOWED: Status[] = ["COMPLETED", "CANCELLED", "NO_SHOW", "CONFIRMED"];

/** Randevu durumunu değiştirir (tamamlandı/iptal/gelmedi/onayla). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const status = String((body as { status?: unknown })?.status ?? "");
  if (!ALLOWED.includes(status as Status)) {
    return NextResponse.json({ ok: false, error: "bad_status" }, { status: 400 });
  }
  const res = await setAppointmentStatusAction(id, status as Status);
  return NextResponse.json(res, { status: res.ok ? 200 : 400 });
}
