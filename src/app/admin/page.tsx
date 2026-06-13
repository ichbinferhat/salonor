import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Users, CalendarDays, Star, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { formatDateTr } from "@/lib/datetime";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FeaturedToggle } from "@/components/admin/featured-toggle";
import { ActiveToggle } from "@/components/admin/active-toggle";
import { CreateBusiness } from "@/components/admin/create-business";

export const metadata: Metadata = { title: "Yönetim" };

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Müşteri",
  OWNER: "İşletme",
  ADMIN: "Yönetici",
};

export default async function AdminPage() {
  const [bizCount, activeCount, userCount, apptCount, reviewCount, businesses, recentUsers] =
    await Promise.all([
      db.business.count(),
      db.business.count({ where: { active: true } }),
      db.user.count(),
      db.appointment.count(),
      db.review.count(),
      db.business.findMany({
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
    ]);

  const suspended = bizCount - activeCount;

  const stats = [
    {
      label: "İşletme",
      value: String(bizCount),
      sub: `${activeCount} aktif · ${suspended} askıda`,
      icon: Building2,
      tone: "bg-accent-soft text-accent-deep",
    },
    { label: "Kullanıcı", value: String(userCount), icon: Users, tone: "bg-mint-soft text-mint" },
    { label: "Randevu", value: String(apptCount), icon: CalendarDays, tone: "bg-sea-soft text-sea" },
    { label: "Yorum", value: String(reviewCount), icon: Star, tone: "bg-honey-soft text-honey" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Genel bakış
          </h1>
          <p className="mt-1 text-ink-soft">Tüm işletmeler ve kullanıcılar tek ekranda.</p>
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

      {/* İşletmeler */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <h2 className="border-b border-line px-5 py-4 font-display text-lg font-bold text-ink">
          İşletmeler ({businesses.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-mute">
                <th className="px-5 py-3 font-bold">İşletme</th>
                <th className="px-3 py-3 font-bold">Sahip</th>
                <th className="px-3 py-3 font-bold">Şehir</th>
                <th className="px-3 py-3 font-bold">Randevu</th>
                <th className="px-3 py-3 font-bold">Öne çıkan</th>
                <th className="px-3 py-3 font-bold">Durum</th>
                <th className="px-5 py-3 text-right font-bold">Vitrin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {businesses.map((b) => (
                <tr key={b.id} className={b.active ? "hover:bg-cream/60" : "bg-cream/40 opacity-70"}>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-ink">{b.name}</p>
                    <p className="text-xs text-ink-mute">{b.category.name}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-ink">{b.owner.name}</p>
                    <p className="text-xs text-ink-mute">{b.owner.email}</p>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{b.city || "—"}</td>
                  <td className="px-3 py-3 font-semibold text-ink">{b._count.appointments}</td>
                  <td className="px-3 py-3">
                    <FeaturedToggle businessId={b.id} initial={b.featured} />
                  </td>
                  <td className="px-3 py-3">
                    <ActiveToggle businessId={b.id} initial={b.active} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/salon/${b.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-semibold text-accent-deep hover:underline"
                    >
                      Gör <ExternalLink className="size-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Son kullanıcılar */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Son kaydolanlar</h2>
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
