import { Logo } from "@/components/logo";
import { getDictionary } from "@/i18n";

export default async function FlowLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md">
        <div className="container-x flex h-14 items-center justify-between">
          <Logo size="sm" />
          <span className="text-xs font-semibold text-ink-mute">
            {dict.booking.secureHeader}
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
