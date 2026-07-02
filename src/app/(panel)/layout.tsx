import { redirect } from "next/navigation";
import Link from "next/link";
import { getDbVerifiedSession } from "@/lib/auth-guard";
import { getOwnerBusiness } from "@/lib/owner";
import { getUnseenAppointmentCountAction } from "@/server/actions/business";
import { PanelSidebar } from "@/components/panel/sidebar";
import { getDictionary } from "@/i18n";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rolü DB'den doğrula (stale-role koruması): rolü düşürülen kullanıcı anında kilitlenir.
  const session = await getDbVerifiedSession();
  if (!session) redirect("/giris?next=/panel");
  if (session.role !== "OWNER" && session.role !== "ADMIN") redirect("/");

  const business = await getOwnerBusiness();
  if (!business) redirect("/isletme/kurulum");

  // Yalnızca GERÇEKTEN askıya alınmış işletme panele erişemez. Taslak (yeni, henüz
  // aktifleştirilmemiş: active=false ama suspended=false) sahibi panele girip bilgilerini
  // TAMAMLAYABİLİR — yayına alma sonra admin tarafından yapılır.
  if (business.suspended) {
    const dict = await getDictionary();
    const t = dict.panelCore.suspended;
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <h1 className="font-display text-2xl text-ink">{t.title}</h1>
        <p className="max-w-md text-ink-mute">
          {t.desc}
        </p>
        <Link
          href="/"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
        >
          {t.backHome}
        </Link>
      </div>
    );
  }

  const unseenCount = await getUnseenAppointmentCountAction();

  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <PanelSidebar
        businessName={business.name}
        businessSlug={business.slug}
        initialUnseen={unseenCount}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
