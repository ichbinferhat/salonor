"use client";

import Link from "next/link";

export function Logo({
  size = "md",
  tone = "ink",
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "white";
  href?: string;
}) {
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";
  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof window !== "undefined" && window.location.pathname === href) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={`inline-flex items-baseline gap-0.5 font-display font-extrabold tracking-tight ${text} ${
        tone === "white" ? "text-white" : "text-ink"
      }`}
      aria-label="Salonor ana sayfa"
    >
      salonor
      <span
        className="inline-block size-2 rounded-full bg-gradient-to-br from-accent to-[#ff5fa2] shadow-[0_0_10px_-1px_rgb(108_77_246_/_0.7)] ring-1 ring-white/40"
        aria-hidden
      />
    </Link>
  );
}
