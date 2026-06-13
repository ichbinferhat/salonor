function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M10 1.7l2.47 5.0 5.53.8-4 3.9.94 5.5L10 14.3l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.7z" />
    </svg>
  );
}

/** Fresha tarzı: koyu mürekkep renkli yıldızlar */
export function RatingStars({
  value,
  size = "md",
  className = "",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = size === "lg" ? "size-5" : size === "sm" ? "size-3.5" : "size-4";
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className={`relative inline-flex ${className}`} aria-label={`${value} / 5 puan`}>
      <span className="flex text-line-strong">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={px} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex overflow-hidden text-ink"
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${px} shrink-0`} />
        ))}
      </span>
    </span>
  );
}
