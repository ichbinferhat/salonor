"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, Upload, Wand2, Check, Loader2, RefreshCw } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { suggestStyleAction, type StyleRecommendation } from "@/server/actions/ai";
import { formatTl } from "@/lib/format";
import { useDict } from "@/i18n/provider";

type ServiceLite = { id: string; name: string; priceTl: number };

/** Görseli en fazla 1024px kenara küçültüp JPEG data URL döndürür (token + boyut tasarrufu). */
function fileToScaledDataUrl(file: File, max = 1024, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas yok"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel okunamadı"));
    };
    img.src = url;
  });
}

export function StyleAdvisor({
  businessId,
  services,
  onApply,
}: {
  businessId: string;
  services: ServiceLite[];
  onApply: (serviceIds: string[]) => void;
}) {
  const a = useDict().booking.advisor;
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [prefs, setPrefs] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    { analysis: string; recommendations: StyleRecommendation[] } | null
  >(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    setPrefs("");
    setConsent(false);
    setLoading(false);
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const dataUrl = await fileToScaledDataUrl(file);
      setPreview(dataUrl);
    } catch {
      setError(a.photoLoadError);
    }
  }

  async function analyze() {
    if (!preview) return;
    if (!consent) {
      setError(a.consentRequired);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await suggestStyleAction(businessId, preview, prefs.trim() || undefined, consent);
      if (res.ok) setResult({ analysis: res.analysis, recommendations: res.recommendations });
      else setError(res.error);
    } catch {
      setError(a.genericError);
    } finally {
      setLoading(false);
    }
  }

  function applyRec(ids: string[]) {
    onApply(ids);
    setOpen(false);
    reset();
  }

  const nameOf = (id: string) => services.find((s) => s.id === id)?.name ?? "";
  const priceOf = (ids: string[]) =>
    ids.reduce((sum, id) => sum + (services.find((s) => s.id === id)?.priceTl ?? 0), 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative isolate flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-r from-accent-faint to-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#ff5fa2] text-white shadow-pop">
          <Sparkles className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 font-bold text-ink">
            {a.cardTitle}
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {a.newBadge}
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-ink-soft">
            {a.cardDesc}
          </span>
        </span>
        <Wand2 className="ml-auto size-5 shrink-0 text-accent transition-transform group-hover:rotate-12" />
      </button>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title={a.modalTitle}
        maxW="max-w-xl"
      >
        <p className="-mt-2 mb-4 text-sm text-ink-soft">
          {a.intro}{" "}
          <strong>{a.introStrong}</strong> {a.introEnd}
        </p>

        {/* Görsel seçimi */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />

        {!preview ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong bg-cream/50 px-6 py-12 text-center transition-colors hover:border-accent hover:bg-accent-faint/40"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-accent-faint">
              <Upload className="size-6 text-accent" />
            </span>
            <span className="font-semibold text-ink">{a.uploadCta}</span>
            <span className="text-xs text-ink-mute">{a.uploadHint}</span>
          </button>
        ) : (
          <div className="flex items-start gap-4">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-line">
              <Image src={preview} alt={a.previewAlt} fill className="object-cover" unoptimized />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                <RefreshCw className="size-3.5" /> {a.changePhoto}
              </button>
              <input
                value={prefs}
                onChange={(e) => setPrefs(e.target.value)}
                placeholder={a.prefsPlaceholder}
                maxLength={120}
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-xl bg-rose/10 px-3 py-2 text-sm font-medium text-rose">
            {error}
          </p>
        )}

        {/* Onay kutusu + Analiz butonu */}
        {preview && !result && (
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-accent"
              />
              <span>{a.consent}</span>
            </label>
            <Button
              onClick={analyze}
              variant="accent"
              size="lg"
              className="w-full"
              disabled={loading || !consent}
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> {a.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="size-5" /> {a.suggestCta}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Sonuçlar */}
        {result && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-accent-faint/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                <Sparkles className="size-3.5" /> {a.evaluation}
              </p>
              <p className="mt-1 text-sm text-ink">{result.analysis}</p>
            </div>

            <div className="space-y-3">
              {result.recommendations.map((rec, i) => {
                const hasService = rec.serviceIds.length > 0;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-line bg-surface p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-bold text-ink">{rec.title}</h3>
                      {hasService && (
                        <span className="shrink-0 font-bold text-ink">
                          {formatTl(priceOf(rec.serviceIds))}
                        </span>
                      )}
                    </div>

                    {/* Saçın nasıl yapılacağı — asıl içerik */}
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink">
                      {rec.description}
                    </p>

                    {rec.reason && (
                      <p className="mt-2 rounded-xl bg-accent-faint/50 px-3 py-2 text-xs text-ink-soft">
                        💡 {rec.reason}
                      </p>
                    )}

                    {hasService ? (
                      <>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {rec.serviceIds.map((id) => (
                            <span
                              key={id}
                              className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-ink-soft"
                            >
                              {nameOf(id)}
                            </span>
                          ))}
                        </div>
                        <Button
                          onClick={() => applyRec(rec.serviceIds)}
                          variant="primary"
                          className="mt-3 w-full"
                        >
                          <Check className="size-4" /> {a.selectAndContinue}
                        </Button>
                      </>
                    ) : (
                      <p className="mt-3 text-xs text-ink-mute">
                        {a.noMatchedService}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className="w-full text-center text-sm font-semibold text-ink-soft hover:text-ink"
            >
              {a.reanalyze}
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-ink-mute">
          {a.disclaimer}
        </p>
      </Modal>
    </>
  );
}
