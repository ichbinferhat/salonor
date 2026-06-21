import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.privacy.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.privacy;
  return (
    <InfoPage title={t.title} updated={t.updated} intro={t.intro}>
      <Section title={t.controllerTitle}>
        <p>{t.controllerBody}</p>
      </Section>
      <Section title={t.dataTitle}>
        <p>{t.dataBody}</p>
      </Section>
      <Section title={t.purposesTitle}>
        <p>{t.purposesBody}</p>
      </Section>
      <Section title={t.sharingTitle}>
        <p>{t.sharingBody}</p>
      </Section>
      <Section title={t.aiTitle}>
        <p>{t.aiBody}</p>
      </Section>
      <Section title={t.rightsTitle}>
        <p>{t.rightsBody}</p>
      </Section>
    </InfoPage>
  );
}
