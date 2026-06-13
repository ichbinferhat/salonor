/** App Store & Google Play indirme rozetleri (sade, marka-nötr glifler). */
export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Badge
        store="App Store"
        top="İndir —"
        glyph={
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
            <path d="M16.36 12.78c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.18-1.72-1.35-.14-2.64.79-3.33.79-.69 0-1.74-.77-2.87-.75-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.59 1.1 8.75.73 1.06 1.6 2.24 2.74 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.29-.88-2.32-3.49zM14.2 6.02c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.56 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.97-.49 2.58-1.21z" />
          </svg>
        }
      />
      <Badge
        store="Google Play"
        top="İndir —"
        glyph={
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
            <path d="M3.6 2.4c-.25.26-.4.66-.4 1.18v16.84c0 .52.15.92.4 1.18l.06.05L13 12.5v-.1L3.66 2.35l-.06.05z" fill="#34d399" />
            <path d="M16.3 15.8 13 12.5v-.1l3.3-3.3.08.05 3.9 2.22c1.12.63 1.12 1.67 0 2.31l-3.9 2.22-.08.05z" fill="#fbbf24" />
            <path d="M16.38 15.75 13 12.45 3.6 21.6c.37.39.98.44 1.67.05l11.11-5.9z" fill="#f87171" />
            <path d="M16.38 9.15 5.27 3.25c-.69-.39-1.3-.34-1.67.05l9.4 9.15 3.38-3.3z" fill="#60a5fa" />
          </svg>
        }
      />
    </div>
  );
}

function Badge({
  glyph,
  top,
  store,
}: {
  glyph: React.ReactNode;
  top: string;
  store: string;
}) {
  return (
    <span className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-ink px-4 py-2.5 text-white transition-transform hover:scale-[1.03]">
      {glyph}
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/60">{top}</span>
        <span className="block text-sm font-bold">{store}</span>
      </span>
    </span>
  );
}
