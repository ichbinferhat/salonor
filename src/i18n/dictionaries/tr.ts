// Türkçe sözlük — TÜM çevrilebilir metinlerin KAYNAĞIDIR (tek doğruluk kaynağı).
// `en.ts` bunun tip imzasına (`Dictionary = typeof tr`) birebir uymak ZORUNDADIR;
// eksik/fazla anahtar derleme hatası verir. Yeni metin eklerken önce buraya ekle.
//
// NOT: `as const` KULLANMA — değerler `string` kalmalı ki diğer diller farklı
// metin koyabilsin (literal tip kilitlenmesin).
//
// Sayfa bazlı namespace'ler ayrı fragment dosyalarında tutulur (tr.<ns>.ts) ve
// aşağıda birleştirilir; böylece büyük sayfalar bağımsız düzenlenebilir.
import { common } from "./tr.common";
import { search } from "./tr.search";
import { salon } from "./tr.salon";
import { booking } from "./tr.booking";
import { pricing } from "./tr.pricing";
import { business } from "./tr.business";
import { auth } from "./tr.auth";
import { account } from "./tr.account";
import { legal } from "./tr.legal";
import { panelCore } from "./tr.panelCore";
import { panelCatalog } from "./tr.panelCatalog";
import { panelFinance } from "./tr.panelFinance";
import { panelOther } from "./tr.panelOther";
import { onboarding } from "./tr.onboarding";
import { admin } from "./tr.admin";
import { consent } from "./tr.consent";

export const tr = {
  common,

  nav: {
    signIn: "Oturum aç",
    listBusiness: "İşletmenizi listeleyin",
    menu: "Menü",
    account: "Hesabım",
    forCustomers: "Müşteriler için",
    signInOrUp: "Oturum açın veya kaydolun",
    downloadApp: "Uygulamayı indirin",
    helpSupport: "Yardım ve destek",
    forBusinesses: "İşletmeler için",
    businessLogin: "İşletme girişi",
    businessPanel: "İşletme Paneli",
    adminPanel: "Yönetim Paneli",
    myAppointments: "Randevularım",
    myFavorites: "Favorilerim",
    myProfile: "Profilim",
    logout: "Çıkış yap",
    language: "Dil",
  },

  footer: {
    tagline: "Güzellik ve bakım randevunu saniyeler içinde ayırt. Ücretsiz, hızlı, 7/24.",
    exploreTitle: "Keşfet",
    hairdressers: "Kuaförler",
    barbers: "Berberler",
    spaMassage: "Spa & Masaj",
    nailStudios: "Tırnak stüdyoları",
    skincare: "Cilt bakımı",
    forBusinessesTitle: "İşletmeler için",
    salonorBusiness: "Salonor Business",
    pricing: "Fiyatlandırma",
    addBusiness: "İşletmenizi ekleyin",
    businessLogin: "İşletme girişi",
    companyTitle: "Salonor",
    about: "Hakkımızda",
    helpFaq: "Yardım & SSS",
    privacy: "Gizlilik & KVKK",
    terms: "Kullanım şartları",
    contact: "İletişim",
    legalTitle: "Yasal",
    distanceSales: "Mesafeli satış sözleşmesi",
    preInfo: "Ön bilgilendirme formu",
    withdrawal: "Cayma ve iade",
    cookiePolicy: "Çerez politikası",
    rights: "© 2026 Salonor. Tüm hakları saklıdır.",
    designedIn: "Türkiye’de 🇹🇷 tasarlandı",
  },

  home: {
    heroBadge: "Türkiye’nin en iyi randevu platformu",
    heroTitleA: "Randevun saniyeler içinde, ",
    heroTitleHighlight: "cebinde",
    heroTitleEnd: ".",
    heroSubtitle:
      "Çevrendeki kuaför, berber, spa ve güzellik uzmanlarını keşfet; uygun saati seç, yerini anında ayırt — ücretsiz ve 7/24.",
    popular: "Popüler:",
    ratingAvg: "ortalama puan",
    verifiedReviews: "doğrulanmış yorum",
    selectSalons: "seçkin salon",
    categoriesSr: "Kategoriler",
    featuredTitle: "Önerilen salonlar",
    featuredSubtitle: "Yüksek puanlı, en çok tercih edilenler",
    newestTitle: "Yeni eklenenler",
    newestSubtitle: "Salonor’a yeni katılan işletmeler",

    stats: {
      heading: "Güzellik ve bakımda doğru adres",
      sub: "Tek platform, tek uygulama — 81 ilden seçkin salonların ve uzmanların buluştuğu yer.",
      bigGradient: "Saniyeler içinde",
      bigSub: "randevu — ücretsiz ve 7/24",
      selectSalons: "seçkin salon",
      provincesNum: "81 il",
      provincesLabel: "Türkiye genelinde",
      verifiedReviews: "doğrulanmış yorum",
      footnote: "{n}+ rezerve edilebilir hizmet · anında onay · güvenli ödeme",
    },

    bizPromo: {
      kicker: "Salonor Business",
      heading: "İşletmen için Salonor",
      desc: "Salon ve spa merkezleri için tek panelde randevu, takvim, personel ve müşteri yönetimi. İşini büyütmenin profesyonel yolu.",
      feat1: "7/24 online randevu — telefon başında beklemek yok",
      feat2: "Takvim, personel ve hizmetler tek ekranda",
      feat3: "Yorumlarla güven kazan, yeni müşteriye ulaş",
      learnMore: "Daha fazlasını öğren",
      perfect: "Mükemmel 5/5",
      satisfaction: "işletme memnuniyeti",
      calendar: "Takvim",
      today: "Bugün",
      date: "14 Haziran Cmt",
      blockHaircut: "Saç Kesimi",
      blockBlowDry: "Fön",
      blockBeard: "Sakal Tıraşı",
      blockSkincare: "Cilt Bakımı",
      blockManicure: "Manikür",
      blockColor: "Saç Boyama",
      featured: "Öne çıkan",
      reviewsCount: "({n} yorum)",
      apptConfirmed: "Randevu onaylandı",
      apptDetail: "Bugün 14:30 · Saç Kesimi",
    },

    reviews: {
      title: "Değerlendirmeler",
      subtitle: "Gerçek randevulardan, gerçek deneyimler",
    },

    directory: {
      kicker: "Tüm hizmetler",
      heading: "Aradığın her hizmet Salonor’da",
      groups: [
        {
          title: "Salon türleri",
          items: ["Kadın kuaförü", "Erkek berberi", "Güzellik & estetik merkezi", "Tırnak stüdyosu", "Spa & masaj merkezi", "Makyaj stüdyosu"],
        },
        {
          title: "Saç hizmetleri",
          items: ["Saç kesimi", "Fön & şekillendirme", "Saç boyası", "Ombre & balyaj", "Keratin & saç bakımı", "Gelin saçı"],
        },
        {
          title: "Tırnak hizmetleri",
          items: ["Manikür", "Pedikür", "Kalıcı oje", "Protez tırnak", "Jel tırnak", "Nail art"],
        },
        {
          title: "Makyaj, kaş & kirpik",
          items: ["Gündüz & abiye makyajı", "Gelin makyajı", "İpek kirpik", "Kirpik lifting", "Kaş laminasyonu", "Kaş tasarımı"],
        },
        {
          title: "Cilt bakımı",
          items: ["Klasik cilt bakımı", "Profesyonel cilt bakımı", "Leke & akne bakımı", "Hydrafacial", "Kaş alma", "Yüz ağdası"],
        },
        {
          title: "Spa & masaj",
          items: ["İsveç masajı", "Aroma terapi", "Derin doku masajı", "Sıcak taş masajı", "Refleksoloji", "Hamam ritüeli"],
        },
        {
          title: "Lazer epilasyon",
          items: ["Tüm vücut", "Koltuk altı", "Bacak", "Kol", "Sırt", "Yüz & bölgesel"],
        },
        {
          title: "Erkek bakımı",
          items: ["Erkek saç kesimi", "Sakal tıraşı & şekillendirme", "Erkek saç boyası", "Erkek cilt bakımı", "Erkek ağda", "Saç & sakal combo"],
        },
      ],
    },

    appDownload: {
      heading: "Salonor’u cebine al",
      desc: "Randevularını yönet, favori salonlarını takip et ve yeni yerleri keşfet — hepsi tek dokunuşla, her an yanında.",
      feat1: "Tek dokunuşla yeniden randevu",
      feat2: "Randevu hatırlatmaları ve bildirimler",
      feat3: "Sana özel salon önerileri",
      qrText: "Kamerayla tara, hemen indir",
      bookNow: "Hemen rezerve et",
      nearbyCount: "Yakınındaki {n} salon",
      exploreMap: "Haritada keşfet →",
      mockHaircut: "Saç Kesimi",
      mockBlowDry: "Fön & Şekil",
      mockColor: "Saç Boyama",
    },
  },

  search,
  salon,
  booking,
  pricing,
  business,
  auth,
  account,
  legal,
  panelCore,
  panelCatalog,
  panelFinance,
  panelOther,
  onboarding,
  admin,
  consent,
} satisfies Record<string, unknown>;
