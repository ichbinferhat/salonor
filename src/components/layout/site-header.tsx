import Link from "next/link";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { Logo } from "@/components/logo";
import { MainMenu } from "./header-menus";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export async function SiteHeader() {
  const session = await getSession();
  const dict = await getDictionary();
  const info = session ? { name: session.name, role: session.role } : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-xl shadow-header supports-[backdrop-filter]:bg-surface/70">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-3">
          {!info && (
            <Link
              href="/giris"
              className="rounded-full px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 sm:px-4"
            >
              {dict.nav.signIn}
            </Link>
          )}
          {(!info || info.role === "CUSTOMER") && (
            <Link
              href="/isletme"
              className="hidden rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-faint hover:shadow-card sm:inline-flex"
            >
              {dict.nav.listBusiness}
            </Link>
          )}
          <LanguageSwitcher />
          <MainMenu session={info} />
        </div>
      </div>
    </header>
  );
}
