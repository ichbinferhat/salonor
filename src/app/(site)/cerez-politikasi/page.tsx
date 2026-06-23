import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.cookies.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.cookies;
  return (
    <InfoPage title={t.title} updated={t.updated} intro={t.intro}>
      <Section title={t.whatTitle}>
        <p>{t.whatBody}</p>
      </Section>
      <Section title={t.typesTitle}>
        <p>{t.typesBody}</p>
      </Section>
      <Section title={t.analyticsTitle}>
        <p>{t.analyticsBody}</p>
      </Section>
      <Section title={t.manageTitle}>
        <p>{t.manageBody}</p>
      </Section>
      <Section title={t.contactTitle}>
        <p>{t.contactBody}</p>
      </Section>
    </InfoPage>
  );
}
