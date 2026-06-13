"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  Scissors,
  Users,
  UserRound,
  Star,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { logoutAction } from "@/server/actions/auth";

const NAV = [
  ["/panel", "Genel Bakış", LayoutDashboard],
  ["/panel/takvim", "Takvim", CalendarRange],
  ["/panel/hizmetler", "Hizmetler", Scissors],
  ["/panel/personel", "Personel", Users],
  ["/panel/musteriler", "Müşteriler", UserRound],
  ["/panel/yorumlar", "Yorumlar", Star],
  ["/panel/ayarlar", "Ayarlar", Settings],
] as const;

export function PanelSidebar({
  businessName,
  businessSlug,
}: {
  businessName: string;
  businessSlug: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNav }: { onNav?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map(([href, label, Icon]) => {
        const active = href === "/panel" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-accent text-white"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="size-4.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Masaüstü kenar çubuğu */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-ink-strong p-4 lg:flex">
        <div className="px-2 py-3">
          <Logo tone="white" size="sm" href="/panel" />
        </div>
        <div className="mt-2 rounded-xl bg-white/5 px-3.5 py-3">
          <p className="text-xs font-semibold text-white/45">İşletme</p>
          <p className="truncate text-sm font-bold text-white">{businessName}</p>
        </div>
        <div className="mt-4 flex-1">
          <NavLinks />
        </div>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link
            href={`/salon/${businessSlug}`}
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4.5" /> Sayfamı gör
          </Link>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white">
              <LogOut className="size-4.5" /> Çıkış yap
            </button>
          </form>
        </div>
      </aside>

      {/* Mobil üst bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink-strong px-4 lg:hidden">
        <Logo tone="white" size="sm" href="/panel" />
        <button
          onClick={() => setOpen(true)}
          className="rounded-full p-2 text-white"
          aria-label="Menü"
        >
          <Menu className="size-6" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink-strong/60 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="flex h-full w-72 max-w-[85vw] flex-col bg-ink-strong p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <Logo tone="white" size="sm" href="/panel" />
              <button onClick={() => setOpen(false)} className="p-2 text-white" aria-label="Kapat">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1">
              <NavLinks onNav={() => setOpen(false)} />
            </div>
            <div className="space-y-1 border-t border-white/10 pt-3">
              <Link
                href={`/salon/${businessSlug}`}
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65"
              >
                <ExternalLink className="size-4.5" /> Sayfamı gör
              </Link>
              <form action={logoutAction}>
                <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65">
                  <LogOut className="size-4.5" /> Çıkış yap
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
