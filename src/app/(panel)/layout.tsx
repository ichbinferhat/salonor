import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOwnerBusiness } from "@/lib/owner";
import { getUnseenAppointmentCountAction } from "@/server/actions/business";
import { PanelSidebar } from "@/components/panel/sidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/giris?next=/panel");
  if (session.role !== "OWNER" && session.role !== "ADMIN") redirect("/");

  const business = await getOwnerBusiness();
  if (!business) redirect("/isletme/kurulum");

  // Askıya alınan işletme (admin active=false yaptı) panele erişemez.
  if (!business.active) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <h1 className="font-display text-2xl text-ink">Hesabınız askıya alındı</h1>
        <p className="max-w-md text-ink-mute">
          İşletme hesabınız geçici olarak askıya alınmıştır. Lütfen destek ile iletişime geçin.
        </p>
        <a
          href="/"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
        >
          Ana sayfaya dön
        </a>
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
