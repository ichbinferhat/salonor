import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserMenu, MobileMenu } from "./header-menus";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/arama"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Keşfet
          </Link>
          <Link
            href="/isletme"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            İşletmeniz için Salonor
          </Link>
          <span className="mx-2 h-5 w-px bg-line-strong" aria-hidden />
          {session ? (
            <UserMenu session={{ name: session.name, role: session.role }} />
          ) : (
            <div className="flex items-center gap-2">
              <Button href="/giris" variant="ghost" size="sm">
                Giriş yap
              </Button>
              <Button href="/kayit" variant="primary" size="sm">
                Kayıt ol
              </Button>
            </div>
          )}
        </nav>

        <MobileMenu
          session={session ? { name: session.name, role: session.role } : null}
        />
      </div>
    </header>
  );
}
