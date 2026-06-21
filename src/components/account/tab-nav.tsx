"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict } from "@/i18n/provider";

export function AccountTabNav() {
  const dict = useDict();
  const pathname = usePathname();
  const tabs: ReadonlyArray<readonly [string, string]> = [
    ["/hesap", dict.account.tabs.appointments],
    ["/hesap/favoriler", dict.account.tabs.favorites],
    ["/hesap/profil", dict.account.tabs.profile],
  ];
  return (
    <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {tabs.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              active
                ? "bg-gradient-to-r from-accent via-[#8b5cf6] to-[#ff5fa2] text-white shadow-pop"
                : "border border-line-strong bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-card"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
