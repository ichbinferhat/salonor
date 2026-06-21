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
