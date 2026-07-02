import { minToHHMM } from "./datetime";
import { APPT_MESSAGES, APPT_LOCALE } from "./appt-message-i18n";

/**
 * Müşteriye giden WhatsApp randevu mesajlarının (onay + hatırlatmalar) ortak biçimi.
 * ÇOK DİLLİ: `lang` (müşterinin telefon ülkesinden, bkz. phone.ts langFromPhone) mesajı
 * o dilde kurar; tarih de o dilin biçiminde yazılır. Metinler appt-message-i18n.ts'te.
 *
 * Biçim (rakiplerden üstün): kişiselleştirilmiş selam, haftanın günüyle tarih,
 * hizmet(ler), personel, isteğe bağlı kod ve TEK-DOKUNUŞ iptal linki.
 */
export type ApptKind = "confirm" | "dayBefore" | "3hToday" | "3hTomorrow";

export function buildApptMessage(i: {
  kind: ApptKind;
  lang?: string; // "de","fr"... yoksa "tr"
  customerName?: string | null;
  businessName: string;
  date: string; // YYYY-MM-DD
  startMin: number;
  services?: string | null;
  staffName?: string | null;
  code?: string | null; // yalnız onayda
  cancelUrl: string;
}): string {
  const lang = i.lang && APPT_MESSAGES[i.lang] ? i.lang : "tr";
  const t = APPT_MESSAGES[lang];
  const locale = APPT_LOCALE[lang] ?? "tr-TR";

  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(i.date + "T12:00:00Z"));

  const intro = i.kind === "confirm" ? t.introConfirm : t.introReminder;
  const leadTpl =
    i.kind === "confirm" ? t.leadConfirm : i.kind === "3hToday" ? t.lead3hToday : t.leadDayBefore;
  const lead = leadTpl.replace("{salon}", i.businessName);

  const name = i.customerName?.trim();
  const firstLine = name
    ? `${t.greeting.replace("{name}", name)} ${lead}`
    : lead.charAt(0).toUpperCase() + lead.slice(1); // isim yoksa lead'i cümle başı yap

  const lines: (string | false)[] = [
    intro,
    "",
    firstLine,
    "",
    `📅 ${dateLabel}`,
    `🕐 ${minToHHMM(i.startMin)}`,
    i.services ? `💇 ${i.services}` : false,
    i.staffName ? `👤 ${i.staffName}` : false,
    i.code ? `🔖 ${t.labelCode} ${i.code}` : false,
    "",
    t.cancelLine,
    i.cancelUrl,
  ];
  if (i.kind === "confirm") lines.push("", t.closing);
  return lines.filter((l) => l !== false).join("\n");
}
