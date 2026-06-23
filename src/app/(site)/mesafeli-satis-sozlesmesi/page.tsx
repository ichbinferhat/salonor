import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.distanceSales.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.distanceSales;
  return (
    <InfoPage title={t.title} updated={t.updated} intro={t.intro}>
      <Section title={t.partiesTitle}>
        <p>{t.partiesBody}</p>
      </Section>
      <Section title={t.subjectTitle}>
        <p>{t.subjectBody}</p>
      </Section>
      <Section title={t.productTitle}>
        <p>{t.productBody}</p>
      </Section>
      <Section title={t.paymentTitle}>
        <p>{t.paymentBody}</p>
      </Section>
      <Section title={t.deliveryTitle}>
        <p>{t.deliveryBody}</p>
      </Section>
      <Section title={t.withdrawalTitle}>
        <p>{t.withdrawalBody}</p>
      </Section>
      <Section title={t.disputeTitle}>
        <p>{t.disputeBody}</p>
      </Section>
    </InfoPage>
  );
}
