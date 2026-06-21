import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/auth/forms";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.login.metaTitle };
}

// Aynı doğrulama loginAction içindeki safeNext ile: "/" ile başlamalı ve
// sonraki karakter "/" veya "\" olmamalı (açık yönlendirmeyi engeller).
function safeNext(raw: string | undefined, fallback: string) {
  return raw && /^\/(?![/\\])/.test(raw) ? raw : fallback;
}

export default async function LoginPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await props.searchParams;

  const session = await getSession();
  if (session) redirect(session.role === "OWNER" ? "/panel" : safeNext(next, "/"));

  const dict = await getDictionary();
  const t = dict.auth.login;

  return (
    <div className="container-x flex justify-center py-16">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -top-10 h-40 bg-gradient-to-br from-accent/25 via-[#8b5cf6]/20 to-[#ff5fa2]/20 blur-3xl"
        />
        <div className="anim-rise relative rounded-[28px] border border-line bg-surface p-8 shadow-card ring-1 ring-accent/5">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            {t.title}
          </h1>
          <p className="mb-6 mt-2 text-ink-soft">
            {t.subtitle}
          </p>
          <LoginForm next={next} />
        </div>

        <div className="anim-rise d-2 mt-4 rounded-2xl border border-dashed border-accent/40 bg-accent-faint p-4 text-sm">
          <p className="font-bold text-accent-deep">{t.demoTitle}</p>
          <p className="mt-1.5 text-ink-soft">
            {t.demoCustomer} <code className="font-semibold text-ink">musteri@salonor.com</code>
            <br />
            {t.demoBusiness} <code className="font-semibold text-ink">isletme@salonor.com</code>
            <br />
            {t.demoPassword} <code className="font-semibold text-ink">salonor123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
