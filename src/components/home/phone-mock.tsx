/** Saf CSS telefon çerçevesi — içine ekran içeriği konur. */
export function PhoneMock({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[9/19] rounded-[2.4rem] border-[6px] border-ink bg-ink p-1 shadow-pop ${className}`}
    >
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-surface">
        {children}
      </div>
    </div>
  );
}
