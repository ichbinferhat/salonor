// Randevu akışı (booking) namespace — randevu sihirbazı, AI stil danışmanı,
// akış layout'u ve randevu sayfası meta başlığı için statik arayüz metinleri.
// Kullanıcı/DB verisi (salon adı, hizmet adı, fiyat, tarih) buraya TAŞINMAZ.

export const booking = {
  // Randevu sayfası meta başlığı
  metaTitle: "Randevu al",

  // Akış layout'u başlığı
  secureHeader: "Güvenli randevu · Salonor",

  // Sihirbaz adımları
  steps: {
    services: "Hizmetler",
    staff: "Personel",
    dateTime: "Tarih & Saat",
    confirm: "Onay",
  },

  // Başarı ekranı
  success: {
    title: "Randevun onaylandı!",
    codeLabel: "Randevu kodun",
    viewAppointments: "Randevularımı gör",
    backHome: "Ana sayfaya dön",
  },

  // Adım 1: Hizmetler
  services: {
    heading: "Hizmet seç",
  },

  // Adım 2: Personel
  staff: {
    heading: "Personel seç",
    anyTitle: "Farketmez",
    anyDesc: "Müsait olan ilk personel",
    noEligible:
      'Seçtiğin hizmet kombinasyonunu tek başına verebilen personel yok. "Farketmez" ile devam edebilir veya hizmet seçimini değiştirebilirsin.',
  },

  // Adım 3: Tarih & Saat
  dateTime: {
    heading: "Tarih ve saat seç",
    noStaffForCombo: "Seçtiğin hizmetlerin tümünü tek bir personel veremiyor.",
    noStaffForComboHint: "Hizmetleri ayrı randevularda almayı ya da seçimini değiştirmeyi dene.",
    noSlots: "Bu günde uygun saat kalmamış.",
    noSlotsHint: "Başka bir gün seçmeyi dene.",
    noOpenDays: "Bu salon önümüzdeki 14 gün boyunca kapalı görünüyor.",
    noOpenDaysHint: "Şu an çevrim içi randevu alınamıyor. Lütfen salonla doğrudan iletişime geç.",
    slotLoadError: "Uygun saatler yüklenemedi.",
    retry: "Tekrar dene",
    morning: "Sabah",
    afternoon: "Öğleden sonra",
    evening: "Akşam",
  },

  // Adım 4: Onay
  confirm: {
    heading: "Randevunu onayla",
    anyStaff: "Müsait personel",
    discountLine: "İndirim · %{pct}",
    totalLabel: "Toplam · {duration}",
    couponQuestion: "İndirim kodun var mı?",
    couponApplied: "{code} · %{pct} indirim uygulandı",
    couponRemove: "Kaldır",
    couponPlaceholder: "KOD",
    couponApply: "Uygula",
    contactHeading: "İletişim bilgilerin",
    nameLabel: "Ad Soyad",
    namePlaceholder: "Adın Soyadın",
    phoneLabel: "Telefon",
    phoneLabelOptional: "Telefon (isteğe bağlı)",
    phonePlaceholder: "05XX XXX XX XX",
    phoneHint: "Randevu onayı ve hatırlatma için SMS/WhatsApp göndereceğiz.",
    noteLabel: "Not (isteğe bağlı)",
    notePlaceholder: "Salona iletmek istediğin bir not var mı?",
    submitBooking: "Randevuyu onayla — {total}",
    submitting: "Onaylanıyor...",
    paymentNote: "Ödeme salonda yapılır. Ücretsiz iptal hakkın var.",
    consentBefore: "Randevu oluşturmak için verdiğim kişisel verilerin ",
    consentLink: "KVKK Aydınlatma Metni",
    consentAfter: " kapsamında işlenmesini ve randevu için ilgili salonla paylaşılmasını kabul ediyorum.",
  },

  // Hata mesajları
  errors: {
    nameRequired: "Lütfen adını ve soyadını gir.",
    phoneRequired: "SMS ile onay gönderebilmemiz için geçerli bir cep numarası gir (05XX XXX XX XX).",
    connection: "Bağlantı hatası oluştu. Lütfen tekrar dene.",
    consentRequired: "Devam etmek için aydınlatma onayını işaretlemen gerekiyor.",
  },

  // Özet kartı (sidebar) ve mobil bar
  summary: {
    noServices: "Henüz hizmet seçilmedi.",
    continue: "Devam et",
    servicesCount: "{count} hizmet · {total}",
  },

  // Genel
  ellipsis: "...",

  // İndirim kodu rezervasyon anında geçersizleşirse (süresi dolmuş/pasif) gösterilir.
  couponDropped:
    "İndirim kodun rezervasyon sırasında geçerliliğini yitirdiği için uygulanamadı. Randevun tam ücret üzerinden oluşturuldu.",

  // AI Stil Danışmanı
  advisor: {
    cardTitle: "AI Stil Danışmanı",
    newBadge: "Yeni",
    cardDesc: "Fotoğrafını yükle, sana en uygun stili önerelim",
    modalTitle: "AI Stil Danışmanı",
    intro: "Net bir yüz/saç fotoğrafı yükle. Yapay zeka yüz şeklini ve saç tipini değerlendirip",
    introStrong: "bu salonun hizmetleri",
    introEnd: "arasından sana özel öneri yapsın.",
    uploadCta: "Fotoğraf yükle",
    uploadHint: "JPG / PNG · en fazla 5MB",
    previewAlt: "Önizleme",
    changePhoto: "Başka fotoğraf seç",
    prefsPlaceholder: "İsteğe bağlı: örn. 'kısa ve bakımı kolay olsun'",
    analyzing: "Analiz ediliyor…",
    suggestCta: "Stilimi öner",
    evaluation: "Değerlendirme",
    selectAndContinue: "Bu hizmeti seç ve devam et",
    noMatchedService:
      "Bu salonda birebir eşleşen bir saç hizmeti bulunamadı — aşağıdan uygun hizmeti elle seçebilirsin.",
    reanalyze: "Yeniden analiz et",
    disclaimer: "Yapay zeka önerileri bilgilendirme amaçlıdır; son kararı uzmanınla birlikte ver.",
    consent:
      "Fotoğrafımın stil önerisi üretmek amacıyla yapay zeka servisine (Google, yurt dışı) gönderilip işlenmesini kabul ediyorum.",
    consentRequired: "Devam etmek için onay kutusunu işaretlemen gerekiyor.",
    photoLoadError: "Fotoğraf yüklenemedi, başka bir görsel dene.",
    genericError: "Bir hata oluştu, lütfen tekrar dene.",
  },
};
