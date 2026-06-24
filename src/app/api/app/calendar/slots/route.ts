import { NextResponse } from "next/server";
import { getOwnerBusiness } from "@/lib/owner";
import { fetchSlotsAction } from "@/server/actions/booking";

/** Walk-in için uygun saat dilimleri. fetchSlotsAction'ı (slot motoru) sarar. */
export async function GET(request: Request) {
  const business = await getOwnerBusiness();
  if (!business) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(request.url);
  const date = url.searchParams.get("date") || "";
  const durationMin = Number(url.searchParams.get("durationMin") || "0");
  const staffId = url.searchParams.get("staffId") || undefined;
  const serviceIds = (url.searchParams.get("serviceIds") || "").split(",").filter(Boolean);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(durationMin) || durationMin <= 0) {
    return NextResponse.json({ ok: false, error: "bad_params" }, { status: 400 });
  }

  const slots = await fetchSlotsAction({ businessId: business.id, date, durationMin, staffId, serviceIds });
  return NextResponse.json({ ok: true, slots });
}
