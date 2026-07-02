/**
 * Randevu WhatsApp mesajlarının çok-dilli metinleri. Müşterinin TELEFON ÜLKESİNE göre
 * seçilir (bkz. lib/phone.ts langFromPhone) — Alman no → Almanca, Fransız → Fransızca...
 *
 * Çeviriler çok-ajanlı akışla üretildi ve her biri ANA DİL gözüyle doğrulandı/düzeltildi
 * (kusursuzluk hedefi). {name} ve {salon} yer tutucuları çalışma zamanında doldurulur.
 * Yeni dil eklerken: hem buraya metin hem lib/phone.ts DIAL_TO_LANG + APPT_LOCALE ekle.
 */

export type ApptMsgStrings = {
  introConfirm: string; // onay başlığı
  introReminder: string; // hatırlatma başlığı
  greeting: string; // {name} içerir; lead'in önüne gelir
  leadConfirm: string; // {salon} içerir (onay)
  leadDayBefore: string; // {salon} içerir (yarın)
  lead3hToday: string; // {salon} içerir (bugün ~3 saat kala)
  labelCode: string; // onay kodu etiketi
  cancelLine: string; // iptal linkinden önceki satır
  closing: string; // kapanış (yalnız onayda)
};

/** Dil → BCP47 (tarih biçimlendirme için). */
export const APPT_LOCALE: Record<string, string> = {
  tr: "tr-TR",
  de: "de-DE",
  nl: "nl-NL",
  fr: "fr-FR",
  en: "en-GB",
  sv: "sv-SE",
  da: "da-DK",
  no: "nb-NO",
  it: "it-IT",
  es: "es-ES",
};

export const APPT_MESSAGES: Record<string, ApptMsgStrings> = {
  tr: {
    introConfirm: "✅ Randevunuz oluşturuldu!",
    introReminder: "🔔 Randevu hatırlatması",
    greeting: "Sayın {name},",
    leadConfirm: "{salon} randevu detaylarınız:",
    leadDayBefore: "yarın {salon} randevunuz var:",
    lead3hToday: "bugün {salon} randevunuz yaklaşıyor:",
    labelCode: "Kod:",
    cancelLine: "Gelemeyecekseniz tek dokunuşla iptal edebilirsiniz:",
    closing: "Görüşmek üzere! 🙌",
  },
  de: {
    introConfirm: "✅ Ihr Termin ist gebucht!",
    introReminder: "🔔 Terminerinnerung",
    greeting: "Guten Tag {name},",
    leadConfirm: "hier sind Ihre Termindetails bei {salon}:",
    leadDayBefore: "morgen haben Sie einen Termin bei {salon}:",
    lead3hToday: "heute steht Ihr Termin bei {salon} bald an:",
    labelCode: "Code:",
    cancelLine: "Falls Sie verhindert sind, können Sie mit einem Klick absagen:",
    closing: "Wir freuen uns auf Sie! 🙌",
  },
  nl: {
    introConfirm: "✅ Uw afspraak is bevestigd!",
    introReminder: "🔔 Herinnering voor uw afspraak",
    greeting: "Beste {name},",
    leadConfirm: "hier zijn de details van uw afspraak bij {salon}:",
    leadDayBefore: "u heeft morgen een afspraak bij {salon}:",
    lead3hToday: "uw afspraak bij {salon} komt er vandaag aan:",
    labelCode: "Code:",
    cancelLine: "Kunt u niet komen? Dan kunt u met één tik annuleren:",
    closing: "Tot snel! 🙌",
  },
  fr: {
    introConfirm: "✅ Votre rendez-vous est confirmé !",
    introReminder: "🔔 Rappel de rendez-vous",
    greeting: "Bonjour {name},",
    leadConfirm: "voici les détails de votre rendez-vous chez {salon} :",
    leadDayBefore: "vous avez rendez-vous demain chez {salon} :",
    lead3hToday: "votre rendez-vous chez {salon} approche, c'est aujourd'hui :",
    labelCode: "Code :",
    cancelLine: "Si vous ne pouvez pas venir, annulez en un seul clic :",
    closing: "À très bientôt ! 🙌",
  },
  en: {
    introConfirm: "✅ Your appointment is confirmed!",
    introReminder: "🔔 Appointment reminder",
    greeting: "Dear {name},",
    leadConfirm: "here are your booking details at {salon}:",
    leadDayBefore: "you have an appointment at {salon} tomorrow:",
    lead3hToday: "your appointment at {salon} is coming up today:",
    labelCode: "Code:",
    cancelLine: "If you're unable to make it, you can cancel with a single tap:",
    closing: "See you soon! 🙌",
  },
  sv: {
    introConfirm: "✅ Din tid är bokad!",
    introReminder: "🔔 Påminnelse om din tid",
    greeting: "Hej {name},",
    leadConfirm: "här är detaljerna för din tid hos {salon}:",
    leadDayBefore: "imorgon har du en tid hos {salon}:",
    lead3hToday: "din tid hos {salon} närmar sig idag:",
    labelCode: "Kod:",
    cancelLine: "Om du får förhinder kan du avboka med ett enda tryck:",
    closing: "Vi ses! 🙌",
  },
  da: {
    introConfirm: "✅ Din tid er booket!",
    introReminder: "🔔 Påmindelse om din tid",
    greeting: "Kære {name},",
    leadConfirm: "her er detaljerne for din tid hos {salon}:",
    leadDayBefore: "du har en tid hos {salon} i morgen:",
    lead3hToday: "din tid hos {salon} nærmer sig i dag:",
    labelCode: "Kode:",
    cancelLine: "Er du forhindret, kan du aflyse med et enkelt tryk:",
    closing: "Vi ses! 🙌",
  },
  no: {
    introConfirm: "✅ Timen din er booket!",
    introReminder: "🔔 Påminnelse om time",
    greeting: "Hei {name},",
    leadConfirm: "her er detaljene for timen din hos {salon}:",
    leadDayBefore: "du har time hos {salon} i morgen:",
    lead3hToday: "timen din hos {salon} nærmer seg i dag:",
    labelCode: "Kode:",
    cancelLine: "Hvis du ikke kan komme, kan du avbestille med ett trykk:",
    closing: "Vi gleder oss til å se deg! 🙌",
  },
  it: {
    introConfirm: "✅ Appuntamento confermato!",
    introReminder: "🔔 Promemoria appuntamento",
    greeting: "Gentile {name},",
    leadConfirm: "ecco i dettagli del tuo appuntamento da {salon}:",
    leadDayBefore: "domani hai un appuntamento da {salon}:",
    lead3hToday: "il tuo appuntamento di oggi da {salon} si avvicina:",
    labelCode: "Codice:",
    cancelLine: "Se non puoi venire, puoi disdire con un solo tocco:",
    closing: "A presto! 🙌",
  },
  es: {
    introConfirm: "✅ ¡Tu cita está confirmada!",
    introReminder: "🔔 Recordatorio de tu cita",
    greeting: "Hola {name},",
    leadConfirm: "estos son los detalles de tu cita en {salon}:",
    leadDayBefore: "mañana tienes tu cita en {salon}:",
    lead3hToday: "tu cita de hoy en {salon} ya se acerca:",
    labelCode: "Código:",
    cancelLine: "Si no puedes asistir, puedes cancelarla con un solo toque:",
    closing: "¡Te esperamos! 🙌",
  },
};
