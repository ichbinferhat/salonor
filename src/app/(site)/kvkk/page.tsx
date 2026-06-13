import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";

export const metadata: Metadata = { title: "Gizlilik & KVKK" };

export default function Page() {
  return (
    <InfoPage
      title="Gizlilik ve KVKK Aydınlatma Metni"
      updated="13 Haziran 2026"
      intro="Kişisel verilerinin güvenliği bizim için önemlidir. Bu metin, Salonor'u kullanırken verilerinin nasıl işlendiğini özetler."
    >
      <Section title="Veri sorumlusu">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri
          sorumlusu Salonor Teknoloji A.Ş.'dir. Sorularını destek@salonor.com
          adresine iletebilirsin.
        </p>
      </Section>
      <Section title="İşlenen veriler">
        <p>
          Hesap bilgilerin (ad, e-posta, telefon), randevu geçmişin, favori
          salonların ve yazdığın yorumlar; ayrıca hizmet kalitesi için temel
          kullanım verileri işlenir.
        </p>
      </Section>
      <Section title="İşleme amaçları">
        <p>
          Randevularını oluşturmak ve yönetmek, sana randevu hatırlatmaları
          (SMS/WhatsApp/e-posta) göndermek, hesabının güvenliğini sağlamak ve
          platformu geliştirmek için verilerini işleriz.
        </p>
      </Section>
      <Section title="Paylaşım">
        <p>
          Randevu aldığın işletmeyle, randevunu gerçekleştirmek için gerekli
          bilgiler paylaşılır. Verilerin pazarlama amacıyla üçüncü taraflara
          satılmaz.
        </p>
      </Section>
      <Section title="Haklarınız">
        <p>
          KVKK 11. madde uyarınca verilerine erişme, düzeltme, silme ve işlemeye
          itiraz etme hakların vardır. Taleplerin için destek@salonor.com.
        </p>
      </Section>
    </InfoPage>
  );
}
