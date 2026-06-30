"use client";

import { useCallback, useEffect, useState } from "react";
import { Lightbulb, Sparkles, TrendingUp, AlertTriangle, Info, Loader2, RefreshCw } from "lucide-react";
import { businessInsightsAction, type Insight } from "@/server/actions/ai";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

/**
 * AI Analiz öneri bölümü. Mount olunca Gemini'den gerçek içgörü çeker;
 * AI yoksa/başarısızsa sunucudan gelen kural-tabanlı `fallback` önerilerini gösterir.
 * "Yenile" ile kullanıcı yeniden gerçek AI analizi tetikleyebilir.
 */
export function AiInsights({ fallback }: { fallback: string[] }) {
  const t = useDict().panelOther.ai;
  const [state, setState] = useState<"loading" | "ai" | "fallback">("loading");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  // GEMINI_API_KEY kalıcı yoksa: geçici hata değil, yapılandırma eksikliği —
  // ayrı, "geçici" demeyen bir mesaj göster.
  const [notConfigured, setNotConfigured] = useState(false);

  const load = useCallback(() => {
    let alive = true;
    setState("loading");
    setFallbackReason(null);
    setNotConfigured(false);
    businessInsightsAction()
      .then((res) => {
        if (!alive) return;
        if (res.ok && res.insights.length > 0) {
          setInsights(res.insights);
          setState("ai");
        } else {
          // AI başarısızsa (ör. saatlik limit aşıldı) nedeni sakla ki kullanıcı
          // neden kural-tabanlı listeye düşüldüğünü anlasın.
          if (!res.ok) {
            setNotConfigured(Boolean(res.notConfigured));
            setFallbackReason(res.notConfigured ? null : res.error);
          }
          setState("fallback");
        }
      })
      .catch(() => alive && setState("fallback"));
    return () => {
      alive = false;
    };
  }, []);

  // Mount'ta gerçek AI verisini çek (dış sistemle senkronizasyon). load() içindeki
  // setState("loading") başlangıç değeriyle aynı olduğundan cascade yoktur; bu kural
  // mount-veri-çekme için yanlış-pozitiftir.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => load(), [load]);

  return (
    <section className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent-faint to-surface p-5 shadow-card sm:p-6">
      <h2 className="mb-4 flex items-center justify-between gap-2 font-display text-lg font-bold text-ink">
        <span className="flex items-center gap-2">
          <Lightbulb className="size-5 text-accent" /> {t.insightsTitle}
        </span>
        <span className="flex items-center gap-2">
          {state === "ai" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
              <Sparkles className="size-3" /> {t.geminiBadge}
            </span>
          )}
          {state !== "loading" && (
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface px-2.5 py-1 text-[11px] font-bold text-ink-soft transition-colors hover:border-accent/40 hover:text-accent-deep"
            >
              <RefreshCw className="size-3" /> {t.refresh}
            </button>
          )}
        </span>
      </h2>

      {state === "loading" && (
        <div className="flex items-center gap-3 rounded-xl bg-surface/70 p-4 text-sm text-ink-soft">
          <Loader2 className="size-5 animate-spin text-accent" />
          {t.analyzing}
        </div>
      )}

      {state === "ai" && (
        <ul className="space-y-3">
          {insights.map((ins, i) => {
            const Icon = ins.tone === "good" ? TrendingUp : ins.tone === "warn" ? AlertTriangle : Info;
            const color =
              ins.tone === "good" ? "text-mint" : ins.tone === "warn" ? "text-rose" : "text-accent";
            return (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-surface/70 p-3.5">
                <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} />
                <div>
                  <p className="text-sm font-bold text-ink">{ins.title}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{ins.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {state === "fallback" && (
        <>
          {notConfigured ? (
            <p className="mb-3 flex items-start gap-2 rounded-xl bg-honey-soft/60 p-3 text-xs font-medium text-ink-soft">
              <Info className="mt-0.5 size-4 shrink-0 text-honey" />
              {t.aiNotConfigured}
            </p>
          ) : (
            fallbackReason && (
              <p className="mb-3 flex items-start gap-2 rounded-xl bg-honey-soft/60 p-3 text-xs font-medium text-ink-soft">
                <Info className="mt-0.5 size-4 shrink-0 text-honey" />
                {interpolate(t.aiUnavailable, { reason: fallbackReason })}
              </p>
            )
          )}
          <ul className="space-y-3">
            {fallback.map((t, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-surface/70 p-3.5 text-sm text-ink">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
