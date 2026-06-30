import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { todayStr, addDaysStr, weekdayOf } from "@/lib/datetime";
import { BookingWizard } from "@/components/booking/wizard";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.booking.metaTitle };
}

export default async function BookingPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ hizmet?: string }>;
}) {
  const [{ slug }, { hizmet }, session] = await Promise.all([
    props.params,
    props.searchParams,
    getSession(),
  ]);

  const business = await db.business.findUnique({
    where: { slug },
    include: {
      serviceCategories: {
        orderBy: { sort: "asc" },
        include: { services: { orderBy: { sort: "asc" } } },
      },
      staff: {
        where: { active: true },
        include: { services: { select: { serviceId: true } } },
      },
      hours: true,
    },
  });

  // Pasif/askıya alınmış işletme her yerde gizliyken (arama/listeler) doğrudan URL
  // ile randevu sihirbazına gelinmesini engelle (createAppointmentAction da ayrıca korur).
  if (!business || !business.active) notFound();

  // Önümüzdeki 14 gün; kapalı günler işaretli
  const today = todayStr();
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDaysStr(today, i);
    const h = business.hours.find((x) => x.weekday === weekdayOf(date));
    return { date, closed: !h || h.closed };
  });

  return (
    <BookingWizard
      business={{
        id: business.id,
        slug: business.slug,
        name: business.name,
        coverImage: business.coverImage,
        district: business.district,
        city: business.city,
        ratingAvg: business.ratingAvg,
        ratingCount: business.ratingCount,
      }}
      categories={business.serviceCategories.map((sc) => ({
        id: sc.id,
        name: sc.name,
        services: sc.services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          durationMin: s.durationMin,
          priceTl: s.priceTl,
        })),
      }))}
      staff={business.staff.map((st) => ({
        id: st.id,
        name: st.name,
        title: st.title,
        image: st.image,
        serviceIds: st.services.map((x) => x.serviceId),
      }))}
      days={days}
      initialServiceId={hizmet ?? null}
      isAuthed={!!session}
      userName={session?.name ?? null}
    />
  );
}
