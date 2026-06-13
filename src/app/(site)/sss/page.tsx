import type { Metadata } from "next";
import { InfoPage, Section } from "@/components/legal/info-page";

export const metadata: Metadata = { title: "Yardım & Sıkça Sorulan Sorular" };

const FAQ: [string, string][] = [
  [
    "Salonor'u kullanmak ücretli mi?",
    "Hayır. Misafirler için randevu almak tamamen ücretsizdir; sadece salonda aldığın hizmetin bedelini ödersin.",
  ],
  [
    "Randevumu nasıl iptal ederim?",
    "Hesabım → Randevularım bölümünden randevunu görüntüleyip iptal edebilirsin. İptal koşulları işletmeye göre değişebilir.",
  ],
  [
    "Randevu hatırlatması alacak mıyım?",
    "Evet. Randevun yaklaştığında seçtiğin kanaldan (SMS, WhatsApp veya e-posta) hatırlatma gönderilir.",
  ],
  [
    "Yorumlar gerçek mi?",
    "Yorumlar yalnızca randevusunu tamamlamış misafirler tarafından yazılır; böylece gördüğün puanlar gerçek deneyimlere dayanır.",
  ],
  [
    "İşletmemi nasıl eklerim?",
    "İşletmeniz için Salonor sayfasından ücretsiz kaydol; 5 dakikalık kurulumla salonunu yayına alabilirsin.",
  ],
];

export default function Page() {
  return (
    <InfoPage
      title="Yardım & Sıkça Sorulan Sorular"
      intro="Aklındaki çoğu sorunun yanıtı burada. Bulamazsan destek@salonor.com her zaman açık."
    >
      {FAQ.map(([q, a]) => (
        <Section key={q} title={q}>
          <p>{a}</p>
        </Section>
      ))}
    </InfoPage>
  );
}
