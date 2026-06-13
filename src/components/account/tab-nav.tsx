"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["/hesap", "Randevularım"],
  ["/hesap/favoriler", "Favorilerim"],
  ["/hesap/profil", "Profilim"],
] as const;

export function AccountTabNav() {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {TABS.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              active
                ? "bg-ink text-white"
                : "border border-line-strong bg-surface text-ink hover:border-ink/40"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
