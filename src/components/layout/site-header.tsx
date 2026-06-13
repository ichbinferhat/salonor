import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserMenu, MobileMenu } from "./header-menus";

export async function SiteHeader() {
  const session = await getSession();
  const info = session ? { name: session.name, role: session.role } : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/arama"
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Keşfet
          </Link>
          <Link
            href="/fiyatlandirma"
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Fiyatlar
          </Link>
          <Link
            href="/isletme"
            className="rounded-full border border-line-strong px-4 py-2 text-sm font-semibold text-ink transition-all hover:border-ink/40 hover:bg-surface"
          >
            İşletmeni listele
          </Link>
          <span className="mx-1 h-5 w-px bg-line-strong" aria-hidden />
          {info ? (
            <UserMenu session={info} />
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

        <div className="flex items-center gap-2 md:hidden">
          {info && <UserMenu session={info} />}
          <MobileMenu session={info} />
        </div>
      </div>
    </header>
  );
}
