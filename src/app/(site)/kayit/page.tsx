import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { RegisterForm } from "@/components/auth/forms";

export const metadata: Metadata = { title: "Kayıt ol" };

export default async function RegisterPage(props: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/");

  const { next } = await props.searchParams;

  return (
    <div className="container-x flex justify-center py-16">
      <div className="anim-rise w-full max-w-md rounded-[28px] border border-line bg-surface p-8 shadow-card">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          Salonor'a katıl
        </h1>
        <p className="mb-6 mt-2 text-ink-soft">
          Ücretsiz hesabını oluştur, randevunu saniyeler içinde al.
        </p>
        <RegisterForm next={next} />
      </div>
    </div>
  );
}
