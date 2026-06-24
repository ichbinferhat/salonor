export const panelCore = {
  // Sidebar — bölüm başlıkları
  navDailyTitle: "Günlük",
  navSalesTitle: "Satış & Finans",
  navCatalogTitle: "Katalog",
  navMarketingTitle: "Pazarlama",
  navCustomerTitle: "Müşteri",
  navToolsTitle: "Araçlar & Ayarlar",

  // Sidebar — menü etiketleri
  navOverview: "Genel Bakış",
  navCalendar: "Takvim",
  navNotifications: "Bildirimler",
  navCashbox: "Kasa & Adisyon",
  navDebts: "Borç & Taksit",
  navReports: "Raporlar",
  navExpenses: "Giderler",
  navServices: "Hizmetler",
  navStaff: "Personel",
  navCommission: "Prim & Performans",
  navPackages: "Paketler",
  navProducts: "Ürünler & Stok",
  navCampaigns: "Kampanyalar",
  navGiftCard: "Hediye Çeki",
  navLoyalty: "Para Puan",
  navSms: "SMS",
  navMessaging: "Mesajlaşma",
  navCustomers: "Müşteriler",
  navLostCustomers: "Kayıp Müşteri",
  navReviews: "Yorumlar",
  navAiAnalysis: "AI Analiz",
  navTodos: "Yapılacaklar",
  navSettings: "Ayarlar",

  // Sidebar — alt eylemler / etiketler
  businessLabel: "İşletme",
  viewMyPage: "Sayfamı gör",
  logout: "Çıkış yap",
  loggingOut: "Çıkış yapılıyor...",
  menu: "Menü",
  close: "Kapat",

  // Dashboard (Genel bakış)
  dashboardTitle: "Genel bakış",
  goToCalendar: "Takvime git",
  statTodayAppts: "Bugünkü randevu",
  statTodayRevenue: "Bugünkü ciro",
  statWeekRevenue: "7 günlük ciro",
  statRating: "Puan",
  todaySchedule: "Bugünün programı",
  calendar: "Takvim",
  noApptsToday: "Bugün için randevu yok",
  noApptsTodayDesc: "Takvimden manuel randevu ekleyebilirsin.",
  noShowTag: "Gelmedi",
  last7Days: "Son 7 gün",
  summary: "Özet",
  nextAppt: "Sıradaki randevu",
  upcomingAppts: "Gelecek randevular",
  totalReviews: "Toplam yorum",
  activeStaff: "Aktif personel",

  // Takvim (CalendarBoard)
  calendarTitle: "Takvim",
  newAppt: "Randevu",
  prevDay: "Önceki gün",
  nextDay: "Sonraki gün",
  today: "Bugün",
  noStaffTitle: "Henüz personel yok",
  noStaffDesc: "Takvimi kullanmak için önce ekibini eklemelisin.",
  addStaff: "Personel ekle",
  closedNotice: "Bu gün çalışma saatlerinde kapalı görünüyor — yine de randevu ekleyebilirsin.",

  // Takvim — lejant
  legendConfirmed: "Onaylı",
  legendCompleted: "Tamamlandı",
  legendNoShow: "Gelinmedi",

  // Yeni randevu modalı
  newApptTitle: "Yeni randevu",
  staffField: "Personel",
  startField: "Başlangıç",
  customerNameField: "Müşteri adı",
  customerNamePlaceholder: "Örn. Ayşe K. (boş bırakılabilir)",
  phoneField: "Telefon (hatırlatma için)",
  phonePlaceholder: "05XX XXX XX XX (opsiyonel)",
  pickFromContacts: "Rehberden seç",
  pickedNoMobile: "Seçilen kişinin geçerli bir cep numarası yok.",
  servicesField: "Hizmetler",
  selectAtLeastOneService: "En az bir hizmet seç.",
  overflowsDay: "Bu randevu gün sonunu ({end}) aşıyor.",
  cancel: "Vazgeç",
  adding: "Ekleniyor...",
  addAppt: "Randevu ekle",

  // Randevu detay modalı
  statusConfirmed: "Onaylı",
  statusCompleted: "Tamamlandı",
  statusNoShow: "Gelinmedi",
  statusCancelled: "İptal",
  withStaff: "{staff} ile",
  noteLabel: "Not:",
  markCompleted: "Tamamlandı olarak işaretle",
  markNoShow: "Gelinmedi",
  cancelAppt: "İptal et",
  apptStatusInfo: "Bu randevu {status} durumunda.",

  // Bildirimler sayfası
  notificationsMetaTitle: "Bildirimler",
  notificationsTitle: "Bildirimler",
  notificationsSubtitle:
    "Yeni randevu isteklerini onayla ve yaklaşan randevular için hatırlatma gönder",
  reminderInfoReady: "hazır dolu",
  reminderInfoMarked: "“Hatırlatıldı”",
  reminderInfoBefore: "Butona basınca mesaj ",
  reminderInfoMiddle:
    " şekilde WhatsApp/SMS uygulamanda açılır; sen gönderirsin. Gönderdiklerin otomatik ",
  reminderInfoAfter:
    " işaretlenir, böylece aynı kişiye iki kez yazmazsın. Ek ücret veya kurulum yok.",
  noUpcomingTitle: "Yaklaşan randevu yok",
  noUpcomingDesc: "Önümüzdeki 3 gün için onaylı randevu bulunmuyor.",
  reminderMessageBody:
    "Merhaba {name}, {business} randevu hatırlatması: {date} {time}. Sizi bekliyoruz! 😊",

  // Yeni randevu istekleri (NewBookings)
  newBookingRequests: "Yeni randevu isteği",
  approveAll: "Tümünü onayla",
  approve: "Onayla",
  approveFailed: "Onaylanamadı. Lütfen tekrar dene.",

  // Hatırlatma listesi (ReminderList)
  reminderSaveFailed: "İşaret kaydedilemedi, lütfen tekrar dene.",
  remindNow: "Şimdi hatırlatılmalı",
  pendingCount: "{n} bekliyor",
  upcomingSection: "Yaklaşan (önümüzdeki 3 gün)",
  noPhone: "Telefon yok",
  reminded: "Hatırlatıldı",
  undo: "Geri al",
  whatsapp: "WhatsApp",
  sms: "SMS",

  // Ortak fallback etiketleri (DB verisi boşken gösterilen statik metin)
  fallbackCustomer: "Müşteri",
  fallbackAppt: "Randevu",
};
