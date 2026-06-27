import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Globe } from "lucide-react";
import { getDbVerifiedSession } from "@/lib/auth-guard";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "@/components/logo";
import { RefreshButton } from "@/components/admin/refresh-button";
import { getDictionary } from "@/i18n";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary();
  // Rolü DB'den doğrula (stale-role koruması): yetkisi alınmış kullanıcı anında kilitlenir.
  const session = await getDbVerifiedSession();
  if (!session) redirect("/giris?next=/admin");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-40 bg-ink text-white shadow-pop">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo tone="white" size="sm" />
            <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white/75 sm:inline">
              {dict.admin.consoleBadge}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshButton />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              <Globe className="size-4" />
              <span className="hidden sm:inline">{dict.admin.backToSite}</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <LogOut className="size-4" /> {dict.admin.logout}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </div>
  );
}
