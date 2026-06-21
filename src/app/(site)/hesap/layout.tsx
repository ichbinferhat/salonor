import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { AccountTabNav } from "@/components/account/tab-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/giris?next=/hesap");
  if (session.role !== "CUSTOMER") redirect(session.role === "ADMIN" ? "/admin" : "/panel");

  const dict = await getDictionary();

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        {interpolate(dict.account.greeting, { name: session.name.split(" ")[0] })}
      </h1>
      <p className="mt-1 text-ink-soft">{dict.account.layoutSubtitle}</p>
      <div className="mb-8 mt-6">
        <AccountTabNav />
      </div>
      {children}
    </div>
  );
}
