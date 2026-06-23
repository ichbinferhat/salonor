import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.preInfo.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.preInfo;
  return (
    <InfoPage title={t.title} updated={t.updated} intro={t.intro}>
      <Section title={t.sellerTitle}>
        <p>{t.sellerBody}</p>
      </Section>
      <Section title={t.productTitle}>
        <p>{t.productBody}</p>
      </Section>
      <Section title={t.priceTitle}>
        <p>{t.priceBody}</p>
      </Section>
      <Section title={t.deliveryTitle}>
        <p>{t.deliveryBody}</p>
      </Section>
      <Section title={t.withdrawalTitle}>
        <p>{t.withdrawalBody}</p>
      </Section>
      <Section title={t.complaintTitle}>
        <p>{t.complaintBody}</p>
      </Section>
    </InfoPage>
  );
}
