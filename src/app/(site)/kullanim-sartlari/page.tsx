import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";

export const metadata: Metadata = { title: "Kullanım Şartları" };

export default function Page() {
  return (
    <InfoPage
      title="Kullanım Şartları"
      updated="13 Haziran 2026"
      intro="Salonor'u kullanarak aşağıdaki şartları kabul etmiş olursun."
    >
      <Section title="Hizmet">
        <p>
          Salonor, misafirlerle güzellik ve bakım işletmelerini buluşturan bir
          randevu platformudur. Hizmetler işletmeler tarafından sunulur; Salonor
          aracı konumundadır.
        </p>
      </Section>
      <Section title="Hesap">
        <p>
          Hesabının güvenliğinden ve verdiğin bilgilerin doğruluğundan sen
          sorumlusun. 18 yaşından küçükler veli onayıyla kullanmalıdır.
        </p>
      </Section>
      <Section title="Randevular ve iptal">
        <p>
          Aldığın randevulara zamanında gelmen beklenir. İptal ve değişiklik
          kuralları işletmeden işletmeye değişebilir; randevu sayfasındaki
          koşullar geçerlidir.
        </p>
      </Section>
      <Section title="Yorumlar">
        <p>
          Yalnızca gerçekten deneyimlediğin hizmetler için, dürüst ve saygılı
          yorumlar paylaşmalısın. Hakaret, spam ve yanıltıcı içerik kaldırılır.
        </p>
      </Section>
      <Section title="Sorumluluk">
        <p>
          Hizmetin niteliğinden ilgili işletme sorumludur. Salonor platformun
          kesintisiz çalışması için çaba gösterir ancak teknik aksaklıklar
          yaşanabilir.
        </p>
      </Section>
    </InfoPage>
  );
}
