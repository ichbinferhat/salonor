"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ArrowRight,
  Globe,
  Download,
  LifeBuoy,
  LogIn,
  CalendarDays,
  Heart,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";

type SessionInfo = { name: string; role: "CUSTOMER" | "OWNER" | "ADMIN" };

/** Üst bardaki tek "Menü" düğmesi ve açılır listesi (Fresha tarzı). */
export function MainMenu({ session }: { session: SessionInfo | null }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
        aria-expanded={open}
        aria-label="Menü"
      >
        Menü <Menu className="size-4" />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            onClick={close}
            aria-label="Menüyü kapat"
            tabIndex={-1}
          />
          <div className="anim-rise absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-pop">
            {session ? (
              <AccountItems session={session} close={close} />
            ) : (
              <GuestItems close={close} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function GuestItems({ close }: { close: () => void }) {
  return (
    <>
      <p className="px-3 pb-1 pt-2 font-display text-base font-bold text-ink">
        Müşteriler için
      </p>
      <MenuLink href="/giris" icon={<LogIn className="size-4" />} onClick={close} accent>
        Oturum açın veya kaydolun
      </MenuLink>
      <MenuLink href="/#uygulama" icon={<Download className="size-4" />} onClick={close}>
        Uygulamayı indirin
      </MenuLink>
      <MenuLink href="/sss" icon={<LifeBuoy className="size-4" />} onClick={close}>
        Yardım ve destek
      </MenuLink>
      <LangRow />
      <Divider />
      <BusinessRow close={close} />
    </>
  );
}

function AccountItems({ session, close }: { session: SessionInfo; close: () => void }) {
  return (
    <>
      <p className="truncate px-3 pb-1 pt-2 font-display text-base font-bold text-ink">
        {session.name}
      </p>
      {session.role === "OWNER" ? (
        <MenuLink href="/panel" icon={<LayoutDashboard className="size-4" />} onClick={close}>
          İşletme Paneli
        </MenuLink>
      ) : session.role === "ADMIN" ? (
        <MenuLink href="/admin" icon={<ShieldCheck className="size-4" />} onClick={close}>
          Yönetim Paneli
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
      <MenuLink href="/sss" icon={<LifeBuoy className="size-4" />} onClick={close}>
        Yardım ve destek
      </MenuLink>
      <LangRow />
      <Divider />
      {session.role === "CUSTOMER" && <BusinessRow close={close} />}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose transition-colors hover:bg-rose-soft"
        >
          <LogOut className="size-4" /> Çıkış yap
        </button>
      </form>
    </>
  );
}

function BusinessRow({ close }: { close: () => void }) {
  return (
    <Link
      href="/isletme"
      onClick={close}
      className="mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-cream"
    >
      İşletmeler için <ArrowRight className="size-4" />
    </Link>
  );
}

function LangRow() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-ink-soft">
      <Globe className="size-4" /> Türkçe (TR)
    </div>
  );
}

function Divider() {
  return <div className="my-1.5 border-t border-line" />;
}

function MenuLink({
  href,
  icon,
  children,
  onClick,
  accent = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-cream ${
        accent ? "font-bold text-accent-deep" : "font-medium text-ink"
      }`}
    >
      <span className={accent ? "text-accent" : "text-ink-soft"}>{icon}</span>
      {children}
    </Link>
  );
}
