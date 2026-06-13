import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/logo";
import { MainMenu } from "./header-menus";

export async function SiteHeader() {
  const session = await getSession();
  const info = session ? { name: session.name, role: session.role } : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md shadow-header">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-3">
          {!info && (
            <Link
              href="/giris"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 sm:block"
            >
              Oturum aç
            </Link>
          )}
          <Link
            href="/isletme"
            className="hidden rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-all hover:border-ink/40 sm:inline-flex"
          >
            İşletmenizi listeleyin
          </Link>
          <MainMenu session={info} />
        </div>
      </div>
    </header>
  );
}
