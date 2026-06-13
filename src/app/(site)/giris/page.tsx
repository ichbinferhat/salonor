import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/auth/forms";

export const metadata: Metadata = { title: "Giriş yap" };

export default async function LoginPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect(session.role === "OWNER" ? "/panel" : "/");

  const { next } = await props.searchParams;

  return (
    <div className="container-x flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="anim-rise rounded-[28px] border border-line bg-surface p-8 shadow-card">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Tekrar hoş geldin
          </h1>
          <p className="mb-6 mt-2 text-ink-soft">
            Randevularını yönetmek için giriş yap.
          </p>
          <LoginForm next={next} />
        </div>

        <div className="anim-rise d-2 mt-4 rounded-2xl border border-dashed border-accent/40 bg-accent-faint p-4 text-sm">
          <p className="font-bold text-accent-deep">Demo hesaplar</p>
          <p className="mt-1.5 text-ink-soft">
            Müşteri: <code className="font-semibold text-ink">musteri@salonor.com</code>
            <br />
            İşletme: <code className="font-semibold text-ink">isletme@salonor.com</code>
            <br />
            Şifre (her ikisi): <code className="font-semibold text-ink">salonor123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
