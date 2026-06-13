import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger" | "white";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink-strong active:scale-[0.98] border border-transparent",
  accent:
    "bg-accent text-white hover:bg-accent-deep active:scale-[0.98] border border-transparent",
  outline:
    "bg-surface text-ink border border-line-strong hover:border-ink/40 hover:bg-cream",
  ghost: "bg-transparent text-ink hover:bg-ink/5 border border-transparent",
  danger: "bg-rose-soft text-rose hover:bg-rose hover:text-white border border-transparent",
  white:
    "bg-white text-ink hover:bg-white/90 active:scale-[0.98] border border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  xl: "h-14 px-8 text-base gap-2.5",
};

const BASE =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className"> &
  Pick<ComponentProps<"a">, "target" | "rel">;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  target,
  rel,
  ...rest
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} target={target} rel={rel}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
