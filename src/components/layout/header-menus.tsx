"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  ArrowRight,
  LifeBuoy,
  LogIn,
  CalendarDays,
  Heart,
  User,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Avatar } from "@/components/ui/avatar";
import { useDict } from "@/i18n/provider";

type SessionInfo = { name: string; role: "CUSTOMER" | "OWNER" | "ADMIN" };

/** Üst bardaki tek "Menü" düğmesi ve açılır listesi (Fresha tarzı). */
export function MainMenu({ session }: { session: SessionInfo | null }) {
  const dict = useDict();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-full border border-line-strong bg-surface text-sm font-semibold text-ink transition-colors hover:border-ink/40 ${
          session ? "py-1 pl-1 pr-2.5" : "px-4 py-2"
        }`}
        aria-expanded={open}
        aria-label={session ? dict.nav.account : dict.nav.menu}
      >
        {session ? (
          <>
            <Avatar name={session.name} size="sm" />
            <span className="hidden max-w-[7rem] truncate sm:inline">
              {session.name.split(" ")[0]}
            </span>
            <ChevronDown className="size-4 text-ink-soft" />
          </>
        ) : (
          <>
            {dict.nav.menu} <Menu className="size-4" />
          </>
        )}
      </button>

      {open && (
        <div className="anim-rise absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-pop">
          {session ? (
            <AccountItems session={session} close={close} />
          ) : (
            <GuestItems close={close} />
          )}
        </div>
      )}
    </div>
  );
}

function GuestItems({ close }: { close: () => void }) {
  const dict = useDict();
  return (
    <>
      <p className="px-3 pb-1 pt-2 font-display text-base font-bold text-ink">
        {dict.nav.forCustomers}
      </p>
      <MenuLink href="/giris" icon={<LogIn className="size-4" />} onClick={close} accent>
        {dict.nav.signInOrUp}
      </MenuLink>
      <MenuLink href="/sss" icon={<LifeBuoy className="size-4" />} onClick={close}>
        {dict.nav.helpSupport}
      </MenuLink>
      <Divider />
      <p className="px-3 pb-1 pt-1 font-display text-base font-bold text-ink">
        {dict.nav.forBusinesses}
      </p>
      <MenuLink href="/giris?next=/panel" icon={<LogIn className="size-4" />} onClick={close}>
        {dict.nav.businessLogin}
      </MenuLink>
      <BusinessRow close={close} />
    </>
  );
}

function AccountItems({ session, close }: { session: SessionInfo; close: () => void }) {
  const dict = useDict();
  return (
    <>
      <p className="truncate px-3 pb-1 pt-2 font-display text-base font-bold text-ink">
        {session.name}
      </p>
      {session.role === "OWNER" ? (
        <MenuLink href="/panel" icon={<LayoutDashboard className="size-4" />} onClick={close}>
          {dict.nav.businessPanel}
        </MenuLink>
      ) : session.role === "ADMIN" ? (
        <MenuLink href="/admin" icon={<ShieldCheck className="size-4" />} onClick={close}>
          {dict.nav.adminPanel}
        </MenuLink>
      ) : (
        <>
          <MenuLink href="/hesap" icon={<CalendarDays className="size-4" />} onClick={close}>
            {dict.nav.myAppointments}
          </MenuLink>
          <MenuLink href="/hesap/favoriler" icon={<Heart className="size-4" />} onClick={close}>
            {dict.nav.myFavorites}
          </MenuLink>
          <MenuLink href="/hesap/profil" icon={<User className="size-4" />} onClick={close}>
            {dict.nav.myProfile}
          </MenuLink>
        </>
      )}
      <MenuLink href="/sss" icon={<LifeBuoy className="size-4" />} onClick={close}>
        {dict.nav.helpSupport}
      </MenuLink>
      <Divider />
      {session.role === "CUSTOMER" && <BusinessRow close={close} />}
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose transition-colors hover:bg-rose-soft"
        >
          <LogOut className="size-4" /> {dict.nav.logout}
        </button>
      </form>
    </>
  );
}

function BusinessRow({ close }: { close: () => void }) {
  const dict = useDict();
  return (
    <Link
      href="/isletme"
      onClick={close}
      className="mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-cream"
    >
      {dict.nav.listBusiness} <ArrowRight className="size-4" />
    </Link>
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
