import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { readResetToken, hashFingerprint } from "@/lib/pw-reset-token";
import { ResetPasswordForm } from "@/components/auth/reset-forms";

export const metadata: Metadata = { title: "Şifre sıfırla" };
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

  return (
    <div className="container-x flex justify-center py-16">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -top-10 h-40 bg-gradient-to-br from-accent/25 via-[#8b5cf6]/20 to-[#ff5fa2]/20 blur-3xl"
        />
        <div className="anim-rise relative rounded-[28px] border border-line bg-surface p-8 shadow-card ring-1 ring-accent/5">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Yeni şifre belirle
          </h1>
          {valid ? (
            <>
              <p className="mb-6 mt-2 text-ink-soft">Hesabın için yeni bir şifre gir.</p>
              <ResetPasswordForm token={token} />
            </>
          ) : (
            <div className="mt-3">
              <p className="text-ink-soft">
                Bu sıfırlama bağlantısı geçersiz veya süresi dolmuş (bağlantılar 1 saat geçerlidir).
              </p>
              <Link
                href="/sifremi-unuttum"
                className="mt-4 inline-block font-semibold text-accent-deep hover:underline"
              >
                Yeni bağlantı iste
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
