export const panelFinance = {
  // ── Ortak ──
  noDataYet: "Henüz veri yok.",

  // ── Kasa & Adisyon (kasa/page + kasa-pos) ──
  kasa: {
    metaTitle: "Kasa & Adisyon",
    title: "Kasa & Adisyon",
    subtitle: "Hızlı satış al, günlük kasanı takip et",
    todayCash: "Bugünkü kasa",
    todayTxns: "Bugünkü işlem",
    todaySales: "Bugünkü satışlar",
    noSalesToday: "Bugün henüz satış yok.",
    defaultCustomer: "Müşteri",

    // POS — katalog
    services: "Hizmetler",
    products: "Ürünler",
    noProductsHint: "Henüz ürün yok — Ürünler & Stok bölümünden ekleyebilirsin.",
    outOfStock: "stok yok",
    stockCount: "stok {n}",
    stockExactNone: '"{name}" stokta yok.',
    stockLimit: '"{name}" stokta {n} adet — daha fazla eklenemez.',

    // POS — manuel kalem
    manualLine: "Manuel kalem",
    descriptionPlaceholder: "Açıklama",
    priceTlSymbol: "₺",
    manualHint: "Tutar tam TL olarak girilir; sepette tekrar düzenleyebilirsin.",
    unitPriceAria: "Birim fiyat",
    perUnit: "₺ / adet",

    // POS — sepet/adisyon
    receipt: "Adisyon",
    saleSaved: "Satış kaydedildi ✓ Yeni adisyon ekleyebilirsin.",
    emptyCart: "Soldan ürün/hizmet ekle.",
    decrease: "Azalt",
    increase: "Artır",
    remove: "Kaldır",
    customerNamePlaceholder: "Müşteri adı (isteğe bağlı)",
    customerPhonePlaceholder: "Telefon — puan kazandırmak için (isteğe bağlı)",
    earnPointsNote: "Bu satış {n} puan kazandırır (her 100 ₺ = 5 puan).",
    total: "Toplam",
    saving: "Kaydediliyor...",
    charge: "Tahsil et",
  },

  // ── Giderler (giderler/page + expenses) ──
  expenses: {
    metaTitle: "Giderler",
    title: "Giderler",
    subtitle: "Aylık gider takibi ve net kâr",
    revenueOfMonth: "{month} cirosu",
    cashSales: "Kasa satışları",
    monthExpense: "Bu ay gider",
    netProfit: "Net kâr",
    addExpense: "Gider ekle",
    expensesOfMonth: "{month} giderleri",
    emptyTitle: "Bu ay gider yok",
    emptyDesc: "Soldaki formla ilk giderini ekle.",

    // Form
    description: "Açıklama",
    descriptionPlaceholder: "Örn. Aylık kira",
    category: "Kategori",
    amountWithSymbol: "Tutar (₺)",
    date: "Tarih",
    note: "Not (isteğe bağlı)",
    notePlaceholder: "Detay...",
    adding: "Ekleniyor...",
    submit: "Gider ekle",
    deleteConfirm: "Bu gider kaydı silinsin mi? Bu işlem geri alınamaz.",
    deleteAria: "Gideri sil",
  },

  // ── Borç & Taksit (borclar/page + debt-manager) ──
  debt: {
    metaTitle: "Borç & Taksit — Salonor",
    title: "Borç & Taksitli Satış",
    subtitle: "Açık hesapları takip et, taksit tahsil et",
    openAccounts: "Açık hesap",
    totalReceivable: "Toplam alacak",
    collected: "Tahsil edilen",

    // Form
    newDebt: "Yeni borç / taksit",
    customerName: "Müşteri adı",
    phoneOptional: "Telefon (isteğe bağlı)",
    amountWithSymbol: "Tutar (₺)",
    installment: "Taksit",
    noteOptional: "Not (isteğe bağlı)",
    errEnterCustomer: "Müşteri adı gir.",
    errEnterValidAmount: "Geçerli bir tutar gir.",
    saving: "Kaydediliyor...",
    addDebtRecord: "Borç kaydı ekle",

    // Liste / satır
    emptyTitle: "Açık hesap yok",
    emptyDesc: "Borç/taksitli satışları soldan ekleyerek takip et.",
    closedAccounts: "Kapanan hesaplar",
    installmentCount: "{n} taksit",
    closed: "Kapandı",
    remaining: "kalan",
    paidOf: "{paid} / {total} ödendi",
    errEnterAmount: "Tutar gir.",
    collectMax: "Tahsilat (en fazla {n})",
    collect: "Tahsil et",
    deleteConfirm: "Bu borç kaydı silinsin mi?",
    paymentHistory: "Tahsilat geçmişi",
    noPaymentsYet: "Henüz tahsilat yok.",
  },

  // ── Para Puan (para-puan/page + loyalty-manager) ──
  loyalty: {
    metaTitle: "Para Puan — Salonor",
    title: "Para Puan",
    subtitle: "Müşteri sadakat puanları — kazandır, biriktir, harca",
    totalMembers: "Toplam üye",
    circulatingPoints: "Dolaşımdaki puan",
    pointValue: "Puan değeri",
    pointValueHint: "1 puan = 1 ₺",

    // Puan ekle
    addPoints: "Puan ekle",
    customerName: "Müşteri adı",
    phonePlaceholder: "05xx xxx xx xx",
    pointsAmount: "Puan miktarı",
    errEnterCustomer: "Müşteri adı gir.",
    errEnterValidPoints: "Geçerli bir puan gir.",
    adding: "Ekleniyor...",
    hint: "İpucu: Kasa & Adisyon ekranında tahsilat yaparken müşterinin telefonunu girersen satış otomatik puan kazandırır (her 100 ₺ = 5 puan).",

    // Üye listesi
    searchPlaceholder: "İsim veya telefon ara",
    emptyNoMembers: "Henüz puanlı müşteri yok",
    emptyNoMatch: "Eşleşen müşteri yok",
    emptyDesc: "Soldan ilk puanı ekleyerek başla.",
    points: "puan",
    spend: "Harca",
    errEnterQuantity: "Miktar gir.",
    redeemMax: "En fazla {n}",
    use: "Kullan",
  },

  // ── Hediye Çeki (hediye-ceki/page + giftcard-manager) ──
  giftcard: {
    metaTitle: "Hediye Çeki — Salonor",
    title: "Hediye Çeki",
    subtitle: "Hediye çeki oluştur, kod ver, satışta kullandır",
    activeCards: "Aktif çek",
    unusedBalance: "Kullanılmamış bakiye",
    totalIssued: "Toplam kesilen",

    // Form
    newGiftcard: "Yeni hediye çeki",
    amountWithSymbol: "Tutar (₺)",
    amountPlaceholder: "örn. 500",
    buyerPlaceholder: "Alan kişi (isteğe bağlı)",
    recipientPlaceholder: "Hediye edilen (isteğe bağlı)",
    expiryOptional: "Son kullanım (isteğe bağlı)",
    errEnterValidAmount: "Geçerli bir tutar gir.",
    creating: "Oluşturuluyor...",
    createCard: "Çek oluştur",

    // Liste / kart
    emptyTitle: "Henüz hediye çeki yok",
    emptyDesc: "Soldan ilk çekini oluştur, kodu müşterine ver.",
    copyCode: "Kodu kopyala",
    depleted: "Tükendi",
    active: "Aktif",
    passive: "Pasif",
    balanceOf: "/ {total} bakiye",
    buyerLabel: "Alan: {name}. ",
    recipientLabel: "Hediye: {name}. ",
    expiryLabel: "Son: {date}",
    errEnterQuantity: "Miktar gir.",
    redeemMax: "En fazla {n}",
    use: "Kullan",
    deactivate: "Pasifleştir",
    activate: "Aktifleştir",
    deduct: "Düş",
  },

  // ── Prim & Performans (prim/page) ──
  commission: {
    metaTitle: "Prim & Performans",
    title: "Prim & Performans",
    subtitle: "Son 30 gün — personel cirosu ve prim hesabı",
    revenue30d: "30 günlük ciro",
    commissionDue: "Ödenecek prim",
    emptyTitle: "Aktif personel yok",
    emptyDesc: "Önce Personel bölümünden ekip ekle.",
    colStaff: "Personel",
    colAppointment: "Randevu",
    colRevenue30d: "Ciro (30g)",
    colCommissionPct: "Prim %",
    colCommissionAmount: "Prim tutarı",
    footnote:
      'Prim oranını gir, "Kaydet"e bas — tutar personelin son 30 günlük cirosuna göre otomatik hesaplanır.',
  },

  // ── Raporlar (raporlar/page) ──
  reports: {
    metaTitle: "Raporlar",
    title: "Raporlar",
    subtitle: "Son 30 günün performansı",
    revenue30d: "30 günlük ciro",
    cashSales: "Kasa satışları",
    appointment: "Randevu",
    avgTicket: "Ortalama sepet",
    completed: "Tamamlanan",
    dailyRevenueTitle: "Günlük ciro · son 14 gün",
    topServicesTitle: "En çok kazandıran hizmetler",
    timesUsed: "{n} kez",
    staffPerformanceTitle: "Personel performansı",
    appointmentCount: "{n} randevu",
    busyDaysTitle: "Haftanın yoğun günleri",
    appointmentStatusTitle: "Randevu durumları",
    statusCompleted: "Tamamlanan",
    statusConfirmedPending: "Onaylı (bekleyen)",
    statusCancelled: "İptal edilen",
    statusNoShow: "Gelmedi",
  },

  // ── Ürünler & Stok (urunler/page) ──
  products: {
    metaTitle: "Ürünler & Stok",
    title: "Ürünler & Stok",
    subtitle: "Perakende ürün ve stok takibi",
    productTypes: "Ürün çeşidi",
    lowStock: "Düşük stok",
    stockValue: "Stok değeri",
    addProduct: "Ürün ekle",
    productsCount: "Ürünler",
    emptyTitle: "Henüz ürün yok",
    emptyDesc: "Soldaki formla ilk ürününü ekle.",
    lowStockBadge: "· düşük stok!",
  },

  // ── Paketler (paketler/page) ──
  packages: {
    metaTitle: "Paketler",
    title: "Paketler",
    subtitle: "Seans paketleri ve üyelikler — sabit gelir oluştur",
    addPackage: "Paket ekle",
    packagesCount: "Paketler",
    emptyTitle: "Henüz paket yok",
    emptyDesc: "Soldaki formla ilk paketini oluştur.",
    sessionsValidity: "{sessions} seans · {days} gün geçerli",
  },
};
