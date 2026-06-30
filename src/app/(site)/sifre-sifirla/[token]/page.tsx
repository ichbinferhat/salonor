import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { readResetToken, hashFingerprint } from "@/lib/pw-reset-token";
import { ResetPasswordForm } from "@/components/auth/reset-forms";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.auth.resetForm.metaTitle };
}
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const claims = await readResetToken(token);
  const user = claims
    ? await db.user.findUnique({ where: { id: claims.uid }, select: { passwordHash: true } })
    : null;
  // Token, kullanıcının GÜNCEL şifre parmak iziyle eşleşmeli (tek-kullanımlık güvencesi).
  const valid = !!(claims && user && claims.h === hashFingerprint(user.passwordHash));

  const dict = await getDictionary();
  const t = dict.auth.resetForm;

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
          {valid ? (
            <>
              <p className="mb-6 mt-2 text-ink-soft">{t.subtitle}</p>
              <ResetPasswordForm token={token} />
            </>
          ) : (
            <div className="mt-3">
              <p className="text-ink-soft">
                {t.invalid}
              </p>
              <Link
                href="/sifremi-unuttum"
                className="mt-4 inline-block font-semibold text-accent-deep hover:underline"
              >
                {t.requestNew}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
