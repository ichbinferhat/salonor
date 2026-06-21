export function PanelPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-accent to-[#ff5fa2]" />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-balance text-ink sm:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-pretty text-ink-soft">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
