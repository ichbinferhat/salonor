import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { ProfileForm } from "@/components/account/profile-form";
import { DeleteAccountSection } from "@/components/account/delete-account";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.account.meta.profile };
}

export default async function ProfilePage() {
  const session = (await getSession())!;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true },
  });

  return (
    <>
      <ProfileForm
        defaults={{
          name: user?.name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
        }}
      />
      <DeleteAccountSection />
    </>
  );
}
