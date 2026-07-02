import { trPhoneDigits } from "./contact";

/**
 * WhatsApp gönderim sağlayıcısı — WaMessage (panel: app.wamessage.app).
 *
 * WaMessage'ın "yeni" API backend'i VatanSoft/TopluSMS altyapısını paylaşır; gerçek
 * API host'u https://api.toplusms.app (canlı testte doğrulandı). Gönderim İKİ ADIMLIDIR:
 *   1) POST {base}/bulk/preview/wp   (multipart/form-data) → data.id (önizleme UUID)
 *   2) POST {base}/bulk/wp           (JSON {id})           → data.report_id (gönderim)
 * Tek-adımlı alternatif: POST {base}/bulk/wp/nton (JSON {messages:[...]}) —
 *   WAMESSAGE_SINGLE_STEP=true ile denenir (daha az doğrulanmış, yedek yol).
 *
 * Kimlik: `x-api-key: <key>` header'ı (panelde "API Key Göster" değeri, WhatsApp API
 * sekmesi). Bearer/session token DEĞİL — canlı testte doğrulandı (Bearer → "Unauthorized
 * - Session not found"). Anahtar panelden iptal/değiştirilirse env güncellenir.
 *
 * Gönderim, bağlı WhatsApp cihazının reg_id'sini ister (WAMESSAGE_REG_ID). reg_id,
 * GET {base}/wp/device yanıtındaki "registration_id" alanıdır — bkz. test ucu /api/wa-devices.
 *
 * Anahtar/cihaz yoksa "mock": gerçek gönderim yapılmaz, akış (cron vb.) bozulmaz.
 *
 * Ortam değişkenleri:
 *   WHATSAPP_PROVIDER=wamessage
 *   WAMESSAGE_API_URL=https://api.toplusms.app   (TABAN host; tam uç değil)
 *   WAMESSAGE_API_KEY=<panel "API Key Göster" — x-api-key değeri>
 *   WAMESSAGE_REG_ID=<bağlı cihaz reg_id = /wp/device'daki registration_id> (yoksa WAMESSAGE_SENDER)
 *   WAMESSAGE_SINGLE_STEP=                        ("true" → /bulk/wp/nton tek adım)
 *
 * Yanıt gövdeleri log/teşhis için `detail`e kısaltılarak konur (parse TAM metin üzerinde
 * yapılır — kısaltılmış metni parse etmek JSON'u bozar). Şema araştırma özeti:
 * [[salonor-messaging-strategy]] hafızasında.
 */

export type WaResult = { status: "sent" | "failed" | "mock"; detail?: string };

type WaResp = {
  data?: {
    id?: string;
    count_valid_numbers?: number;
    report_id?: string;
    reportId?: string;
    message?: string;
  };
  status?: number;
  message?: string;
} | null;

const DEFAULT_BASE = "https://api.toplusms.app";
const SNIP = 700; // detail'e konacak ham yanıt kırpma sınırı (parse'tan SONRA)

/** WAMESSAGE_API_URL'yi origin'e indirger (tam uç yapıştırılmış olsa bile). */
function baseHost(): string {
  const raw = (process.env.WAMESSAGE_API_URL ?? "").trim();
  if (!raw) return DEFAULT_BASE;
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

function regId(): string {
  return (process.env.WAMESSAGE_REG_ID ?? process.env.WAMESSAGE_SENDER ?? "").trim();
}

/** Gerçek gönderim için anahtar + bağlı cihaz (reg_id) şart. */
export function whatsappConfigured(): boolean {
  return (
    (process.env.WHATSAPP_PROVIDER ?? "").toLowerCase() === "wamessage" &&
    !!process.env.WAMESSAGE_API_KEY &&
    !!regId()
  );
}

function authHeaders(token: string, extra: Record<string, string> = {}): Record<string, string> {
  // Kimlik: x-api-key header'ı (panelin "API Key Göster" değeri). Bearer/session DEĞİL —
  // canlı testte doğrulandı: Bearer → "Unauthorized - Session not found".
  return {
    "x-api-key": token,
    Accept: "application/json",
    ...extra,
  };
}

function safeJson(text: string): WaResp {
  try {
    return JSON.parse(text) as WaResp;
  } catch {
    return null;
  }
}

/** İKİ ADIMLI akış: önizleme (id al) → gönderim (report_id). */
async function sendTwoStep(
  base: string,
  token: string,
  reg: string,
  toIntlPlus: string,
  body: string
): Promise<WaResult> {
  // ADIM 1 — önizleme. multipart/form-data: Content-Type'ı fetch/FormData otomatik koyar.
  const fd = new FormData();
  fd.append("numbers", toIntlPlus);
  fd.append("message", body);
  fd.append("campaign_name", "salonor-hatirlatma");
  fd.append("reg_id", reg);
  fd.append("now", "true");
  fd.append("send_speed", "4");
  fd.append("send_date", "");
  fd.append("add_cancel_link", "false");

  let previewSnip = "";
  let previewId = "";
  try {
    const res = await fetch(`${base}/bulk/preview/wp`, {
      method: "POST",
      headers: authHeaders(token), // Content-Type EKLEME (boundary otomatik)
      body: fd,
    });
    const full = await res.text().catch(() => "");
    previewSnip = full.slice(0, SNIP);
    if (res.status === 401 || res.status === 403) {
      return {
        status: "failed",
        detail: `AUTH ${res.status} — x-api-key geçersiz/süresi dolmuş, panelden yeni API Key al: ${previewSnip}`,
      };
    }
    const j = safeJson(full);
    previewId = j?.data?.id ?? "";
    const validCount = Number(j?.data?.count_valid_numbers ?? NaN);
    if (!res.ok || !previewId) {
      return { status: "failed", detail: `preview başarısız (HTTP ${res.status}): ${previewSnip}` };
    }
    if (validCount === 0) {
      return { status: "failed", detail: `geçerli alıcı yok (numara biçimi?): ${previewSnip}` };
    }
  } catch (e) {
    return { status: "failed", detail: `preview ağ hatası: ${e instanceof Error ? e.message : ""}` };
  }

  // ADIM 2 — gönderim.
  try {
    const res = await fetch(`${base}/bulk/wp`, {
      method: "POST",
      headers: authHeaders(token, { "Content-Type": "application/json" }),
      body: JSON.stringify({ id: previewId }),
    });
    const full = await res.text().catch(() => "");
    const sendSnip = full.slice(0, SNIP);
    const combined = `preview=${previewSnip} || send=${sendSnip}`;
    if (res.status === 401 || res.status === 403) {
      return { status: "failed", detail: `AUTH ${res.status} (send): ${combined}` };
    }
    const j = safeJson(full);
    const reportId = j?.data?.report_id ?? j?.data?.reportId ?? "";
    if (!res.ok || !reportId) {
      return { status: "failed", detail: `send başarısız (HTTP ${res.status}): ${combined}` };
    }
    return { status: "sent", detail: combined };
  } catch (e) {
    return { status: "failed", detail: `send ağ hatası: ${e instanceof Error ? e.message : ""}` };
  }
}

/** Tek-adımlı yedek: WAMESSAGE_SINGLE_STEP=true olduğunda dener. */
async function sendSingleStep(
  base: string,
  token: string,
  reg: string,
  toIntlPlus: string,
  body: string
): Promise<WaResult> {
  try {
    const res = await fetch(`${base}/bulk/wp/nton`, {
      method: "POST",
      headers: authHeaders(token, { "Content-Type": "application/json" }),
      body: JSON.stringify({ messages: [{ reg_id: reg, target: toIntlPlus, message: body }] }),
    });
    const full = await res.text().catch(() => "");
    const snip = full.slice(0, SNIP);
    if (res.status === 401 || res.status === 403) {
      return { status: "failed", detail: `AUTH ${res.status} (nton): ${snip}` };
    }
    const j = safeJson(full);
    const ok = res.ok && (!!j?.data?.report_id || !!j?.data?.id || /report_id|success/i.test(full));
    return ok
      ? { status: "sent", detail: snip }
      : { status: "failed", detail: `nton başarısız (HTTP ${res.status}): ${snip}` };
  } catch (e) {
    return { status: "failed", detail: `nton ağ hatası: ${e instanceof Error ? e.message : ""}` };
  }
}

/**
 * Tek bir numaraya WhatsApp mesajı gönderir (sağlayıcı/cihaz yoksa mock).
 * TR cep → +90XXXXXXXXXX; yabancı numaralar olduğu gibi (test alıcısı yurt dışı olabilir).
 */
export async function sendWhatsApp(rawTo: string, body: string): Promise<WaResult> {
  const intl = trPhoneDigits(rawTo);
  if (!intl || intl.length < 10) return { status: "failed", detail: "geçersiz numara" };
  if (!body?.trim()) return { status: "failed", detail: "boş mesaj" };
  if (!whatsappConfigured()) return { status: "mock" };

  const base = baseHost();
  const token = process.env.WAMESSAGE_API_KEY!;
  const reg = regId();
  const toIntlPlus = `+${intl}`; // araştırma+test: numbers alanı '+' önekli, ülke kodlu

  if ((process.env.WAMESSAGE_SINGLE_STEP ?? "").toLowerCase() === "true") {
    return sendSingleStep(base, token, reg, toIntlPlus, body);
  }
  return sendTwoStep(base, token, reg, toIntlPlus, body);
}
