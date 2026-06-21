import type { ReactNode } from "react";
import { getDictionary } from "@/i18n";

export async function InfoPage({
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
  const dict = await getDictionary();
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-faint px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-deep ring-1 ring-accent/10">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {dict.legal.brand}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {intro && <p className="mt-4 text-lg text-ink-soft">{intro}</p>}
        {updated && (
          <p className="mt-2 text-sm text-ink-mute">
            {dict.legal.lastUpdated} {updated}
          </p>
        )}
        <div className="mt-10 space-y-8">{children}</div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink before:h-5 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-accent before:to-[#ff5fa2] before:content-['']">{title}</h2>
      <div className="mt-2.5 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
