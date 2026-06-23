// ─────────────────────────────────────────────────────────────────────────────
// Salonor — Şirket / işletme bilgisi (TEK DOĞRULUK KAYNAĞI)
//
// Salonor henüz bir anonim şirket (A.Ş.) DEĞİLDİR. Platform, gerçek kişi /
// şahıs işletmesi olarak Ferhat Gökel tarafından işletilmektedir. Hiçbir
// metinde "Salonor Teknoloji A.Ş." gibi var olmayan bir tüzel kişi BEYAN
// EDİLMEMELİDİR (yanıltıcı/hukuken riskli). KVKK veri sorumlusu, telif sahibi
// ve mesafeli satış sözleşmesindeki "Satıcı" buradaki gerçek kişidir.
//
// ÖNEMLİ: Aşağıdaki [DOLDURULACAK: ...] alanlarını Ferhat gerçek değerleriyle
// doldurmalıdır. Bu sabit; legal sayfalarda, footer'da ve sözleşmelerde
// referans olarak kullanılır — değeri tek yerden güncellemek yeterlidir.
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY = {
  /** Markanın ticari adı (kullanıcıya görünen). */
  tradeName: "Salonor",

  /**
   * Hukuki sahibi — gerçek kişi / şahıs işletmesi (tüzel kişi DEĞİL).
   * Mesafeli satış sözleşmesinde "Satıcı", KVKK'da "veri sorumlusu" sıfatıyla
   * bu kişi yer alır.
   */
  owner: "Ferhat Gökel",

  /** Şahıs işletmesinin (varsa) ticari unvanı; yoksa gerçek kişinin adı. */
  legalName: "Ferhat Gökel (şahıs işletmesi)",

  /** Vergi dairesi ve numarası (şahıs işletmesi T.C. kimlik no olabilir). */
  taxOffice: "[DOLDURULACAK: Vergi Dairesi]",
  taxNumber: "[DOLDURULACAK: Vergi / T.C. Kimlik No]",

  /** MERSIS no (varsa; şahıs işletmesinde olmayabilir). */
  mersis: "[DOLDURULACAK: MERSIS No — varsa]",

  /** Açık adres (tebligat adresi). */
  address: "[DOLDURULACAK: Açık Adres, İlçe/İl, Türkiye]",

  /** İletişim e-postaları. */
  email: "destek@salonor.com",
  businessEmail: "isletme@salonor.com",
  pressEmail: "merhaba@salonor.com",

  /** İletişim telefonu (varsa). */
  phone: "[DOLDURULACAK: Telefon — varsa]",

  /**
   * KVKK 6698 kapsamında veri sorumlusu. Tüzel kişi olmadığından gerçek kişi
   * adı + iletişim bilgisi gösterilir.
   */
  kvkkController: "Ferhat Gökel (gerçek kişi / şahıs işletmesi)",

  /** Telif yılı (footer © {year} için). */
  copyrightYear: 2026,
} as const;

/** Footer ve sözleşmelerde kullanılacak telif metni — tüzel kişi BEYAN ETMEZ. */
export const COPYRIGHT_OWNER = `${COMPANY.tradeName}`;
