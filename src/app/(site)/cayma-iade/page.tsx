import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.withdrawal.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.withdrawal;
  return (
    <InfoPage title={t.title} updated={t.updated} intro={t.intro}>
      <Section title={t.rightTitle}>
        <p>{t.rightBody}</p>
      </Section>
      <Section title={t.howTitle}>
        <p>{t.howBody}</p>
      </Section>
      <Section title={t.exceptionTitle}>
        <p>{t.exceptionBody}</p>
      </Section>
      <Section title={t.refundTitle}>
        <p>{t.refundBody}</p>
      </Section>
      <Section title={t.contactTitle}>
        <p>{t.contactBody}</p>
      </Section>
    </InfoPage>
  );
}
