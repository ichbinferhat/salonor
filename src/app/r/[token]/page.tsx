import Link from "next/link";
import { db } from "@/lib/db";
import { verifyApptToken } from "@/lib/appt-token";
import { formatDateTr, minToHHMM } from "@/lib/datetime";
import { ReminderActions } from "@/components/reminder/reminder-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Randevu Teyidi" };

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

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-card">
        <Link href="/" className="block text-center font-display text-2xl font-bold text-ink">
          Salonor
        </Link>

        {!appt ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-ink">Bağlantı geçersiz veya süresi dolmuş.</p>
            <p className="mt-1 text-sm text-ink-soft">
              Randevunla ilgili işlem için lütfen salonu ara veya hesabına giriş yap.
            </p>
            <Link
              href="/hesap"
              className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
            >
              Hesabım
            </Link>
          </div>
        ) : appt.status === "CANCELLED" ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-ink">Bu randevu iptal edilmiş.</p>
            <p className="mt-1 text-sm text-ink-soft">Dilediğinde yeni bir randevu alabilirsin.</p>
          </div>
        ) : appt.status === "COMPLETED" ? (
          <div className="mt-6 text-center">
            <p className="font-semibold text-ink">Bu randevu tamamlanmış. Teşekkürler!</p>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-2xl bg-cream p-4 text-center">
              <p className="text-sm text-ink-soft">Randevu hatırlatması</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{appt.business.name}</p>
              <p className="mt-1 text-ink">
                {formatDateTr(appt.date, { weekday: "long", day: "numeric", month: "long" })} ·{" "}
                <span className="font-semibold">{minToHHMM(appt.startMin)}</span>
              </p>
            </div>
            <p className="mt-4 mb-3 text-center text-sm text-ink-soft">Geliyor musun?</p>
            <ReminderActions token={token} />
          </>
        )}
      </div>
    </main>
  );
}
