/**
 * Küçük, ölçeklenebilir Türk bayrağı (ay-yıldız). Rozet/çip içinde ikon yerine
 * kullanılır. Salt-dekoratif: aria-hidden, ekran okuyucu görmez.
 */
export function TurkishFlag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block overflow-hidden rounded-[3px] ring-1 ring-black/10 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 36 24" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="36" height="24" fill="#E30A17" />
        {/* Hilal — beyaz daire eksi içteki kırmızı daire */}
        <circle cx="14" cy="12" r="6.2" fill="#fff" />
        <circle cx="15.7" cy="12" r="4.9" fill="#E30A17" />
        {/* Beş köşeli yıldız */}
        <path
          d="M22.6 8.9 L23.4 11 L25.6 11 L23.8 12.4 L24.4 14.5 L22.6 13.2 L20.8 14.5 L21.4 12.4 L19.6 11 L21.8 11 Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}
