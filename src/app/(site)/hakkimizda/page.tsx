import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.about.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.about;
  return (
    <InfoPage title={t.title} intro={t.intro}>
      <Section title={t.missionTitle}>
        <p>{t.missionBody}</p>
      </Section>
      <Section title={t.customersTitle}>
        <p>{t.customersBody}</p>
      </Section>
      <Section title={t.businessesTitle}>
        <p>{t.businessesBody}</p>
      </Section>
      <Section title={t.valuesTitle}>
        <p>{t.valuesBody}</p>
      </Section>
    </InfoPage>
  );
}
