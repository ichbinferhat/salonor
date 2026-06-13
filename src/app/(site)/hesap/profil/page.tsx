import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ProfileForm } from "@/components/account/profile-form";

export const metadata: Metadata = { title: "Profilim" };

export default async function ProfilePage() {
  const session = (await getSession())!;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true },
  });

  return (
    <ProfileForm
      defaults={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
      }}
    />
  );
}
