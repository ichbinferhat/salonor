import Image from "next/image";
import { initials } from "@/lib/format";

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-lg",
} as const;

const PX = { sm: 32, md: 40, lg: 56, xl: 80 } as const;

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={PX[size]}
        height={PX[size]}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      className={`${SIZES[size]} inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-accent-deep ${className}`}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
