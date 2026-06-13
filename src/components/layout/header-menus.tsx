"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  Tag,
  User,
  X,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { initials } from "@/lib/format";

type SessionInfo = { name: string; role: "CUSTOMER" | "OWNER" | "ADMIN" };

export function UserMenu({ session }: { session: SessionInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-surface py-1.5 pl-1.5 pr-3 transition-colors hover:border-ink/30"
        aria-expanded={open}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-deep">
          {initials(session.name)}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">
          {session.name.split(" ")[0]}
        </span>
        <ChevronDown className={`size-4 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Menüyü kapat"
            tabIndex={-1}
          />
          <div className="anim-rise absolute right-0 z-40 mt-2 w-60 rounded-2xl border border-line bg-surface p-2 shadow-pop">
            {session.role === "OWNER" ? (
              <MenuLink href="/panel" icon={<LayoutDashboard className="size-4" />} onClick={() => setOpen(false)}>
                İşletme Paneli
              </MenuLink>
            ) : (
              <>
                <MenuLink href="/hesap" icon={<CalendarDays className="size-4" />} onClick={() => setOpen(false)}>
                  Randevularım
                </MenuLink>
                <MenuLink href="/hesap/favoriler" icon={<Heart className="size-4" />} onClick={() => setOpen(false)}>
                  Favorilerim
                </MenuLink>
                <MenuLink href="/hesap/profil" icon={<User className="size-4" />} onClick={() => setOpen(false)}>
                  Profilim
                </MenuLink>
              </>
            )}
            <div className="my-1.5 border-t border-line" />
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose transition-colors hover:bg-rose-soft"
              >
                <LogOut className="size-4" /> Çıkış yap
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
    >
      <span className="text-ink-soft">{icon}</span>
      {children}
    </Link>
  );
}

export function MobileMenu({ session }: { session: SessionInfo | null }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="rounded-full p-2 text-ink transition-colors hover:bg-ink/5"
        aria-label="Menüyü aç"
      >
        <Menu className="size-6" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-ink-strong/50" onClick={close}>
          <div
            className="anim-rise ml-auto flex h-full w-80 max-w-[85vw] flex-col gap-1 bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold">Menü</span>
              <button onClick={close} className="rounded-full p-2 hover:bg-ink/5" aria-label="Kapat">
                <X className="size-5" />
              </button>
            </div>
            <MenuLink href="/arama" icon={<CalendarDays className="size-4" />} onClick={close}>
              Salon keşfet
            </MenuLink>
            <MenuLink href="/isletme" icon={<Store className="size-4" />} onClick={close}>
              İşletmeniz için Salonor
            </MenuLink>
            <MenuLink href="/fiyatlandirma" icon={<Tag className="size-4" />} onClick={close}>
              Fiyatlar
            </MenuLink>
            <div className="my-2 border-t border-line" />
            {session ? (
              <>
                {session.role === "OWNER" ? (
                  <MenuLink href="/panel" icon={<LayoutDashboard className="size-4" />} onClick={close}>
                    İşletme Paneli
                  </MenuLink>
                ) : (
                  <>
                    <MenuLink href="/hesap" icon={<CalendarDays className="size-4" />} onClick={close}>
                      Randevularım
                    </MenuLink>
                    <MenuLink href="/hesap/favoriler" icon={<Heart className="size-4" />} onClick={close}>
                      Favorilerim
                    </MenuLink>
                    <MenuLink href="/hesap/profil" icon={<User className="size-4" />} onClick={close}>
                      Profilim
                    </MenuLink>
                  </>
                )}
                <form action={logoutAction} className="mt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-xl bg-rose-soft px-3 py-2.5 text-sm font-semibold text-rose"
                  >
                    <LogOut className="size-4" /> Çıkış yap
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  href="/giris"
                  onClick={close}
                  className="rounded-full border border-line-strong px-5 py-2.5 text-center text-sm font-semibold"
                >
                  Giriş yap
                </Link>
                <Link
                  href="/kayit"
                  onClick={close}
                  className="rounded-full bg-ink px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Kayıt ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
