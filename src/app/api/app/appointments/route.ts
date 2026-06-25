import { NextResponse } from "next/server";
import { createWalkInAction } from "@/server/actions/business";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Walk-in randevu oluşturur. createWalkInAction'ı sarar (Serializable çift-rezervasyon
 * koruması + personel-hizmet doğrulaması action içinde kalır). Yetki: salonor_session
 * çerezi (action içinde requireOwnerBusinessId).
 */
export async function POST(request: Request) {
  // Gerçek istemci IP'si: önce güvenilir x-real-ip / x-vercel-forwarded-for; ham
  // x-forwarded-for[0] sahtelenebildiğinden son çare (kod tabanıyla tutarlı sıra).
  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown";
  // Cömert sınır — normal kullanımı engellemez, seri kötüye kullanımı keser.
  if (!rateLimit(`app-walkin:${ip}`, 40, 60_000).ok) {
    return NextResponse.json({ ok: false, error: "Çok fazla istek, biraz sonra dene." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const res = await createWalkInAction({
    staffId: String(b?.staffId ?? ""),
    date: String(b?.date ?? ""),
    startMin: Number(b?.startMin ?? -1),
    serviceIds: Array.isArray(b?.serviceIds) ? (b.serviceIds as unknown[]).map(String) : [],
    customerName: String(b?.customerName ?? ""),
    customerPhone: b?.customerPhone ? String(b.customerPhone) : undefined,
  });

  return NextResponse.json(res, { status: res.ok ? 200 : 400 });
}
