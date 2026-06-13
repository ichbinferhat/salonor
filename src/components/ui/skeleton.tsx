export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-ink/8 ${className}`}
      aria-hidden
    />
  );
}
