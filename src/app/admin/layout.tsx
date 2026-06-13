import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/giris?next=/admin");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
              Yönetim
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            Siteye dön →
          </Link>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </div>
  );
}
