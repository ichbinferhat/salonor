import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import type { Dictionary } from "@/i18n/types";
import { todayStr, formatDateTr, minToHHMM } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CancelButton,
  ReviewButton,
} from "@/components/account/appointment-actions";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.account.meta.appointments };
}

const STATUS_TONE = {
  CONFIRMED: "mint",
  COMPLETED: "sea",
  CANCELLED: "rose",
  NO_SHOW: "honey",
} as const;

function statusLabel(dict: Dictionary, status: keyof typeof STATUS_TONE) {
  const a = dict.account.appointments;
  return {
    CONFIRMED: a.statusConfirmed,
    COMPLETED: a.statusCompleted,
    CANCELLED: a.statusCancelled,
    NO_SHOW: a.statusNoShow,
  }[status];
}

export default async function AppointmentsPage() {
  const session = (await getSession())!;
  const dict = await getDictionary();
  const today = todayStr();

  const appointments = await db.appointment.findMany({
    where: { customerId: session.userId },
    include: {
      business: { select: { name: true, slug: true, coverImage: true, district: true, city: true, googlePlaceId: true } },
      staff: { select: { name: true } },
      items: { select: { name: true } },
      review: { select: { id: true } },
    },
    orderBy: [{ date: "desc" }, { startMin: "desc" }],
  });

  const upcoming = appointments
    .filter((a) => a.status === "CONFIRMED" && a.date >= today)
    .sort((a, b) => (a.date + a.startMin).localeCompare(b.date + b.startMin) || a.startMin - b.startMin);
  const past = appointments.filter((a) => !(a.status === "CONFIRMED" && a.date >= today));

  if (appointments.length === 0) {
    return (
      <div className="relative isolate flex flex-col items-center overflow-hidden rounded-[28px] border border-dashed border-line-strong bg-gradient-to-b from-surface to-cream/40 px-6 py-20 text-center shadow-card">
        <div className="pointer-events-none absolute -top-16 left-1/2 -z-10 size-48 -translate-x-1/2 rounded-full bg-accent-faint blur-3xl" />
        <span className="flex size-16 items-center justify-center rounded-full bg-cream ring-1 ring-line shadow-card">
          <CalendarX2 className="size-8 text-ink-mute" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold text-balance text-ink">{dict.account.appointments.emptyTitle}</h2>
        <p className="mt-2 max-w-sm text-ink-soft">
          {dict.account.appointments.emptyDesc}
        </p>
        <Button href="/arama" variant="accent" className="mt-6">
          {dict.account.appointments.discoverSalons}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 flex items-center gap-2.5 font-display text-xl font-bold text-ink">
          <span className="h-5 w-1 rounded-full bg-gradient-to-b from-accent to-[#ff5fa2]" />
          {interpolate(dict.account.appointments.upcomingTitle, { n: upcoming.length })}
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-ink-soft">
            {dict.account.appointments.noUpcoming}{" "}
            <Link href="/arama" className="font-semibold text-accent-deep hover:underline">
              {dict.account.appointments.newAppointment}
            </Link>
          </p>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appt={a} dict={dict} upcoming />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-ink">{dict.account.appointments.pastTitle}</h2>
          <ul className="space-y-4">
            {past.map((a) => (
              <AppointmentCard key={a.id} appt={a} dict={dict} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

type ApptWithRelations = Awaited<
  ReturnType<typeof getAppointmentsForType>
>[number];

function getAppointmentsForType() {
  return db.appointment.findMany({
    include: {
      business: { select: { name: true, slug: true, coverImage: true, district: true, city: true, googlePlaceId: true } },
      staff: { select: { name: true } },
      items: { select: { name: true } },
      review: { select: { id: true } },
    },
  });
}

function AppointmentCard({
  appt,
  dict,
  upcoming = false,
}: {
  appt: ApptWithRelations;
  dict: Dictionary;
  upcoming?: boolean;
}) {
  const tone = STATUS_TONE[appt.status];
  return (
    <li className="group flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-4 shadow-card ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-pop hover:ring-accent-faint sm:flex-row sm:items-center sm:p-5">
      <Link
        href={`/salon/${appt.business.slug}`}
        className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl sm:size-24"
      >
        <Image
          src={appt.business.coverImage}
          alt={appt.business.name}
          fill
          sizes="(max-width: 640px) 100vw, 96px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/salon/${appt.business.slug}`}
            className="font-display font-bold text-ink hover:text-accent-deep"
          >
            {appt.business.name}
          </Link>
          <Badge tone={tone}>{statusLabel(dict, appt.status)}</Badge>
        </div>
        <p className="mt-1 text-sm font-semibold text-ink">
          {formatDateTr(appt.date)} · {minToHHMM(appt.startMin)} – {minToHHMM(appt.endMin)}
        </p>
        <p className="mt-0.5 truncate text-sm text-ink-soft">
          {appt.items.map((i) => i.name).join(" + ")} · {interpolate(dict.account.appointments.withStaff, { name: appt.staff.name })}
        </p>
        <p className="mt-1 text-xs text-ink-mute">
          {interpolate(dict.account.appointments.codeAndTotal, { code: appt.code, total: formatTl(appt.totalTl) })}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {upcoming && <CancelButton appointmentId={appt.id} />}
        {appt.status === "COMPLETED" && (
          <ReviewButton
            appointmentId={appt.id}
            businessName={appt.business.name}
            googlePlaceId={appt.business.googlePlaceId}
            alreadyReviewed={!!appt.review}
          />
        )}
        {!upcoming && (
          <Button href={`/randevu/${appt.business.slug}`} variant="outline" size="sm">
            {dict.account.appointments.rebook}
          </Button>
        )}
      </div>
    </li>
  );
}
