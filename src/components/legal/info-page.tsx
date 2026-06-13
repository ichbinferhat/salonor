import type { ReactNode } from "react";

export function InfoPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-accent-deep">
          Salonor
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {intro && <p className="mt-4 text-lg text-ink-soft">{intro}</p>}
        {updated && (
          <p className="mt-2 text-sm text-ink-mute">Son güncelleme: {updated}</p>
        )}
        <div className="mt-10 space-y-8">{children}</div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <div className="mt-2.5 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
