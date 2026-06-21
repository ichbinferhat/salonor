export const panelOther = {
  // === Müşteriler sayfası ===
  customers: {
    title: "Müşteriler",
    subtitle: "{n} müşteri",
    // CustomersTable
    emptyTitle: "Henüz müşterin yok",
    emptyDesc: "Randevular geldikçe müşterilerin burada listelenecek.",
    searchPlaceholder: "İsim, telefon veya e-posta ara",
    sortLastVisit: "Son ziyaret",
    sortVisits: "Ziyaret sayısı",
    sortSpend: "Harcama",
    noMatch: "“{q}” ile eşleşen müşteri bulunamadı.",
    colCustomer: "Müşteri",
    colContact: "İletişim",
    colVisit: "Ziyaret",
    colCompleted: "Tamamlanan",
    colNoShow: "Gelmedi",
    colSpend: "Harcama",
    colLastVisit: "Son ziyaret",
    salonCustomer: "Salon müşterisi",
    visitsLabel: "{n} ziyaret",
    completedLabel: "{n} tamamlanan",
    noShowLabel: "{n} gelmedi",
  },

  // === Yorumlar sayfası ===
  reviews: {
    title: "Yorumlar",
    subtitle: "{count} yorum · {unanswered} yanıtlanmamış",
    adminHidden: "Yönetici gizledi",
    emptyTitle: "Henüz yorum yok",
    emptyDesc: "Tamamlanan randevulardan sonra müşterilerin yorumları burada görünecek.",
    // ReviewReply
    repliedSuffix: "yanıtladı",
    edit: "Düzenle",
    reply: "Yanıtla",
    replyPlaceholder: "Müşteriye nazik bir yanıt yaz...",
    cancel: "Vazgeç",
    sending: "Gönderiliyor...",
    saveReply: "Yanıtı kaydet",
    // DeleteReviewButton / ReportReviewButton
    deleteConfirm: "Bu yorumu silmek istediğine emin misin? Bu işlem geri alınamaz.",
    deleteAria: "Yorumu sil",
    delete: "Sil",
    reported: "Şikayet edildi",
    reportConfirm: "Bu yorumu yöneticiye şikayet et? Yorum silinmez, yalnızca inceleme için işaretlenir.",
    reportAria: "Yorumu şikayet et",
    report: "Şikayet et",
  },

  // === SMS sayfası ===
  sms: {
    title: "SMS",
    subtitle: "Randevu teyit ve toplu bilgilendirme mesajları",
    creditBalance: "Kontör bakiyesi",
    mockTitle: "Test (mock) modu",
    mockDesc:
      "SMS sağlayıcı anahtarı henüz tanımlı değil. Gönderimler kontör düşer ve geçmişe işlenir ama gerçek SMS iletilmez. Gerçek gönderim için sağlayıcı bilgilerini ortam değişkenlerine ekleyin (Netgsm: ",
    mockDescEnd: ").",
    historyTitle: "Gönderim geçmişi",
    historyEmpty: "Henüz SMS gönderilmedi.",
    colNumber: "Numara",
    colMessage: "Mesaj",
    colKind: "Tür",
    colStatus: "Durum",
    colDate: "Tarih",
    // KIND_TR
    kindManual: "Manuel",
    kindConfirm: "Randevu teyit",
    kindReminder: "Hatırlatma",
    kindBulk: "Toplu",
    // StatusBadge
    statusSent: "Gönderildi",
    statusMock: "Test",
    statusFailed: "Başarısız",
    statusQueued: "Sırada",
    // SmsSender
    messageTitle: "Mesaj",
    messagePlaceholder: "Örn. {business} olarak bu hafta size özel %15 indirim!",
    charsCredits: "{chars} karakter · {credits} kontör/SMS",
    charsLeft: "{n} kaldı",
    template: "Şablon {n}",
    extraNumbersLabel: "Ek numaralar (virgül veya boşlukla ayır)",
    extraNumbersPlaceholder: "0532..., 0505...",
    invalidNumbers: "{n} numara geçersiz, gönderilmeyecek: ",
    recipientCount: "{n} alıcı",
    totalCredits: "Toplam {n} kontör",
    sending: "Gönderiliyor...",
    send: "Gönder",
    contactsTitle: "Müşteriler ({n})",
    deselect: "Seçimi kaldır",
    selectAll: "Tümünü seç",
    searchPlaceholder: "İsim / telefon ara",
    contactsEmpty: "Telefonlu müşteri kaydı oluştukça burada listelenecek.",
    errorEmptyBody: "Mesaj metni gir.",
    errorNoRecipient: "En az bir geçerli alıcı seç veya numara gir.",
    errorInsufficient: "Yetersiz kontör. Gerekli: {needed}, mevcut: {have}.",
    resultSent: "{sent} gönderildi",
    resultFailed: ", {failed} başarısız",
    fallbackCustomer: "Müşteri",
    // Sunucu aksiyonu hata mesajları (sendBulkSmsAction)
    errorUnauthorized: "Yetkisiz.",
    errorBodyEmpty: "Mesaj metni gir.",
    errorBodyTooLong: "Mesaj çok uzun (en fazla 500 karakter).",
    errorNoValidNumber: "Geçerli en az bir numara gir.",
    errorInsufficientCredits: "Kontör yetersiz.",
    // Templates
    templateText1: "Sevgili müşterimiz, bu hafta tüm hizmetlerde %15 indirim sizi bekliyor. Randevu için bize ulaşın.",
    templateText2: "Randevunuzu hatırlatırız. Sizi salonumuzda görmekten mutluluk duyarız.",
    templateText3: "Yeni hizmetlerimiz ve kampanyalarımızdan ilk siz haberdar olun!",
  },

  // === Mesajlaşma merkezi sayfası ===
  messaging: {
    title: "Mesajlaşma",
    subtitle: "Müşterilerine randevu hatırlatması ve bilgilendirme gönder — çok kanallı",
    introBadge: "Çok kanallı bildirim",
    introTitle: "Müşterine doğru kanaldan ulaş",
    introDesc:
      "Salonor iki kanalı bir arada sunar: bugün ücretsiz WhatsApp, firmanı kurunca otomatik SMS. İkisini birlikte kullanarak hiçbir randevuyu kaçırma.",

    // Durum rozetleri
    statusActive: "Aktif",
    statusLocked: "Firma gelince açılır",
    statusTest: "Test modu",

    // WhatsApp kartı
    waName: "WhatsApp",
    waTagline: "Ücretsiz · manuel gönderim · şimdi hazır",
    waDesc:
      "Randevu hatırlatması ve kayıp müşteri mesajlarını tek dokunuşla, kendi telefonundan ücretsiz gönder. Kurulum gerekmez.",
    waPoint1: "Sıfır maliyet — kontör yok",
    waPoint2: "Yüksek okunma oranı",
    waPoint3: "Görsel ve bağlantı paylaşabilirsin",
    waNumberLabel: "Salon WhatsApp numarası",
    waNumberMissing: "Özel numara girilmedi — telefon numaran kullanılıyor",
    waNumberSet: "Ayarla / değiştir",
    waCtaReminders: "Hatırlatmalara git",
    waCtaLost: "Kayıp müşterileri geri kazan",
    waPublicNote: "Salon sayfanda müşterilerin sana WhatsApp'tan ulaşabilmesi için butonu da açtık.",

    // SMS kartı
    smsName: "SMS",
    smsTagline: "Otomatik · her telefonda çalışır",
    smsDesc:
      "Randevu teyidi ve toplu bilgilendirmeyi SMS ile gönder. Uygulama gerektirmez, her telefona ulaşır.",
    smsPoint1: "Tam otomatik gönderim",
    smsPoint2: "App gerekmez — her telefona ulaşır",
    smsPoint3: "Profesyonel gönderici adı",
    smsCreditLabel: "Kontör bakiyesi",
    smsCta: "SMS paneline git",
    smsLockedNote:
      "SMS gönderimi için şahıs/limited firma ve İYS (İleti Yönetim Sistemi) kaydı gerekir. Firmanı kurup sağlayıcı bilgilerini girince bu kanal otomatik açılır.",
    smsTestNote:
      "Şu an test modunda: akışı deneyebilirsin, kontör düşer ama gerçek SMS iletilmez.",

    // Karşılaştırma
    compareTitle: "Hangi kanal ne zaman?",
    compareCol: "Özellik",
    rowCost: "Maliyet",
    rowCostWa: "Ücretsiz",
    rowCostSms: "Kontör başına",
    rowSetup: "Kurulum",
    rowSetupWa: "Hazır",
    rowSetupSms: "Firma + İYS",
    rowAuto: "Gönderim",
    rowAutoWa: "Manuel",
    rowAutoSms: "Otomatik",
    rowReach: "Erişim",
    rowReachWa: "WhatsApp'lı müşteriler",
    rowReachSms: "Her telefon",

    // Yol haritası
    roadmapTitle: "Önerilen yol",
    recommendedBadge: "Önerilen",
    roadmapNowTitle: "Şimdi: WhatsApp",
    roadmapNowDesc:
      "Sıfır maliyetle başla. Hatırlatmaları WhatsApp'tan gönder, müşteri memnuniyetini hemen artır.",
    roadmapNextTitle: "Sonra: SMS",
    roadmapNextDesc:
      "Gelir gelip firmanı kurunca SMS'i aç; hatırlatmalar otomatikleşsin, manuel uğraş bitsin.",
  },

  // === Yapılacaklar sayfası ===
  todos: {
    title: "Yapılacaklar Listesi",
    subtitle: "İşletmenin günlük görev ve hatırlatmaları",
    statOpen: "Bekleyen görev",
    statDone: "Tamamlanan",
    addTitle: "Görev ekle",
    listTitle: "Görevler ({n})",
    emptyTitle: "Henüz görev yok",
    emptyDesc: "Soldaki formla ilk görevini ekle.",
    overduePrefix: "Gecikti · ",
    // Öncelik etiketleri
    priorityHigh: "Yüksek",
    priorityNormal: "Normal",
    priorityLow: "Düşük",
    // TodoForm
    taskLabel: "Görev",
    taskPlaceholder: "Örn. Tedarikçiyi ara",
    priorityLabel: "Öncelik",
    dueDateLabel: "Son tarih",
    adding: "Ekleniyor...",
    addButton: "Görev ekle",
    // TodoToggle
    undo: "Geri al",
    markDone: "Tamamlandı işaretle",
    deleteAria: "Görevi sil",
    clearDone: "Tamamlananları temizle ({n})",
  },

  // === Kampanyalar sayfası ===
  campaigns: {
    title: "Kampanyalar",
    subtitle: "İndirim kodları ile yeni müşteri çek",
    createTitle: "Kampanya oluştur",
    listTitle: "Kampanyalar ({n})",
    emptyTitle: "Henüz kampanya yok",
    emptyDesc: "Soldaki formla ilk indirim kodunu oluştur.",
    expired: "Süresi doldu",
    usedCount: "{n} kez kullanıldı",
    endedOn: " · {date} tarihinde bitti",
    endsOn: " · {date} bitiyor",
    noExpiry: " · süresiz",
  },

  // === AI Analiz sayfası ===
  ai: {
    title: "AI Analiz",
    subtitle: "İşletme verilerinden otomatik çıkarılan içgörüler ve öneriler",
    smartBadge: "Akıllı analiz",
    collectingTitle: "Analiz için veri toplanıyor",
    collectingDesc:
      "Randevular ve satışlar biriktikçe gelir trendi, yoğunluk, personel performansı ve sana özel öneriler burada belirir.",
    metricRevenue: "30 günlük gelir",
    metricRevenueSub: "{pct}% önceki döneme göre",
    metricBusiest: "En yoğun zaman",
    metricBusiestSub: "{time} civarı",
    metricAvgTicket: "Ortalama sepet",
    metricAvgTicketSub: "işlem başına",
    metricAtRisk: "Riskli müşteri",
    metricAtRiskSub: "30+ gündür gelmeyen",
    none: "—",
    topServicesTitle: "En çok kazandıran hizmetler",
    notEnoughData: "Yeterli veri yok.",
    transactions: "{n} işlem",
    staffPerfTitle: "Personel performansı (60 gün)",
    staffCompleted: "{n} tamamlanan randevu",
    // AiInsights bileşeni
    insightsTitle: "Sana özel öneriler",
    geminiBadge: "Gemini AI",
    refresh: "Yenile",
    analyzing: "Yapay zeka işletme verilerini analiz ediyor…",
    aiUnavailable:
      "Yapay zeka analizi şu an alınamadı ({reason}) — kural-tabanlı öneriler gösteriliyor.",
    aiNotConfigured:
      "Yapay zeka analizi yapılandırılmamış — kural-tabanlı öneriler gösteriliyor.",
    // businessInsightsAction hata mesajları
    errorUnauthorized: "Yetkisiz.",
    errorTooFrequent: "Çok sık yenilendi, biraz sonra tekrar dene.",
    errorNoData: "Yeterli veri yok.",
    errorNoSuggestion: "Öneri üretilemedi.",
    errorInsightsFailed: "AI önerileri alınamadı.",
    // Kural-tabanlı öneri metinleri (içgörü motoru)
    tipRevenueDown: "Gelir son 30 günde %{pct} düştü. ",
    tipRevenueDownAtRisk: "{n} müşteri uzun süredir gelmiyor — SMS ile bir kampanya gönder.",
    tipRevenueDownLoyal: "Sadık müşterilere özel bir kampanya düşün.",
    tipRevenueUp: "Gelir yükselişte (%{pct}). İvmeyi korumak için en çok kazandıran hizmetlere odaklan.",
    tipBusiestHour: "En yoğun saat {time} civarı. Bu saatlere ek personel planlayarak bekleme süresini azalt.",
    tipQuietDays: "Sakin günlere özel indirimle talebi haftaya yay; yoğun günlerdeki yükü dengele.",
    tipAtRisk: "{n} riskli müşteri var (30+ gündür gelmiyor). Para Puan + SMS ile geri kazan.",
    tipLowStock: "{n} üründe stok kritik: {names}. Sipariş zamanı.",
    tipNoShow: "No-show oranı %{pct} ile yüksek. Randevu teyit SMS'i ile gelmeyenleri azaltabilirsin.",
    tipTopService: "“{name}” en çok kazandıran hizmetin. Paket veya üst-satış (upsell) ile değerini artır.",
    tipNoData: "Veri biriktikçe burada işletmene özel akıllı öneriler göreceksin. Randevu ve satışları kaydetmeye devam et.",
  },

  // === Kayıp Müşteri sayfası ===
  lost: {
    title: "Kayıp Müşteri",
    subtitle: "{days}+ gündür gelmeyen müşteriler — WhatsApp ile geri kazan",
    fallbackCustomer: "Salon müşterisi",
    emptyTitle: "Harika — kayıp müşterin yok!",
    emptyDesc: "Tüm müşterilerin son {days} gün içinde uğramış. Böyle devam!",
    waMessage:
      "Merhaba {name}, {business} olarak sizi özledik! 💜 Tekrar ağırlamaktan mutluluk duyarız — size özel bir fırsatımız var, randevu için bekliyoruz.",
    lastVisit: "Son ziyaret: {date} · ",
    daysAgo: "{n} gün önce",
    visits: "{n} ziyaret",
    recover: "Geri kazan",
    noPhone: "Telefon yok",
  },
};
