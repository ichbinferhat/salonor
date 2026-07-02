import { NextResponse } from "next/server";
import { sendWhatsApp, whatsappConfigured } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/**
 * WhatsApp (WaMessage) TEK MESAJ test ucu — entegrasyonu canlıya bağlamadan
 * doğrulamak için. WaMessage'ın döndürdüğü HAM yanıtı (`detail`) geri verir;
 * böylece alan adları/şema uyuşmazsa `src/lib/whatsapp.ts`'de tek noktadan
 * düzeltilir.
 *
 * Kullanım (tarayıcıdan):
 *   /api/wa-test?to=905XXXXXXXXX&text=merhaba&secret=<CRON_SECRET>
 *
 * Güvenlik: CRON_SECRET tanımlıysa `secret` eşleşmeli. Tanımsızsa yalnızca
 * üretim-DIŞI ortamda çalışır (canlıda açık bırakılmaz).
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
      { ok: false, error: "CRON_SECRET tanımlı değil — üretimde test ucu kapalı" },
      { status: 503 }
    );
  }

  const to = url.searchParams.get("to")?.trim();
  const text =
    url.searchParams.get("text")?.trim() ||
    "Salonor test mesajı ✅ WhatsApp entegrasyonu çalışıyor.";

  if (!to) {
    return NextResponse.json(
      { ok: false, error: "`to` parametresi gerekli (ör. 905XXXXXXXXX)" },
      { status: 400 }
    );
  }

  const configured = whatsappConfigured();
  const result = await sendWhatsApp(to, text);

  return NextResponse.json({
    ok: result.status !== "failed",
    configured, // false ise env eksik → sonuç "mock" döner (gerçek gönderim yok)
    to,
    result, // { status, detail } — detail WaMessage'ın ham yanıtı
  });
}
