// Deutsches Wörterbuch. Erfüllt die Typsignatur von `tr.ts` (Dictionary = typeof tr) EXAKT;
// fehlende/überzählige Schlüssel oder falsche Funktionssignaturen verursachen Compile-Fehler.
import type { Dictionary } from "../types";

export const de: Dictionary = {
  common: {
    viewAll: "Alle ansehen",
    scrollBack: "Zurück scrollen",
    scrollForward: "Vorwärts scrollen",
    close: "Schließen",

    // Fehlergrenze (error.tsx)
    errorTitle: "Etwas ist schiefgelaufen",
    errorDesc: "Es ist ein unerwarteter Fehler aufgetreten. Du kannst es erneut versuchen oder zur Startseite zurückkehren.",
    retry: "Erneut versuchen",
    backHome: "Zurück zur Startseite",

    // 404 (not-found.tsx)
    notFoundTitle: "Seite nicht gefunden",
    notFoundDesc: "Die gesuchte Seite wurde möglicherweise verschoben oder hat nie existiert.",
    searchSalons: "Salon suchen",

    // Leerer Slider-Zustand
    carouselEmpty: "Bald gibt es hier weitere Salons.",

    // Store-Badges (App Store / Google Play)
    comingSoon: "Bald verfügbar",

    // Kartenattribution
    mapAttribution: "© OpenStreetMap-Mitwirkende · © CARTO",

    // SEO- / OpenGraph-Standardwerte
    ogTitle: "Salonor — Beauty- und Pflegetermine in Sekunden",
    ogDescription:
      "Entdecke Friseure, Barbershops, Spas und Beauty-Expertinnen in deiner Nähe; wähle eine passende Uhrzeit und sichere dir sofort deinen Platz.",
  },

  nav: {
    signIn: "Anmelden",
    listBusiness: "Ihr Geschäft eintragen",
    menu: "Menü",
    account: "Mein Konto",
    forCustomers: "Für Kundinnen & Kunden",
    signInOrUp: "Anmelden oder registrieren",
    downloadApp: "App herunterladen",
    helpSupport: "Hilfe & Support",
    forBusinesses: "Für Unternehmen",
    businessLogin: "Unternehmens-Login",
    businessPanel: "Unternehmens-Dashboard",
    adminPanel: "Admin-Bereich",
    myAppointments: "Meine Termine",
    myFavorites: "Meine Favoriten",
    myProfile: "Mein Profil",
    logout: "Abmelden",
    language: "Sprache",
  },

  footer: {
    tagline: "Buche deinen Beauty- und Pflegetermin in Sekunden. Kostenlos, schnell, rund um die Uhr.",
    exploreTitle: "Entdecken",
    hairdressers: "Friseure",
    barbers: "Barbershops",
    spaMassage: "Spa & Massage",
    nailStudios: "Nagelstudios",
    skincare: "Hautpflege",
    forBusinessesTitle: "Für Unternehmen",
    salonorBusiness: "Salonor Business",
    pricing: "Preise",
    addBusiness: "Geschäft hinzufügen",
    businessLogin: "Unternehmens-Login",
    companyTitle: "Salonor",
    about: "Über uns",
    helpFaq: "Hilfe & FAQ",
    privacy: "Datenschutz & DSGVO",
    terms: "Nutzungsbedingungen",
    contact: "Kontakt",
    legalTitle: "Rechtliches",
    distanceSales: "Fernabsatzvertrag",
    preInfo: "Vorinformationsformular",
    withdrawal: "Widerruf & Rückerstattung",
    cookiePolicy: "Cookie-Richtlinie",
    rights: "© 2026 Salonor. Alle Rechte vorbehalten.",
    designedIn: "Gestaltet in der Türkei 🇹🇷",
  },

  home: {
    heroBadge: "Die Buchungsplattform Nr. 1 der Türkei",
    heroTitleA: "Dein Termin in Sekunden, ",
    heroTitleHighlight: "in deiner Tasche",
    heroTitleEnd: ".",
    heroSubtitle:
      "Entdecke Friseure, Barber, Spas und Beauty-Expert:innen in deiner Nähe; wähle eine Uhrzeit und sichere dir deinen Platz sofort — kostenlos und rund um die Uhr.",
    popular: "Beliebt:",
    ratingAvg: "Durchschnittsbewertung",
    verifiedReviews: "verifizierte Bewertungen",
    selectSalons: "ausgewählte Salons",
    categoriesSr: "Kategorien",
    featuredTitle: "Empfohlene Salons",
    featuredSubtitle: "Top bewertet und besonders beliebt",
    newestTitle: "Neu hinzugefügt",
    newestSubtitle: "Unternehmen, die gerade zu Salonor gestoßen sind",

    stats: {
      heading: "Die richtige Adresse für Beauty und Pflege",
      sub: "Eine Plattform, eine App — wo ausgewählte Salons und Expert:innen aus allen 81 Provinzen zusammenkommen.",
      bigGradient: "In Sekunden",
      bigSub: "buchen — kostenlos und rund um die Uhr",
      selectSalons: "ausgewählte Salons",
      provincesNum: "81 Provinzen",
      provincesLabel: "in der ganzen Türkei",
      verifiedReviews: "verifizierte Bewertungen",
      footnote: "{n}+ buchbare Leistungen · sofortige Bestätigung · sichere Zahlung",
    },

    bizPromo: {
      kicker: "Salonor Business",
      heading: "Salonor für dein Geschäft",
      desc: "Termine, Kalender, Mitarbeiter- und Kundenverwaltung in einem Panel für Salons und Spas. Der professionelle Weg, deinen Alltag leichter zu machen.",
      feat1: "Online-Buchung rund um die Uhr — kein Warten mehr am Telefon",
      feat2: "Kalender, Team und Leistungen auf einen Blick",
      feat3: "Mit Bewertungen Vertrauen aufbauen und Kunden binden",
      learnMore: "Mehr erfahren",
      perfect: "Perfekte 5/5",
      satisfaction: "Zufriedenheit der Unternehmen",
      calendar: "Kalender",
      today: "Heute",
      date: "Sa, 14. Juni",
      blockHaircut: "Haarschnitt",
      blockBlowDry: "Föhnen",
      blockBeard: "Bartrasur",
      blockSkincare: "Hautpflege",
      blockManicure: "Maniküre",
      blockColor: "Haarfärbung",
      featured: "Empfohlen",
      reviewsCount: "({n} Bewertungen)",
      apptConfirmed: "Termin bestätigt",
      apptDetail: "Heute 14:30 Uhr · Haarschnitt",
    },

    reviews: {
      title: "Bewertungen",
      subtitle: "Echte Termine, echte Erfahrungen",
    },

    directory: {
      kicker: "Alle Leistungen",
      heading: "Jede Leistung, die du brauchst, auf Salonor",
      groups: [
        {
          title: "Salon-Typen",
          items: ["Damenfriseur", "Herrenbarbier", "Beauty- & Kosmetikinstitut", "Nagelstudio", "Spa- & Massagezentrum", "Make-up-Studio"],
        },
        {
          title: "Haar-Leistungen",
          items: ["Haarschnitt", "Föhnen & Styling", "Haarfärbung", "Ombré & Balayage", "Keratin & Haarpflege", "Brautfrisur"],
        },
        {
          title: "Nagel-Leistungen",
          items: ["Maniküre", "Pediküre", "Shellac", "Acrylnägel", "Gelnägel", "Nail Art"],
        },
        {
          title: "Make-up, Brauen & Wimpern",
          items: ["Tages- & Abend-Make-up", "Braut-Make-up", "Seidenwimpern", "Wimpernlifting", "Augenbrauenlaminierung", "Augenbrauen-Styling"],
        },
        {
          title: "Hautpflege",
          items: ["Klassische Gesichtsbehandlung", "Professionelle Gesichtsbehandlung", "Pigment- & Aknebehandlung", "Hydrafacial", "Augenbrauenzupfen", "Gesichtswaxing"],
        },
        {
          title: "Spa & Massage",
          items: ["Schwedische Massage", "Aromatherapie", "Tiefengewebsmassage", "Hot-Stone-Massage", "Reflexzonenmassage", "Hammam-Ritual"],
        },
        {
          title: "Laser-Haarentfernung",
          items: ["Ganzkörper", "Achseln", "Beine", "Arme", "Rücken", "Gesicht & Zonen"],
        },
        {
          title: "Herrenpflege",
          items: ["Herrenhaarschnitt", "Bartschnitt & Styling", "Herren-Haarfärbung", "Herren-Gesichtsbehandlung", "Herren-Waxing", "Haar- & Bart-Kombi"],
        },
      ],
    },

    appDownload: {
      heading: "Hol dir Salonor aufs Handy",
      desc: "Verwalte deine Termine, folge deinen Lieblingssalons und entdecke neue Orte — alles mit einem Fingertipp, immer dabei.",
      feat1: "Neu buchen mit nur einem Fingertipp",
      feat2: "Terminerinnerungen und Benachrichtigungen",
      feat3: "Personalisierte Salon-Empfehlungen",
      qrText: "Mit der Kamera scannen und sofort herunterladen",
      bookNow: "Jetzt buchen",
      nearbyCount: "{n} Salons in deiner Nähe",
      exploreMap: "Auf der Karte entdecken →",
      mockHaircut: "Haarschnitt",
      mockBlowDry: "Föhnen",
      mockColor: "Haarfärbung",
    },
  },

  search: {
    metaTitle: "Salon suchen",

    // Ergebnisüberschrift / Zähler
    allSalons: "Alle Salons",
    resultsCount: "{n} Ergebnisse",
    resultsForQuery: "· für „{q}“",

    // Leerer Zustand
    emptyTitle: "Keine Ergebnisse gefunden",
    emptyDesc: "Erweitere deine Suche oder setze die Filter zurück.",
    clearFilters: "Filter zurücksetzen",

    // Suchleiste (SearchBar)
    typeLabel: "Art",
    allServices: "Alle Leistungen",
    locationLabel: "Ort",
    locationPlaceholder: "Stadt & Bezirk",
    salonNameLabel: "Salonname",
    salonNamePlaceholder: "Salon, Leistung suchen…",
    salonNameAria: "Salon oder Leistung",
    searchButton: "Suchen",
    close: "Schließen",
    serviceTypeTitle: "Leistungsart",

    // Sekundäre Filter (SearchControls)
    filterAll: "Alle",
    sortLabel: "Sortieren:",
    sortRecommended: "Empfohlen",
    sortRating: "Beste Bewertung",
    sortReviews: "Meiste Bewertungen",

    // Ortsauswahl (LocationList)
    provinceSearchPlaceholder: "Provinz suchen… (z. B. Istanbul)",
    allTurkey: "Ganze Türkei",
    backToProvinces: "Zurück zu Provinzen",
    allProvince: "Ganz {province}",
    districtSearchPlaceholder: "Bezirk in {province} suchen…",
    districtCount: "{n} Bezirke",
    noResults: "Keine Ergebnisse gefunden",

    // Kartenpanel (SalonMapPanel)
    viewSalon: "Salon ansehen →",
    backToList: "Zurück zur Liste",
    mapButton: "Karte",
  },

  salon: {
    // Metadaten
    notFoundTitle: "Salon nicht gefunden",
    metaDescriptionFallback: "Preise für {name} ansehen, Bewertungen lesen und online einen Termin buchen.",

    // Breadcrumb
    breadcrumbLabel: "Seitenpfad",
    home: "Startseite",

    // Überschrift / Status
    reviewsCountInline: "({n} Bewertungen)",
    openNow: "Jetzt geöffnet",
    closedNow: "Jetzt geschlossen",

    // Abschnitte
    servicesTitle: "Leistungen",
    select: "Auswählen",
    teamTitle: "Team",
    reviewsTitle: "Bewertungen",
    guest: "Gast",
    ratingSummary: "{label} · {n} Bewertungen",

    // Bewertungslabels (nach Durchschnitt)
    ratingExcellent: "Außergewöhnlich",
    ratingVeryGood: "Hervorragend",
    ratingGood: "Sehr gut",
    ratingAverage: "Gut",
    ratingPoor: "Durchschnittlich",
    businessReplied: "{name} hat geantwortet",
    aboutTitle: "Über uns",
    openingHours: "Öffnungszeiten",
    today: "· Heute",
    closed: "Geschlossen",

    // Terminkarte
    book: "Termin buchen",
    bookNote: "Sofortige Bestätigung · Kostenlose Stornierung",
    todayHours: "Heute: {open} – {close}",
    getDirections: "Route berechnen",
    whatsappChat: "Auf WhatsApp schreiben",
    whatsappGreeting: "Hallo, ich möchte gerne Informationen zu {name} erhalten / nach einem Termin fragen.",

    // Galerie
    openGallery: "Galerie öffnen",
    photoAlt: "{name} Foto {n}",
    allPhotos: "Alle Fotos ({n})",
    close: "Schließen",

    // Favorit
    inFavorites: "In Favoriten",
    addToFavorites: "Zu Favoriten hinzufügen",
    removeFromFavorites: "Aus Favoriten entfernen",

    // Bewertung hinzufügen
    addReview: "Bewertung schreiben",
    thanksTitle: "Danke!",
    reviewPublished: "Deine Bewertung wurde veröffentlicht. Danke, dass du deine Erfahrung teilst! 💛",
    yourRating: "Deine Bewertung",
    starsLabel: "{n} Sterne",
    yourName: "Dein Name",
    yourNamePlaceholder: "Vor- und Nachname",
    yourReview: "Deine Bewertung",
    yourReviewPlaceholder: "Teile deine Erfahrung in wenigen Sätzen...",
    cancel: "Abbrechen",
    submitting: "Wird gesendet...",
    submitReview: "Bewertung senden",
    selectRatingFirst: "Bitte wähle zuerst eine Bewertung.",

    // Salonkarte
    featured: "Empfohlen",
    reviewWord: "Bewertung",

    // Karte
    mapAriaLabel: "Karte, die den Standort von {name} zeigt",
  },

  booking: {
    // Meta-Titel der Terminseite
    metaTitle: "Termin buchen",

    // Überschrift des Flow-Layouts
    secureHeader: "Sichere Buchung · Salonor",

    // Schritte des Assistenten
    steps: {
      services: "Leistungen",
      staff: "Personal",
      dateTime: "Datum & Uhrzeit",
      confirm: "Bestätigung",
    },

    // Erfolgsbildschirm
    success: {
      title: "Dein Termin ist bestätigt!",
      codeLabel: "Dein Termincode",
      viewAppointments: "Meine Termine ansehen",
      backHome: "Zurück zur Startseite",
    },

    // Schritt 1: Leistungen
    services: {
      heading: "Leistung auswählen",
    },

    // Schritt 2: Personal
    staff: {
      heading: "Personal auswählen",
      anyTitle: "Egal",
      anyDesc: "Erstes verfügbares Personal",
      noEligible:
        'Keine Mitarbeiterin kann deine gewählte Leistungskombination allein erbringen. Du kannst mit „Egal“ fortfahren oder deine Leistungsauswahl ändern.',
    },

    // Schritt 3: Datum & Uhrzeit
    dateTime: {
      heading: "Datum und Uhrzeit auswählen",
      noStaffForCombo: "Deine gewählten Leistungen können nicht alle von einer Person erbracht werden.",
      noStaffForComboHint: "Versuche, die Leistungen in getrennten Terminen zu buchen oder deine Auswahl zu ändern.",
      noSlots: "An diesem Tag sind keine freien Zeiten mehr verfügbar.",
      noSlotsHint: "Versuche, einen anderen Tag zu wählen.",
      noOpenDays: "Dieser Salon scheint in den nächsten 14 Tagen geschlossen zu sein.",
      noOpenDaysHint: "Derzeit ist keine Online-Buchung möglich. Bitte kontaktiere den Salon direkt.",
      slotLoadError: "Die freien Zeiten konnten nicht geladen werden.",
      retry: "Erneut versuchen",
      morning: "Morgens",
      afternoon: "Nachmittags",
      evening: "Abends",
    },

    // Schritt 4: Bestätigung
    confirm: {
      heading: "Deinen Termin bestätigen",
      anyStaff: "Verfügbares Personal",
      discountLine: "Rabatt · %{pct}",
      totalLabel: "Gesamt · {duration}",
      couponQuestion: "Hast du einen Rabattcode?",
      couponApplied: "{code} · %{pct} Rabatt angewendet",
      couponRemove: "Entfernen",
      couponPlaceholder: "CODE",
      couponApply: "Anwenden",
      contactHeading: "Deine Kontaktdaten",
      nameLabel: "Vor- und Nachname",
      namePlaceholder: "Vor- und Nachname",
      phoneLabel: "Telefon",
      phoneLabelOptional: "Telefon (optional)",
      phonePlaceholder: "05XX XXX XX XX",
      phoneHint: "Wir senden dir per SMS/WhatsApp eine Terminbestätigung und Erinnerung.",
      noteLabel: "Notiz (optional)",
      notePlaceholder: "Möchtest du dem Salon etwas mitteilen?",
      submitBooking: "Termin bestätigen — {total}",
      submitting: "Wird bestätigt...",
      paymentNote: "Die Zahlung erfolgt im Salon. Du kannst kostenlos stornieren.",
      consentBefore: "Ich stimme zu, dass die für diesen Termin angegebenen personenbezogenen Daten gemäß der ",
      consentLink: "KVKK-Datenschutzerklärung",
      consentAfter: " verarbeitet und für den Termin an den betreffenden Salon weitergegeben werden.",
    },

    // Fehlermeldungen
    errors: {
      nameRequired: "Bitte gib deinen Vor- und Nachnamen ein.",
      phoneRequired: "Gib eine gültige Handynummer ein, damit wir die Bestätigung per SMS senden können (05XX XXX XX XX).",
      connection: "Es ist ein Verbindungsfehler aufgetreten. Bitte versuche es erneut.",
      consentRequired: "Um fortzufahren, musst du die Datenschutzerklärung akzeptieren.",
    },

    // Zusammenfassungskarte (Sidebar) und mobile Leiste
    summary: {
      noServices: "Noch keine Leistung ausgewählt.",
      continue: "Weiter",
      servicesCount: "{count} Leistungen · {total}",
    },

    // Allgemein
    ellipsis: "...",

    // Wird angezeigt, wenn der Rabattcode bei der Buchung ungültig wird (abgelaufen/inaktiv).
    couponDropped:
      "Dein Rabattcode konnte nicht angewendet werden, da er während der Buchung seine Gültigkeit verloren hat. Dein Termin wurde zum vollen Preis erstellt.",

    // KI-Stilberater
    advisor: {
      cardTitle: "KI-Stilberater",
      newBadge: "Neu",
      cardDesc: "Lade dein Foto hoch und wir empfehlen dir den passenden Stil",
      modalTitle: "KI-Stilberater",
      intro: "Lade ein klares Gesichts-/Haarfoto hoch. Die KI bewertet deine Gesichtsform und deinen Haartyp und gibt dir aus",
      introStrong: "den Leistungen dieses Salons",
      introEnd: "eine persönliche Empfehlung.",
      uploadCta: "Foto hochladen",
      uploadHint: "JPG / PNG · maximal 5 MB",
      previewAlt: "Vorschau",
      changePhoto: "Anderes Foto wählen",
      prefsPlaceholder: "Optional: z. B. ‚kurz und pflegeleicht‘",
      analyzing: "Wird analysiert…",
      suggestCta: "Meinen Stil empfehlen",
      evaluation: "Bewertung",
      selectAndContinue: "Diese Leistung auswählen und fortfahren",
      noMatchedService:
        "In diesem Salon wurde keine genau passende Haarleistung gefunden — du kannst unten manuell eine passende Leistung auswählen.",
      reanalyze: "Erneut analysieren",
      disclaimer: "KI-Empfehlungen dienen nur zur Information; die endgültige Entscheidung triffst du gemeinsam mit deiner Expertin.",
      consent: "Ich stimme zu, dass mein Foto an einen KI-Dienst (Google, im Ausland) übermittelt und dort verarbeitet wird, um Stilvorschläge zu erstellen.",
      consentRequired: "Du musst das Kontrollkästchen aktivieren, um fortzufahren.",
      photoLoadError: "Das Foto konnte nicht geladen werden, versuche ein anderes Bild.",
      genericError: "Es ist ein Fehler aufgetreten, bitte versuche es erneut.",
    },
  },

  pricing: {
    metaTitle: "Preise — Salonor Business",
    metaDescription:
      "Salonor-Business-Pakete: Starter, Professional und Enterprise. Termine, Kassenbon, SMS, Bonuspunkte, Geschenkgutscheine, Lager, Provision und KI-Analyse — alles in einem Panel. Monatlich oder jährlich (2 Monate gratis).",

    badge: "Salonor Business",
    title: "Wähle den passenden Plan für dein Geschäft",
    subtitlePrefix: "Jedes Paket umfasst ",
    subtitleEmphasis: "alle Systeme des kleineren Pakets",
    subtitleSuffix:
      " und ergänzt sie um neue Werkzeuge für dein Wachstum. Einrichtung kostenlos, keine langfristige Bindung.",

    trust: {
      noContract: "Keine langfristige Bindung, jederzeit kündbar",
      freeSetup: "Einrichtung kostenlos — unser Team übernimmt das",
      liveSupport: "Live-Support über WhatsApp",
    },

    footnotePrefix:
      "Preise verstehen sich zzgl. MwSt. Salonor ist ausschließlich in der Türkei verfügbar. Dein Konto wird von unserem Team eingerichtet und deine Zugangsdaten werden dir übermittelt. Bei Fragen erreichst du uns unter ",
    footnoteEmail: "isletme@salonor.com",

    billingAriaLabel: "Abrechnungszeitraum",
    monthly: "Monatlich",
    annual: "Jährlich",
    annualBadge: "2 Monate gratis",

    mostPopular: "Am beliebtesten",
    perMonth: "/ Monat",
    annualBilledPrefix: "Jährlich ",
    annualBilledSuffix: " abgerechnet",
    annualSavingsPrefix: "· jährlich ",
    annualSavingsSuffix: " sparen",
    monthlyBilled: "Monatlich abgerechnet · jederzeit kündbar",

    staffLabel: "Mitarbeiter / Nutzer",
    smsBonusLabel: "SMS-Gratisguthaben",

    contactCta: "Kontakt aufnehmen",

    planBaslangicName: "Starter",
    planBaslangicTagline: "Für Einsteiger und Boutique-Salons",
    planProfesyonelName: "Professional",
    planProfesyonelTagline: "Der Favorit wachsender Salons",
    planKurumsalName: "Enterprise",
    planKurumsalTagline: "Für stark frequentierte Betriebe mit vielen Mitarbeitern",

    feature1: "Unbegrenzte Kundendatensätze",
    feature2: "Unbegrenztes Hinzufügen von Leistungen",
    feature3: "Unbegrenzte Terminverwaltung",
    feature4: "SMS-Terminbestätigungssystem",
    feature5: "SMS-Versand",
    feature6: "Kassenbon-System",
    feature7: "Paketverkaufssystem",
    feature8: "Forderungs- / Ratenverkaufsverfolgung",
    feature9: "Einnahmen- / Ausgabenverfolgung",
    feature10: "Mitarbeiter-Provisionssystem",
    feature11: "Bonuspunkte-System",
    feature12: "Geschenkgutschein-System",
    feature13: "Produkt- / Lagerverwaltung",
    feature14: "KI-Analyse",
    feature15: "Berichtswesen",
  },

  business: {
    meta: {
      title: "Salonor für dein Geschäft — Salon-Management-Software",
      description:
        "Online-Buchung, smarter Kalender, Kassenbon, Bonuspunkte, Geschenkgutscheine, Lager, Provision und KI-Analyse — dein gesamter Salon in einem smarten Panel. Einrichtung kostenlos, in 5 Minuten online.",
    },

    modules: {
      smartCalendar: "Smarter Kalender",
      onlineBooking: "Online-Buchung",
      checkoutCashbox: "Kassenbon & Kasse",
      loyaltyPoints: "Bonuspunkte",
      giftCard: "Geschenkgutschein",
      productStock: "Produkt & Lager",
      staffCommission: "Mitarbeiter-Provision",
      debtTracking: "Forderungsverwaltung",
      smsReminder: "SMS & Erinnerung",
      aiAnalysis: "KI-Analyse",
      reports: "Berichte",
      reviewReputation: "Bewertung & Reputation",
    },

    steps: {
      step1Title: "Kontaktiere uns",
      step1Desc: "Fülle das Kontaktformular aus; unser Team meldet sich noch am selben Tag.",
      step1Badge: "Wenige Minuten",
      step2Title: "Wir richten deinen Salon ein",
      step2Desc: "Wir bereiten dein Team, deine Leistungen und deine Öffnungszeiten für dich vor.",
      step2Badge: "Für dich kostenlos",
      step3Title: "Online gehen, Termine sammeln",
      step3Desc: "Deine Salonseite ist online; deine Kunden buchen sofort einen Termin.",
      step3Badge: "Am selben Tag",
    },

    testimonials: {
      quote1:
        "Seit dem Wechsel zu Salonor müssen wir Terminen nicht mehr telefonisch hinterherlaufen. Der Kalender füllt sich von selbst, die Kunden sind sehr zufrieden.",
      role1: "Friseur · Kadıköy",
      quote2:
        "Kassenbon, Kasse, Provision und Lager in einem Panel. Die Monatsabrechnung dauert nur Minuten, kein Hantieren mehr mit Büchern.",
      role2: "Barbier · Beşiktaş",
      quote3:
        "Dank Bonuspunkten und Geschenkgutscheinen kommen die Kunden zurück. Unsere No-Show-Quote ist deutlich gesunken.",
      role3: "Beauty-Center · Bornova",
    },

    hero: {
      badge: "Salonor Business",
      titleLine1: "Dein gesamter Salon",
      titleHighlight: "in einem smarten Panel",
      subtitle:
        "Von der Online-Buchung über den Kassenbon bis zu Bonuspunkten und KI-Analyse — alles, was deinen Salon wachsen lässt, an einem Ort. Reduziere den Telefonverkehr, fülle leere Stühle, schließe die Bücher.",
      ctaStart: "Jetzt starten",
      ctaPackages: "Pakete ansehen",
      proofFreeSetup: "Einrichtung kostenlos",
      proofNoContract: "Kein Vertrag",
      proofLive: "In 5 Minuten online",
      notifNewAppt: "Neuer Termin · Ayşe K.",
      notifApptDetail: "14:30 · Haarfärbung",
      revenueLabel: "Heutiger Umsatz",
    },

    stats: {
      selectBusiness: "ausgewählte Geschäfte",
      bookableService: "buchbare Leistung",
      verifiedReview: "verifizierte Bewertung",
    },

    modulesSection: {
      kicker: "Ein Abo · unbegrenzte Systeme",
      heading: "Alles, um deinen Salon zu führen",
      descBefore: "Vergiss verstreute Bücher, verpasste Anrufe und einzelne Apps. In allen Paketen sind ",
      descBold: "alle",
      descAfter: " der folgenden Systeme enthalten.",
    },

    calendarShowcase: {
      kicker: "Smarter Kalender",
      heading: "Dein ganzer Tag auf einem Bildschirm",
      descBefore:
        "Mit dem farbigen, mitarbeiterbasierten Kalender siehst du sofort, wer wann welche Leistung erbringt. Dank Überschneidungsschutz kommen auf einen Stuhl",
      descBold: " niemals",
      descAfter: " zwei Termine.",
      feat1Title: "Schutz vor Doppelbuchungen",
      feat1Desc: "Zwei Kunden können nicht zur selben Zeit gebucht werden — das System verhindert es.",
      feat2Title: "Walk-in-Kunden hinzufügen",
      feat2Desc: "Nimm Laufkundschaft mit einem Fingertipp in den Kalender auf.",
      feat3Title: "Statusverfolgung",
      feat3Desc: "Bestätigt, abgeschlossen, nicht erschienen — alles farbig und klar.",
    },

    bookingShowcase: {
      kicker: "Online-Buchung",
      heading: "Dein Kalender füllt sich, während du schläfst",
      desc:
        "Deine Kunden buchen Tag und Nacht in Sekunden — ganz ohne Warten am Telefon. Bestätigung und Erinnerung gehen automatisch raus; weniger verpasste Termine, keine leeren Stühle.",
      feat1: "Sofortige Bestätigung rund um die Uhr",
      feat2: "SMS- & WhatsApp-Erinnerung",
      feat3: "Verifizierte Bewertungen",
      feat4: "DSGVO-konform & sicher",
    },

    comparison: {
      heading: "Lass die alte Methode hinter dir",
      sub: "Chaos aus Buch und Telefon oder ein System, das sich von selbst dreht?",
      oldTitle: "Alte Methode",
      old1: "Termine per Telefon, verpasste Anrufe",
      old2: "Chaos im Terminbuch, Doppelbuchungen",
      old3: "Vergessene Termine, leere Stühle",
      old4: "Unklar, wohin der Umsatz fließt",
      old5: "Der Kunde kommt einmal und nie wieder",
      newTitle: "Mit Salonor",
      new1: "Online-Buchung rund um die Uhr, null verpasste Anrufe",
      new2: "Farbiger Kalender + automatischer Überschneidungsschutz",
      new3: "Automatische Erinnerung, volle Stühle",
      new4: "Echtzeit-Berichte zu Umsatz, Auslastung und Leistungen",
      new5: "Wiederkehrende Kunden dank Bonuspunkten & Geschenkgutscheinen",
    },

    testimonialsSection: {
      heading: "Was sagen Salonbesitzer?",
    },

    stepsSection: {
      heading: "In 3 Schritten online",
      sub: "Die Einrichtung übernehmen wir. Du empfängst nur deine Kunden.",
    },

    finalCta: {
      badge: "Einrichtung von uns",
      heading: "Bring deinen Salon noch heute zu Salonor",
      desc:
        "Einrichtung kostenlos, in 5 Minuten bereit. Deine bestehenden Kunden buchen schon heute online.",
      ctaStart: "Jetzt starten",
      ctaPackages: "Pakete ansehen",
      proofNoContract: "Kein Vertrag",
      proofCancel: "Jederzeit kündbar",
      proofSupport: "Support speziell für die Türkei",
    },

    calendarMock: {
      windowTitle: "Salonor · Kalender",
      today: "Heute",
      dayTitle: "Samstag, 14. Juni",
      staffActive: "3 Mitarbeiter aktiv",
    },

    walkInErrors: {
      unauthorized: "Nicht autorisiert.",
      staffNotFound: "Personal nicht gefunden.",
      selectService: "Wähle mindestens eine Leistung.",
      servicesNotFound: "Die ausgewählten Leistungen wurden nicht gefunden.",
      invalidTime: "Ungültige Uhrzeit.",
      staffServiceMismatch: "Dieses Personal erbringt nicht alle ausgewählten Leistungen.",
      invalidPhone: "Gib eine gültige Handynummer ein (05XX XXX XX XX).",
      pastDayEnd: "Der Termin überschreitet das Tagesende (24:00).",
      slotTaken: "Das Personal hat zu dieser Uhrzeit bereits einen anderen Termin.",
      createFailed: "Der Termin konnte nicht hinzugefügt werden. Bitte versuche es erneut.",
    },

    phoneMock: {
      salonName: "Studio Lumière",
      salonMeta: "4.9 (210) · Nişantaşı",
      svc1Name: "Haarschnitt",
      svc1Dur: "45 Min.",
      svc1Price: "₺350",
      svc2Name: "Haarfärbung",
      svc2Dur: "90 Min.",
      svc2Price: "₺900",
      svc3Name: "Gesichtspflege",
      svc3Dur: "60 Min.",
      svc3Price: "₺600",
      bookCta: "Termin buchen",
      confirmTitle: "Dein Termin ist bestätigt",
      confirmDate: "14. Juni · 14:30",
      confirmCode: "SLNR-7K2P9",
      waMessage: "Hallo Ayşe 👋 Wir erinnern dich an deinen Termin morgen um 14:30 💇‍♀️",
      waLabel: "WhatsApp ✓✓",
    },
  },

  auth: {
    login: {
      metaTitle: "Anmelden",
      title: "Willkommen zurück",
      subtitle: "Melde dich an, um deine Termine zu verwalten.",
      demoTitle: "Demo-Konten",
      demoCustomer: "Kunde:",
      demoBusiness: "Geschäft:",
      demoPassword: "Passwort (für beide):",
    },

    fields: {
      email: "E-Mail",
      password: "Passwort",
      name: "Vor- und Nachname",
      phoneOptional: "Telefon (optional)",
      businessEmail: "Deine geschäftliche E-Mail",
    },

    placeholders: {
      email: "beispiel@email.com",
      password: "••••••••",
      name: "Vor- und Nachname",
      phone: "05xx xxx xx xx",
      passwordMin: "Mindestens 6 Zeichen",
      businessEmail: "salon@email.com",
    },

    loginForm: {
      submit: "Anmelden",
      submitPending: "Anmeldung läuft...",
      forgotPassword: "Passwort vergessen?",
      noAccount: "Noch kein Konto?",
      contactUs: "Kontaktiere uns",
      tooManyAttempts: "Du hast zu viele Anmeldeversuche unternommen. Bitte versuche es in ein paar Minuten erneut.",
    },

    registerForm: {
      submit: "Konto erstellen",
      submitPending: "Konto wird erstellt...",
      haveAccount: "Hast du bereits ein Konto?",
      signIn: "Anmelden",
      consentBefore: "Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der ",
      consentLink: "KVKK-Datenschutzerklärung",
      consentAfter: " zu.",
      consentRequired: "Um ein Konto zu erstellen, musst du die Datenschutzerklärung akzeptieren.",
    },

    businessForm: {
      submit: "Weiter — dein Geschäft einrichten",
      submitPending: "Konto wird erstellt...",
      termsNotice: "Indem du fortfährst, akzeptierst du die Nutzungsbedingungen.",
    },

    forgotForm: {
      metaTitle: "Passwort vergessen",
      title: "Passwort vergessen?",
      subtitle: "Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.",
      submit: "Link zum Zurücksetzen senden",
      submitPending: "Wird gesendet...",
      backToLogin: "Zurück zur Anmeldung",
    },

    resetForm: {
      metaTitle: "Passwort zurücksetzen",
      title: "Neues Passwort festlegen",
      subtitle: "Gib ein neues Passwort für dein Konto ein.",
      newPassword: "Neues Passwort",
      newPasswordAgain: "Neues Passwort (wiederholen)",
      submit: "Passwort aktualisieren",
      submitPending: "Wird gespeichert...",
      invalid: "Dieser Link zum Zurücksetzen ist ungültig oder abgelaufen (Links sind 1 Stunde gültig).",
      requestNew: "Neuen Link anfordern",
    },
  },

  account: {
    // Konto-Layout (Kopfzeile)
    greeting: "Hallo, {name} 👋",
    layoutSubtitle: "Verwalte hier deine Termine und dein Konto.",

    // Tab-Navigation
    tabs: {
      appointments: "Meine Termine",
      favorites: "Meine Favoriten",
      profile: "Mein Profil",
    },

    // Seitentitel (Metadaten)
    meta: {
      appointments: "Meine Termine",
      profile: "Mein Profil",
      favorites: "Meine Favoriten",
    },

    // Terminseite
    appointments: {
      statusConfirmed: "Bestätigt",
      statusCompleted: "Abgeschlossen",
      statusCancelled: "Storniert",
      statusNoShow: "Nicht erschienen",
      emptyTitle: "Du hast noch keine Termine",
      emptyDesc: "Entdecke die besten Salons in deiner Nähe und buche deinen ersten Termin in Sekunden.",
      discoverSalons: "Salons entdecken",
      upcomingTitle: "Anstehende Termine ({n})",
      noUpcoming: "Du hast keine anstehenden Termine.",
      newAppointment: "Neuen Termin buchen →",
      pastTitle: "Vergangene",
      withStaff: "mit {name}",
      codeAndTotal: "Code: {code} · {total}",
      rebook: "Erneut buchen",
    },

    // Favoritenseite
    favorites: {
      emptyTitle: "Du hast noch keine Favoriten",
      emptyDesc: "Speichere die Salons, die dir gefallen, mit einem Tipp aufs Herz; sie warten alle hier auf dich.",
      discoverSalons: "Salons entdecken",
    },

    // Profilformular
    profile: {
      nameLabel: "Vor- und Nachname",
      emailLabel: "E-Mail",
      emailHint: "Die E-Mail-Adresse kann nicht geändert werden.",
      phoneLabel: "Telefon",
      phonePlaceholder: "05xx xxx xx xx",
      passwordSectionTitle: "Passwort ändern (optional)",
      currentPasswordLabel: "Aktuelles Passwort",
      newPasswordLabel: "Neues Passwort",
      updated: "Dein Profil wurde aktualisiert.",
      save: "Änderungen speichern",
    },

    // Stornierungsbutton für Termine
    cancel: {
      cancel: "Stornieren",
      confirm: "Bist du sicher?",
      cancelling: "Wird storniert...",
      yesCancel: "Ja, stornieren",
      dismiss: "Abbrechen",
    },

    // Bewertungs-Modal
    review: {
      shareOnGoogle: "Auf Google teilen",
      rate: "Bewerten",
      thanksTitle: "Danke!",
      thanksDesc: "Deine Bewertung wurde veröffentlicht, du hast anderen Nutzern den Weg gewiesen.",
      alsoGoogleTitle: "Teilst du es auch auf Google?",
      alsoGoogleDesc: "Deine Bewertung für {name} auf Google ist uns sehr wertvoll.",
      rateOnGoogle: "Auf Google bewerten",
      close: "Schließen",
      ratingLabel: "Deine Bewertung",
      starsAria: "{n} Sterne",
      experienceLabel: "Deine Erfahrung",
      commentPlaceholder: "Wie war die Leistung? Zeige anderen Nutzern den Weg...",
      submitting: "Wird gesendet...",
      submitReview: "Bewertung senden",
    },
  },

  legal: {
    // Gemeinsame Hilfskomponente (info-page.tsx)
    brand: "Salonor",
    lastUpdated: "Zuletzt aktualisiert:",

    // Über uns
    about: {
      metaTitle: "Über uns",
      title: "Über uns",
      intro:
        "Salonor ist eine für die Türkei konzipierte Buchungsplattform, mit der du Beauty- und Pflegetermine in Sekunden buchst.",
      missionTitle: "Unsere Mission",
      missionBody:
        "Wir möchten den Zugang zu Friseur-, Barber-, Spa-, Nagel- und Beauty-Leistungen für alle einfach, transparent und zuverlässig machen. Wir beenden das Zeitalter der telefonischen Terminjagd; passende Uhrzeiten, echte Bewertungen und klare Preise vereinen wir auf einem Bildschirm.",
      customersTitle: "Für Kunden",
      customersBody:
        "Entdecke die besten Salons in deiner Nähe, sieh dir Fotos und verifizierte Bewertungen an, wähle die für dich passende Uhrzeit und sichere dir deinen Platz sofort — und das völlig kostenlos.",
      businessesTitle: "Für Unternehmen",
      businessesBody:
        "Mit Salonor Business vereinst du Termin-, Kalender-, Mitarbeiter- und Leistungsverwaltung in einem Panel; nimm rund um die Uhr Online-Termine an, gewinne mit Bewertungen Vertrauen und erreiche neue Kunden.",
      valuesTitle: "Unsere Werte",
      valuesBody:
        "Transparenz, Geschwindigkeit und Vertrauen. Wir arbeiten daran, einen fairen und nützlichen Marktplatz aufzubauen, bei dem sowohl Gäste als auch Unternehmen gewinnen.",
    },

    // Datenschutz & DSGVO
    privacy: {
      metaTitle: "Datenschutz & DSGVO",
      title: "Datenschutz- und DSGVO-Erklärung",
      updated: "13. Juni 2026",
      intro:
        "Die Sicherheit deiner personenbezogenen Daten ist uns wichtig. Dieser Text fasst zusammen, wie deine Daten bei der Nutzung von Salonor verarbeitet werden.",
      controllerTitle: "Verantwortlicher",
      controllerBody:
        "Im Sinne des türkischen Datenschutzgesetzes Nr. 6698 (KVKK) ist der Verantwortliche Ferhat Gökel, der die Salonor-Plattform als natürliche Person / Einzelunternehmen betreibt. Salonor ist derzeit keine Aktiengesellschaft. Deine Fragen und KVKK-Anfragen kannst du an destek@salonor.com richten.",
      dataTitle: "Verarbeitete Daten",
      dataBody:
        "Deine Kontodaten (Name, E-Mail, Telefon), dein Terminverlauf, deine Lieblingssalons und deine geschriebenen Bewertungen; außerdem werden zur Sicherung der Servicequalität grundlegende Nutzungsdaten verarbeitet. In der Business-App können wir Zugriff auf deine Gerätekontakte anfragen, damit du im Namen eines Kunden schnell einen Termin anlegen kannst; dabei werden nur Name und Telefon des von dir gewählten Kontakts verwendet — deine gesamte Kontaktliste bleibt auf deinem Gerät und wird nie an unsere Server gesendet.",
      purposesTitle: "Verarbeitungszwecke",
      purposesBody:
        "Wir verarbeiten deine Daten, um deine Termine zu erstellen und zu verwalten, dir Terminerinnerungen (SMS/WhatsApp/E-Mail) zu senden, die Sicherheit deines Kontos zu gewährleisten und die Plattform zu verbessern.",
      sharingTitle: "Weitergabe",
      sharingBody:
        "Mit dem Unternehmen, bei dem du einen Termin buchst, werden die zur Durchführung deines Termins erforderlichen Informationen geteilt. Deine Daten werden nicht zu Marketingzwecken an Dritte verkauft.",
      aiTitle: "Datenverarbeitung mit künstlicher Intelligenz",
      aiBody:
        "Wenn du die Funktion KI-Stilberater nutzt, werden das von dir hochgeladene Foto und die von dir hinzugefügten Notizen zur Erstellung von Stilvorschlägen an unseren KI-Dienstleister Google (Server im Ausland) übermittelt und dort verarbeitet. Diese Funktion ist vollkommen optional und funktioniert nur mit deiner ausdrücklichen Einwilligung; wenn du nicht einwilligst, wird dein Foto an keinen Ort gesendet. Die Fotos werden von Salonor nach der Erstellung des Vorschlags nicht gespeichert.",
      rightsTitle: "Deine Rechte",
      rightsBody:
        "Gemäß Artikel 11 des KVKK hast du das Recht, auf deine Daten zuzugreifen, sie zu korrigieren, zu löschen und der Verarbeitung zu widersprechen. Für deine Anliegen: destek@salonor.com.",
    },

    // Nutzungsbedingungen
    terms: {
      metaTitle: "Nutzungsbedingungen",
      title: "Nutzungsbedingungen",
      updated: "13. Juni 2026",
      intro: "Mit der Nutzung von Salonor akzeptierst du die folgenden Bedingungen.",
      serviceTitle: "Dienst",
      serviceBody:
        "Salonor ist eine Buchungsplattform, die Gäste mit Beauty- und Pflegeunternehmen zusammenbringt. Die Leistungen werden von den Unternehmen erbracht; Salonor ist Vermittler.",
      accountTitle: "Konto",
      accountBody:
        "Du bist für die Sicherheit deines Kontos und die Richtigkeit deiner Angaben verantwortlich. Personen unter 18 Jahren dürfen die Plattform nur mit Zustimmung der Erziehungsberechtigten nutzen.",
      bookingsTitle: "Termine und Stornierung",
      bookingsBody:
        "Es wird erwartet, dass du zu deinen Terminen pünktlich erscheinst. Stornierungs- und Änderungsregeln können von Unternehmen zu Unternehmen variieren; es gelten die Bedingungen auf der Terminseite.",
      reviewsTitle: "Bewertungen",
      reviewsBody:
        "Du solltest nur für tatsächlich erlebte Leistungen ehrliche und respektvolle Bewertungen teilen. Beleidigungen, Spam und irreführende Inhalte werden entfernt.",
      liabilityTitle: "Haftung",
      liabilityBody:
        "Für die Qualität der Leistung ist das jeweilige Unternehmen verantwortlich. Salonor bemüht sich um einen unterbrechungsfreien Betrieb der Plattform, technische Störungen können jedoch auftreten.",
    },

    // FAQ
    faq: {
      metaTitle: "Hilfe & häufig gestellte Fragen",
      title: "Hilfe & häufig gestellte Fragen",
      intro:
        "Hier findest du die Antworten auf die meisten deiner Fragen. Findest du sie nicht, ist destek@salonor.com immer erreichbar.",
      q1: "Ist die Nutzung von Salonor kostenpflichtig?",
      a1: "Nein. Für Gäste ist das Buchen von Terminen völlig kostenlos; du zahlst nur für die im Salon erhaltene Leistung.",
      q2: "Wie storniere ich meinen Termin?",
      a2: "Du kannst deinen Termin unter Mein Konto → Meine Termine ansehen und stornieren. Die Stornierungsbedingungen können je nach Unternehmen variieren.",
      q3: "Bekomme ich eine Terminerinnerung?",
      a3: "Ja. Wenn dein Termin näher rückt, wird über den von dir gewählten Kanal (SMS, WhatsApp oder E-Mail) eine Erinnerung gesendet.",
      q4: "Sind die Bewertungen echt?",
      a4: "Bewertungen werden nur von Gästen geschrieben, die ihren Termin abgeschlossen haben; so beruhen die angezeigten Bewertungen auf echten Erfahrungen.",
      q5: "Wie füge ich mein Unternehmen hinzu?",
      a5: "Registriere dich kostenlos über die Seite Salonor für dein Geschäft; mit einer 5-minütigen Einrichtung kannst du deinen Salon online stellen.",
    },

    // Kontakt
    contact: {
      metaTitle: "Kontakt",
      title: "Kontakt",
      intro:
        "Möchtest du dein Geschäft zu Salonor hinzufügen? Fülle das untenstehende Formular aus, unser Team meldet sich bei dir.",
      addBusinessTitle: "Füge dein Geschäft zu Salonor hinzu",
      addBusinessBody:
        "Egal ob Salon, Friseur, Barber, Spa oder Beauty-Center — hinterlasse deine Angaben, wir richten dein Geschäft kostenlos ein und du nimmst sofort Online-Termine an.",
      cardSupportTitle: "Kundensupport",
      cardPartnerTitle: "Unternehmenskooperation",
      cardPressTitle: "Presse & Sonstiges",
      hoursTitle: "Öffnungszeiten",
      hoursBody:
        "Unser Support-Team beantwortet schriftliche Anfragen werktags von 09:00 bis 18:00 Uhr. In der Regel melden wir uns noch am selben Tag.",
      businessTitle: "Bist du ein Unternehmen?",
      businessBodyBefore: "Um Salonor Business kennenzulernen und dein Geschäft hinzuzufügen, schreib uns an ",
      businessBodyAfter:
        " oder starte direkt über die Registrierungsseite.",
    },

    // Kontaktformular (contact-form.tsx, Client-Komponente)
    contactForm: {
      successTitle: "Deine Anfrage hat uns erreicht 🎉",
      successBody:
        "Unser Team meldet sich schnellstmöglich bei dir und fügt dein Geschäft zu Salonor hinzu.",
      nameLabel: "Vor- und Nachname",
      namePlaceholder: "Vor- und Nachname",
      emailLabel: "E-Mail",
      emailPlaceholder: "beispiel@email.com",
      phoneLabel: "Telefon",
      phonePlaceholder: "05xx xxx xx xx",
      messageLabel: "Über dein Geschäft (optional)",
      messagePlaceholder: "Erzähle kurz vom Namen, der Stadt und den Leistungen deines Salons...",
      pendingText: "Wird gesendet...",
      submit: "Anfrage senden",
      disclaimer: "Deine Angaben werden nur verwendet, um mit dir Kontakt aufzunehmen.",
      consentBefore: "Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der ",
      consentLink: "KVKK-Datenschutzerklärung",
      consentAfter: " sowie der Kontaktaufnahme zu.",
      consentRequired: "Um fortzufahren, musst du die Datenschutzerklärung akzeptieren.",
    },

    distanceSales: {
      metaTitle: "Fernabsatzvertrag",
      title: "Fernabsatzvertrag",
      updated: "23. Juni 2026",
      intro:
        "Dieser Vertrag regelt die Rechte und Pflichten der Parteien beim Online-Verkauf der kostenpflichtigen Salonor-Business-Pakete gemäß dem türkischen Verbraucherschutzgesetz Nr. 6502 und der Verordnung über Fernabsatzverträge.",
      partiesTitle: "1. Parteien",
      partiesBody:
        "VERKÄUFER: Ferhat Gökel, der die Salonor-Plattform als natürliche Person / Einzelunternehmen betreibt. Kontakt- und Adressdaten findest du im Vorinformationsformular und auf der Kontaktseite. KÄUFER: das Unternehmen / der Nutzer, das/der ein Salonor-Business-Paket erwirbt.",
      subjectTitle: "2. Vertragsgegenstand",
      subjectBody:
        "Gegenstand des Vertrags ist der Verkauf und die Bereitstellung des vom Käufer elektronisch bestellten Salonor-Business-Software-Abonnements (Paket Starter, Professional oder Enterprise), dessen Eigenschaften und Verkaufspreis auf der Preisseite angegeben sind.",
      productTitle: "3. Leistung und Preis",
      productBody:
        "Die Leistung ist eine Abonnement-Software, die je nach gewähltem Paket Termine, Kalender, Kassensystem, SMS, Berichte und weitere Panel-Funktionen umfasst. Paketpreise, Abrechnungszeitraum (monatlich/jährlich) und etwaige Steuern werden aktuell auf der Preisseite angezeigt. Preise verstehen sich ohne MwSt.",
      paymentTitle: "4. Zahlung",
      paymentBody:
        "Die Zahlung wird gemäß dem gewählten Paket und Abrechnungszeitraum eingezogen. Für den Beginn des Abonnements ist die Zahlung erforderlich; dein Konto wird von unserem Team eingerichtet und deine Zugangsdaten werden dir zugesandt.",
      deliveryTitle: "5. Lieferung / Erfüllung",
      deliveryBody:
        "Die Leistung ist digital; nach Zahlungsfreigabe wird dein Konto eingerichtet und der Panel-Zugang aktiviert. Ausnahmen vom Widerrufsrecht bei sofort erbrachten digitalen Diensten sind in der Widerrufs- und Rückerstattungsrichtlinie erläutert.",
      withdrawalTitle: "6. Widerrufsrecht",
      withdrawalBody:
        "Der Käufer hat das gesetzlich vorgesehene 14-tägige Widerrufsrecht. Ausübung, Ausnahmen und Rückerstattungsprozess findest du auf der Seite Widerrufs- und Rückerstattungsrichtlinie.",
      disputeTitle: "7. Streitbeilegung",
      disputeBody:
        "Für Streitigkeiten aus diesem Vertrag sind die Verbraucherschlichtungsstellen und Verbrauchergerichte innerhalb der jeweiligen Wertgrenzen zuständig. Für Beschwerden und Anliegen: destek@salonor.com.",
    },

    preInfo: {
      metaTitle: "Vorinformationsformular",
      title: "Vorinformationsformular",
      updated: "23. Juni 2026",
      intro:
        "Dieses Formular enthält die Punkte, über die du vor dem Kauf der kostenpflichtigen Salonor-Business-Pakete gemäß dem Gesetz Nr. 6502 und der Verordnung über Fernabsatzverträge informiert werden musst.",
      sellerTitle: "Verkäuferinformationen",
      sellerBody:
        "Verkäufer ist Ferhat Gökel, der die Salonor-Plattform als natürliche Person / Einzelunternehmen betreibt (keine Aktiengesellschaft). Für vollständige Adresse sowie Steuer-/Kontaktdaten gelten die aktuellen Werte im company-info-Eintrag; bei Fragen: destek@salonor.com und isletme@salonor.com.",
      productTitle: "Wesentliche Eigenschaften der Leistung",
      productBody:
        "Die Leistung ist die Salonor-Business-Abonnement-Software für Termin- und Geschäftsverwaltung. Die in den Paketen (Starter, Professional, Enterprise) enthaltenen Funktionen sind auf der Preisseite ausführlich aufgeführt.",
      priceTitle: "Preis und Zahlung",
      priceBody:
        "Der Gesamtpreis (inkl./exkl. Steuern), der Abrechnungszeitraum und die Zahlungsweise werden im Bestellbildschirm und auf der Preisseite angezeigt. Preise verstehen sich ohne MwSt. Das Abonnement verlängert sich gemäß dem gewählten Zeitraum.",
      deliveryTitle: "Erfüllung und Laufzeit",
      deliveryBody:
        "Die Leistung ist digital und der Zugang wird nach Zahlungsbestätigung durch Einrichtung deines Kontos aktiviert. Die Laufzeit des Abonnements richtet sich nach dem von dir gewählten monatlichen oder jährlichen Zeitraum.",
      withdrawalTitle: "Widerrufsrecht",
      withdrawalBody:
        "Dein 14-tägiges Widerrufsrecht und dessen Ausnahmen für digitale Dienste sind auf der Seite Widerrufs- und Rückerstattungsrichtlinie erläutert. Deine Widerrufserklärung kannst du an destek@salonor.com senden.",
      complaintTitle: "Beschwerden und Anträge",
      complaintBody:
        "Anliegen und Beschwerden kannst du an destek@salonor.com richten; bei ungelösten Streitigkeiten kannst du dich je nach gesetzlichen Wertgrenzen an die Verbraucherschlichtungsstelle oder das Verbrauchergericht wenden.",
    },

    withdrawal: {
      metaTitle: "Widerrufs- und Rückerstattungsrichtlinie",
      title: "Widerrufs- und Rückerstattungsrichtlinie",
      updated: "23. Juni 2026",
      intro:
        "Dein Widerrufsrecht und die Rückerstattungsbedingungen für die kostenpflichtigen Salonor-Business-Pakete sind nachstehend erläutert.",
      rightTitle: "Widerrufsfrist",
      rightBody:
        "Bei Fernabsatzverträgen hast du das Recht, innerhalb von 14 Tagen ab Kaufdatum ohne Angabe von Gründen und ohne Vertragsstrafe vom Vertrag zurückzutreten.",
      howTitle: "Ausübung des Widerrufsrechts",
      howBody:
        "Um dein Widerrufsrecht auszuüben, genügt es, innerhalb von 14 Tagen eine eindeutige Erklärung an destek@salonor.com zu senden. Gib in deiner Erklärung deine Konto-/Geschäftsdaten und deinen Widerrufswunsch an.",
      exceptionTitle: "Ausnahme vom Widerrufsrecht (digitaler Dienst)",
      exceptionBody:
        "Nach der Gesetzgebung kann das Widerrufsrecht bei digitalen Inhalten/Diensten, mit deren Ausführung mit Zustimmung des Verbrauchers vor Ablauf der Widerrufsfrist begonnen wurde und die sofort erbracht werden, nicht ausgeübt werden. Daher kann das Widerrufsrecht eingeschränkt sein, sobald dein Konto eingerichtet und der Panel-Zugang aktiviert wurde (Ausführung begonnen); dies wird beim Kauf gesondert zu deiner Zustimmung vorgelegt.",
      refundTitle: "Rückerstattungsprozess",
      refundBody:
        "Bei einem gültigen Widerruf wird der von dir gezahlte Betrag innerhalb von 14 Tagen ab Eingang deiner Widerrufserklärung über die von dir verwendete Zahlungsmethode und ohne Zusatzkosten erstattet.",
      contactTitle: "Kontakt",
      contactBody:
        "Für Widerrufs- und Rückerstattungsanliegen kannst du an destek@salonor.com schreiben.",
    },

    cookies: {
      metaTitle: "Cookie-Richtlinie",
      title: "Cookie-Richtlinie",
      updated: "23. Juni 2026",
      intro:
        "Diese Richtlinie erläutert, welche Cookies und ähnlichen Technologien wir bei der Nutzung von Salonor verwenden und wie du deine Einstellungen verwalten kannst.",
      whatTitle: "Was ist ein Cookie?",
      whatBody:
        "Cookies sind kleine Textdateien, die von den von dir besuchten Websites auf deinem Gerät gespeichert werden. Sie dienen dazu, deine Einstellungen zu merken und die Website zu verbessern.",
      typesTitle: "Von uns verwendete Cookies",
      typesBody:
        "Notwendige Cookies: erforderlich für Grundfunktionen wie Sitzung und Sprachpräferenz (z. B. das Cookie salonor_locale für deine Sprachpräferenz und das Cookie salonor_cookie_consent für deine Cookie-Einwilligung). Diese Cookies sind immer aktiv. Analyse-Cookies: Vercel Analytics wird zur Messung des Traffics und zur Verbesserung des Erlebnisses verwendet und wird nur geladen, wenn du der Cookie-Einwilligung zustimmst.",
      analyticsTitle: "Analyse und Dritte",
      analyticsBody:
        "Wir nutzen den Dienst Vercel Analytics, um den Website-Traffic zu verstehen. Analyse-Cookies werden nicht ausgeführt, sofern du im Cookie-Banner am Seitenende nicht auf 'Akzeptieren' klickst; mit der Option 'Nur notwendige' kannst du ablehnen.",
      manageTitle: "Einstellungen verwalten",
      manageBody:
        "Du kannst deine Cookie-Einstellung im Cookie-Banner am Seitenende festlegen; außerdem kannst du Cookies in den Browsereinstellungen löschen oder blockieren. Das Blockieren notwendiger Cookies kann einige Funktionen der Website beeinträchtigen.",
      contactTitle: "Kontakt",
      contactBody:
        "Fragen zu Cookies kannst du an destek@salonor.com richten.",
    },
  },

  panelCore: {
    // Sidebar — Abschnittsüberschriften
    navDailyTitle: "Täglich",
    navSalesTitle: "Verkauf & Finanzen",
    navCatalogTitle: "Katalog",
    navMarketingTitle: "Marketing",
    navCustomerTitle: "Kunden",
    navToolsTitle: "Tools & Einstellungen",

    // Sidebar — Menübeschriftungen
    navOverview: "Übersicht",
    navCalendar: "Kalender",
    navNotifications: "Benachrichtigungen",
    navCashbox: "Kasse & Bon",
    navDebts: "Forderungen & Raten",
    navReports: "Berichte",
    navExpenses: "Ausgaben",
    navServices: "Leistungen",
    navStaff: "Personal",
    navCommission: "Provision & Performance",
    navPackages: "Pakete",
    navProducts: "Produkte & Lager",
    navCampaigns: "Kampagnen",
    navGiftCard: "Geschenkgutschein",
    navLoyalty: "Bonuspunkte",
    navSms: "SMS",
    navMessaging: "Nachrichten",
    navCustomers: "Kunden",
    navLostCustomers: "Verlorene Kunden",
    navReviews: "Bewertungen",
    navAiAnalysis: "KI-Analyse",
    navTodos: "Aufgaben",
    navSettings: "Einstellungen",

    // Sidebar — untere Aktionen / Beschriftungen
    businessLabel: "Geschäft",
    viewMyPage: "Meine Seite ansehen",
    logout: "Abmelden",
    loggingOut: "Abmeldung läuft...",
    menu: "Menü",
    close: "Schließen",

    // Dashboard (Übersicht)
    dashboardTitle: "Übersicht",
    goToCalendar: "Zum Kalender",
    statTodayAppts: "Termine heute",
    statTodayRevenue: "Umsatz heute",
    statWeekRevenue: "Umsatz 7 Tage",
    statRating: "Bewertung",
    todaySchedule: "Heutiges Programm",
    calendar: "Kalender",
    noApptsToday: "Heute keine Termine",
    noApptsTodayDesc: "Du kannst über den Kalender manuell Termine hinzufügen.",
    noShowTag: "Nicht erschienen",
    last7Days: "Letzte 7 Tage",
    summary: "Zusammenfassung",
    nextAppt: "Nächster Termin",
    upcomingAppts: "Anstehende Termine",
    totalReviews: "Bewertungen gesamt",
    activeStaff: "Aktives Personal",

    // Kalender (CalendarBoard)
    calendarTitle: "Kalender",
    newAppt: "Termin",
    prevDay: "Vorheriger Tag",
    nextDay: "Nächster Tag",
    today: "Heute",
    noStaffTitle: "Noch kein Personal",
    noStaffDesc: "Um den Kalender zu nutzen, musst du zuerst dein Team hinzufügen.",
    addStaff: "Personal hinzufügen",
    closedNotice: "An diesem Tag bist du laut deinen Öffnungszeiten geschlossen — du kannst trotzdem einen Termin hinzufügen.",

    // Kalender — Legende
    legendConfirmed: "Bestätigt",
    legendCompleted: "Abgeschlossen",
    legendNoShow: "Nicht erschienen",

    // Modal: Neuer Termin
    newApptTitle: "Neuer Termin",
    staffField: "Personal",
    startField: "Beginn",
    customerNameField: "Kundenname",
    customerNamePlaceholder: "z. B. Ayşe K. (kann leer bleiben)",
    phoneField: "Telefon (für Erinnerung)",
    phonePlaceholder: "05XX XXX XX XX (optional)",
    pickFromContacts: "Aus Kontakten wählen",
    pickedNoMobile: "Der gewählte Kontakt hat keine gültige Mobilnummer.",
    servicesField: "Leistungen",
    selectAtLeastOneService: "Wähle mindestens eine Leistung.",
    overflowsDay: "Dieser Termin überschreitet das Tagesende ({end}).",
    cancel: "Abbrechen",
    adding: "Wird hinzugefügt...",
    addAppt: "Termin hinzufügen",

    // Modal: Termindetails
    statusConfirmed: "Bestätigt",
    statusCompleted: "Abgeschlossen",
    statusNoShow: "Nicht erschienen",
    statusCancelled: "Storniert",
    withStaff: "mit {staff}",
    noteLabel: "Notiz:",
    markCompleted: "Als abgeschlossen markieren",
    markNoShow: "Nicht erschienen",
    cancelAppt: "Stornieren",
    apptStatusInfo: "Dieser Termin hat den Status {status}.",

    // Benachrichtigungsseite
    notificationsMetaTitle: "Benachrichtigungen",
    notificationsTitle: "Benachrichtigungen",
    notificationsSubtitle:
      "Bestätige neue Terminanfragen und sende Erinnerungen für anstehende Termine",
    reminderInfoReady: "fertig ausgefüllt",
    reminderInfoMarked: "„Erinnert“",
    reminderInfoBefore: "Beim Tippen auf die Schaltfläche öffnet sich die Nachricht ",
    reminderInfoMiddle:
      " in deiner WhatsApp-/SMS-App; du musst sie nur noch senden. Gesendete werden automatisch als ",
    reminderInfoAfter:
      " markiert, damit du derselben Person nicht zweimal schreibst. Keine Zusatzkosten, keine Einrichtung.",
    noUpcomingTitle: "Keine anstehenden Termine",
    noUpcomingDesc: "Für die nächsten 3 Tage gibt es keine bestätigten Termine.",
    reminderMessageBody:
      "Hallo {name}, Terminerinnerung von {business}: {date} {time}. Wir freuen uns auf dich! 😊",

    // Neue Terminanfragen (NewBookings)
    newBookingRequests: "Neue Terminanfrage",
    approveAll: "Alle bestätigen",
    approve: "Bestätigen",
    approveFailed: "Bestätigung fehlgeschlagen. Bitte versuche es erneut.",

    // Erinnerungsliste (ReminderList)
    reminderSaveFailed: "Markierung konnte nicht gespeichert werden, bitte versuche es erneut.",
    remindNow: "Sollte jetzt erinnert werden",
    pendingCount: "{n} ausstehend",
    upcomingSection: "Anstehend (nächste 3 Tage)",
    noPhone: "Keine Telefonnummer",
    reminded: "Erinnert",
    undo: "Rückgängig",
    whatsapp: "WhatsApp",
    call: "Anrufen",
    sms: "SMS",

    // Gemeinsame Fallback-Beschriftungen (statischer Text, wenn DB-Daten leer sind)
    fallbackCustomer: "Kunde",
    fallbackAppt: "Termin",

    suspended: {
      title: "Dein Konto wurde gesperrt",
      desc: "Dein Geschäftskonto wurde vorübergehend gesperrt. Bitte wende dich an den Support.",
      backHome: "Zurück zur Startseite",
    },
  },

  panelCatalog: {
    // ── Leistungsseite / ServicesManager ──
    services: {
      title: "Leistungen",
      subtitle: "{count} Leistungen · {sections} Abschnitte",
      addSection: "Abschnitt",
      addService: "Leistung hinzufügen",
      addServiceShort: "Leistung",
      emptyTitle: "Noch keine Abschnitte",
      emptyDesc: 'Um deine Leistungen zu gruppieren, erstelle zuerst einen Abschnitt (z. B. "Schnitt", "Farbe").',
      addFirstSection: "Ersten Abschnitt hinzufügen",
      deleteSectionAria: "Abschnitt löschen",
      emptySection: "In diesem Abschnitt gibt es noch keine Leistung.",
      editAria: "Bearbeiten",
      deleteAria: "Löschen",
      confirmDeleteSection: 'Der Abschnitt "{name}" wird gelöscht. Bist du sicher?',
      confirmDeleteService: 'Die Leistung "{name}" wird gelöscht. Bist du sicher?',

      // Modal: Leistung hinzufügen/bearbeiten
      modalEditTitle: "Leistung bearbeiten",
      modalNewTitle: "Neue Leistung",
      sectionLabel: "Abschnitt",
      nameLabel: "Leistungsname",
      namePlaceholder: "z. B. Damen-Haarschnitt",
      descLabel: "Beschreibung (optional)",
      descPlaceholder: "z. B. inkl. Haaranalyse + Waschen + Schnitt + Föhnen",
      durationLabel: "Dauer (Min.)",
      priceLabel: "Preis (₺)",
      cancel: "Abbrechen",
      save: "Speichern",
      add: "Hinzufügen",

      // Modal: Abschnitt hinzufügen
      categoryModalTitle: "Neuer Abschnitt",
      categoryNameLabel: "Abschnittsname",
      categoryNamePlaceholder: "z. B. Schnitt & Styling",
    },

    // ── Personalseite / StaffManager ──
    staff: {
      title: "Personal",
      subtitle: "{count} aktive Mitarbeiter",
      addStaff: "Personal hinzufügen",
      emptyTitle: "Noch kein Personal",
      emptyDesc: "Füge dein Team hinzu, damit Termine diesen Personen zugewiesen werden können.",
      addFirstStaff: "Ersten Mitarbeiter hinzufügen",
      inactiveBadge: "Inaktiv",
      summary: "{services} Leistungen · {appointments} Termine",
      edit: "Bearbeiten",
      deactivate: "Deaktivieren",
      activate: "Aktivieren",
      deleteAria: "Löschen",
      confirmDeactivate:
        "{name} kann nicht gelöscht werden, da vergangene Termine vorliegen. Stattdessen wird die Person deaktiviert. Fortfahren?",
      confirmDelete:
        "{name} wird dauerhaft gelöscht (inkl. Provisions- und Leistungszuweisungen). Dieser Vorgang kann nicht rückgängig gemacht werden. Bist du sicher?",

      // Modal: Personal hinzufügen/bearbeiten
      modalEditTitle: "Personal bearbeiten",
      modalNewTitle: "Neues Personal",
      nameLabel: "Vor- und Nachname",
      namePlaceholder: "z. B. Elif Aydın",
      titleLabel: "Position",
      titlePlaceholder: "z. B. Farbspezialistin",
      cancel: "Abbrechen",
      save: "Speichern",
      add: "Hinzufügen",
      saving: "Wird gespeichert...",

      // Leistungszuweisung (Leistungen, die der Mitarbeiter erbringen kann)
      manageServices: "Leistungen",
      servicesModalTitle: "{name} — Leistungen",
      saveServices: "Leistungen speichern",
      noServices: "Füge zuerst Leistungen hinzu, dann kannst du sie dem Personal zuweisen.",

      // Plan-Personallimit
      staffLimitReached:
        "Im {plan}-Paket kannst du höchstens {limit} aktive Mitarbeiter hinzufügen. Für mehr aktualisiere dein Paket.",
    },

    // ── Einstellungsseite ──
    settings: {
      title: "Einstellungen",
      subtitle: "Verwalte dein Geschäftsprofil und deine Öffnungszeiten",
      publicPage: "Meine veröffentlichte Seite",
      businessInfo: "Geschäftsinformationen",
      workingHours: "Öffnungszeiten",
      coverTitle: "Titelbild",
      coverDesc: "Wähle das obere Bild deiner Salonseite. (Vorgefertigte Bildauswahl für die Demo)",
    },

    // ── Geschäftsprofilformular ──
    profile: {
      nameLabel: "Geschäftsname",
      descLabel: "Beschreibung",
      promoLabel: "📣 Hervorgehobene Kampagne / Ankündigung",
      promoPlaceholder: "z. B. Diese Woche 20 % Rabatt auf Haarfärbung!",
      promoUntilLabel: "Enddatum (optional):",
      promoHint:
        "Wenn du etwas einträgst, erscheint es als auffälliges Band ganz oben auf deiner Salonseite. Lässt du es leer, wird es nicht angezeigt. Nach Ablauf des Enddatums wird es automatisch ausgeblendet.",
      phoneLabel: "Telefon",
      phonePlaceholder: "0212 000 00 00",
      whatsappLabel: "WhatsApp-Nummer",
      whatsappPlaceholder: "05XX XXX XX XX (falls leer, wird die Telefonnummer verwendet)",
      whatsappHint:
        "Der Button „Auf WhatsApp schreiben“ auf deiner Salonseite öffnet diese Nummer. Lässt du sie leer, wird deine Telefonnummer verwendet.",
      cityLabel: "Stadt",
      addressLabel: "Adresse",
      districtLabel: "Bezirk",
      mapLabel: "Kartenstandort",
      mapHint: "Deine Kunden finden dich auf der Karte. Ziehe den Marker oder klicke auf die Karte.",
      placeIdLabel: "Google-Orts-ID (Place ID)",
      placeIdPlaceholder: "z. B. ChIJN1t_tDeuEmsRUsoyG83frY4",
      placeIdHintBefore: "Wenn du sie einträgst, können Kunden ihre Bewertungen ",
      placeIdHintGoogle: "auch auf Google",
      placeIdHintMid: " teilen. Deine Place ID findest du ",
      placeIdHintLink: "hier",
      placeIdHintAfter: ", indem du den Geschäftsnamen suchst. Du kannst auch den vollständigen Link einfügen.",
      saveSuccess: "Deine Geschäftsinformationen wurden aktualisiert.",
      saveButton: "Änderungen speichern",
    },

    // ── Öffnungszeiten-Editor ──
    hours: {
      closed: "Geschlossen",
      open: "Geöffnet",
      saving: "Wird gespeichert...",
      saveButton: "Zeiten speichern",
      saved: "Gespeichert",
      invalidError: "Ungültige Öffnungszeit: Öffnung muss vor Schließung liegen.",
    },

    // ── Titelbild-Auswahl ──
    cover: {
      optionAlt: "Titelbild-Option",
    },

    // ── Katalogformulare (Paket / Kampagne / Produkt / Provision / Lager) ──
    catalog: {
      adding: "Wird hinzugefügt...",
      saving: "Wird gespeichert...",
      deleteAria: "Löschen",
      editAria: "Bearbeiten",
      cancel: "Abbrechen",
      saveChanges: "Änderungen speichern",
      editProduct: "Produkt bearbeiten",
      editPackage: "Paket bearbeiten",
      editCampaign: "Kampagne bearbeiten",
      active: "Aktiv",
      inactive: "Inaktiv",
      decreaseAria: "Verringern",
      increaseAria: "Erhöhen",
      saveCommission: "Speichern",
      commissionLabel: "Provisionssatz (%)",

      // Paketformular
      packageNameLabel: "Paketname",
      packageNamePlaceholder: "z. B. 5er-Paket Gesichtspflege",
      priceLabel: "Preis (₺)",
      sessionsLabel: "Sitzungen",
      daysLabel: "Tage",
      descLabel: "Beschreibung (optional)",
      addPackage: "Paket hinzufügen",

      // Kampagnenformular
      codeLabel: "Rabattcode",
      codePlaceholder: "YAZ25",
      discountLabel: "Rabatt (%)",
      expiresLabel: "Enddatum (optional)",
      createCampaign: "Kampagne erstellen",
      expiryInPast: "Das Enddatum darf nicht vor heute liegen.",

      // Produktformular
      productNameLabel: "Produktname",
      productNamePlaceholder: "z. B. Shampoo 500 ml",
      stockLabel: "Lagerbestand",
      lowStockLabel: "Niedrigschwelle",
      addProduct: "Produkt hinzufügen",
    },
  },

  panelFinance: {
    // ── Gemeinsam ──
    noDataYet: "Noch keine Daten.",

    // ── Kasse & Bon (kasa/page + kasa-pos) ──
    kasa: {
      metaTitle: "Kasse & Bon",
      title: "Kasse & Bon",
      subtitle: "Schnellverkauf erfassen, deine Tageskasse im Blick behalten",
      todayCash: "Kasse heute",
      todayTxns: "Transaktionen heute",
      todaySales: "Verkäufe heute",
      noSalesToday: "Heute noch keine Verkäufe.",
      defaultCustomer: "Kunde",

      // POS — Katalog
      services: "Leistungen",
      products: "Produkte",
      noProductsHint: "Noch keine Produkte — du kannst sie unter Produkte & Lager hinzufügen.",
      outOfStock: "nicht auf Lager",
      stockCount: "Bestand {n}",
      stockExactNone: '"{name}" ist nicht auf Lager.',
      stockLimit: '"{name}" hat {n} Stück auf Lager — mehr kann nicht hinzugefügt werden.',

      // POS — manuelle Position
      manualLine: "Manuelle Position",
      descriptionPlaceholder: "Beschreibung",
      priceTlSymbol: "₺",
      manualHint: "Der Betrag wird in vollen TL eingegeben; im Warenkorb kannst du ihn erneut anpassen.",
      unitPriceAria: "Stückpreis",
      perUnit: "₺ / Stück",

      // POS — Warenkorb/Bon
      receipt: "Bon",
      saleSaved: "Verkauf gespeichert ✓ Du kannst einen neuen Bon erstellen.",
      emptyCart: "Füge links Produkte/Leistungen hinzu.",
      decrease: "Verringern",
      increase: "Erhöhen",
      remove: "Entfernen",
      customerNamePlaceholder: "Kundenname (optional)",
      customerPhonePlaceholder: "Telefon — um Punkte zu vergeben (optional)",
      earnPointsNote: "Dieser Verkauf bringt {n} Punkte (je 100 ₺ = 5 Punkte).",
      total: "Gesamt",
      saving: "Wird gespeichert...",
      charge: "Kassieren",
    },

    // ── Ausgaben (giderler/page + expenses) ──
    expenses: {
      metaTitle: "Ausgaben",
      title: "Ausgaben",
      subtitle: "Monatliche Ausgabenverfolgung und Reingewinn",
      revenueOfMonth: "Umsatz {month}",
      cashSales: "Kassenverkäufe",
      monthExpense: "Ausgaben diesen Monat",
      netProfit: "Reingewinn",
      addExpense: "Ausgabe hinzufügen",
      expensesOfMonth: "Ausgaben {month}",
      emptyTitle: "Diesen Monat keine Ausgaben",
      emptyDesc: "Füge mit dem Formular links deine erste Ausgabe hinzu.",

      // Formular
      description: "Beschreibung",
      descriptionPlaceholder: "z. B. Monatsmiete",
      category: "Kategorie",
      amountWithSymbol: "Betrag (₺)",
      date: "Datum",
      note: "Notiz (optional)",
      notePlaceholder: "Details...",
      adding: "Wird hinzugefügt...",
      submit: "Ausgabe hinzufügen",
      deleteConfirm: "Soll dieser Ausgabeneintrag gelöscht werden? Dieser Vorgang kann nicht rückgängig gemacht werden.",
      deleteAria: "Ausgabe löschen",
    },

    // ── Forderungen & Raten (borclar/page + debt-manager) ──
    debt: {
      metaTitle: "Forderungen & Raten — Salonor",
      title: "Forderungen & Ratenverkauf",
      subtitle: "Offene Konten verfolgen, Raten kassieren",
      openAccounts: "Offene Konten",
      totalReceivable: "Gesamtforderung",
      collected: "Kassiert",

      // Formular
      newDebt: "Neue Forderung / Rate",
      customerName: "Kundenname",
      phoneOptional: "Telefon (optional)",
      amountWithSymbol: "Betrag (₺)",
      installment: "Rate",
      noteOptional: "Notiz (optional)",
      errEnterCustomer: "Gib einen Kundennamen ein.",
      errEnterValidAmount: "Gib einen gültigen Betrag ein.",
      saving: "Wird gespeichert...",
      addDebtRecord: "Forderungseintrag hinzufügen",

      // Liste / Zeile
      emptyTitle: "Keine offenen Konten",
      emptyDesc: "Verfolge Forderungen/Ratenverkäufe, indem du sie links hinzufügst.",
      closedAccounts: "Geschlossene Konten",
      installmentCount: "{n} Raten",
      closed: "Geschlossen",
      remaining: "verbleibend",
      paidOf: "{paid} / {total} bezahlt",
      errEnterAmount: "Gib einen Betrag ein.",
      collectMax: "Kassieren (max. {n})",
      collect: "Kassieren",
      deleteConfirm: "Soll dieser Forderungseintrag gelöscht werden?",
      paymentHistory: "Zahlungsverlauf",
      noPaymentsYet: "Noch keine Zahlungen.",
    },

    // ── Bonuspunkte (para-puan/page + loyalty-manager) ──
    loyalty: {
      metaTitle: "Bonuspunkte — Salonor",
      title: "Bonuspunkte",
      subtitle: "Kunden-Treuepunkte — vergeben, sammeln, einlösen",
      totalMembers: "Mitglieder gesamt",
      circulatingPoints: "Punkte im Umlauf",
      pointValue: "Punktwert",
      pointValueHint: "1 Punkt = 1 ₺",

      // Punkte hinzufügen
      addPoints: "Punkte hinzufügen",
      customerName: "Kundenname",
      phonePlaceholder: "05xx xxx xx xx",
      pointsAmount: "Punktanzahl",
      errEnterCustomer: "Gib einen Kundennamen ein.",
      errEnterValidPoints: "Gib eine gültige Punktzahl ein.",
      adding: "Wird hinzugefügt...",
      hint: "Tipp: Wenn du im Bildschirm Kasse & Bon beim Kassieren die Telefonnummer des Kunden eingibst, bringt der Verkauf automatisch Punkte (je 100 ₺ = 5 Punkte).",

      // Mitgliederliste
      searchPlaceholder: "Name oder Telefon suchen",
      emptyNoMembers: "Noch keine Kunden mit Punkten",
      emptyNoMatch: "Kein passender Kunde",
      emptyDesc: "Beginne, indem du links die ersten Punkte hinzufügst.",
      points: "Punkte",
      spend: "Einlösen",
      errEnterQuantity: "Gib eine Menge ein.",
      redeemMax: "Max. {n}",
      use: "Verwenden",
    },

    // ── Geschenkgutschein (hediye-ceki/page + giftcard-manager) ──
    giftcard: {
      metaTitle: "Geschenkgutschein — Salonor",
      title: "Geschenkgutschein",
      subtitle: "Geschenkgutschein erstellen, Code vergeben, beim Verkauf einlösen",
      activeCards: "Aktive Gutscheine",
      unusedBalance: "Ungenutztes Guthaben",
      totalIssued: "Gesamt ausgestellt",

      // Formular
      newGiftcard: "Neuer Geschenkgutschein",
      amountWithSymbol: "Betrag (₺)",
      amountPlaceholder: "z. B. 500",
      buyerPlaceholder: "Käufer (optional)",
      recipientPlaceholder: "Beschenkte/r (optional)",
      expiryOptional: "Ablaufdatum (optional)",
      errEnterValidAmount: "Gib einen gültigen Betrag ein.",
      creating: "Wird erstellt...",
      createCard: "Gutschein erstellen",

      // Liste / Karte
      emptyTitle: "Noch keine Geschenkgutscheine",
      emptyDesc: "Erstelle links deinen ersten Gutschein und gib den Code deinem Kunden.",
      copyCode: "Code kopieren",
      depleted: "Aufgebraucht",
      active: "Aktiv",
      passive: "Inaktiv",
      balanceOf: "/ {total} Guthaben",
      buyerLabel: "Käufer: {name}. ",
      recipientLabel: "Geschenk: {name}. ",
      expiryLabel: "Ablauf: {date}",
      errEnterQuantity: "Gib eine Menge ein.",
      redeemMax: "Max. {n}",
      use: "Verwenden",
      deactivate: "Deaktivieren",
      activate: "Aktivieren",
      deduct: "Abziehen",
    },

    // ── Provision & Performance (prim/page) ──
    commission: {
      metaTitle: "Provision & Performance",
      title: "Provision & Performance",
      subtitle: "Letzte 30 Tage — Mitarbeiterumsatz und Provisionsberechnung",
      revenue30d: "Umsatz 30 Tage",
      commissionDue: "Fällige Provision",
      emptyTitle: "Kein aktives Personal",
      emptyDesc: "Füge zuerst unter Personal dein Team hinzu.",
      colStaff: "Personal",
      colAppointment: "Termin",
      colRevenue30d: "Umsatz (30 T)",
      colCommissionPct: "Provision %",
      colCommissionAmount: "Provisionsbetrag",
      footnote:
        'Gib den Provisionssatz ein und tippe auf "Speichern" — der Betrag wird automatisch anhand des Umsatzes der Mitarbeiterin der letzten 30 Tage berechnet.',
    },

    // ── Berichte (raporlar/page) ──
    reports: {
      metaTitle: "Berichte",
      title: "Berichte",
      subtitle: "Leistung der letzten 30 Tage",
      revenue30d: "Umsatz 30 Tage",
      cashSales: "Kassenverkäufe",
      appointment: "Termin",
      avgTicket: "Durchschnittsbon",
      completed: "Abgeschlossen",
      dailyRevenueTitle: "Tagesumsatz · letzte 14 Tage",
      topServicesTitle: "Umsatzstärkste Leistungen",
      timesUsed: "{n}-mal",
      staffPerformanceTitle: "Mitarbeiterleistung",
      appointmentCount: "{n} Termine",
      busyDaysTitle: "Stoßzeiten der Woche",
      appointmentStatusTitle: "Terminstatus",
      statusCompleted: "Abgeschlossen",
      statusConfirmedPending: "Bestätigt (ausstehend)",
      statusCancelled: "Storniert",
      statusNoShow: "Nicht erschienen",
    },

    // ── Produkte & Lager (urunler/page) ──
    products: {
      metaTitle: "Produkte & Lager",
      title: "Produkte & Lager",
      subtitle: "Einzelhandelsprodukte und Lagerverwaltung",
      productTypes: "Produktsorten",
      lowStock: "Niedriger Bestand",
      stockValue: "Lagerwert",
      addProduct: "Produkt hinzufügen",
      productsCount: "Produkte",
      emptyTitle: "Noch keine Produkte",
      emptyDesc: "Füge mit dem Formular links dein erstes Produkt hinzu.",
      lowStockBadge: "· niedriger Bestand!",
    },

    // ── Pakete (paketler/page) ──
    packages: {
      metaTitle: "Pakete",
      title: "Pakete",
      subtitle: "Sitzungspakete und Mitgliedschaften — schaffe wiederkehrende Einnahmen",
      addPackage: "Paket hinzufügen",
      packagesCount: "Pakete",
      emptyTitle: "Noch keine Pakete",
      emptyDesc: "Erstelle mit dem Formular links dein erstes Paket.",
      sessionsValidity: "{sessions} Sitzungen · {days} Tage gültig",
    },
  },

  panelOther: {
    // === Kundenseite ===
    customers: {
      title: "Kunden",
      subtitle: "{n} Kunden",
      // CustomersTable
      emptyTitle: "Du hast noch keine Kunden",
      emptyDesc: "Sobald Termine eingehen, werden deine Kunden hier aufgelistet.",
      searchPlaceholder: "Name, Telefon oder E-Mail suchen",
      sortLastVisit: "Letzter Besuch",
      sortVisits: "Anzahl Besuche",
      sortSpend: "Ausgaben",
      noMatch: "Keine Kunden gefunden, die zu „{q}“ passen.",
      colCustomer: "Kunde",
      colContact: "Kontakt",
      colVisit: "Besuch",
      colCompleted: "Abgeschlossen",
      colNoShow: "Nicht erschienen",
      colSpend: "Ausgaben",
      colLastVisit: "Letzter Besuch",
      salonCustomer: "Salonkunde",
      visitsLabel: "{n} Besuche",
      completedLabel: "{n} abgeschlossen",
      noShowLabel: "{n} nicht erschienen",
    },

    // === Bewertungsseite ===
    reviews: {
      title: "Bewertungen",
      subtitle: "{count} Bewertungen · {unanswered} unbeantwortet",
      adminHidden: "Vom Administrator ausgeblendet",
      emptyTitle: "Noch keine Bewertungen",
      emptyDesc: "Nach abgeschlossenen Terminen erscheinen hier die Bewertungen deiner Kunden.",
      // ReviewReply
      repliedSuffix: "hat geantwortet",
      edit: "Bearbeiten",
      reply: "Antworten",
      replyPlaceholder: "Schreibe dem Kunden eine freundliche Antwort...",
      cancel: "Abbrechen",
      sending: "Wird gesendet...",
      saveReply: "Antwort speichern",
      // DeleteReviewButton / ReportReviewButton
      deleteConfirm: "Möchtest du diese Bewertung wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.",
      deleteAria: "Bewertung löschen",
      delete: "Löschen",
      reported: "Gemeldet",
      reportConfirm: "Diese Bewertung beim Administrator melden? Die Bewertung wird nicht gelöscht, sondern nur zur Prüfung markiert.",
      reportAria: "Bewertung melden",
      report: "Melden",
    },

    // === SMS-Seite ===
    sms: {
      title: "SMS",
      subtitle: "Terminbestätigungen und Massen-Infonachrichten",
      creditBalance: "Guthaben",
      mockTitle: "Test-(Mock-)Modus",
      mockDesc:
        "Der SMS-Anbieterschlüssel ist noch nicht hinterlegt. Beim Versand wird Guthaben abgezogen und der Verlauf gespeichert, aber es wird keine echte SMS zugestellt. Für den echten Versand füge die Anbieterdaten zu den Umgebungsvariablen hinzu (Netgsm: ",
      mockDescEnd: ").",
      historyTitle: "Versandverlauf",
      historyEmpty: "Noch keine SMS gesendet.",
      colNumber: "Nummer",
      colMessage: "Nachricht",
      colKind: "Art",
      colStatus: "Status",
      colDate: "Datum",
      // KIND_TR
      kindManual: "Manuell",
      kindConfirm: "Terminbestätigung",
      kindReminder: "Erinnerung",
      kindBulk: "Massenversand",
      // StatusBadge
      statusSent: "Gesendet",
      statusMock: "Test",
      statusFailed: "Fehlgeschlagen",
      statusQueued: "In Warteschlange",
      // SmsSender
      messageTitle: "Nachricht",
      messagePlaceholder: "z. B. Diese Woche 15 % Sonderrabatt für dich von {business}!",
      charsCredits: "{chars} Zeichen · {credits} Guthaben/SMS",
      charsLeft: "{n} übrig",
      template: "Vorlage {n}",
      extraNumbersLabel: "Zusätzliche Nummern (durch Komma oder Leerzeichen trennen)",
      extraNumbersPlaceholder: "0532..., 0505...",
      invalidNumbers: "{n} Nummer(n) ungültig, werden nicht gesendet: ",
      recipientCount: "{n} Empfänger",
      totalCredits: "Insgesamt {n} Guthaben",
      sending: "Wird gesendet...",
      send: "Senden",
      contactsTitle: "Kunden ({n})",
      deselect: "Auswahl aufheben",
      selectAll: "Alle auswählen",
      searchPlaceholder: "Name / Telefon suchen",
      contactsEmpty: "Sobald Kundeneinträge mit Telefonnummer entstehen, werden sie hier aufgelistet.",
      errorEmptyBody: "Gib einen Nachrichtentext ein.",
      errorNoRecipient: "Wähle mindestens einen gültigen Empfänger oder gib eine Nummer ein.",
      errorInsufficient: "Unzureichendes Guthaben. Benötigt: {needed}, vorhanden: {have}.",
      resultSent: "{sent} gesendet",
      resultFailed: ", {failed} fehlgeschlagen",
      fallbackCustomer: "Kunde",
      // Fehlermeldungen der Serveraktion (sendBulkSmsAction)
      errorUnauthorized: "Nicht autorisiert.",
      errorBodyEmpty: "Gib einen Nachrichtentext ein.",
      errorBodyTooLong: "Die Nachricht ist zu lang (maximal 500 Zeichen).",
      errorNoValidNumber: "Gib mindestens eine gültige Nummer ein.",
      errorInsufficientCredits: "Unzureichendes Guthaben.",
      // Templates
      templateText1: "Liebe Kundin, lieber Kunde, diese Woche erwarten Sie 15 % Rabatt auf alle Leistungen. Für einen Termin kontaktieren Sie uns gern.",
      templateText2: "Wir erinnern Sie an Ihren Termin. Wir freuen uns, Sie in unserem Salon begrüßen zu dürfen.",
      templateText3: "Erfahren Sie als Erste/r von unseren neuen Leistungen und Kampagnen!",
    },

    // === Nachrichtenseite ===
    messaging: {
      title: "Nachrichten",
      subtitle: "Sende deinen Kunden Terminerinnerungen und Updates – über mehrere Kanäle",
      introBadge: "Benachrichtigungen über mehrere Kanäle",
      introTitle: "Erreiche deinen Kunden auf dem richtigen Kanal",
      introDesc:
        "Salonor vereint zwei Kanäle: heute kostenloses WhatsApp, automatisierte SMS, sobald dein Unternehmen eingerichtet ist. Nutze beide, damit dir kein Termin entgeht.",
      statusActive: "Aktiv",
      statusLocked: "Wird mit deinem Unternehmen freigeschaltet",
      statusTest: "Testmodus",
      waName: "WhatsApp",
      waTagline: "Kostenlos · manueller Versand · sofort einsatzbereit",
      waDesc:
        "Sende Terminerinnerungen und Rückgewinnungsnachrichten an verlorene Kunden mit einem Fingertipp, kostenlos, von deinem eigenen Telefon. Keine Einrichtung erforderlich.",
      waPoint1: "Keine Kosten – keine Credits",
      waPoint2: "Hohe Öffnungsrate",
      waPoint3: "Bilder und Links teilen",
      waNumberLabel: "WhatsApp-Nummer des Salons",
      waNumberMissing: "Keine eigene Nummer hinterlegt – deine Telefonnummer wird verwendet",
      waNumberSet: "Festlegen / ändern",
      waCtaReminders: "Zu den Erinnerungen",
      waCtaLost: "Verlorene Kunden zurückgewinnen",
      waPublicNote:
        "Wir haben außerdem einen Button auf deiner Salonseite hinzugefügt, damit dich Kunden über WhatsApp erreichen können.",
      smsName: "SMS",
      smsTagline: "Automatisiert · funktioniert auf jedem Telefon",
      smsDesc:
        "Sende Terminbestätigungen und Massen-Updates per SMS. Keine App erforderlich, erreicht jedes Telefon.",
      smsPoint1: "Vollautomatischer Versand",
      smsPoint2: "Keine App nötig – erreicht jedes Telefon",
      smsPoint3: "Professioneller Absendername",
      smsCreditLabel: "Guthaben",
      smsCta: "Zum SMS-Panel",
      smsLockedNote:
        "Für den SMS-Versand sind ein registriertes Unternehmen und eine IYS-Registrierung (System zur Nachrichtenverwaltung) erforderlich. Sobald du dein Unternehmen einrichtest und die Anbieterdaten eingibst, wird dieser Kanal automatisch freigeschaltet.",
      smsTestNote:
        "Derzeit im Testmodus: Du kannst den Ablauf ausprobieren, Credits werden abgezogen, aber es wird keine echte SMS zugestellt.",
      compareTitle: "Welcher Kanal, wann?",
      compareCol: "Funktion",
      rowCost: "Kosten",
      rowCostWa: "Kostenlos",
      rowCostSms: "Pro Credit",
      rowSetup: "Einrichtung",
      rowSetupWa: "Bereit",
      rowSetupSms: "Unternehmen + IYS",
      rowAuto: "Versand",
      rowAutoWa: "Manuell",
      rowAutoSms: "Automatisiert",
      rowReach: "Reichweite",
      rowReachWa: "Kunden mit WhatsApp",
      rowReachSms: "Jedes Telefon",
      roadmapTitle: "Empfohlener Weg",
      recommendedBadge: "Empfohlen",
      roadmapNowTitle: "Jetzt: WhatsApp",
      roadmapNowDesc:
        "Starte ohne Kosten. Sende Erinnerungen über WhatsApp und steigere sofort die Kundenzufriedenheit.",
      roadmapNextTitle: "Später: SMS",
      roadmapNextDesc:
        "Sobald Umsatz fließt und dein Unternehmen eingerichtet ist, aktiviere SMS, damit Erinnerungen automatisch werden und der manuelle Aufwand entfällt.",
    },

    // === Aufgabenseite ===
    todos: {
      title: "Aufgabenliste",
      subtitle: "Tägliche Aufgaben und Erinnerungen des Geschäfts",
      statOpen: "Offene Aufgaben",
      statDone: "Abgeschlossen",
      addTitle: "Aufgabe hinzufügen",
      listTitle: "Aufgaben ({n})",
      emptyTitle: "Noch keine Aufgaben",
      emptyDesc: "Füge mit dem Formular links deine erste Aufgabe hinzu.",
      overduePrefix: "Überfällig · ",
      // Prioritätsbeschriftungen
      priorityHigh: "Hoch",
      priorityNormal: "Normal",
      priorityLow: "Niedrig",
      // TodoForm
      taskLabel: "Aufgabe",
      taskPlaceholder: "z. B. Lieferanten anrufen",
      priorityLabel: "Priorität",
      dueDateLabel: "Fälligkeitsdatum",
      adding: "Wird hinzugefügt...",
      addButton: "Aufgabe hinzufügen",
      // TodoToggle
      undo: "Rückgängig",
      markDone: "Als erledigt markieren",
      deleteAria: "Aufgabe löschen",
      clearDone: "Erledigte entfernen ({n})",
    },

    // === Kampagnenseite ===
    campaigns: {
      title: "Kampagnen",
      subtitle: "Mit Rabattcodes neue Kunden gewinnen",
      createTitle: "Kampagne erstellen",
      listTitle: "Kampagnen ({n})",
      emptyTitle: "Noch keine Kampagnen",
      emptyDesc: "Erstelle mit dem Formular links deinen ersten Rabattcode.",
      expired: "Abgelaufen",
      usedCount: "{n}-mal verwendet",
      endedOn: " · endete am {date}",
      endsOn: " · endet am {date}",
      noExpiry: " · unbefristet",
    },

    // === KI-Analyse-Seite ===
    ai: {
      title: "KI-Analyse",
      subtitle: "Automatisch aus den Geschäftsdaten abgeleitete Erkenntnisse und Empfehlungen",
      smartBadge: "Smarte Analyse",
      collectingTitle: "Daten werden für die Analyse gesammelt",
      collectingDesc:
        "Sobald sich Termine und Verkäufe ansammeln, erscheinen hier Umsatztrend, Auslastung, Mitarbeiterleistung und auf dich zugeschnittene Empfehlungen.",
      metricRevenue: "Umsatz 30 Tage",
      metricRevenueSub: "{pct} % gegenüber Vorperiode",
      metricBusiest: "Stoßzeit",
      metricBusiestSub: "gegen {time}",
      metricAvgTicket: "Durchschnittsbon",
      metricAvgTicketSub: "pro Transaktion",
      metricAtRisk: "Gefährdete Kunden",
      metricAtRiskSub: "seit 30+ Tagen nicht da",
      none: "—",
      topServicesTitle: "Umsatzstärkste Leistungen",
      notEnoughData: "Nicht genügend Daten.",
      transactions: "{n} Transaktionen",
      staffPerfTitle: "Mitarbeiterleistung (60 Tage)",
      staffCompleted: "{n} abgeschlossene Termine",
      // AiInsights-Komponente
      insightsTitle: "Auf dich zugeschnittene Empfehlungen",
      geminiBadge: "Gemini AI",
      refresh: "Aktualisieren",
      analyzing: "Die KI analysiert die Geschäftsdaten…",
      aiUnavailable:
        "Die KI ist vorübergehend nicht verfügbar ({reason}) — es werden regelbasierte Empfehlungen angezeigt.",
      aiNotConfigured:
        "Die KI-Analyse ist nicht konfiguriert — es werden regelbasierte Empfehlungen angezeigt.",
      // Fehlermeldungen von businessInsightsAction
      errorUnauthorized: "Nicht autorisiert.",
      errorTooFrequent: "Zu häufig aktualisiert, versuche es gleich noch einmal.",
      errorNoData: "Nicht genügend Daten.",
      errorNoSuggestion: "Es konnte keine Empfehlung erstellt werden.",
      errorInsightsFailed: "Die KI-Empfehlungen konnten nicht abgerufen werden.",
      // Regelbasierte Empfehlungstexte (Insight-Engine)
      tipRevenueDown: "Der Umsatz ist in den letzten 30 Tagen um {pct} % gesunken. ",
      tipRevenueDownAtRisk: "{n} Kunden kommen seit Langem nicht — sende per SMS eine Kampagne.",
      tipRevenueDownLoyal: "Denke über eine spezielle Kampagne für treue Kunden nach.",
      tipRevenueUp: "Der Umsatz steigt ({pct} %). Konzentriere dich auf die umsatzstärksten Leistungen, um den Schwung zu halten.",
      tipBusiestHour: "Die Stoßzeit liegt gegen {time}. Plane für diese Zeiten zusätzliches Personal ein, um Wartezeiten zu verringern.",
      tipQuietDays: "Verteile die Nachfrage über die Woche mit Sonderrabatten an ruhigen Tagen; gleiche so die Last der Stoßtage aus.",
      tipAtRisk: "Es gibt {n} gefährdete Kunden (seit 30+ Tagen nicht da). Gewinne sie mit Bonuspunkten + SMS zurück.",
      tipLowStock: "Bei {n} Produkten ist der Bestand kritisch: {names}. Zeit zu bestellen.",
      tipNoShow: "Die No-Show-Quote ist mit {pct} % hoch. Mit einer Terminbestätigungs-SMS kannst du Nichterscheinen reduzieren.",
      tipTopService: "„{name}“ ist deine umsatzstärkste Leistung. Steigere ihren Wert mit einem Paket oder Upselling.",
      tipNoData: "Sobald sich Daten ansammeln, siehst du hier smarte, auf dein Geschäft zugeschnittene Empfehlungen. Erfasse weiterhin Termine und Verkäufe.",
    },

    // === Verlorene Kunden Seite ===
    lost: {
      title: "Verlorene Kunden",
      subtitle: "Kunden, die seit {days}+ Tagen nicht da waren — gewinne sie per WhatsApp zurück",
      fallbackCustomer: "Salonkunde",
      emptyTitle: "Großartig — du hast keine verlorenen Kunden!",
      emptyDesc: "Alle deine Kunden waren in den letzten {days} Tagen da. Weiter so!",
      waMessage:
        "Hallo {name}, wir von {business} haben dich vermisst! 💜 Wir würden uns freuen, dich wieder zu empfangen — wir haben ein besonderes Angebot für dich und warten auf deinen Termin.",
      lastVisit: "Letzter Besuch: {date} · ",
      daysAgo: "vor {n} Tagen",
      visits: "{n} Besuche",
      recover: "Zurückgewinnen",
      noPhone: "Keine Telefonnummer",
    },
  },

  onboarding: {
    metaTitle: "Geschäftseinrichtung",

    // Obere Überschrift (greeting)
    greeting: "Hallo, {name} 👋",

    // Beschriftungen der Schrittanzeige
    steps: {
      business: "Geschäft",
      category: "Kategorie",
      location: "Standort",
      hours: "Zeiten",
      services: "Leistungen",
    },

    // Schritt 1: Geschäft
    step1: {
      title: "Stellen wir dein Geschäft vor",
      subtitle: "Wie werden dich deine Kunden sehen?",
      nameLabel: "Geschäftsname",
      namePlaceholder: "z. B. Nova Haaratelier",
      phoneLabel: "Telefon",
      phonePlaceholder: "0212 000 00 00",
      descLabel: "Kurzbeschreibung (optional)",
      descPlaceholder: "Beschreibe deinen Salon in wenigen Sätzen...",
    },

    // Schritt 2: Kategorie
    step2: {
      title: "In welchem Bereich bist du tätig?",
      subtitle: "Wähle die für dein Geschäft passendste Kategorie.",
    },

    // Schritt 3: Standort
    step3: {
      title: "Wo befindest du dich?",
      subtitle: "Damit deine Kunden dich auf der Karte finden.",
      cityLabel: "Stadt",
      districtLabel: "Bezirk",
      districtPlaceholder: "z. B. Kadıköy",
      addressLabel: "Vollständige Adresse",
      addressPlaceholder: "Viertel, Straße, Nr.",
    },

    // Schritt 4: Zeiten
    step4: {
      title: "Deine Öffnungszeiten",
      subtitle: "Lege die Zeiten und Tage fest, an denen du geöffnet hast.",
      openLabel: "Öffnung",
      closeLabel: "Schließung",
      closedDaysLabel: "Geschlossene Tage",
      hoursHint: "An nicht als geschlossen markierten Tagen bist du von {open} bis {close} geöffnet.",
    },

    // Schritt 5: Leistungen
    step5: {
      title: "Deine ersten Leistungen",
      subtitle: "Füge ein paar Leistungen hinzu — später kannst du im Panel beliebig viele ändern.",
      servicePlaceholder: "Leistungsname",
      minUnit: "Min.",
      priceUnit: "₺",
      removeService: "Entfernen",
      addService: "Leistung hinzufügen",
    },

    // Navigation
    back: "Zurück",
    creating: "Wird erstellt...",
    publish: "Mein Geschäft veröffentlichen",
    continue: "Weiter",

    // Karte (LocationPicker)
    mapHint: "Lege deinen Standort fest, indem du auf die Karte klickst oder den Marker ziehst.",
  },

  admin: {
    // Seitentitel (Metadaten)
    metaTitle: "Verwaltung",

    // Gemeinsamer Aktionsfehler (Inline-Hinweis, wenn eine Serveraktion fehlschlägt)
    actionFailed: "Aktion fehlgeschlagen. Bitte versuche es erneut.",

    // Layout (obere Leiste)
    consoleBadge: "Plattform-Konsole",
    refresh: "Aktualisieren",
    refreshAria: "Aktualisieren",
    backToSite: "Zur Website",
    logout: "Abmelden",

    // Übersichtsüberschrift
    overviewTitle: "Übersicht",
    overviewSubtitle: "Alle Geschäfte und Nutzer auf einem Bildschirm.",

    // Statistikkarten
    statBusiness: "Geschäfte",
    statBusinessSub: "{active} aktiv · {suspended} ausgesetzt",
    statUser: "Nutzer",
    statAppointment: "Termine",
    statRevenue: "Gesamtumsatz",

    // Rollenbeschriftungen
    roleCustomer: "Kunde",
    roleOwner: "Geschäft",
    roleAdmin: "Administrator",

    // Geschäftstabelle
    businessesTitle: "Geschäfte",
    businessesShowing: "neueste {shown} / {total} angezeigt",
    colBusiness: "Geschäft",
    colOwner: "Inhaber",
    colPlanCredits: "Paket & Guthaben",
    colAppointment: "Termine",
    colRevenue: "Umsatz",
    colFeatured: "Empfohlen",
    colStatus: "Status",
    colAction: "Aktion",
    emptyBusinesses: "Noch keine Geschäfte. Beginne mit",
    emptyBusinessesCta: "Neues Geschäft erstellen",
    emptyBusinessesEnd: "oben rechts.",
    incompleteProfile: "Unvollständiges Profil",
    incompleteProfileTitle: "Telefon, Adresse oder Beschreibung fehlt",
    view: "Ansehen",

    // Zuletzt registriert
    recentTitle: "Zuletzt registriert",

    // CreateBusiness (Modal)
    createButton: "Neues Geschäft erstellen",
    createdTitle: "Geschäft erstellt",
    createTitle: "Neues Geschäft erstellen",
    close: "Schließen",
    createdNote: "Das Geschäft ist im Schaufenster veröffentlicht. Der Inhaber kann sich mit den folgenden Daten anmelden und es anpassen.",
    loginEmail: "Login-E-Mail",
    tempPassword: "Temporäres Passwort",
    viewStorefront: "Schaufenster ansehen",
    ok: "OK",
    nameLabel: "Geschäftsname",
    namePlaceholder: "Glow Studio",
    ownerNameLabel: "Name des Inhabers (optional)",
    ownerNamePlaceholder: "Vor- und Nachname",
    emailLabel: "Login-E-Mail",
    emailPlaceholder: "isletme@ornek.com",
    passwordLabel: "Temporäres Passwort",
    planLabel: "Paket",
    submit: "Geschäft erstellen",
    createHint: "Das Geschäft erscheint automatisch im Schaufenster (Geschäfte).",

    // PlanControl
    creditAmountAria: "Guthabenmenge",
    addCreditsTitle: "{amount} Guthaben hinzufügen",
    removeCreditsTitle: "{amount} Guthaben abziehen",
    planUpdateError: "Paket konnte nicht aktualisiert werden. Bitte versuche es erneut.",
    creditUpdateError: "Guthaben konnte nicht aktualisiert werden. Bitte versuche es erneut.",

    // ActiveToggle
    suspend: "Aussetzen",
    activate: "Aktivieren",
    activeUpdateError: "Status konnte nicht aktualisiert werden. Bitte versuche es erneut.",

    // FeaturedToggle
    featuredOn: "Empfohlen",
    featuredOff: "Empfehlen",
    featuredUpdateError: "Aktualisierung fehlgeschlagen. Bitte versuche es erneut.",

    // DeleteBusiness
    deleteConfirm:
      "Das Geschäft \"{name}\" und ALLE zugehörigen Daten (Termine, Bewertungen, Verkäufe, Inhaberkonto) werden dauerhaft gelöscht. Dieser Vorgang kann nicht rückgängig gemacht werden. Fortfahren?",
    deleteError: "Geschäft konnte nicht gelöscht werden. Bitte versuche es erneut.",
    deleteTitle: "Geschäft löschen",

    // ContactRequests
    contactTitle: "Geschäftsanfragen",
    contactNewBadge: "{n} neu",
    contactEmpty: "Noch keine Kooperationsanfragen eingegangen.",
    contactHandled: "Kontaktiert",
    contactNew: "Neu",
    contactUndo: "Rückgängig",
    contactMarkHandled: "Kontaktiert",
    contactDeleteConfirm: "Möchtest du diese Anfrage wirklich löschen?",
    contactDeleteAria: "Löschen",

    // ReviewModeration
    reviewTitle: "Bewertungsmoderation",
    reviewReportedBadge: "{n} Meldung(en) ausstehend",
    reviewEmpty: "Noch keine Bewertungen.",
    reviewShow: "Anzeigen",
    reviewHide: "Ausblenden",
    reviewDeleteConfirm: "Bewertung dauerhaft löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.",
    reviewDeleteAria: "Löschen",
    reviewReported: "Gemeldet",
    reviewHidden: "Ausgeblendet",
  },

  consent: {
    message:
      "Wir verwenden Cookies, um dein Erlebnis zu verbessern und den Datenverkehr zu analysieren. Notwendige Cookies sind immer aktiv; ob du Analyse-Cookies zulässt, entscheidest du selbst.",
    accept: "Akzeptieren",
    reject: "Nur notwendige",
    learnMore: "Details",
  },

  reminder: {
    metaTitle: "Terminbestätigung",
    invalidTitle: "Der Link ist ungültig oder abgelaufen.",
    invalidDesc: "Um deinen Termin zu ändern, ruf bitte den Salon an oder melde dich in deinem Konto an.",
    myAccount: "Mein Konto",
    cancelledTitle: "Dieser Termin wurde storniert.",
    cancelledDesc: "Du kannst jederzeit einen neuen Termin buchen.",
    completedTitle: "Dieser Termin ist abgeschlossen. Danke!",
    reminderLabel: "Terminerinnerung",
    comingQuestion: "Kommst du?",
    coming: "Ich komme",
    cancel: "Stornieren",
    confirmedTitle: "Super, du hast deinen Termin bestätigt!",
    confirmedDesc: "Wir freuen uns auf dich. 🎉",
    cancelledActionTitle: "Dein Termin wurde storniert.",
    cancelledActionDesc: "Du kannst jederzeit wieder buchen.",
    actionFailed: "Etwas ist schiefgelaufen, bitte versuche es erneut.",
  },
};
