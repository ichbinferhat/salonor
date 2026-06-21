export const onboarding = {
  metaTitle: "İşletme kurulumu",

  // Üst başlık (greeting)
  greeting: "Merhaba, {name} 👋",

  // Adım göstergesi etiketleri
  steps: {
    business: "İşletme",
    category: "Kategori",
    location: "Konum",
    hours: "Saatler",
    services: "Hizmetler",
  },

  // Adım 1: İşletme
  step1: {
    title: "İşletmeni tanıtalım",
    subtitle: "Müşterilerin seni nasıl görecek?",
    nameLabel: "İşletme adı",
    namePlaceholder: "Örn. Nova Saç Atölyesi",
    phoneLabel: "Telefon",
    phonePlaceholder: "0212 000 00 00",
    descLabel: "Kısa açıklama (isteğe bağlı)",
    descPlaceholder: "Salonunu birkaç cümleyle anlat...",
  },

  // Adım 2: Kategori
  step2: {
    title: "Hangi alandasın?",
    subtitle: "İşletmene en uygun kategoriyi seç.",
  },

  // Adım 3: Konum
  step3: {
    title: "Neredesin?",
    subtitle: "Müşterilerin seni haritada bulabilsin.",
    cityLabel: "Şehir",
    districtLabel: "İlçe",
    districtPlaceholder: "Örn. Kadıköy",
    addressLabel: "Açık adres",
    addressPlaceholder: "Mahalle, cadde, no",
  },

  // Adım 4: Saatler
  step4: {
    title: "Çalışma saatlerin",
    subtitle: "Açık olduğun saatleri ve günleri belirle.",
    openLabel: "Açılış",
    closeLabel: "Kapanış",
    closedDaysLabel: "Kapalı günler",
    hoursHint: "Kapalı işaretlenmeyen günlerde {open}–{close} arası açıksın.",
  },

  // Adım 5: Hizmetler
  step5: {
    title: "İlk hizmetlerin",
    subtitle: "Birkaç hizmet ekle — sonra panelden istediğin kadar değiştirebilirsin.",
    servicePlaceholder: "Hizmet adı",
    minUnit: "dk",
    priceUnit: "₺",
    removeService: "Kaldır",
    addService: "Hizmet ekle",
  },

  // Navigasyon
  back: "Geri",
  creating: "Oluşturuluyor...",
  publish: "İşletmemi yayınla",
  continue: "Devam et",

  // Harita (LocationPicker)
  mapHint: "Haritaya tıklayarak veya işaretçiyi sürükleyerek konumunu ayarla.",
};
