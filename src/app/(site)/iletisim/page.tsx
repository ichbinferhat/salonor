import type { Metadata } from "next";
import { Mail, Headphones, Building2 } from "lucide-react";
import { InfoPage, Section } from "@/components/legal/info-page";

export const metadata: Metadata = { title: "İletişim" };

export default function Page() {
  return (
    <InfoPage
      title="İletişim"
      intro="Bir sorun mu var, bir önerin mi? Sana yardımcı olmaktan memnuniyet duyarız."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Headphones, title: "Müşteri desteği", value: "destek@salonor.com" },
          { icon: Building2, title: "İşletme iş birliği", value: "isletme@salonor.com" },
          { icon: Mail, title: "Basın & diğer", value: "merhaba@salonor.com" },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-line bg-surface p-5 shadow-card"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
              <c.icon className="size-5" />
            </span>
            <p className="mt-3 font-bold text-ink">{c.title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{c.value}</p>
          </div>
        ))}
      </div>
      <Section title="Çalışma saatleri">
        <p>
          Destek ekibimiz hafta içi 09:00–18:00 arası yazılı taleplere yanıt
          verir. Genellikle aynı gün içinde dönüş yaparız.
        </p>
      </Section>
      <Section title="İşletme misin?">
        <p>
          Salonor Business ile tanışmak ve işletmeni eklemek için{" "}
          <span className="font-semibold text-accent-deep">isletme@salonor.com</span>{" "}
          adresine yazabilir veya kayıt sayfasından hemen başlayabilirsin.
        </p>
      </Section>
    </InfoPage>
  );
}
