import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { RegisterForm } from "@/components/auth/forms";
import { getDictionary } from "@/i18n";

export const metadata: Metadata = { title: "Hesap oluştur" };

export default async function RegisterPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect(session.role === "OWNER" ? "/panel" : "/");

  const { next } = await props.searchParams;
  const dict = await getDictionary();
  const t = dict.auth;

  return (
    <div className="container-x flex justify-center py-16">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -top-10 h-40 bg-gradient-to-br from-accent/25 via-[#8b5cf6]/20 to-[#ff5fa2]/20 blur-3xl"
        />
        <div className="anim-rise relative rounded-[28px] border border-line bg-surface p-8 shadow-card ring-1 ring-accent/5">
          <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight text-ink">
            {t.registerForm.submit}
          </h1>
          <RegisterForm next={next} />
        </div>
      </div>
    </div>
  );
}
