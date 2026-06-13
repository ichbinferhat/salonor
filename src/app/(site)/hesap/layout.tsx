import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AccountTabNav } from "@/components/account/tab-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/giris?next=/hesap");
  if (session.role === "OWNER") redirect("/panel");

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Merhaba, {session.name.split(" ")[0]} 👋
      </h1>
      <p className="mt-1 text-ink-soft">Randevularını ve hesabını buradan yönet.</p>
      <div className="mb-8 mt-6">
        <AccountTabNav />
      </div>
      {children}
    </div>
  );
}
