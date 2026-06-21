import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { todayStr, addDaysStr, formatDateTr, minToHHMM, nowMinutes } from "@/lib/datetime";
import { PanelPageHeader } from "@/components/panel/page-header";
import { waLink, smsLink } from "@/lib/contact";
import { ReminderList, type ReminderItem } from "@/components/panel/reminder-list";
import { NewBookings, type NewBookingItem } from "@/components/panel/new-bookings";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.panelCore.notificationsMetaTitle };
}

// Bugün ve start'ı şu andan itibaren 3 saat içinde (15 dk öncesine kadar) olanlar "acil".
const DUE_AHEAD_MIN = 180;
const DUE_BEHIND_MIN = 15;

export default async function NotificationsPage() {
  const dict = await getDictionary();
  const t = dict.panelCore;
  const business = (await getOwnerBusiness())!;
  const today = todayStr();
  const until = addDaysStr(today, 2);
  const now = nowMinutes();

  const [appts, unseen] = await Promise.all([
    db.appointment.findMany({
      where: { businessId: business.id, date: { gte: today, lte: until }, status: "CONFIRMED" },
      include: {
        customer: { select: { name: true, phone: true } },
        items: { select: { name: true } },
      },
      orderBy: [{ date: "asc" }, { startMin: "asc" }],
    }),
    db.appointment.findMany({
      where: { businessId: business.id, seenAt: null, status: "CONFIRMED", date: { gte: today } },
      include: {
        customer: { select: { name: true } },
        items: { select: { name: true } },
        staff: { select: { name: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    }),
  ]);

  const newBookings: NewBookingItem[] = unseen.map((a) => ({
    id: a.id,
    name: a.customer?.name ?? a.customerName ?? t.fallbackCustomer,
    when: `${a.date === today ? t.today : formatDateTr(a.date, { day: "numeric", month: "short", weekday: "short" })} · ${minToHHMM(a.startMin)}`,
    svc: a.items.map((i) => i.name).join(" + ") || t.fallbackAppt,
    staff: a.staff?.name ?? "—",
  }));

  const items: ReminderItem[] = appts.map((a) => {
    const name = a.customer?.name ?? a.customerName ?? t.fallbackCustomer;
    const phone = a.customerPhone ?? a.customer?.phone ?? null;
    const svc = a.items.map((i) => i.name).join(" + ") || t.fallbackAppt;
    const isToday = a.date === today;
    const delta = a.startMin - now; // dakika
    const due = isToday && delta <= DUE_AHEAD_MIN && delta >= -DUE_BEHIND_MIN;

    const msg = interpolate(t.reminderMessageBody, {
      name,
      business: business.name,
      date: formatDateTr(a.date, { day: "numeric", month: "long" }),
      time: minToHHMM(a.startMin),
    });

    const when = `${isToday ? t.today : formatDateTr(a.date, { day: "numeric", month: "short", weekday: "short" })} · ${minToHHMM(a.startMin)}`;

    return {
      id: a.id,
      name,
      when,
      svc,
      wa: waLink(phone, msg),
      sms: smsLink(phone, msg),
      sent: !!a.reminderSentAt,
      due,
      hasPhone: !!phone,
      startMin: a.startMin,
      isToday,
    };
  });

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={t.notificationsTitle}
        subtitle={t.notificationsSubtitle}
      />

      <NewBookings items={newBookings} />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-accent-faint/60 p-4">
        <Bell className="mt-0.5 size-5 shrink-0 text-accent-deep" />
        <p className="text-sm text-ink-soft">
          {t.reminderInfoBefore}<strong>{t.reminderInfoReady}</strong>{t.reminderInfoMiddle}
          <strong>{t.reminderInfoMarked}</strong>{t.reminderInfoAfter}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream">
            <Bell className="size-7 text-ink-mute" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.noUpcomingTitle}</h2>
          <p className="mt-2 text-ink-soft">{t.noUpcomingDesc}</p>
        </div>
      ) : (
        <ReminderList items={items} dueAheadMin={DUE_AHEAD_MIN} dueBehindMin={DUE_BEHIND_MIN} />
      )}
    </div>
  );
}
