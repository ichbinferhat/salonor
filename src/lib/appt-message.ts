import { formatDateTr, minToHHMM } from "./datetime";

/**
 * Müşteriye giden WhatsApp randevu mesajlarının (onay + hatırlatmalar) ortak biçimi.
 * Tek yerde tutulur ki üç mesaj da tutarlı ve "premium" görünsün: kişiselleştirilmiş
 * selam, haftanın günüyle tarih, hizmet(ler), personel, isteğe bağlı kod ve TEK-DOKUNUŞ
 * iptal linki (rakipler "aramak için bizi arayın" derken bizde tek tık).
 */
export function buildApptMessage(i: {
  intro: string; // "✅ Randevunuz oluşturuldu!" / "🔔 Randevu hatırlatması"
  lead: string; // greet'ten sonraki cümle, ör. "yarın Salon X randevunuz var:"
  customerName?: string | null;
  date: string; // YYYY-MM-DD
  startMin: number;
  services?: string | null; // "Saç Kesimi, Sakal Tıraşı"
  staffName?: string | null;
  code?: string | null; // yalnız onay mesajında
  cancelUrl: string;
  closing?: string; // ör. "Görüşmek üzere! 🙌"
}): string {
  const dateLabel = formatDateTr(i.date, { weekday: "long", day: "numeric", month: "long" });
  const greet = i.customerName?.trim() ? `Sayın ${i.customerName.trim()}, ` : "";
  const lines: (string | false)[] = [
    i.intro,
    "",
    `${greet}${i.lead}`,
    "",
    `📅 ${dateLabel}`,
    `🕐 ${minToHHMM(i.startMin)}`,
    i.services ? `💇 ${i.services}` : false,
    i.staffName ? `👤 ${i.staffName}` : false,
    i.code ? `🔖 Kod: ${i.code}` : false,
    "",
    "Gelemeyecekseniz tek dokunuşla iptal edebilirsiniz:",
    i.cancelUrl,
  ];
  if (i.closing) lines.push("", i.closing);
  return lines.filter((l) => l !== false).join("\n");
}
