import type { ReactNode } from "react";

type Tone = "ink" | "accent" | "mint" | "honey" | "rose" | "sea" | "line";

const TONES: Record<Tone, string> = {
  ink: "bg-ink text-white",
  accent: "bg-accent-soft text-accent-deep",
  mint: "bg-mint-soft text-mint",
  honey: "bg-honey-soft text-honey",
  rose: "bg-rose-soft text-rose",
  sea: "bg-sea-soft text-sea",
  line: "bg-cream text-ink-soft border border-line",
};

export function Badge({
  tone = "line",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.01em] ring-1 ring-inset ring-ink/[0.04] ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
