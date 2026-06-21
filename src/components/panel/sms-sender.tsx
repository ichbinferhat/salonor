"use client";

import { useMemo, useState, useTransition } from "react";
import { Send, Users, Check } from "lucide-react";
import { sendBulkSmsAction } from "@/server/actions/sms";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";
import { Button } from "@/components/ui/button";
import { formatPhoneTr, normalizePhone, isValidTrMobile } from "@/lib/phone";

type Contact = { name: string; phone: string };

export function SmsSender({
  credits,
  contacts,
  businessName,
}: {
  credits: number;
  contacts: Contact[];
  businessName: string;
}) {
  const t = useDict().panelOther.sms;
  const TEMPLATES = [t.templateText1, t.templateText2, t.templateText3];
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [manual, setManual] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const filtered = useMemo(
    () =>
      contacts.filter(
        (c) =>
          c.name.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")) ||
          c.phone.includes(query.replace(/\D/g, ""))
      ),
    [contacts, query]
  );

  // Ham manuel parçalar (geçerlilik kontrolünden önce)
  const manualParts = useMemo(
    () =>
      manual
        .split(/[\s,;]+/)
        .map((p) => p.trim())
        .filter(Boolean),
    [manual]
  );
  // Geçersiz (TR cep olmayan) manuel parçaları kullanıcıya bildirmek için ayır
  const invalidManual = useMemo(
    () => manualParts.filter((p) => !isValidTrMobile(p)),
    [manualParts]
  );

  // Alıcı sayısını SUNUCUYLA AYNI mantıkla hesapla: seçili + manuel numaraları
  // normalize et, geçerli cepleri al, Set ile tekilleştir. Böylece panelde gösterilen
  // alıcı/kontör tahmini gerçekten gönderilecek SMS sayısıyla birebir tutar.
  const uniqueRecipients = useMemo(() => {
    const set = new Set<string>();
    for (const p of [...selected, ...manualParts]) {
      if (isValidTrMobile(p)) set.add(normalizePhone(p));
    }
    return set;
  }, [selected, manualParts]);

  const recipientCount = uniqueRecipients.size;
  // Türkçe karakter varsa 70, yoksa 160 karakter = 1 kontör
  const unicode = /[ğüşıöçĞÜŞİÖÇ]/.test(body);
  const perMsg = unicode ? 70 : 160;
  const creditsPerSms = Math.max(1, Math.ceil((body.length || 1) / perMsg));
  const totalCredits = recipientCount * creditsPerSms;

  function toggle(phone: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(phone)) next.delete(phone);
      else next.add(phone);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.phone)));
  }

  function send() {
    setError(null);
    setResult(null);
    if (body.trim().length < 2) return setError(t.errorEmptyBody);
    const phones = [...uniqueRecipients];
    if (phones.length === 0) return setError(t.errorNoRecipient);
    if (totalCredits > credits)
      return setError(interpolate(t.errorInsufficient, { needed: totalCredits, have: credits }));

    start(async () => {
      const res = await sendBulkSmsAction({ phones, body: body.trim() });
      if (res.ok) {
        setResult(
          `${interpolate(t.resultSent, { sent: res.sent })}${
            res.failed ? interpolate(t.resultFailed, { failed: res.failed }) : ""
          }.`
        );
        setBody("");
        setSelected(new Set());
        setManual("");
      } else setError(res.error);
    });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      {/* Mesaj */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <h3 className="mb-3 font-display text-lg font-bold text-ink">{t.messageTitle}</h3>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          maxLength={500}
          placeholder={interpolate(t.messagePlaceholder, { business: businessName })}
          className="w-full resize-none rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-ink-mute">
          <span>
            {interpolate(t.charsCredits, { chars: body.length, credits: creditsPerSms })}
          </span>
          <span>{interpolate(t.charsLeft, { n: 500 - body.length })}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setBody(tpl)}
              className="rounded-lg border border-line-strong bg-cream/50 px-2.5 py-1.5 text-left text-xs text-ink-soft hover:border-accent hover:text-ink"
            >
              {interpolate(t.template, { n: i + 1 })}
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <label className="mb-1 block text-xs font-semibold text-ink-soft">
            {t.extraNumbersLabel}
          </label>
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder={t.extraNumbersPlaceholder}
            className="h-11 w-full rounded-xl border border-line-strong bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none"
          />
          {invalidManual.length > 0 && (
            <p className="mt-1.5 text-xs font-medium text-rose">
              {interpolate(t.invalidNumbers, { n: invalidManual.length })}
              {invalidManual.slice(0, 3).join(", ")}
              {invalidManual.length > 3 ? "…" : ""}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
          <div className="text-sm">
            <p className="font-bold text-ink">{interpolate(t.recipientCount, { n: recipientCount })}</p>
            <p className="text-xs text-ink-soft">{interpolate(t.totalCredits, { n: totalCredits })}</p>
          </div>
          <Button variant="accent" size="lg" onClick={send} disabled={pending || recipientCount === 0}>
            <Send className="size-4" /> {pending ? t.sending : t.send}
          </Button>
        </div>
        {result && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-mint">
            <Check className="size-4" /> {result}
          </p>
        )}
        {error && <p className="mt-2 text-sm font-medium text-rose">{error}</p>}
      </section>

      {/* Rehber */}
      <section className="rounded-2xl border border-line bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-line p-4">
          <span className="flex items-center gap-2 text-sm font-bold text-ink">
            <Users className="size-4 text-accent" /> {interpolate(t.contactsTitle, { n: contacts.length })}
          </span>
          {filtered.length > 0 && (
            <button onClick={selectAll} className="text-xs font-semibold text-accent-deep hover:underline">
              {selected.size === filtered.length ? t.deselect : t.selectAll}
            </button>
          )}
        </div>
        <div className="border-b border-line p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-9 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </div>
        {contacts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">
            {t.contactsEmpty}
          </p>
        ) : (
          <ul className="max-h-80 divide-y divide-line overflow-y-auto">
            {filtered.map((c) => {
              const on = selected.has(c.phone);
              return (
                <li key={c.phone}>
                  <button
                    onClick={() => toggle(c.phone)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-cream/50 ${
                      on ? "bg-accent-faint" : ""
                    }`}
                  >
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                        on ? "border-accent bg-accent text-white" : "border-line-strong"
                      }`}
                    >
                      {on && <Check className="size-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{c.name}</span>
                      <span className="block text-xs text-ink-mute">{formatPhoneTr(c.phone)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
