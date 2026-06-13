import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";

export const metadata: Metadata = { title: "Hakkımızda" };

export default function Page() {
  return (
    <InfoPage
      title="Hakkımızda"
      intro="Salonor, güzellik ve kişisel bakım randevularını saniyeler içinde almanı sağlayan, Türkiye için tasarlanmış bir randevu platformudur."
    >
      <Section title="Misyonumuz">
        <p>
          Kuaför, berber, spa, tırnak ve güzellik hizmetlerine ulaşmayı herkes
          için kolay, şeffaf ve güvenilir hâle getirmek istiyoruz. Telefonla
          randevu kovalama dönemini bitiriyor; uygun saati, gerçek yorumları ve
          net fiyatları tek ekranda topluyoruz.
      </p>
      </Section>
      <Section title="Müşteriler için">
        <p>
          Çevrendeki en iyi salonları keşfet, fotoğraflara ve doğrulanmış
          yorumlara göz at, sana uyan saati seç ve yerini anında ayırt — üstelik
          tamamen ücretsiz.
        </p>
      </Section>
      <Section title="İşletmeler için">
        <p>
          Salonor Business ile randevu, takvim, personel ve hizmet yönetimini tek
          panelde topla; 7/24 online randevu al, yorumlarla güven kazan ve yeni
          müşterilere ulaş.
        </p>
      </Section>
      <Section title="Değerlerimiz">
        <p>
          Şeffaflık, hız ve güven. Hem misafirlerin hem de işletmelerin kazandığı,
          adil ve kullanışlı bir pazar yeri kurmak için çalışıyoruz.
        </p>
      </Section>
    </InfoPage>
  );
}
