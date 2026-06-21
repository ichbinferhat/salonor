/**
 * Google Gemini (AI Studio) soyutlaması.
 *
 * Gerçek çağrı için ortam değişkeni gerekir:
 *   GEMINI_API_KEY=...   (https://aistudio.google.com/apikey)
 *
 * Anahtar yoksa `geminiConfigured()` false döner ve çağıran taraf
 * kural-tabanlı / mock davranışına geri düşer.
 *
 * Model seçimi: gemini-2.5-flash — hızlı, ucuz, hem metin hem görsel (multimodal).
 */

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export function geminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

type GeminiOpts = {
  /** JSON modunu zorlar (response_mime_type=application/json). */
  json?: boolean;
  /** 0–1 arası yaratıcılık. Varsayılan 0.7. */
  temperature?: number;
  /** İstemin başına eklenecek sistem yönergesi. */
  system?: string;
  signal?: AbortSignal;
};

async function callGemini(parts: Part[], opts: GeminiOpts = {}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY tanımlı değil");

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (opts.system) {
    body.systemInstruction = { parts: [{ text: opts.system }] };
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify(body),
    signal: opts.signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("");
  if (!text) throw new Error("Gemini boş yanıt döndürdü");
  return text;
}

/** Düz metin üretir. */
export function geminiText(prompt: string, opts: GeminiOpts = {}): Promise<string> {
  return callGemini([{ text: prompt }], opts);
}

/** JSON üretir ve parse eder. Hata olursa exception fırlatır. */
export async function geminiJson<T>(prompt: string, opts: GeminiOpts = {}): Promise<T> {
  const raw = await callGemini([{ text: prompt }], { ...opts, json: true });
  return parseJson<T>(raw);
}

/**
 * Görsel + metin ile JSON üretir (multimodal).
 * @param imageBase64 base64 (data: öneki OLMADAN)
 */
export async function geminiVisionJson<T>(
  prompt: string,
  imageBase64: string,
  mimeType: string,
  opts: GeminiOpts = {}
): Promise<T> {
  const raw = await callGemini(
    [{ inlineData: { mimeType, data: imageBase64 } }, { text: prompt }],
    { ...opts, json: true }
  );
  return parseJson<T>(raw);
}

function parseJson<T>(raw: string): T {
  // JSON modunda genelde temiz gelir; yine de ```json çitlerini ve baş/son
  // metinleri temizleyerek dayanıklı parse yap.
  let s = raw.trim();
  if (s.startsWith("```")) s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = s.indexOf("{");
  const startArr = s.indexOf("[");
  const begin =
    startArr !== -1 && (start === -1 || startArr < start) ? startArr : start;
  if (begin > 0) s = s.slice(begin);
  return JSON.parse(s) as T;
}
