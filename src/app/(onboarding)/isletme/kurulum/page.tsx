import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getDictionary } from "@/i18n";
import { OnboardingWizard } from "@/components/onboarding/wizard";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.onboarding.metaTitle };
}

// Sıralı bir kategori listesi
const ORDER = ["kuafor", "berber", "tirnak", "cilt-bakimi", "spa-masaj", "makyaj", "epilasyon", "kas-kirpik"];

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/giris");
  if (session.role !== "OWNER") redirect("/");

  const existing = await db.business.findUnique({
    where: { ownerId: session.userId },
    select: { id: true },
  });
  if (existing) redirect("/panel");

  const categories = await db.category.findMany();
  const ordered = [...categories].sort(
    (a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug)
  );

  return (
    <OnboardingWizard
      categories={ordered.map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }))}
      ownerName={session.name}
    />
  );
}
