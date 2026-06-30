"use server";

import { db } from "@/lib/db";
import { geminiConfigured, geminiVisionJson, geminiJson } from "@/lib/gemini";
import { requireOwnerBusinessId } from "@/lib/owner";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { getDictionary } from "@/i18n";
import { todayStr, addDaysStr, WEEKDAYS_TR, minToHHMM } from "@/lib/datetime";

export type StyleRecommendation = {
  /** Önerilen stilin kısa başlığı, ör. "Katmanlı Lob Kesim" */
  title: string;
  /** Saçın NASIL yapılacağının somut tarifi: uzunluk, üst, yanlar, ön/kâkül, renk, şekillendirme */
  description: string;
  /** Neden bu kişiye/yüz şekline uygun olduğunun kısa açıklaması */
  reason: string;
  /** Varsa katalogdan eşleşen SAÇ hizmeti id'leri (boş olabilir) */
  serviceIds: string[];
};

export type StyleAdvice =
  | {
      ok: true;
      analysis: string;
      recommendations: StyleRecommendation[];
      configured: boolean;
    }
  | { ok: false; error: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Kullanıcının yüklediği fotoğrafı Gemini ile analiz eder ve işletmenin
 * SUNDUĞU hizmetler içinden uygun stilleri önerir.
 *
 * @param imageDataUrl "data:image/jpeg;base64,...." biçiminde data URL
 */
export async function suggestStyleAction(
  businessId: string,
  imageDataUrl: string,
  prefs?: string,
  consent?: boolean
): Promise<StyleAdvice> {
  if (!businessId || !imageDataUrl) return { ok: false, error: "Eksik bilgi." };

  // KVKK: Yüz fotoğrafı yurt dışındaki Gemini'ye (Google) aktarıldığından açık rıza
  // ZORUNLUDUR. İstemci onay kutusu atlanabileceği için (doğrudan action çağrısı)
  // rızayı SUNUCUDA da doğrula.
  if (!consent)
    return { ok: false, error: "Devam etmek için veri işleme ve yurt dışı aktarım onayı gerekli." };

  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(imageDataUrl);
  if (!match) return { ok: false, error: "Geçersiz görsel biçimi." };
  const mimeType = match[1];
  const base64 = match[2];
  if (base64.length * 0.75 > MAX_IMAGE_BYTES)
    return { ok: false, error: "Fotoğraf çok büyük (en fazla 5MB)." };

  if (!geminiConfigured())
    return { ok: false, error: "AI stil danışmanı şu an kullanılamıyor." };

  // Kötüye kullanım / maliyet koruması: IP başına saatte 8 analiz.
  const ip = await getClientIp();
  const rl = rateLimit(`style:${ip}`, 8, 60 * 60 * 1000);
  if (!rl.ok)
    return {
      ok: false,
      error: `Çok fazla deneme yaptın. Lütfen ${Math.ceil(rl.retryAfterSec / 60)} dakika sonra tekrar dene.`,
    };

  const business = await db.business.findUnique({
    where: { id: businessId },
    select: {
      name: true,
      serviceCategories: {
        orderBy: { sort: "asc" },
        select: {
          name: true,
          services: {
            orderBy: { sort: "asc" },
            select: { id: true, name: true, description: true, priceTl: true, durationMin: true },
          },
        },
      },
    },
  });
  if (!business) return { ok: false, error: "İşletme bulunamadı." };

  const catalog = business.serviceCategories.flatMap((c) =>
    c.services.map((s) => ({
      id: s.id,
      kategori: c.name,
      hizmet: s.name,
      aciklama: s.description ?? undefined,
      fiyatTl: s.priceTl,
      dakika: s.durationMin,
    }))
  );

  if (catalog.length === 0)
    return { ok: false, error: "Bu işletmenin tanımlı hizmeti yok." };

  const prompt = `Sen "${business.name}" salonunda deneyimli bir kuaför/saç tasarımcısısın.
Fotoğraftaki kişinin GERÇEKTEN görünen özelliklerine bak: yüz şekli, mevcut saç uzunluğu, rengi, dokusu, varsa sakal. Değerlendirmeni bu kişiye ÖZEL yap — klişe/herkese uyan laflar etme.

${prefs ? `Müşterinin notu: "${prefs}" (buna mutlaka uy)\n` : ""}
Kişiye 2 (en fazla 3) SAÇ stili öner. Her öneri KISA ve DENGELİ olsun:
- "description": en fazla 2-3 cümle. Net ve somut anlat — uzunluk, yanlar, üst/hacim, ön/kâkül ve gerekiyorsa renk. Kişiye doğrudan hitap et ("yanlarını kademeli kısaltıp..."). Uzun paragraf YAZMA, gevezelik YOK.
- "reason": tek cümle, neden bu YÜZ ŞEKLİNE/saça uygun olduğu.

Kurallar:
- Türkçe, samimi ama uzman. Önerileri bu kişinin fotoğrafına göre farklılaştır; her seferinde aynı şeyleri söyleme.
- SADECE saç (kesim, boya, fön, bakım, şekillendirme). Spa, masaj, cilt/vücut bakımı, tırnak gibi ALAKASIZ hizmetleri ASLA önerme/eşleme.
- "serviceIds": aşağıdaki katalogda bu öneriyle örtüşen SAÇLA İLGİLİ hizmet(ler) varsa onların "id"lerini MUTLAKA ekle (müşteriyi gerçek hizmete/pakete yönlendir). Saçla ilgili hizmet yoksa boş bırak ([]). Saç dışı id KOYMA, uydurma id YOK.

Salonun hizmet kataloğu (JSON):
${JSON.stringify(catalog)}

Sadece şu JSON şemasında yanıt ver:
{"analysis":"...","recommendations":[{"title":"...","description":"...","reason":"...","serviceIds":["..."]}]}`;

  try {
    const out = await geminiVisionJson<{
      analysis: string;
      recommendations: { title: string; description: string; reason: string; serviceIds: string[] }[];
    }>(prompt, base64, mimeType, { temperature: 0.9 });

    const validIds = new Set(catalog.map((c) => c.id));
    const recommendations = (out.recommendations ?? [])
      .map((r) => ({
        title: String(r.title ?? "").slice(0, 80),
        description: String(r.description ?? "").slice(0, 340),
        reason: String(r.reason ?? "").slice(0, 300),
        serviceIds: (r.serviceIds ?? []).filter((id) => validIds.has(id)),
      }))
      .filter((r) => r.title && r.description);

    if (recommendations.length === 0)
      return { ok: false, error: "Uygun bir öneri oluşturulamadı, lütfen tekrar dene." };

    return {
      ok: true,
      analysis: String(out.analysis ?? "").slice(0, 400),
      recommendations,
      configured: true,
    };
  } catch (e) {
    console.error("suggestStyleAction:", e);
    return { ok: false, error: "AI analizi başarısız oldu, lütfen tekrar dene." };
  }
}

/* ------------------------------------------------------------------ */
/*  AI Analiz — gerçek Gemini içgörüleri                               */
/* ------------------------------------------------------------------ */

export type Insight = {
  /** Kısa başlık */
  title: string;
  /** 1-2 cümlelik somut, eyleme dönük öneri */
  detail: string;
  /** Önceliklendirme için renk tonu */
  tone: "good" | "warn" | "info";
};

export type InsightResult =
  | { ok: true; insights: Insight[]; ai: boolean }
  | { ok: false; error: string; notConfigured?: boolean };

/**
 * İşletme verisinden hesaplanan özeti Gemini'ye gönderip işletmeye özel,
 * gerçek (kural-tabanlı olmayan) öneriler üretir. Sadece işletme sahibi çağırabilir.
 */
export async function businessInsightsAction(): Promise<InsightResult> {
  const dict = await getDictionary();
  const a = dict.panelOther.ai;
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { ok: false, error: a.errorUnauthorized };

  // Maliyet koruması: aynı işletme sayfayı sık yenilese bile saatte en fazla
  // 6 kez Gemini çağrılır; aşılırsa kural-tabanlı fallback gösterilir.
  if (!rateLimit(`insights:${businessId}`, 6, 60 * 60 * 1000).ok)
    return { ok: false, error: a.errorTooFrequent };

  const today = todayStr();
  const d30 = addDaysStr(today, -30);
  const d60 = addDaysStr(today, -60);

  const [appts, sales, products, business] = await Promise.all([
    db.appointment.findMany({
      where: { businessId, date: { gte: d60 } },
      include: { items: true, staff: { select: { name: true } } },
    }),
    db.sale.findMany({ where: { businessId, date: { gte: d60 } } }),
    db.product.findMany({ where: { businessId } }),
    db.business.findUnique({ where: { id: businessId }, select: { name: true, city: true, district: true } }),
  ]);

  // --- Aynı sayfadaki metrik hesapları (özet için) ---
  const revInRange = (from: string, to: string) => {
    const a = appts
      .filter((x) => x.status === "COMPLETED" && x.date >= from && x.date < to)
      .reduce((s, x) => s + x.totalTl, 0);
    const s = sales.filter((x) => x.date >= from && x.date < to).reduce((sum, x) => sum + x.totalTl, 0);
    return a + s;
  };
  const last30 = revInRange(d30, addDaysStr(today, 1));
  const prev30 = revInRange(d60, d30);
  const trendPct = prev30 > 0 ? Math.round(((last30 - prev30) / prev30) * 100) : last30 > 0 ? 100 : 0;

  const activeAppts = appts.filter((a) => a.status !== "CANCELLED");
  const byWeekday = new Array(7).fill(0);
  const byHour = new Map<number, number>();
  for (const a of activeAppts) {
    byWeekday[new Date(a.date + "T00:00:00").getDay()] += 1;
    const hour = Math.floor(a.startMin / 60);
    byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
  }
  const busiestWeekday = byWeekday.indexOf(Math.max(...byWeekday));
  const busiestHour = [...byHour.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const quietWeekday = byWeekday.indexOf(Math.min(...byWeekday));

  const serviceRev = new Map<string, { name: string; count: number; rev: number }>();
  for (const a of activeAppts)
    for (const it of a.items) {
      const cur = serviceRev.get(it.name) ?? { name: it.name, count: 0, rev: 0 };
      cur.count += 1;
      cur.rev += it.priceTl;
      serviceRev.set(it.name, cur);
    }
  const topServices = [...serviceRev.values()].sort((a, b) => b.rev - a.rev).slice(0, 5);

  const lastVisit = new Map<string, string>();
  for (const a of activeAppts) {
    const key = a.customerId ?? a.customerPhone ?? a.customerName ?? "?";
    if (!lastVisit.has(key) || a.date > lastVisit.get(key)!) lastVisit.set(key, a.date);
  }
  const atRisk = [...lastVisit.values()].filter((d) => d < d30).length;
  const lowStock = products.filter((p) => p.stock <= p.lowStockAt);

  const totalForShow = appts.filter((a) => ["COMPLETED", "NO_SHOW"].includes(a.status)).length;
  const noShows = appts.filter((a) => a.status === "NO_SHOW").length;
  const noShowPct = totalForShow > 0 ? Math.round((noShows / totalForShow) * 100) : 0;

  const summary = {
    isletme: business?.name,
    sehir: [business?.district, business?.city].filter(Boolean).join(", "),
    gelir_son30gun_TL: last30,
    gelir_onceki30gun_TL: prev30,
    gelir_trend_yuzde: trendPct,
    aktif_randevu_60gun: activeAppts.length,
    en_yogun_gun: busiestWeekday >= 0 ? WEEKDAYS_TR[busiestWeekday] : null,
    en_yogun_saat: busiestHour !== undefined ? minToHHMM(busiestHour * 60) : null,
    en_sakin_gun: quietWeekday >= 0 ? WEEKDAYS_TR[quietWeekday] : null,
    en_cok_kazandiran_hizmetler: topServices.map((s) => ({ ad: s.name, islem: s.count, gelirTL: s.rev })),
    riskli_musteri_sayisi: atRisk,
    no_show_yuzde: noShowPct,
    dusuk_stok_urunler: lowStock.slice(0, 5).map((p) => p.name),
  };

  // Veri yoksa veya Gemini yoksa: çağıran taraf kural-tabanlıya düşsün
  if (activeAppts.length === 0 && sales.length === 0)
    return { ok: false, error: a.errorNoData };
  // GEMINI_API_KEY kalıcı olarak yoksa: bu geçici bir hata değil, yapılandırma
  // eksikliği. Çağıran tarafın doğru mesajı göstermesi için ayrı işaretle.
  if (!geminiConfigured())
    return { ok: false, error: a.aiNotConfigured, notConfigured: true };

  const prompt = `Sen bir kuaför/güzellik salonu için deneyimli bir işletme danışmanısın.
Aşağıda bir salonun son 30-60 günlük gerçek performans özeti var (JSON).
Bu verilere dayanarak işletmeye özel, SOMUT ve UYGULANABİLİR 4-6 öneri üret.

Veri özeti:
${JSON.stringify(summary)}

Kurallar:
- Türkçe yaz. Genel-geçer laf etme; verideki gerçek sayılara ve adlara atıf yap.
- Her öneri kısa olsun: net bir başlık + 1-2 cümle eylem.
- "tone": olumlu/güçlü yön için "good", risk/uyarı için "warn", nötr bilgi için "info".
- Salonun elindeki araçlara (SMS kampanyası, Para Puan sadakat, paket/upsell, personel planlama) atıf yapabilirsin.
- Sadece şu JSON şemasında yanıt ver:
{"insights":[{"title":"...","detail":"...","tone":"good|warn|info"}]}`;

  try {
    const out = await geminiJson<{ insights: Insight[] }>(prompt, { temperature: 0.65 });
    const insights = (out.insights ?? [])
      .map((i) => ({
        title: String(i.title ?? "").slice(0, 100),
        detail: String(i.detail ?? "").slice(0, 320),
        tone: (["good", "warn", "info"].includes(i.tone) ? i.tone : "info") as Insight["tone"],
      }))
      .filter((i) => i.title && i.detail)
      .slice(0, 6);
    if (insights.length === 0) return { ok: false, error: a.errorNoSuggestion };
    return { ok: true, insights, ai: true };
  } catch (e) {
    console.error("businessInsightsAction:", e);
    return { ok: false, error: a.errorInsightsFailed };
  }
}
