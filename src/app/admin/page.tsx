import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Users, CalendarDays, Wallet, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { formatDateTr } from "@/lib/datetime";
import { formatTl } from "@/lib/format";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FeaturedToggle } from "@/components/admin/featured-toggle";
import { ActiveToggle } from "@/components/admin/active-toggle";
import { DeleteBusiness } from "@/components/admin/delete-business";
import { CreateBusiness } from "@/components/admin/create-business";
import { PlanControl } from "@/components/admin/plan-control";
import { ContactRequests } from "@/components/admin/contact-requests";
import { ReviewModeration } from "@/components/admin/review-moderation";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.admin.metaTitle };
}

/** Tek istekte çekilen azami işletme sayısı (sayfa şişmesini engeller). */
const BIZ_LIMIT = 200;

export default async function AdminPage() {
  const dict = await getDictionary();
  const ROLE_LABEL: Record<string, string> = {
    CUSTOMER: dict.admin.roleCustomer,
    OWNER: dict.admin.roleOwner,
    ADMIN: dict.admin.roleAdmin,
  };

  const [bizCount, activeCount, userCount, apptCount, revenueRows, businesses, recentUsers, contactRequests, modReviews] =
    await Promise.all([
      db.business.count(),
      db.business.count({ where: { active: true } }),
      db.user.count(),
      db.appointment.count(),
      db.appointment.groupBy({
        by: ["businessId"],
        _sum: { totalTl: true },
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      }),
      db.business.findMany({
        take: BIZ_LIMIT,
        include: {
          category: { select: { name: true } },
          owner: { select: { name: true, email: true } },
          _count: { select: { appointments: true, reviews: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
      }),
      db.contactRequest.findMany({
        orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
        take: 50,
      }),
      db.review.findMany({
        orderBy: [{ reported: "desc" }, { createdAt: "desc" }],
        take: 50,
        include: {
          customer: { select: { name: true } },
          business: { select: { name: true, slug: true } },
        },
      }),
    ]);

  const suspended = bizCount - activeCount;
  const revMap = new Map(revenueRows.map((r) => [r.businessId, r._sum.totalTl ?? 0]));
  const totalRevenue = revenueRows.reduce((s, r) => s + (r._sum.totalTl ?? 0), 0);

  const stats = [
    {
      label: dict.admin.statBusiness,
      value: String(bizCount),
      sub: interpolate(dict.admin.statBusinessSub, { active: activeCount, suspended }),
      icon: Building2,
      tone: "bg-accent-soft text-accent-deep",
    },
    { label: dict.admin.statUser, value: String(userCount), icon: Users, tone: "bg-mint-soft text-mint" },
    { label: dict.admin.statAppointment, value: String(apptCount), icon: CalendarDays, tone: "bg-sea-soft text-sea" },
    { label: dict.admin.statRevenue, value: formatTl(totalRevenue), icon: Wallet, tone: "bg-honey-soft text-honey" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {dict.admin.overviewTitle}
          </h1>
          <p className="mt-1 text-ink-soft">{dict.admin.overviewSubtitle}</p>
        </div>
        <CreateBusiness />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className={`inline-flex size-10 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-ink-soft">{s.label}</p>
            {s.sub && <p className="mt-0.5 text-xs text-ink-mute">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* İşletme talepleri (/iletisim formundan) */}
      <ContactRequests
        items={contactRequests.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          message: c.message,
          handled: c.handled,
          createdLabel: formatDateTr(c.createdAt.toISOString().slice(0, 10), {
            day: "numeric",
            month: "short",
          }),
        }))}
      />

      {/* Yorum moderasyonu */}
      <ReviewModeration
        items={modReviews.map((r) => ({
          id: r.id,
          businessName: r.business.name,
          businessSlug: r.business.slug,
          author: r.customer?.name ?? r.authorName ?? dict.salon.guest,
          rating: r.rating,
          comment: r.comment,
          hidden: r.hidden,
          reported: r.reported,
          createdLabel: formatDateTr(r.createdAt.toISOString().slice(0, 10), {
            day: "numeric",
            month: "short",
          }),
        }))}
      />

      {/* İşletmeler */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <h2 className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
          {dict.admin.businessesTitle} ({businesses.length})
          {bizCount > businesses.length && (
            <span className="text-xs font-semibold text-ink-mute">
              {interpolate(dict.admin.businessesShowing, { shown: businesses.length, total: bizCount })}
            </span>
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-mute">
                <th className="px-5 py-3 font-bold">{dict.admin.colBusiness}</th>
                <th className="px-3 py-3 font-bold">{dict.admin.colOwner}</th>
                <th className="px-3 py-3 font-bold">{dict.admin.colPlanCredits}</th>
                <th className="px-3 py-3 font-bold">{dict.admin.colAppointment}</th>
                <th className="px-3 py-3 font-bold">{dict.admin.colRevenue}</th>
                <th className="px-3 py-3 font-bold">{dict.admin.colFeatured}</th>
                <th className="px-3 py-3 font-bold">{dict.admin.colStatus}</th>
                <th className="px-5 py-3 text-right font-bold">{dict.admin.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-ink-soft">
                    {dict.admin.emptyBusinesses}{" "}
                    <span className="font-semibold text-ink">{dict.admin.emptyBusinessesCta}</span>{" "}
                    {dict.admin.emptyBusinessesEnd}
                  </td>
                </tr>
              )}
              {businesses.map((b) => {
                const incomplete =
                  !b.phone.trim() || !b.address.trim() || !b.description.trim();
                return (
                <tr key={b.id} className={b.active ? "hover:bg-cream/60" : "bg-cream/40 opacity-70"}>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="font-semibold text-ink">{b.name}</p>
                      {incomplete && (
                        <span title={dict.admin.incompleteProfileTitle}>
                          <Badge tone="honey">{dict.admin.incompleteProfile}</Badge>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-mute">{b.category.name}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-ink">{b.owner.name}</p>
                    <p className="text-xs text-ink-mute">{b.owner.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <PlanControl businessId={b.id} plan={b.plan} credits={b.smsCredits} />
                  </td>
                  <td className="px-3 py-3 font-semibold text-ink">{b._count.appointments}</td>
                  <td className="px-3 py-3 font-semibold text-ink">{formatTl(revMap.get(b.id) ?? 0)}</td>
                  <td className="px-3 py-3">
                    <FeaturedToggle businessId={b.id} initial={b.featured} />
                  </td>
                  <td className="px-3 py-3">
                    <ActiveToggle businessId={b.id} initial={b.active} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/salon/${b.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-semibold text-accent-deep hover:underline"
                      >
                        {dict.admin.view} <ExternalLink className="size-3.5" />
                      </Link>
                      <DeleteBusiness businessId={b.id} name={b.name} />
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Son kullanıcılar */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">{dict.admin.recentTitle}</h2>
        <ul className="divide-y divide-line">
          {recentUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-3 py-3">
              <Avatar src={u.image} name={u.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{u.name}</p>
                <p className="truncate text-xs text-ink-mute">{u.email}</p>
              </div>
              <Badge tone={u.role === "ADMIN" ? "ink" : u.role === "OWNER" ? "accent" : "line"}>
                {ROLE_LABEL[u.role] ?? u.role}
              </Badge>
              <span className="hidden shrink-0 text-xs text-ink-mute sm:block">
                {formatDateTr(u.createdAt.toISOString().slice(0, 10), { day: "numeric", month: "short" })}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
