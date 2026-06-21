import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { getDictionary } from "@/i18n";

export default async function NotFound() {
  const { common: c } = await getDictionary();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center">
      <Logo size="lg" />
      <p className="mt-8 font-display text-7xl font-extrabold tracking-tight text-ink">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink">{c.notFoundTitle}</h1>
      <p className="mt-2 max-w-sm text-ink-soft">{c.notFoundDesc}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="accent" size="lg">
          {c.backHome}
        </Button>
        <Button href="/arama" variant="outline" size="lg">
          {c.searchSalons}
        </Button>
      </div>
    </div>
  );
}
