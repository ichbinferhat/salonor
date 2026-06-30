import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { verifyApptToken } from "@/lib/appt-token";
import { minToHHMM } from "@/lib/datetime";
import { ReminderActions } from "@/components/reminder/reminder-actions";
import { getDictionary, getLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.reminder.metaTitle };
}

/** Tek-tık hatırlatma teyit sayfası (mesajdaki linkten gelir, giriş gerekmez). */
export default async function ReminderConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const aid = await verifyApptToken(token);

  const appt = aid
    ? await db.appointment.findUnique({
        where: { id: aid },
        select: {
          status: true,
          date: true,
          startMin: true,
          business: { select: { name: true } },
        },
      })
    : null;

  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.reminder;
  // Tarihi kullanıcının diline göre biçimlendir (randevu tarihi "YYYY-MM-DD").
  const formattedDate = appt
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      }).format(new Date(appt.date + "T12:00:00Z"))
    : "";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-card">
        <Link href="/" className="block text-center font-display text-2xl font-bold text-ink">
          Salonor
        </Link>

        {!appt ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-ink">{t.invalidTitle}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {t.invalidDesc}
            </p>
            <Link
              href="/hesap"
              className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
            >
              {t.myAccount}
            </Link>
          </div>
        ) : appt.status === "CANCELLED" ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-ink">{t.cancelledTitle}</p>
            <p className="mt-1 text-sm text-ink-soft">{t.cancelledDesc}</p>
          </div>
        ) : appt.status === "COMPLETED" ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-ink">{t.completedTitle}</p>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-2xl bg-cream p-4 text-center">
              <p className="text-sm text-ink-soft">{t.reminderLabel}</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{appt.business.name}</p>
              <p className="mt-1 text-ink">
                {formattedDate} ·{" "}
                <span className="font-semibold">{minToHHMM(appt.startMin)}</span>
              </p>
            </div>
            <p className="mt-4 mb-3 text-center text-sm text-ink-soft">{t.comingQuestion}</p>
            <ReminderActions token={token} />
          </>
        )}
      </div>
    </main>
  );
}
