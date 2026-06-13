import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { todayStr, formatDateTr, minToHHMM } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CancelButton,
  ReviewButton,
} from "@/components/account/appointment-actions";

export const metadata: Metadata = { title: "Randevularım" };

const STATUS_BADGE = {
  CONFIRMED: { tone: "mint", label: "Onaylandı" },
  COMPLETED: { tone: "sea", label: "Tamamlandı" },
  CANCELLED: { tone: "rose", label: "İptal edildi" },
  NO_SHOW: { tone: "honey", label: "Gelinmedi" },
} as const;

export default async function AppointmentsPage() {
  const session = (await getSession())!;
  const today = todayStr();

  const appointments = await db.appointment.findMany({
    where: { customerId: session.userId },
    include: {
      business: { select: { name: true, slug: true, coverImage: true, district: true, city: true } },
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
      <div className="flex flex-col items-center rounded-[24px] border border-dashed border-line-strong bg-surface px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-cream">
          <CalendarX2 className="size-8 text-ink-mute" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold text-ink">Henüz randevun yok</h2>
        <p className="mt-2 max-w-sm text-ink-soft">
          Çevrendeki en iyi salonları keşfet ve ilk randevunu saniyeler içinde al.
        </p>
        <Button href="/arama" variant="accent" className="mt-6">
          Salon keşfet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-ink">
          Yaklaşan randevular ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-5 text-ink-soft">
            Yaklaşan randevun yok.{" "}
            <Link href="/arama" className="font-semibold text-accent-deep hover:underline">
              Yeni randevu al →
            </Link>
          </p>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appt={a} upcoming />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-ink">Geçmiş</h2>
          <ul className="space-y-4">
            {past.map((a) => (
              <AppointmentCard key={a.id} appt={a} />
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
      business: { select: { name: true, slug: true, coverImage: true, district: true, city: true } },
      staff: { select: { name: true } },
      items: { select: { name: true } },
      review: { select: { id: true } },
    },
  });
}

function AppointmentCard({
  appt,
  upcoming = false,
}: {
  appt: ApptWithRelations;
  upcoming?: boolean;
}) {
  const badge = STATUS_BADGE[appt.status];
  return (
    <li className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:p-5">
      <Link
        href={`/salon/${appt.business.slug}`}
        className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl sm:size-24"
      >
        <Image
          src={appt.business.coverImage}
          alt={appt.business.name}
          fill
          sizes="(max-width: 640px) 100vw, 96px"
          className="object-cover"
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
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>
        <p className="mt-1 text-sm font-semibold text-ink">
          {formatDateTr(appt.date)} · {minToHHMM(appt.startMin)} – {minToHHMM(appt.endMin)}
        </p>
        <p className="mt-0.5 truncate text-sm text-ink-soft">
          {appt.items.map((i) => i.name).join(" + ")} · {appt.staff.name} ile
        </p>
        <p className="mt-1 text-xs text-ink-mute">
          Kod: {appt.code} · {formatTl(appt.totalTl)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {upcoming && <CancelButton appointmentId={appt.id} />}
        {appt.status === "COMPLETED" && !appt.review && (
          <ReviewButton appointmentId={appt.id} businessName={appt.business.name} />
        )}
        {!upcoming && (
          <Button href={`/randevu/${appt.business.slug}`} variant="outline" size="sm">
            Tekrar al
          </Button>
        )}
      </div>
    </li>
  );
}
