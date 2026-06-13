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
      className={`inline-flex items-baseline gap-0.5 font-display font-extrabold tracking-tight ${text} ${
        tone === "white" ? "text-white" : "text-ink"
      }`}
      aria-label="Salonor ana sayfa"
    >
      salonor
      <span className="inline-block size-2 rounded-full bg-accent" aria-hidden />
    </Link>
  );
}
