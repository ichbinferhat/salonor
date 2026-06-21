import type { Metadata } from "next";
import { Mail, Headphones, Building2 } from "lucide-react";
import { InfoPage, Section } from "@/components/legal/info-page";
import { ContactForm } from "@/components/contact/contact-form";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.legal.contact.metaTitle };
}

export default async function Page() {
  const dict = await getDictionary();
  const t = dict.legal.contact;
  return (
    <InfoPage title={t.title} intro={t.intro}>
      <Section title={t.addBusinessTitle}>
        <p className="mb-5">{t.addBusinessBody}</p>
        <ContactForm />
      </Section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Headphones, title: t.cardSupportTitle, value: "destek@salonor.com" },
          { icon: Building2, title: t.cardPartnerTitle, value: "isletme@salonor.com" },
          { icon: Mail, title: t.cardPressTitle, value: "merhaba@salonor.com" },
        ].map((c) => (
          <div
            key={c.title}
            className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-pop"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-deep transition-transform group-hover:scale-105">
              <c.icon className="size-5" />
            </span>
            <p className="mt-3 font-bold text-ink">{c.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{c.value}</p>
          </div>
        ))}
      </div>
      <Section title={t.hoursTitle}>
        <p>{t.hoursBody}</p>
      </Section>
      <Section title={t.businessTitle}>
        <p>
          {t.businessBodyBefore}
          <span className="font-semibold text-accent-deep">isletme@salonor.com</span>
          {t.businessBodyAfter}
        </p>
      </Section>
    </InfoPage>
  );
}
