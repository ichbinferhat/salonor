import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { getOwnerBusiness } from "@/lib/owner";

/**
 * Tek müşterinin randevu geçmişi. Anahtar kayıtlı müşteri id'si ya da `walk:<ad>`
 * (kayıtsız) olabilir. İşletmeye scope'ludur.
 */
export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const business = await getOwnerBusiness();
  if (!business) return NextResponse.json({ ok: false }, { status: 401 });

  const { key } = await params;
  // Next App Router param'ı zaten URL-decode eder; literal '%' içeren bir anahtarda
  // ikinci decode URIError fırlatır → işlenmeyen 500. Hata olursa ham anahtarı kullan.
  let decoded: string;
  try {
    decoded = decodeURIComponent(key);
  } catch {
    decoded = key;
  }
  const where: Prisma.AppointmentWhereInput = decoded.startsWith("walk:")
    ? { businessId: business.id, customerId: null, customerName: decoded.slice(5) }
    : { businessId: business.id, customerId: decoded };

  const appts = await db.appointment.findMany({
    where,
    include: { items: { select: { name: true } }, staff: { select: { name: true } } },
    orderBy: [{ date: "desc" }, { startMin: "desc" }],
  });

  return NextResponse.json({
    ok: true,
    history: appts.map((a) => ({
      id: a.id,
      date: a.date,
      startMin: a.startMin,
      status: a.status,
      services: a.items.map((i) => i.name).join(", "),
      staffName: a.staff?.name ?? "",
      totalTl: a.totalTl,
    })),
  });
}
