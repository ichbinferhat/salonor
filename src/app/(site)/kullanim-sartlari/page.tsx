import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.terms.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.terms;
  return (
    <InfoPage title={t.title} updated={t.updated} intro={t.intro}>
      <Section title={t.serviceTitle}>
        <p>{t.serviceBody}</p>
      </Section>
      <Section title={t.accountTitle}>
        <p>{t.accountBody}</p>
      </Section>
      <Section title={t.bookingsTitle}>
        <p>{t.bookingsBody}</p>
      </Section>
      <Section title={t.reviewsTitle}>
        <p>{t.reviewsBody}</p>
      </Section>
      <Section title={t.liabilityTitle}>
        <p>{t.liabilityBody}</p>
      </Section>
    </InfoPage>
  );
}
