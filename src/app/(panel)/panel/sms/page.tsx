import { MessageSquare, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { smsConfigured } from "@/lib/sms";
import { normalizePhone, formatPhoneTr } from "@/lib/phone";
import { PanelPageHeader } from "@/components/panel/page-header";
import { SmsSender } from "@/components/panel/sms-sender";

export const metadata = { title: "SMS — Salonor" };

export default async function SmsPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const t = dict.panelOther.sms;

  const [appointments, loyalty, logs] = await Promise.all([
    db.appointment.findMany({
      where: { businessId: business.id, customerPhone: { not: null } },
      select: { customerName: true, customerPhone: true, customer: { select: { name: true } } },
      orderBy: { date: "desc" },
      take: 500,
    }),
    db.loyaltyAccount.findMany({
      where: { businessId: business.id },
      select: { customerName: true, phone: true },
    }),
    db.smsLog.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  // Benzersiz müşteri rehberi (telefon anahtarlı)
  const book = new Map<string, { name: string; phone: string }>();
  for (const a of appointments) {
    const phone = normalizePhone(a.customerPhone ?? "");
    if (phone.length !== 10) continue;
    if (!book.has(phone)) book.set(phone, { name: a.customer?.name ?? a.customerName ?? t.fallbackCustomer, phone });
  }
  for (const l of loyalty) {
    const phone = normalizePhone(l.phone);
    if (phone.length !== 10) continue;
    if (!book.has(phone)) book.set(phone, { name: l.customerName, phone });
  }
  const contacts = [...book.values()].sort((a, b) => a.name.localeCompare(b.name, "tr"));

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.title}
        subtitle={t.subtitle}
        action={
          <div className="rounded-2xl border border-line bg-surface px-4 py-2 text-right shadow-card">
            <p className="text-xs text-ink-soft">{t.creditBalance}</p>
            <p className="font-display text-xl font-extrabold text-accent-deep">
              {business.smsCredits.toLocaleString("tr-TR")}
            </p>
          </div>
        }
      />

      {!smsConfigured() && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-bold text-ink">{t.mockTitle}</p>
            <p className="mt-0.5 text-ink-soft">
              {t.mockDesc}
              <code>SMS_PROVIDER</code>, <code>NETGSM_USER</code>,{" "}
              <code>NETGSM_PASS</code>, <code>NETGSM_HEADER</code>{t.mockDescEnd}
            </p>
          </div>
        </div>
      )}

      <SmsSender
        credits={business.smsCredits}
        contacts={contacts}
        businessName={business.name}
      />

      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <MessageSquare className="size-5 text-accent" /> {t.historyTitle}
        </h2>
        {logs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-ink-soft">
            {t.historyEmpty}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-cream/50 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-bold">{t.colNumber}</th>
                  <th className="px-4 py-3 font-bold">{t.colMessage}</th>
                  <th className="px-4 py-3 font-bold">{t.colKind}</th>
                  <th className="px-4 py-3 text-center font-bold">{t.colStatus}</th>
                  <th className="px-4 py-3 text-right font-bold">{t.colDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-cream/40">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{formatPhoneTr(l.toPhone)}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-ink-soft" title={l.body}>{l.body}</td>
                    <td className="px-4 py-3 text-ink-soft">{kindLabel(t, l.kind)}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={l.status} t={t} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-ink-soft">
                      {l.createdAt.toLocaleString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

type SmsDict = Awaited<ReturnType<typeof getDictionary>>["panelOther"]["sms"];

function kindLabel(t: SmsDict, kind: string): string {
  const map: Record<string, string> = {
    manual: t.kindManual,
    confirm: t.kindConfirm,
    reminder: t.kindReminder,
    bulk: t.kindBulk,
  };
  return map[kind] ?? kind;
}

function StatusBadge({ status, t }: { status: string; t: SmsDict }) {
  const map: Record<string, { label: string; cls: string }> = {
    sent: { label: t.statusSent, cls: "bg-mint-soft text-mint" },
    mock: { label: t.statusMock, cls: "bg-accent-soft text-accent-deep" },
    failed: { label: t.statusFailed, cls: "bg-rose-soft text-rose" },
    queued: { label: t.statusQueued, cls: "bg-cream text-ink-mute" },
  };
  const s = map[status] ?? map.queued;
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.cls}`}>{s.label}</span>;
}
