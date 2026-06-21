export const account = {
  // Hesap layout (üst başlık)
  greeting: "Merhaba, {name} 👋",
  layoutSubtitle: "Randevularını ve hesabını buradan yönet.",

  // Sekme navigasyonu
  tabs: {
    appointments: "Randevularım",
    favorites: "Favorilerim",
    profile: "Profilim",
  },

  // Sayfa başlıkları (metadata)
  meta: {
    appointments: "Randevularım",
    profile: "Profilim",
    favorites: "Favorilerim",
  },

  // Randevular sayfası
  appointments: {
    statusConfirmed: "Onaylandı",
    statusCompleted: "Tamamlandı",
    statusCancelled: "İptal edildi",
    statusNoShow: "Gelinmedi",
    emptyTitle: "Henüz randevun yok",
    emptyDesc: "Çevrendeki en iyi salonları keşfet ve ilk randevunu saniyeler içinde al.",
    discoverSalons: "Salon keşfet",
    upcomingTitle: "Yaklaşan randevular ({n})",
    noUpcoming: "Yaklaşan randevun yok.",
    newAppointment: "Yeni randevu al →",
    pastTitle: "Geçmiş",
    withStaff: "{name} ile",
    codeAndTotal: "Kod: {code} · {total}",
    rebook: "Tekrar al",
  },

  // Favoriler sayfası
  favorites: {
    emptyTitle: "Henüz favorin yok",
    emptyDesc: "Beğendiğin salonları kalbe dokunarak kaydet; hepsi burada seni beklesin.",
    discoverSalons: "Salon keşfet",
  },

  // Profil formu
  profile: {
    nameLabel: "Ad Soyad",
    emailLabel: "E-posta",
    emailHint: "E-posta adresi değiştirilemez.",
    phoneLabel: "Telefon",
    phonePlaceholder: "05xx xxx xx xx",
    passwordSectionTitle: "Şifre değiştir (isteğe bağlı)",
    currentPasswordLabel: "Mevcut şifre",
    newPasswordLabel: "Yeni şifre",
    updated: "Profilin güncellendi.",
    save: "Değişiklikleri kaydet",
  },

  // Randevu iptal butonu
  cancel: {
    cancel: "İptal et",
    confirm: "Emin misin?",
    cancelling: "İptal ediliyor...",
    yesCancel: "Evet, iptal et",
    dismiss: "Vazgeç",
  },

  // Değerlendirme (yorum) modalı
  review: {
    shareOnGoogle: "Google'da paylaş",
    rate: "Değerlendir",
    thanksTitle: "Teşekkürler!",
    thanksDesc: "Yorumun yayınlandı, diğer kullanıcılara yol gösterdin.",
    alsoGoogleTitle: "Bir de Google'da paylaşır mısın?",
    alsoGoogleDesc: "{name} için Google'da da değerlendirmen çok kıymetli.",
    rateOnGoogle: "Google'da değerlendir",
    close: "Kapat",
    ratingLabel: "Puanın",
    starsAria: "{n} yıldız",
    experienceLabel: "Deneyimin",
    commentPlaceholder: "Hizmet nasıldı? Diğer kullanıcılara yol göster...",
    submitting: "Gönderiliyor...",
    submitReview: "Yorumu gönder",
  },
};
