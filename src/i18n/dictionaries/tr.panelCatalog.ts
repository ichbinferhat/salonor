export const panelCatalog = {
  // ── Hizmetler sayfası / ServicesManager ──
  services: {
    title: "Hizmetler",
    subtitle: "{count} hizmet · {sections} bölüm",
    addSection: "Bölüm",
    addService: "Hizmet ekle",
    addServiceShort: "Hizmet",
    emptyTitle: "Henüz bölüm yok",
    emptyDesc: 'Hizmetlerini gruplamak için önce bir bölüm oluştur (örn. "Kesim", "Renk").',
    addFirstSection: "İlk bölümü ekle",
    deleteSectionAria: "Bölümü sil",
    emptySection: "Bu bölümde henüz hizmet yok.",
    editAria: "Düzenle",
    deleteAria: "Sil",
    confirmDeleteSection: '"{name}" bölümü silinecek. Emin misin?',
    confirmDeleteService: '"{name}" hizmeti silinecek. Emin misin?',

    // Hizmet ekle/düzenle modalı
    modalEditTitle: "Hizmeti düzenle",
    modalNewTitle: "Yeni hizmet",
    sectionLabel: "Bölüm",
    nameLabel: "Hizmet adı",
    namePlaceholder: "Örn. Kadın Saç Kesimi",
    descLabel: "Açıklama (isteğe bağlı)",
    descPlaceholder: "Örn. Saç analizi + yıkama + kesim + fön dahil",
    durationLabel: "Süre (dk)",
    priceLabel: "Fiyat (₺)",
    cancel: "Vazgeç",
    save: "Kaydet",
    add: "Ekle",

    // Bölüm ekle modalı
    categoryModalTitle: "Yeni bölüm",
    categoryNameLabel: "Bölüm adı",
    categoryNamePlaceholder: "Örn. Kesim & Şekillendirme",
  },

  // ── Personel sayfası / StaffManager ──
  staff: {
    title: "Personel",
    subtitle: "{count} aktif personel",
    addStaff: "Personel ekle",
    emptyTitle: "Henüz personel yok",
    emptyDesc: "Ekibini ekle; randevular bu kişilere atanabilsin.",
    addFirstStaff: "İlk personeli ekle",
    inactiveBadge: "Pasif",
    summary: "{services} hizmet · {appointments} randevu",
    edit: "Düzenle",
    deactivate: "Pasifleştir",
    activate: "Aktifleştir",
    deleteAria: "Sil",
    confirmDeactivate:
      "{name} silinemez çünkü geçmiş randevuları var. Bunun yerine pasifleştirilecek. Devam edilsin mi?",
    confirmDelete:
      "{name} kalıcı olarak silinecek (prim ve hizmet atamaları dahil). Bu işlem geri alınamaz. Emin misin?",

    // Personel ekle/düzenle modalı
    modalEditTitle: "Personeli düzenle",
    modalNewTitle: "Yeni personel",
    nameLabel: "Ad Soyad",
    namePlaceholder: "Örn. Elif Aydın",
    titleLabel: "Ünvan",
    titlePlaceholder: "Örn. Renk Uzmanı",
    cancel: "Vazgeç",
    save: "Kaydet",
    add: "Ekle",
    saving: "Kaydediliyor...",

    // Hizmet atama (personelin yapabileceği hizmetler)
    manageServices: "Hizmetler",
    servicesModalTitle: "{name} — hizmetler",
    saveServices: "Hizmetleri kaydet",
    noServices: "Önce hizmet ekle; sonra personele atayabilirsin.",

    // Plan personel limiti
    staffLimitReached:
      "{plan} paketinde en fazla {limit} aktif personel ekleyebilirsin. Daha fazlası için paketini yükselt.",
  },

  // ── Ayarlar sayfası ──
  settings: {
    title: "Ayarlar",
    subtitle: "İşletme profilini ve çalışma saatlerini yönet",
    publicPage: "Yayındaki sayfam",
    businessInfo: "İşletme bilgileri",
    workingHours: "Çalışma saatleri",
    coverTitle: "Kapak fotoğrafı",
    coverDesc: "Salon sayfanın üst görselini seç. (Demo için hazır görsel seti)",
  },

  // ── İşletme profil formu ──
  profile: {
    nameLabel: "İşletme adı",
    descLabel: "Açıklama",
    promoLabel: "📣 Öne çıkan kampanya / duyuru",
    promoPlaceholder: "Örn. Bu hafta saç boyamada %20 indirim!",
    promoUntilLabel: "Bitiş tarihi (isteğe bağlı):",
    promoHint:
      "Yazarsan salon sayfanın en üstünde dikkat çekici bir şerit olarak görünür. Boş bırakırsan gösterilmez. Bitiş tarihi geçince otomatik gizlenir.",
    phoneLabel: "Telefon",
    phonePlaceholder: "0212 000 00 00",
    whatsappLabel: "WhatsApp numarası",
    whatsappPlaceholder: "05XX XXX XX XX (boşsa telefon kullanılır)",
    whatsappHint:
      "Salon sayfanda “WhatsApp'tan yaz” butonu bu numarayı açar. Boş bırakırsan telefon numaran kullanılır.",
    cityLabel: "Şehir",
    addressLabel: "Adres",
    districtLabel: "İlçe",
    mapLabel: "Harita konumu",
    mapHint: "Müşterilerin seni haritada bulur. İşaretçiyi sürükle veya haritaya tıkla.",
    placeIdLabel: "Google Yer Kimliği (Place ID)",
    placeIdPlaceholder: "ör. ChIJN1t_tDeuEmsRUsoyG83frY4",
    placeIdHintBefore: "Girersen müşteriler yorumlarını ",
    placeIdHintGoogle: "Google'da da",
    placeIdHintMid: " paylaşabilir. Place ID'ni ",
    placeIdHintLink: "buradan",
    placeIdHintAfter: " işletme adını arayarak bulabilirsin. Tam bağlantı yapıştırsan da olur.",
    saveSuccess: "İşletme bilgilerin güncellendi.",
    saveButton: "Değişiklikleri kaydet",
  },

  // ── Çalışma saatleri düzenleyici ──
  hours: {
    closed: "Kapalı",
    open: "Açık",
    saving: "Kaydediliyor...",
    saveButton: "Saatleri kaydet",
    saved: "Kaydedildi",
    invalidError: "Geçersiz çalışma saati: açılış kapanıştan önce olmalı.",
  },

  // ── Kapak fotoğrafı seçici ──
  cover: {
    optionAlt: "Kapak seçeneği",
  },

  // ── Katalog formları (paket / kampanya / ürün / prim / stok) ──
  catalog: {
    adding: "Ekleniyor...",
    saving: "Kaydediliyor...",
    deleteAria: "Sil",
    editAria: "Düzenle",
    cancel: "Vazgeç",
    saveChanges: "Değişiklikleri kaydet",
    editProduct: "Ürünü düzenle",
    editPackage: "Paketi düzenle",
    editCampaign: "Kampanyayı düzenle",
    active: "Aktif",
    inactive: "Pasif",
    decreaseAria: "Azalt",
    increaseAria: "Artır",
    saveCommission: "Kaydet",
    commissionLabel: "Prim oranı (%)",

    // Paket formu
    packageNameLabel: "Paket adı",
    packageNamePlaceholder: "Örn. 5 Seans Cilt Bakımı",
    priceLabel: "Fiyat (₺)",
    sessionsLabel: "Seans",
    daysLabel: "Gün",
    descLabel: "Açıklama (isteğe bağlı)",
    addPackage: "Paket ekle",

    // Kampanya formu
    codeLabel: "İndirim kodu",
    codePlaceholder: "YAZ25",
    discountLabel: "İndirim (%)",
    expiresLabel: "Bitiş tarihi (isteğe bağlı)",
    createCampaign: "Kampanya oluştur",
    expiryInPast: "Bitiş tarihi bugünden önce olamaz.",

    // Ürün formu
    productNameLabel: "Ürün adı",
    productNamePlaceholder: "Örn. Şampuan 500ml",
    stockLabel: "Stok",
    lowStockLabel: "Düşük eşik",
    addProduct: "Ürün ekle",
  },
};
