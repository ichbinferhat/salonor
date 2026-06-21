import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.faq.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.faq;
  const items: [string, string][] = [
    [t.q1, t.a1],
    [t.q2, t.a2],
    [t.q3, t.a3],
    [t.q4, t.a4],
    [t.q5, t.a5],
  ];
  return (
    <InfoPage title={t.title} intro={t.intro}>
      {items.map(([q, a]) => (
        <Section key={q} title={q}>
          <p>{a}</p>
        </Section>
      ))}
    </InfoPage>
  );
}
