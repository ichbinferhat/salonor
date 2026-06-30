import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ForgotPasswordForm } from "@/components/auth/reset-forms";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.forgotForm.metaTitle };
}

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) redirect(session.role === "OWNER" ? "/panel" : session.role === "ADMIN" ? "/admin" : "/");

  const dict = await getDictionary();
  const t = dict.auth.forgotForm;

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
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
