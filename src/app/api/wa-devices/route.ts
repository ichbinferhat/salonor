import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Bağlı WhatsApp cihazlarını listeler (WaMessage/VatanSoft GET {base}/wp/device).
 * Amaç: gönderim için gereken `reg_id`'yi bulmak → WAMESSAGE_REG_ID env'ine konur.
 * Ham yanıtı döndürür (alan adları farklıysa gör).
 *
 * Kullanım: /api/wa-devices?secret=<CRON_SECRET>
 * Güvenlik: wa-test ile aynı — CRON_SECRET varsa eşleşmeli; yoksa yalnızca üretim-dışı.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  const provided = url.searchParams.get("secret") ?? "";

  if (secret) {
    if (provided !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET tanımlı değil — üretimde kapalı" },
      { status: 503 }
    );
  }

  const rawBase = (process.env.WAMESSAGE_API_URL || "https://api.toplusms.app").trim();
  let base: string;
  try {
    base = new URL(rawBase).origin;
  } catch {
    base = rawBase.replace(/\/+$/, "");
  }

  const token = process.env.WAMESSAGE_API_KEY ?? "";
  if (!token) {
    return NextResponse.json({ ok: false, error: "WAMESSAGE_API_KEY tanımlı değil" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    "x-api-key": token,
    Accept: "application/json",
  };

  try {
    const res = await fetch(`${base}/wp/device`, { headers });
    const raw = (await res.text().catch(() => "")).slice(0, 3000);
    return NextResponse.json({ ok: res.ok, base, httpStatus: res.status, raw });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      base,
      error: e instanceof Error ? e.message : "ağ hatası",
    });
  }
}
