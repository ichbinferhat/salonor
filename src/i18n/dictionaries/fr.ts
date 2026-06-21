// Dictionnaire français. Respecte À LA LETTRE la signature de type de `tr.ts`
// (Dictionary = typeof tr) ; toute clé manquante/en trop ou signature incorrecte
// provoque une erreur de compilation.
import type { Dictionary } from "../types";

export const fr: Dictionary = {
  common: {
    viewAll: "Tout voir",
    scrollBack: "Faire défiler en arrière",
    scrollForward: "Faire défiler en avant",
    close: "Fermer",

    // Limite d’erreur (error.tsx)
    errorTitle: "Un problème est survenu",
    errorDesc: "Une erreur inattendue s’est produite. Vous pouvez réessayer ou revenir à l’accueil.",
    retry: "Réessayer",
    backHome: "Revenir à l’accueil",

    // 404 (not-found.tsx)
    notFoundTitle: "Page introuvable",
    notFoundDesc: "La page que vous cherchez a peut-être été déplacée ou n’a jamais existé.",
    searchSalons: "Rechercher un salon",

    // État vide du carrousel
    carouselEmpty: "D’autres salons seront bientôt disponibles ici.",

    // Badges des stores (App Store / Google Play)
    comingSoon: "Bientôt disponible",

    // Attribution du fond de carte
    mapAttribution: "© Les contributeurs d’OpenStreetMap · © CARTO",

    // Valeurs par défaut SEO / OpenGraph
    ogTitle: "Salonor — Votre rendez-vous beauté et bien-être, en quelques secondes",
    ogDescription:
      "Découvrez les coiffeurs, barbiers, spas et experts beauté près de chez vous ; choisissez un créneau et réservez votre place en un instant.",
  },

  nav: {
    signIn: "Se connecter",
    listBusiness: "Référencez votre établissement",
    menu: "Menu",
    account: "Mon compte",
    forCustomers: "Pour les clients",
    signInOrUp: "Connectez-vous ou inscrivez-vous",
    downloadApp: "Télécharger l’application",
    helpSupport: "Aide et assistance",
    forBusinesses: "Pour les professionnels",
    businessLogin: "Connexion pro",
    businessPanel: "Espace professionnel",
    adminPanel: "Panneau d’administration",
    myAppointments: "Mes rendez-vous",
    myFavorites: "Mes favoris",
    myProfile: "Mon profil",
    logout: "Se déconnecter",
    language: "Langue",
  },

  footer: {
    tagline: "Réservez votre rendez-vous beauté et bien-être en quelques secondes. Gratuit, rapide, 24h/24 et 7j/7.",
    exploreTitle: "Explorer",
    hairdressers: "Salons de coiffure",
    barbers: "Barbiers",
    spaMassage: "Spa et massage",
    nailStudios: "Onglerie",
    skincare: "Soins du visage",
    forBusinessesTitle: "Pour les professionnels",
    salonorBusiness: "Salonor Business",
    pricing: "Tarifs",
    addBusiness: "Ajoutez votre établissement",
    businessLogin: "Connexion pro",
    companyTitle: "Salonor",
    about: "À propos",
    helpFaq: "Aide et FAQ",
    privacy: "Confidentialité et RGPD",
    terms: "Conditions d’utilisation",
    contact: "Contact",
    rights: "© 2026 Salonor Teknoloji A.Ş. Tous droits réservés.",
    designedIn: "Conçu en Türkiye 🇹🇷",
  },

  home: {
    heroBadge: "La plateforme de réservation n°1 en Türkiye",
    heroTitleA: "Votre rendez-vous en quelques secondes, ",
    heroTitleHighlight: "dans votre poche",
    heroTitleEnd: ".",
    heroSubtitle:
      "Découvrez les coiffeurs, barbiers, spas et experts beauté près de chez vous ; choisissez un créneau et réservez votre place en un instant — gratuit et 24h/24, 7j/7.",
    popular: "Populaire :",
    ratingAvg: "note moyenne",
    verifiedReviews: "avis vérifiés",
    selectSalons: "salons d’exception",
    categoriesSr: "Catégories",
    featuredTitle: "Salons recommandés",
    featuredSubtitle: "Les mieux notés et les plus prisés",
    newestTitle: "Nouveautés",
    newestSubtitle: "Les établissements qui viennent de rejoindre Salonor",

    stats: {
      heading: "La bonne adresse pour la beauté et le bien-être",
      sub: "Une seule plateforme, une seule application — le point de rencontre des meilleurs salons et experts des 81 provinces.",
      bigGradient: "En quelques secondes",
      bigSub: "réservation — gratuit et 24h/24, 7j/7",
      selectSalons: "salons d’exception",
      provincesNum: "81 provinces",
      provincesLabel: "partout en Türkiye",
      verifiedReviews: "avis vérifiés",
      footnote: "{n}+ prestations réservables · confirmation immédiate · paiement sécurisé",
    },

    bizPromo: {
      kicker: "Salonor Business",
      heading: "Salonor pour votre établissement",
      desc: "Rendez-vous, agenda, équipe et gestion des clients réunis sur un seul tableau de bord pour les salons et les spas. La manière professionnelle de simplifier votre travail.",
      feat1: "Réservation en ligne 24h/24 — fini les heures passées au téléphone",
      feat2: "Agenda, équipe et prestations sur un seul écran",
      feat3: "Gagnez la confiance grâce aux avis et fidélisez vos clients",
      learnMore: "En savoir plus",
      perfect: "5/5 parfait",
      satisfaction: "de satisfaction des professionnels",
      calendar: "Agenda",
      today: "Aujourd’hui",
      date: "Sam. 14 juin",
      blockHaircut: "Coupe de cheveux",
      blockBlowDry: "Brushing",
      blockBeard: "Rasage de barbe",
      blockSkincare: "Soin du visage",
      blockManicure: "Manucure",
      blockColor: "Coloration",
      featured: "À la une",
      reviewsCount: "({n} avis)",
      apptConfirmed: "Rendez-vous confirmé",
      apptDetail: "Aujourd’hui 14h30 · Coupe de cheveux",
    },

    reviews: {
      title: "Avis",
      subtitle: "De vrais rendez-vous, de vraies expériences",
    },

    directory: {
      kicker: "Toutes les prestations",
      heading: "Toutes les prestations dont vous avez besoin, sur Salonor",
      groups: [
        {
          title: "Types de salons",
          items: ["Salon de coiffure femme", "Barbier homme", "Centre de beauté et d’esthétique", "Onglerie", "Centre de spa et massage", "Studio de maquillage"],
        },
        {
          title: "Prestations capillaires",
          items: ["Coupe de cheveux", "Brushing et coiffage", "Coloration", "Ombré et balayage", "Kératine et soin capillaire", "Coiffure de mariée"],
        },
        {
          title: "Prestations ongles",
          items: ["Manucure", "Pédicure", "Vernis semi-permanent", "Faux ongles", "Ongles en gel", "Nail art"],
        },
        {
          title: "Maquillage, sourcils et cils",
          items: ["Maquillage jour et soirée", "Maquillage de mariée", "Cils soie", "Rehaussement de cils", "Laminage des sourcils", "Restructuration des sourcils"],
        },
        {
          title: "Soins du visage",
          items: ["Soin du visage classique", "Soin du visage professionnel", "Soin anti-taches et anti-acné", "Hydrafacial", "Épilation des sourcils", "Épilation du visage à la cire"],
        },
        {
          title: "Spa et massage",
          items: ["Massage suédois", "Aromathérapie", "Massage des tissus profonds", "Massage aux pierres chaudes", "Réflexologie", "Rituel hammam"],
        },
        {
          title: "Épilation laser",
          items: ["Corps entier", "Aisselles", "Jambes", "Bras", "Dos", "Visage et zones"],
        },
        {
          title: "Soins pour hommes",
          items: ["Coupe homme", "Taille et coiffage de barbe", "Coloration homme", "Soin du visage homme", "Épilation homme", "Combo cheveux et barbe"],
        },
      ],
    },

    appDownload: {
      heading: "Emportez Salonor dans votre poche",
      desc: "Gérez vos rendez-vous, suivez vos salons préférés et découvrez de nouvelles adresses — le tout en un seul geste, toujours à portée de main.",
      feat1: "Reprenez rendez-vous en un seul geste",
      feat2: "Rappels de rendez-vous et notifications",
      feat3: "Des recommandations de salons rien que pour vous",
      qrText: "Scannez avec votre appareil photo pour télécharger",
      bookNow: "Réserver maintenant",
      nearbyCount: "{n} salons près de chez vous",
      exploreMap: "Explorer sur la carte →",
      mockHaircut: "Coupe de cheveux",
      mockBlowDry: "Brushing",
      mockColor: "Coloration",
    },
  },

  search: {
    metaTitle: "Rechercher un salon",

    // Titre / compteur des résultats
    allSalons: "Tous les salons",
    resultsCount: "{n} résultats",
    resultsForQuery: "· pour « {q} »",

    // État vide
    emptyTitle: "Aucun résultat trouvé",
    emptyDesc: "Essayez d’élargir votre recherche ou d’effacer les filtres.",
    clearFilters: "Effacer les filtres",

    // Barre de recherche (SearchBar)
    typeLabel: "Type",
    allServices: "Toutes les prestations",
    locationLabel: "Lieu",
    locationPlaceholder: "Ville et arrondissement",
    salonNameLabel: "Nom du salon",
    salonNamePlaceholder: "Rechercher un salon, une prestation…",
    salonNameAria: "Salon ou prestation",
    searchButton: "Rechercher",
    close: "Fermer",
    serviceTypeTitle: "Type de prestation",

    // Filtres secondaires (SearchControls)
    filterAll: "Tout",
    sortLabel: "Trier :",
    sortRecommended: "Recommandés",
    sortRating: "Mieux notés",
    sortReviews: "Plus d’avis",

    // Sélecteur de lieu (LocationList)
    provinceSearchPlaceholder: "Rechercher une province… (ex. Istanbul)",
    allTurkey: "Toute la Türkiye",
    backToProvinces: "Retour aux provinces",
    allProvince: "Tout {province}",
    districtSearchPlaceholder: "Rechercher un arrondissement à {province}…",
    districtCount: "{n} arrondissements",
    noResults: "Aucun résultat trouvé",

    // Panneau carte (SalonMapPanel)
    viewSalon: "Voir le salon →",
    backToList: "Retour à la liste",
    mapButton: "Carte",
  },

  salon: {
    // Metadata
    notFoundTitle: "Salon introuvable",
    metaDescriptionFallback: "Consultez les tarifs de {name}, lisez les avis et réservez en ligne.",

    // Breadcrumb
    breadcrumbLabel: "Fil d’Ariane",
    home: "Accueil",

    // Titre / statut
    reviewsCountInline: "({n} avis)",
    openNow: "Ouvert maintenant",
    closedNow: "Fermé actuellement",

    // Sections
    servicesTitle: "Prestations",
    select: "Choisir",
    teamTitle: "Équipe",
    reviewsTitle: "Avis",
    guest: "Invité",
    ratingSummary: "{label} · {n} avis",

    // Libellés de note (selon la moyenne)
    ratingExcellent: "Exceptionnel",
    ratingVeryGood: "Excellent",
    ratingGood: "Très bien",
    ratingAverage: "Bien",
    ratingPoor: "Moyen",
    businessReplied: "{name} a répondu",
    aboutTitle: "À propos",
    openingHours: "Horaires d’ouverture",
    today: "· Aujourd’hui",
    closed: "Fermé",

    // Carte de réservation
    book: "Réserver",
    bookNote: "Confirmation immédiate · Annulation gratuite",
    todayHours: "Aujourd’hui : {open} – {close}",
    getDirections: "Obtenir l’itinéraire",
    whatsappChat: "Écrire sur WhatsApp",
    whatsappGreeting: "Bonjour, je souhaite obtenir des informations / poser une question sur un rendez-vous chez {name}.",

    // Galerie
    openGallery: "Ouvrir la galerie",
    photoAlt: "{name} photo {n}",
    allPhotos: "Toutes les photos ({n})",
    close: "Fermer",

    // Favori
    inFavorites: "Dans les favoris",
    addToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",

    // Ajout d’un avis
    addReview: "Ajouter un avis",
    thanksTitle: "Merci !",
    reviewPublished: "Votre avis a été publié. Merci d’avoir partagé votre expérience ! 💛",
    yourRating: "Votre note",
    starsLabel: "{n} étoiles",
    yourName: "Votre nom",
    yourNamePlaceholder: "Prénom et nom",
    yourReview: "Votre avis",
    yourReviewPlaceholder: "Partagez votre expérience en quelques mots...",
    cancel: "Annuler",
    submitting: "Envoi en cours...",
    submitReview: "Envoyer l’avis",
    selectRatingFirst: "Veuillez d’abord choisir une note.",

    // Carte de salon
    featured: "À la une",
    reviewWord: "avis",

    // Carte
    mapAriaLabel: "Carte indiquant l’emplacement de {name}",
  },

  booking: {
    // Titre meta de la page de réservation
    metaTitle: "Réserver",

    // Titre du layout du parcours
    secureHeader: "Réservation sécurisée · Salonor",

    // Étapes de l’assistant
    steps: {
      services: "Prestations",
      staff: "Personnel",
      dateTime: "Date et heure",
      confirm: "Confirmation",
    },

    // Écran de succès
    success: {
      title: "Votre rendez-vous est confirmé !",
      codeLabel: "Votre code de rendez-vous",
      viewAppointments: "Voir mes rendez-vous",
      backHome: "Retour à l’accueil",
    },

    // Étape 1 : Prestations
    services: {
      heading: "Choisir une prestation",
    },

    // Étape 2 : Personnel
    staff: {
      heading: "Choisir un membre de l’équipe",
      anyTitle: "Peu importe",
      anyDesc: "Le premier membre disponible",
      noEligible:
        "Aucun membre de l’équipe ne peut réaliser à lui seul la combinaison de prestations choisie. Vous pouvez continuer avec « Peu importe » ou modifier votre sélection.",
    },

    // Étape 3 : Date et heure
    dateTime: {
      heading: "Choisir une date et une heure",
      noStaffForCombo: "Aucun membre de l’équipe ne peut réaliser à lui seul toutes les prestations choisies.",
      noStaffForComboHint: "Essayez de réserver les prestations sur des rendez-vous séparés ou de modifier votre sélection.",
      noSlots: "Plus aucun créneau disponible ce jour-là.",
      noSlotsHint: "Essayez de choisir un autre jour.",
      noOpenDays: "Ce salon semble fermé pendant les 14 prochains jours.",
      noOpenDaysHint: "La réservation en ligne n’est pas possible pour le moment. Veuillez contacter directement le salon.",
      slotLoadError: "Impossible de charger les créneaux disponibles.",
      retry: "Réessayer",
      morning: "Matin",
      afternoon: "Après-midi",
      evening: "Soir",
    },

    // Étape 4 : Confirmation
    confirm: {
      heading: "Confirmez votre rendez-vous",
      anyStaff: "Personnel disponible",
      discountLine: "Remise · {pct} %",
      totalLabel: "Total · {duration}",
      couponQuestion: "Vous avez un code promo ?",
      couponApplied: "{code} · remise de {pct} % appliquée",
      couponRemove: "Retirer",
      couponPlaceholder: "CODE",
      couponApply: "Appliquer",
      contactHeading: "Vos coordonnées",
      nameLabel: "Prénom et nom",
      namePlaceholder: "Prénom et nom",
      phoneLabel: "Téléphone",
      phoneLabelOptional: "Téléphone (facultatif)",
      phonePlaceholder: "05XX XXX XX XX",
      phoneHint: "Nous vous enverrons un SMS/WhatsApp de confirmation et de rappel.",
      noteLabel: "Note (facultatif)",
      notePlaceholder: "Un message à transmettre au salon ?",
      submitBooking: "Confirmer le rendez-vous — {total}",
      submitting: "Confirmation en cours...",
      paymentNote: "Le paiement se fait au salon. Vous bénéficiez d’une annulation gratuite.",
    },

    // Messages d’erreur
    errors: {
      nameRequired: "Veuillez saisir votre prénom et votre nom.",
      phoneRequired: "Saisissez un numéro de portable valide pour que nous puissions vous envoyer la confirmation par SMS (05XX XXX XX XX).",
      connection: "Une erreur de connexion s’est produite. Veuillez réessayer.",
    },

    // Carte récapitulative (sidebar) et barre mobile
    summary: {
      noServices: "Aucune prestation sélectionnée pour le moment.",
      continue: "Continuer",
      servicesCount: "{count} prestations · {total}",
    },

    // Général
    ellipsis: "...",

    // Affiché si le code de réduction devient invalide au moment de la réservation (expiré/désactivé).
    couponDropped:
      "Votre code de réduction n’a pas pu être appliqué car il a perdu sa validité pendant la réservation. Votre rendez-vous a été créé au tarif plein.",

    // Conseiller style IA
    advisor: {
      cardTitle: "Conseiller style IA",
      newBadge: "Nouveau",
      cardDesc: "Importez votre photo, nous vous suggérons le style qui vous va le mieux",
      modalTitle: "Conseiller style IA",
      intro: "Importez une photo nette de votre visage ou de vos cheveux. L’intelligence artificielle analyse votre forme de visage et votre type de cheveux pour",
      introStrong: "les prestations de ce salon",
      introEnd: "vous proposer une recommandation sur mesure.",
      uploadCta: "Importer une photo",
      uploadHint: "JPG / PNG · 5 Mo maximum",
      previewAlt: "Aperçu",
      changePhoto: "Choisir une autre photo",
      prefsPlaceholder: "Facultatif : ex. « court et facile à entretenir »",
      analyzing: "Analyse en cours…",
      suggestCta: "Suggérer mon style",
      evaluation: "Évaluation",
      selectAndContinue: "Choisir cette prestation et continuer",
      noMatchedService:
        "Aucune prestation capillaire ne correspond exactement dans ce salon — vous pouvez en sélectionner une manuellement ci-dessous.",
      reanalyze: "Relancer l’analyse",
      disclaimer: "Les recommandations de l’IA sont fournies à titre informatif ; prenez la décision finale avec votre professionnel.",
      consent: "J’accepte que ma photo soit envoyée à un service d’intelligence artificielle (Google, situé à l’étranger) et y soit traitée afin de générer des suggestions de style.",
      consentRequired: "Vous devez cocher la case pour continuer.",
      photoLoadError: "Impossible de charger la photo, essayez une autre image.",
      genericError: "Une erreur s’est produite, veuillez réessayer.",
    },
  },

  pricing: {
    metaTitle: "Tarifs — Salonor Business",
    metaDescription:
      "Les formules Salonor Business : Découverte, Professionnel et Entreprise. Rendez-vous, encaissement, SMS, points fidélité, cartes cadeaux, stock, commissions et analyse IA — tout sur un seul tableau de bord. Mensuel ou annuel (2 mois offerts).",

    badge: "Salonor Business",
    title: "Choisissez la formule adaptée à votre établissement",
    subtitlePrefix: "Chaque formule reprend ",
    subtitleEmphasis: "tous les systèmes de la précédente",
    subtitleSuffix:
      ", et y ajoute de nouveaux outils pour développer votre activité. Installation gratuite, sans engagement.",

    trust: {
      noContract: "Sans contrat, sans engagement",
      freeSetup: "Installation gratuite — notre équipe s’en occupe",
      liveSupport: "Assistance en direct via WhatsApp",
    },

    footnotePrefix:
      "Les prix s’entendent hors TVA. Salonor n’opère qu’en Türkiye. Votre compte est configuré par notre équipe et vos identifiants vous sont transmis. Pour toute question, ",
    footnoteEmail: "isletme@salonor.com",

    billingAriaLabel: "Période de facturation",
    monthly: "Mensuel",
    annual: "Annuel",
    annualBadge: "2 mois offerts",

    mostPopular: "Le plus populaire",
    perMonth: "/ mois",
    annualBilledPrefix: "Facturé ",
    annualBilledSuffix: " par an",
    annualSavingsPrefix: "· soit ",
    annualSavingsSuffix: " d’économie par an",
    monthlyBilled: "Facturé chaque mois · annulable à tout moment",

    staffLabel: "Personnel / Utilisateur",
    smsBonusLabel: "Crédit SMS offert",

    contactCta: "Nous contacter",

    planBaslangicName: "Découverte",
    planBaslangicTagline: "Pour les salons débutants et les boutiques",
    planProfesyonelName: "Professionnel",
    planProfesyonelTagline: "Le favori des salons en pleine croissance",
    planKurumsalName: "Entreprise",
    planKurumsalTagline: "Pour les établissements très actifs et à nombreux collaborateurs",

    feature1: "Fiche client illimitée",
    feature2: "Ajout de prestations illimité",
    feature3: "Gestion des rendez-vous illimitée",
    feature4: "Système de confirmation de rendez-vous par SMS",
    feature5: "Envoi de SMS",
    feature6: "Système d’addition",
    feature7: "Système de vente de forfaits",
    feature8: "Suivi des créances / ventes à crédit",
    feature9: "Suivi des recettes et dépenses",
    feature10: "Système de commissions du personnel",
    feature11: "Système de points fidélité",
    feature12: "Système de cartes cadeaux",
    feature13: "Gestion des produits / du stock",
    feature14: "Analyse IA",
    feature15: "Reporting",
  },

  business: {
    meta: {
      title: "Salonor pour votre établissement — Logiciel de gestion de salon",
      description:
        "Réservation en ligne, agenda intelligent, encaissement, points fidélité, cartes cadeaux, stock, commissions et analyse IA — tout votre salon sur un seul tableau de bord intelligent. Installation gratuite, en ligne en 5 minutes.",
    },

    modules: {
      smartCalendar: "Agenda intelligent",
      onlineBooking: "Réservation en ligne",
      checkoutCashbox: "Encaissement et caisse",
      loyaltyPoints: "Points fidélité",
      giftCard: "Carte cadeau",
      productStock: "Produits et stock",
      staffCommission: "Commissions du personnel",
      debtTracking: "Suivi des créances",
      smsReminder: "SMS et rappels",
      aiAnalysis: "Analyse IA",
      reports: "Rapports",
      reviewReputation: "Avis et réputation",
    },

    steps: {
      step1Title: "Contactez-nous",
      step1Desc: "Remplissez le formulaire de contact ; notre équipe vous répond le jour même.",
      step1Badge: "Quelques minutes",
      step2Title: "Nous configurons votre salon",
      step2Desc: "Nous préparons pour vous votre équipe, vos prestations et vos horaires.",
      step2Badge: "Gratuit pour vous",
      step3Title: "Mettez en ligne et collectez des rendez-vous",
      step3Desc: "Votre page salon est en ligne ; vos clients réservent immédiatement.",
      step3Badge: "Le jour même",
    },

    testimonials: {
      quote1:
        "Depuis que nous sommes passés à Salonor, fini la course aux rendez-vous par téléphone. L’agenda se remplit tout seul et les clients sont ravis.",
      role1: "Coiffeur · Kadıköy",
      quote2:
        "Encaissement, caisse, commissions et stock sur un seul tableau de bord. La clôture de fin de mois prend quelques minutes, plus besoin de cahiers.",
      role2: "Barbier · Beşiktaş",
      quote3:
        "Grâce aux points fidélité et aux cartes cadeaux, les clients reviennent. Notre taux de rendez-vous non honorés a nettement baissé.",
      role3: "Centre de beauté · Bornova",
    },

    hero: {
      badge: "Salonor Business",
      titleLine1: "Tout votre salon",
      titleHighlight: "sur un seul tableau de bord intelligent",
      subtitle:
        "De la réservation en ligne à l’encaissement, des points fidélité à l’analyse IA — tout ce qui fait grandir votre salon au même endroit. Réduisez les appels, remplissez les fauteuils vides, fermez les cahiers.",
      ctaStart: "Commencer",
      ctaPackages: "Voir les formules",
      proofFreeSetup: "Installation gratuite",
      proofNoContract: "Sans engagement",
      proofLive: "En ligne en 5 minutes",
      notifNewAppt: "Nouveau rendez-vous · Ayşe K.",
      notifApptDetail: "14h30 · Coloration",
      revenueLabel: "Chiffre d’affaires du jour",
    },

    stats: {
      selectBusiness: "établissements d’exception",
      bookableService: "prestations réservables",
      verifiedReview: "avis vérifiés",
    },

    modulesSection: {
      kicker: "Un seul abonnement · des systèmes illimités",
      heading: "Tout pour gérer votre salon",
      descBefore: "Oubliez les cahiers éparpillés, les appels manqués et les applications séparées. Toutes les formules incluent ",
      descBold: "l’ensemble",
      descAfter: " des systèmes ci-dessous.",
    },

    calendarShowcase: {
      kicker: "Agenda intelligent",
      heading: "Toute votre journée, sur un seul écran",
      descBefore:
        "Avec un agenda coloré par membre de l’équipe, voyez instantanément qui réalise quelle prestation et à quel moment. Grâce à la protection anti-conflit, deux rendez-vous ne tombent",
      descBold: " jamais",
      descAfter: " sur le même fauteuil.",
      feat1Title: "Protection contre les doubles réservations",
      feat1Desc: "Impossible d’inscrire deux clients au même créneau — le système l’empêche.",
      feat2Title: "Ajout de clients sans rendez-vous",
      feat2Desc: "Ajoutez à l’agenda le client qui se présente en un seul geste.",
      feat3Title: "Suivi des statuts",
      feat3Desc: "Confirmé, terminé, absent — tout est coloré et clair.",
    },

    bookingShowcase: {
      kicker: "Réservation en ligne",
      heading: "Votre agenda se remplit pendant que vous dormez",
      desc:
        "Vos clients réservent en quelques secondes, jour et nuit, sans attendre au téléphone. Les confirmations et rappels partent automatiquement ; moins d’absences, plus aucun fauteuil vide.",
      feat1: "Confirmation immédiate 24h/24",
      feat2: "Rappels par SMS et WhatsApp",
      feat3: "Avis vérifiés",
      feat4: "Conforme au RGPD et sécurisé",
    },

    comparison: {
      heading: "Laissez l’ancienne méthode derrière vous",
      sub: "Le chaos du cahier et du téléphone, ou un système qui tourne tout seul ?",
      oldTitle: "Ancienne méthode",
      old1: "Rendez-vous par téléphone, appels manqués",
      old2: "Agenda confus dans un cahier, doubles réservations",
      old3: "Rendez-vous oubliés, fauteuils vides",
      old4: "On ne sait pas où passe le chiffre d’affaires",
      old5: "Le client vient une fois et ne revient jamais",
      newTitle: "Avec Salonor",
      new1: "Réservation en ligne 24h/24, zéro appel manqué",
      new2: "Agenda coloré + protection automatique anti-conflit",
      new3: "Rappels automatiques, fauteuils occupés",
      new4: "Rapports instantanés de chiffre d’affaires, taux de remplissage et prestations",
      new5: "Des clients qui reviennent grâce aux points fidélité et aux cartes cadeaux",
    },

    testimonialsSection: {
      heading: "Ce que disent les gérants de salon",
    },

    stepsSection: {
      heading: "En ligne en 3 étapes",
      sub: "C’est nous qui faisons l’installation. Vous n’avez qu’à accueillir vos clients.",
    },

    finalCta: {
      badge: "L’installation, c’est nous",
      heading: "Transférez votre salon sur Salonor dès aujourd’hui",
      desc:
        "Installation gratuite, prête en 5 minutes. Vos clients actuels peuvent commencer à réserver en ligne dès aujourd’hui.",
      ctaStart: "Commencer",
      ctaPackages: "Découvrir les formules",
      proofNoContract: "Sans engagement",
      proofCancel: "Annulable à tout moment",
      proofSupport: "Une assistance dédiée à la Türkiye",
    },

    calendarMock: {
      windowTitle: "Salonor · Agenda",
      today: "Aujourd’hui",
      dayTitle: "Samedi 14 juin",
      staffActive: "3 membres actifs",
    },

    walkInErrors: {
      unauthorized: "Non autorisé.",
      staffNotFound: "Membre du personnel introuvable.",
      selectService: "Sélectionnez au moins une prestation.",
      servicesNotFound: "Les prestations sélectionnées sont introuvables.",
      invalidTime: "Heure invalide.",
      staffServiceMismatch: "Ce membre du personnel ne réalise pas toutes les prestations sélectionnées.",
      invalidPhone: "Saisissez un numéro de téléphone mobile valide (05XX XXX XX XX).",
      pastDayEnd: "Le rendez-vous dépasse la fin de la journée (24:00).",
      slotTaken: "Le membre du personnel a déjà un rendez-vous à cette heure.",
      createFailed: "Impossible d’ajouter le rendez-vous. Veuillez réessayer.",
    },

    phoneMock: {
      salonName: "Studio Lumière",
      salonMeta: "4.9 (210) · Nişantaşı",
      svc1Name: "Coupe de cheveux",
      svc1Dur: "45 min",
      svc1Price: "350 ₺",
      svc2Name: "Coloration",
      svc2Dur: "90 min",
      svc2Price: "900 ₺",
      svc3Name: "Soin du visage",
      svc3Dur: "60 min",
      svc3Price: "600 ₺",
      bookCta: "Réserver",
      confirmTitle: "Votre rendez-vous est confirmé",
      confirmDate: "14 juin · 14h30",
      confirmCode: "SLNR-7K2P9",
      waMessage: "Bonjour Ayşe 👋 Nous vous rappelons votre rendez-vous demain à 14h30 💇‍♀️",
      waLabel: "WhatsApp ✓✓",
    },
  },

  auth: {
    login: {
      metaTitle: "Se connecter",
      title: "Bon retour parmi nous",
      subtitle: "Connectez-vous pour gérer vos rendez-vous.",
      demoTitle: "Comptes de démonstration",
      demoCustomer: "Client :",
      demoBusiness: "Établissement :",
      demoPassword: "Mot de passe (les deux) :",
    },

    fields: {
      email: "E-mail",
      password: "Mot de passe",
      name: "Prénom et nom",
      phoneOptional: "Téléphone (facultatif)",
      businessEmail: "Votre e-mail professionnel",
    },

    placeholders: {
      email: "exemple@email.com",
      password: "••••••••",
      name: "Votre prénom et nom",
      phone: "05xx xxx xx xx",
      passwordMin: "6 caractères minimum",
      businessEmail: "salon@email.com",
    },

    loginForm: {
      submit: "Se connecter",
      submitPending: "Connexion en cours...",
      noAccount: "Vous n’avez pas de compte ?",
      contactUs: "Contactez-nous",
      tooManyAttempts: "Vous avez effectué trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.",
    },

    registerForm: {
      submit: "Créer un compte",
      submitPending: "Création du compte...",
      haveAccount: "Vous avez déjà un compte ?",
      signIn: "Se connecter",
    },

    businessForm: {
      submit: "Continuer — configurez votre établissement",
      submitPending: "Création du compte...",
      termsNotice: "En continuant, vous acceptez les Conditions d’utilisation.",
    },
  },

  account: {
    // Layout du compte (en-tête)
    greeting: "Bonjour {name} 👋",
    layoutSubtitle: "Gérez ici vos rendez-vous et votre compte.",

    // Navigation par onglets
    tabs: {
      appointments: "Mes rendez-vous",
      favorites: "Mes favoris",
      profile: "Mon profil",
    },

    // Titres des pages (metadata)
    meta: {
      appointments: "Mes rendez-vous",
      profile: "Mon profil",
      favorites: "Mes favoris",
    },

    // Page des rendez-vous
    appointments: {
      statusConfirmed: "Confirmé",
      statusCompleted: "Terminé",
      statusCancelled: "Annulé",
      statusNoShow: "Absent",
      emptyTitle: "Vous n’avez pas encore de rendez-vous",
      emptyDesc: "Découvrez les meilleurs salons près de chez vous et réservez votre premier rendez-vous en quelques secondes.",
      discoverSalons: "Découvrir des salons",
      upcomingTitle: "Rendez-vous à venir ({n})",
      noUpcoming: "Vous n’avez aucun rendez-vous à venir.",
      newAppointment: "Prendre un nouveau rendez-vous →",
      pastTitle: "Historique",
      withStaff: "Avec {name}",
      codeAndTotal: "Code : {code} · {total}",
      rebook: "Reprendre rendez-vous",
    },

    // Page des favoris
    favorites: {
      emptyTitle: "Vous n’avez pas encore de favoris",
      emptyDesc: "Enregistrez les salons que vous aimez d’un simple cœur ; vous les retrouverez tous ici.",
      discoverSalons: "Découvrir des salons",
    },

    // Formulaire de profil
    profile: {
      nameLabel: "Prénom et nom",
      emailLabel: "E-mail",
      emailHint: "L’adresse e-mail ne peut pas être modifiée.",
      phoneLabel: "Téléphone",
      phonePlaceholder: "05xx xxx xx xx",
      passwordSectionTitle: "Changer de mot de passe (facultatif)",
      currentPasswordLabel: "Mot de passe actuel",
      newPasswordLabel: "Nouveau mot de passe",
      updated: "Votre profil a été mis à jour.",
      save: "Enregistrer les modifications",
    },

    // Bouton d’annulation de rendez-vous
    cancel: {
      cancel: "Annuler",
      confirm: "Êtes-vous sûr ?",
      cancelling: "Annulation en cours...",
      yesCancel: "Oui, annuler",
      dismiss: "Renoncer",
    },

    // Modale d’avis
    review: {
      shareOnGoogle: "Partager sur Google",
      rate: "Évaluer",
      thanksTitle: "Merci !",
      thanksDesc: "Votre avis a été publié, vous avez guidé les autres utilisateurs.",
      alsoGoogleTitle: "Le partageriez-vous aussi sur Google ?",
      alsoGoogleDesc: "Votre avis sur Google pour {name} nous est très précieux.",
      rateOnGoogle: "Évaluer sur Google",
      close: "Fermer",
      ratingLabel: "Votre note",
      starsAria: "{n} étoiles",
      experienceLabel: "Votre expérience",
      commentPlaceholder: "Comment était la prestation ? Guidez les autres utilisateurs...",
      submitting: "Envoi en cours...",
      submitReview: "Envoyer l’avis",
    },
  },

  legal: {
    // Composant utilitaire commun (info-page.tsx)
    brand: "Salonor",
    lastUpdated: "Dernière mise à jour :",

    // À propos
    about: {
      metaTitle: "À propos",
      title: "À propos",
      intro:
        "Salonor est une plateforme de réservation conçue pour la Türkiye, qui vous permet de prendre vos rendez-vous beauté et soins personnels en quelques secondes.",
      missionTitle: "Notre mission",
      missionBody:
        "Nous voulons rendre l’accès aux prestations de coiffure, barbier, spa, ongles et beauté facile, transparent et fiable pour tous. Fini la course aux rendez-vous par téléphone ; nous réunissons les créneaux disponibles, les avis authentiques et les tarifs clairs sur un seul écran.",
      customersTitle: "Pour les clients",
      customersBody:
        "Découvrez les meilleurs salons près de chez vous, parcourez les photos et les avis vérifiés, choisissez le créneau qui vous convient et réservez votre place en un instant — le tout entièrement gratuit.",
      businessesTitle: "Pour les professionnels",
      businessesBody:
        "Avec Salonor Business, regroupez la gestion des rendez-vous, de l’agenda, de l’équipe et des prestations sur un seul tableau de bord ; recevez des réservations en ligne 24h/24, gagnez la confiance grâce aux avis et touchez de nouveaux clients.",
      valuesTitle: "Nos valeurs",
      valuesBody:
        "Transparence, rapidité et confiance. Nous œuvrons pour bâtir une place de marché juste et pratique, où les clients comme les professionnels sont gagnants.",
    },

    // Confidentialité et RGPD
    privacy: {
      metaTitle: "Confidentialité et RGPD",
      title: "Politique de confidentialité et protection des données",
      updated: "13 juin 2026",
      intro:
        "La sécurité de vos données personnelles est importante pour nous. Ce texte résume la manière dont vos données sont traitées lorsque vous utilisez Salonor.",
      controllerTitle: "Responsable du traitement",
      controllerBody:
        "Au titre de la loi turque n° 6698 sur la protection des données personnelles (KVKK), le responsable du traitement est Salonor Teknoloji A.Ş. Pour toute question, écrivez à destek@salonor.com.",
      dataTitle: "Données traitées",
      dataBody:
        "Vos informations de compte (nom, e-mail, téléphone), votre historique de rendez-vous, vos salons favoris et les avis que vous publiez ; nous traitons également des données d’usage essentielles pour la qualité du service.",
      purposesTitle: "Finalités du traitement",
      purposesBody:
        "Nous traitons vos données pour créer et gérer vos rendez-vous, vous envoyer des rappels (SMS/WhatsApp/e-mail), assurer la sécurité de votre compte et améliorer la plateforme.",
      sharingTitle: "Partage",
      sharingBody:
        "Les informations nécessaires à la réalisation de votre rendez-vous sont partagées avec l’établissement concerné. Vos données ne sont jamais vendues à des tiers à des fins marketing.",
      aiTitle: "Traitement des données par l’intelligence artificielle",
      aiBody:
        "Lorsque vous utilisez la fonctionnalité Conseiller style IA, la photo que vous importez et les notes que vous ajoutez sont transférées à notre prestataire d’intelligence artificielle Google (serveurs situés à l’étranger) et y sont traitées afin de générer des suggestions de style. Cette fonctionnalité est entièrement facultative et ne fonctionne qu’avec votre consentement explicite ; si vous ne donnez pas votre consentement, votre photo n’est envoyée nulle part. Les photos ne sont pas conservées par Salonor une fois la suggestion générée.",
      rightsTitle: "Vos droits",
      rightsBody:
        "Conformément à l’article 11 de la KVKK, vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition au traitement de vos données. Pour vos demandes : destek@salonor.com.",
    },

    // Conditions d’utilisation
    terms: {
      metaTitle: "Conditions d’utilisation",
      title: "Conditions d’utilisation",
      updated: "13 juin 2026",
      intro: "En utilisant Salonor, vous acceptez les conditions ci-dessous.",
      serviceTitle: "Service",
      serviceBody:
        "Salonor est une plateforme de réservation qui met en relation les clients et les établissements de beauté et de soins. Les prestations sont fournies par les établissements ; Salonor agit en tant qu’intermédiaire.",
      accountTitle: "Compte",
      accountBody:
        "Vous êtes responsable de la sécurité de votre compte et de l’exactitude des informations que vous fournissez. Les mineurs de moins de 18 ans doivent l’utiliser avec l’accord d’un parent.",
      bookingsTitle: "Rendez-vous et annulation",
      bookingsBody:
        "Vous êtes tenu d’honorer vos rendez-vous à l’heure. Les règles d’annulation et de modification peuvent varier d’un établissement à l’autre ; les conditions affichées sur la page de réservation s’appliquent.",
      reviewsTitle: "Avis",
      reviewsBody:
        "Vous ne devez publier que des avis honnêtes et respectueux, et uniquement pour des prestations que vous avez réellement reçues. Les insultes, le spam et les contenus trompeurs sont supprimés.",
      liabilityTitle: "Responsabilité",
      liabilityBody:
        "L’établissement concerné est responsable de la qualité de la prestation. Salonor s’efforce d’assurer le fonctionnement continu de la plateforme, mais des incidents techniques peuvent survenir.",
    },

    // FAQ
    faq: {
      metaTitle: "Aide et foire aux questions",
      title: "Aide et foire aux questions",
      intro:
        "La réponse à la plupart de vos questions se trouve ici. Si vous ne la trouvez pas, destek@salonor.com est toujours à votre disposition.",
      q1: "L’utilisation de Salonor est-elle payante ?",
      a1: "Non. Pour les clients, prendre rendez-vous est entièrement gratuit ; vous ne payez que le prix de la prestation reçue au salon.",
      q2: "Comment annuler mon rendez-vous ?",
      a2: "Vous pouvez consulter et annuler votre rendez-vous depuis Mon compte → Mes rendez-vous. Les conditions d’annulation peuvent varier selon l’établissement.",
      q3: "Vais-je recevoir un rappel de rendez-vous ?",
      a3: "Oui. À l’approche de votre rendez-vous, un rappel vous est envoyé par le canal de votre choix (SMS, WhatsApp ou e-mail).",
      q4: "Les avis sont-ils authentiques ?",
      a4: "Les avis ne sont rédigés que par les clients ayant honoré leur rendez-vous ; les notes que vous voyez reposent donc sur de vraies expériences.",
      q5: "Comment ajouter mon établissement ?",
      a5: "Inscrivez-vous gratuitement depuis la page Salonor pour votre établissement ; une installation de 5 minutes suffit à mettre votre salon en ligne.",
    },

    // Contact
    contact: {
      metaTitle: "Contact",
      title: "Contact",
      intro:
        "Vous souhaitez ajouter votre établissement sur Salonor ? Remplissez le formulaire ci-dessous, notre équipe vous contactera.",
      addBusinessTitle: "Ajoutez votre établissement sur Salonor",
      addBusinessBody:
        "Salon, coiffeur, barbier, spa ou centre de beauté, peu importe — laissez vos coordonnées, nous configurons votre établissement gratuitement et vous commencez à recevoir des réservations en ligne immédiatement.",
      cardSupportTitle: "Service client",
      cardPartnerTitle: "Partenariat professionnel",
      cardPressTitle: "Presse et autres",
      hoursTitle: "Horaires d’ouverture",
      hoursBody:
        "Notre équipe d’assistance répond aux demandes écrites en semaine de 09h00 à 18h00. Nous répondons généralement le jour même.",
      businessTitle: "Vous êtes un professionnel ?",
      businessBodyBefore: "Pour découvrir Salonor Business et ajouter votre établissement, ",
      businessBodyAfter:
        " écrivez à cette adresse ou commencez dès maintenant depuis la page d’inscription.",
    },

    // Formulaire de contact (contact-form.tsx, composant client)
    contactForm: {
      successTitle: "Votre demande nous est parvenue 🎉",
      successBody:
        "Notre équipe vous contactera dans les meilleurs délais pour ajouter votre établissement sur Salonor.",
      nameLabel: "Prénom et nom",
      namePlaceholder: "Votre prénom et nom",
      emailLabel: "E-mail",
      emailPlaceholder: "exemple@email.com",
      phoneLabel: "Téléphone",
      phonePlaceholder: "05xx xxx xx xx",
      messageLabel: "À propos de votre établissement (facultatif)",
      messagePlaceholder: "Parlez-nous brièvement du nom, de la ville et des prestations de votre salon...",
      pendingText: "Envoi en cours...",
      submit: "Envoyer la demande",
      disclaimer: "Vos informations ne sont utilisées que pour vous contacter.",
    },
  },

  panelCore: {
    // Sidebar — titres de section
    navDailyTitle: "Quotidien",
    navSalesTitle: "Ventes et finances",
    navCatalogTitle: "Catalogue",
    navMarketingTitle: "Marketing",
    navCustomerTitle: "Clients",
    navToolsTitle: "Outils et paramètres",

    // Sidebar — libellés des menus
    navOverview: "Vue d’ensemble",
    navCalendar: "Agenda",
    navNotifications: "Notifications",
    navCashbox: "Caisse et addition",
    navDebts: "Créances et échéances",
    navReports: "Rapports",
    navExpenses: "Dépenses",
    navServices: "Prestations",
    navStaff: "Personnel",
    navCommission: "Commissions et performance",
    navPackages: "Forfaits",
    navProducts: "Produits et stock",
    navCampaigns: "Campagnes",
    navGiftCard: "Carte cadeau",
    navLoyalty: "Points fidélité",
    navSms: "SMS",
    navMessaging: "Messagerie",
    navCustomers: "Clients",
    navLostCustomers: "Clients perdus",
    navReviews: "Avis",
    navAiAnalysis: "Analyse IA",
    navTodos: "À faire",
    navSettings: "Paramètres",

    // Sidebar — actions / libellés du bas
    businessLabel: "Établissement",
    viewMyPage: "Voir ma page",
    logout: "Se déconnecter",
    loggingOut: "Déconnexion en cours...",
    menu: "Menu",
    close: "Fermer",

    // Tableau de bord (vue d’ensemble)
    dashboardTitle: "Vue d’ensemble",
    goToCalendar: "Aller à l’agenda",
    statTodayAppts: "Rendez-vous du jour",
    statTodayRevenue: "Chiffre d’affaires du jour",
    statWeekRevenue: "Chiffre d’affaires sur 7 jours",
    statRating: "Note",
    todaySchedule: "Le programme du jour",
    calendar: "Agenda",
    noApptsToday: "Aucun rendez-vous pour aujourd’hui",
    noApptsTodayDesc: "Vous pouvez ajouter un rendez-vous manuellement depuis l’agenda.",
    noShowTag: "Absent",
    last7Days: "7 derniers jours",
    summary: "Récapitulatif",
    nextAppt: "Prochain rendez-vous",
    upcomingAppts: "Rendez-vous à venir",
    totalReviews: "Total des avis",
    activeStaff: "Personnel actif",

    // Agenda (CalendarBoard)
    calendarTitle: "Agenda",
    newAppt: "Rendez-vous",
    prevDay: "Jour précédent",
    nextDay: "Jour suivant",
    today: "Aujourd’hui",
    noStaffTitle: "Aucun membre du personnel pour le moment",
    noStaffDesc: "Pour utiliser l’agenda, vous devez d’abord ajouter votre équipe.",
    addStaff: "Ajouter un membre du personnel",
    closedNotice: "Cette journée semble fermée selon vos horaires d’ouverture — vous pouvez tout de même ajouter un rendez-vous.",

    // Agenda — légende
    legendConfirmed: "Confirmé",
    legendCompleted: "Terminé",
    legendNoShow: "Absent",

    // Modale de nouveau rendez-vous
    newApptTitle: "Nouveau rendez-vous",
    staffField: "Personnel",
    startField: "Début",
    customerNameField: "Nom du client",
    customerNamePlaceholder: "Ex. Ayşe K. (peut rester vide)",
    phoneField: "Téléphone (pour le rappel)",
    phonePlaceholder: "05XX XXX XX XX (facultatif)",
    servicesField: "Prestations",
    selectAtLeastOneService: "Sélectionnez au moins une prestation.",
    overflowsDay: "Ce rendez-vous dépasse la fin de journée ({end}).",
    cancel: "Annuler",
    adding: "Ajout en cours...",
    addAppt: "Ajouter le rendez-vous",

    // Modale de détail du rendez-vous
    statusConfirmed: "Confirmé",
    statusCompleted: "Terminé",
    statusNoShow: "Absent",
    statusCancelled: "Annulé",
    withStaff: "Avec {staff}",
    noteLabel: "Note :",
    markCompleted: "Marquer comme terminé",
    markNoShow: "Absent",
    cancelAppt: "Annuler",
    apptStatusInfo: "Ce rendez-vous est au statut {status}.",

    // Page des notifications
    notificationsMetaTitle: "Notifications",
    notificationsTitle: "Notifications",
    notificationsSubtitle:
      "Confirmez les nouvelles demandes de rendez-vous et envoyez des rappels pour les rendez-vous à venir",
    reminderInfoReady: "déjà pré-rempli",
    reminderInfoMarked: "« Rappel envoyé »",
    reminderInfoBefore: "En appuyant sur le bouton, le message ",
    reminderInfoMiddle:
      " s’ouvre dans votre application WhatsApp/SMS ; c’est vous qui l’envoyez. Les messages envoyés sont automatiquement ",
    reminderInfoAfter:
      ", ainsi vous n’écrivez pas deux fois à la même personne. Aucun frais ni configuration supplémentaire.",
    noUpcomingTitle: "Aucun rendez-vous à venir",
    noUpcomingDesc: "Aucun rendez-vous confirmé pour les 3 prochains jours.",
    reminderMessageBody:
      "Bonjour {name}, rappel de rendez-vous {business} : {date} {time}. Nous vous attendons ! 😊",

    // Nouvelles demandes de rendez-vous (NewBookings)
    newBookingRequests: "Nouvelle demande de rendez-vous",
    approveAll: "Tout confirmer",
    approve: "Confirmer",
    approveFailed: "Confirmation impossible. Veuillez réessayer.",

    // Liste des rappels (ReminderList)
    reminderSaveFailed: "Impossible d’enregistrer le marquage, veuillez réessayer.",
    remindNow: "À rappeler maintenant",
    pendingCount: "{n} en attente",
    upcomingSection: "À venir (3 prochains jours)",
    noPhone: "Pas de téléphone",
    reminded: "Rappel envoyé",
    undo: "Annuler",
    whatsapp: "WhatsApp",
    sms: "SMS",

    // Libellés de repli communs (texte statique affiché lorsque la donnée DB est vide)
    fallbackCustomer: "Client",
    fallbackAppt: "Rendez-vous",
  },

  panelCatalog: {
    // ── Page des prestations / ServicesManager ──
    services: {
      title: "Prestations",
      subtitle: "{count} prestations · {sections} sections",
      addSection: "Section",
      addService: "Ajouter une prestation",
      addServiceShort: "Prestation",
      emptyTitle: "Aucune section pour le moment",
      emptyDesc: 'Pour regrouper vos prestations, créez d’abord une section (ex. « Coupe », « Couleur »).',
      addFirstSection: "Ajouter la première section",
      deleteSectionAria: "Supprimer la section",
      emptySection: "Aucune prestation dans cette section pour le moment.",
      editAria: "Modifier",
      deleteAria: "Supprimer",
      confirmDeleteSection: 'La section « {name} » sera supprimée. Confirmer ?',
      confirmDeleteService: 'La prestation « {name} » sera supprimée. Confirmer ?',

      // Modale d’ajout/modification de prestation
      modalEditTitle: "Modifier la prestation",
      modalNewTitle: "Nouvelle prestation",
      sectionLabel: "Section",
      nameLabel: "Nom de la prestation",
      namePlaceholder: "Ex. Coupe de cheveux femme",
      descLabel: "Description (facultatif)",
      descPlaceholder: "Ex. analyse capillaire + shampooing + coupe + brushing inclus",
      durationLabel: "Durée (min)",
      priceLabel: "Prix (₺)",
      cancel: "Annuler",
      save: "Enregistrer",
      add: "Ajouter",

      // Modale d’ajout de section
      categoryModalTitle: "Nouvelle section",
      categoryNameLabel: "Nom de la section",
      categoryNamePlaceholder: "Ex. Coupe et coiffage",
    },

    // ── Page du personnel / StaffManager ──
    staff: {
      title: "Personnel",
      subtitle: "{count} membres actifs",
      addStaff: "Ajouter un membre du personnel",
      emptyTitle: "Aucun membre du personnel pour le moment",
      emptyDesc: "Ajoutez votre équipe afin de pouvoir lui attribuer les rendez-vous.",
      addFirstStaff: "Ajouter le premier membre du personnel",
      inactiveBadge: "Inactif",
      summary: "{services} prestations · {appointments} rendez-vous",
      edit: "Modifier",
      deactivate: "Désactiver",
      activate: "Activer",
      deleteAria: "Supprimer",
      confirmDeactivate:
        "{name} ne peut pas être supprimé car des rendez-vous passés y sont rattachés. Le profil sera désactivé à la place. Continuer ?",
      confirmDelete:
        "{name} sera supprimé définitivement (y compris les commissions et les attributions de prestations). Cette action est irréversible. Confirmer ?",

      // Modale d’ajout/modification de personnel
      modalEditTitle: "Modifier le membre du personnel",
      modalNewTitle: "Nouveau membre du personnel",
      nameLabel: "Prénom et nom",
      namePlaceholder: "Ex. Elif Aydın",
      titleLabel: "Fonction",
      titlePlaceholder: "Ex. Experte couleur",
      cancel: "Annuler",
      save: "Enregistrer",
      add: "Ajouter",
      saving: "Enregistrement en cours...",

      // Attribution des prestations (prestations que le membre du personnel peut réaliser)
      manageServices: "Prestations",
      servicesModalTitle: "{name} — prestations",
      saveServices: "Enregistrer les prestations",
      noServices: "Ajoutez d’abord une prestation, puis vous pourrez l’attribuer au personnel.",

      // Limite de personnel de la formule
      staffLimitReached:
        "La formule {plan} vous permet d’ajouter au maximum {limit} membres du personnel actifs. Pour en ajouter davantage, passez à une formule supérieure.",
    },

    // ── Page des paramètres ──
    settings: {
      title: "Paramètres",
      subtitle: "Gérez le profil de votre établissement et vos horaires d’ouverture",
      publicPage: "Ma page publiée",
      businessInfo: "Informations sur l’établissement",
      workingHours: "Horaires d’ouverture",
      coverTitle: "Photo de couverture",
      coverDesc: "Choisissez l’image en haut de votre page salon. (Jeu d’images prêt à l’emploi pour la démo)",
    },

    // ── Formulaire de profil de l’établissement ──
    profile: {
      nameLabel: "Nom de l’établissement",
      descLabel: "Description",
      promoLabel: "📣 Campagne / annonce mise en avant",
      promoPlaceholder: "Ex. Cette semaine, -20 % sur la coloration !",
      promoUntilLabel: "Date de fin (facultatif) :",
      promoHint:
        "Si vous renseignez ce champ, il apparaît tout en haut de votre page salon sous forme de bandeau accrocheur. Laissez-le vide pour ne rien afficher. Il disparaît automatiquement une fois la date de fin passée.",
      phoneLabel: "Téléphone",
      phonePlaceholder: "0212 000 00 00",
      whatsappLabel: "Numéro WhatsApp",
      whatsappPlaceholder: "05XX XXX XX XX (le téléphone est utilisé si vide)",
      whatsappHint: "Le bouton « Écrire sur WhatsApp » sur votre page salon ouvre ce numéro. Si vous le laissez vide, votre numéro de téléphone est utilisé.",
      cityLabel: "Ville",
      addressLabel: "Adresse",
      districtLabel: "Arrondissement",
      mapLabel: "Position sur la carte",
      mapHint: "Vos clients vous trouvent sur la carte. Faites glisser le marqueur ou cliquez sur la carte.",
      placeIdLabel: "Identifiant de lieu Google (Place ID)",
      placeIdPlaceholder: "ex. ChIJN1t_tDeuEmsRUsoyG83frY4",
      placeIdHintBefore: "Si vous le renseignez, vos clients peuvent aussi partager leurs avis ",
      placeIdHintGoogle: "sur Google",
      placeIdHintMid: ". Vous pouvez trouver votre Place ID ",
      placeIdHintLink: "ici",
      placeIdHintAfter: " en cherchant le nom de votre établissement. Vous pouvez aussi coller le lien complet.",
      saveSuccess: "Les informations de votre établissement ont été mises à jour.",
      saveButton: "Enregistrer les modifications",
    },

    // ── Éditeur des horaires d’ouverture ──
    hours: {
      closed: "Fermé",
      open: "Ouvert",
      saving: "Enregistrement en cours...",
      saveButton: "Enregistrer les horaires",
      saved: "Enregistré",
      invalidError: "Horaire invalide : l’ouverture doit précéder la fermeture.",
    },

    // ── Sélecteur de photo de couverture ──
    cover: {
      optionAlt: "Option de couverture",
    },

    // ── Formulaires du catalogue (forfait / campagne / produit / prime / stock) ──
    catalog: {
      adding: "Ajout en cours...",
      saving: "Enregistrement en cours...",
      deleteAria: "Supprimer",
      editAria: "Modifier",
      cancel: "Annuler",
      saveChanges: "Enregistrer les modifications",
      editProduct: "Modifier le produit",
      editPackage: "Modifier le forfait",
      editCampaign: "Modifier la campagne",
      active: "Actif",
      inactive: "Inactif",
      decreaseAria: "Diminuer",
      increaseAria: "Augmenter",
      saveCommission: "Enregistrer",
      commissionLabel: "Taux de commission (%)",

      // Formulaire de forfait
      packageNameLabel: "Nom du forfait",
      packageNamePlaceholder: "Ex. Soin du visage 5 séances",
      priceLabel: "Prix (₺)",
      sessionsLabel: "Séances",
      daysLabel: "Jours",
      descLabel: "Description (facultatif)",
      addPackage: "Ajouter un forfait",

      // Formulaire de campagne
      codeLabel: "Code de réduction",
      codePlaceholder: "ETE25",
      discountLabel: "Réduction (%)",
      expiresLabel: "Date de fin (facultatif)",
      createCampaign: "Créer la campagne",
      expiryInPast: "La date de fin ne peut pas être antérieure à aujourd’hui.",

      // Formulaire de produit
      productNameLabel: "Nom du produit",
      productNamePlaceholder: "Ex. Shampooing 500 ml",
      stockLabel: "Stock",
      lowStockLabel: "Seuil bas",
      addProduct: "Ajouter un produit",
    },
  },

  panelFinance: {
    // ── Commun ──
    noDataYet: "Aucune donnée pour le moment.",

    // ── Caisse et addition (kasa/page + kasa-pos) ──
    kasa: {
      metaTitle: "Caisse et addition",
      title: "Caisse et addition",
      subtitle: "Encaissez rapidement et suivez votre caisse quotidienne",
      todayCash: "Caisse du jour",
      todayTxns: "Transactions du jour",
      todaySales: "Ventes du jour",
      noSalesToday: "Aucune vente aujourd’hui pour le moment.",
      defaultCustomer: "Client",

      // POS — catalogue
      services: "Prestations",
      products: "Produits",
      noProductsHint: "Aucun produit pour le moment — vous pouvez en ajouter depuis Produits et stock.",
      outOfStock: "rupture de stock",
      stockCount: "stock {n}",
      stockExactNone: '« {name} » est en rupture de stock.',
      stockLimit: '« {name} » : {n} en stock — impossible d’en ajouter davantage.',

      // POS — article manuel
      manualLine: "Article manuel",
      descriptionPlaceholder: "Description",
      priceTlSymbol: "₺",
      manualHint: "Le montant se saisit en TL entiers ; vous pourrez le modifier à nouveau dans le panier.",
      unitPriceAria: "Prix unitaire",
      perUnit: "₺ / unité",

      // POS — panier/addition
      receipt: "Addition",
      saleSaved: "Vente enregistrée ✓ Vous pouvez ajouter une nouvelle addition.",
      emptyCart: "Ajoutez un produit/une prestation depuis la gauche.",
      decrease: "Diminuer",
      increase: "Augmenter",
      remove: "Retirer",
      customerNamePlaceholder: "Nom du client (facultatif)",
      customerPhonePlaceholder: "Téléphone — pour attribuer des points (facultatif)",
      earnPointsNote: "Cette vente rapporte {n} points (5 points par tranche de 100 ₺).",
      total: "Total",
      saving: "Enregistrement en cours...",
      charge: "Encaisser",
    },

    // ── Dépenses (giderler/page + expenses) ──
    expenses: {
      metaTitle: "Dépenses",
      title: "Dépenses",
      subtitle: "Suivi mensuel des dépenses et bénéfice net",
      revenueOfMonth: "Chiffre d’affaires de {month}",
      cashSales: "Ventes en caisse",
      monthExpense: "Dépenses du mois",
      netProfit: "Bénéfice net",
      addExpense: "Ajouter une dépense",
      expensesOfMonth: "Dépenses de {month}",
      emptyTitle: "Aucune dépense ce mois-ci",
      emptyDesc: "Ajoutez votre première dépense avec le formulaire à gauche.",

      // Formulaire
      description: "Description",
      descriptionPlaceholder: "Ex. Loyer mensuel",
      category: "Catégorie",
      amountWithSymbol: "Montant (₺)",
      date: "Date",
      note: "Note (facultatif)",
      notePlaceholder: "Détail...",
      adding: "Ajout en cours...",
      submit: "Ajouter une dépense",
      deleteConfirm: "Supprimer cette dépense ? Cette action est irréversible.",
      deleteAria: "Supprimer la dépense",
    },

    // ── Créances et échéances (borclar/page + debt-manager) ──
    debt: {
      metaTitle: "Créances et échéances — Salonor",
      title: "Créances et ventes à crédit",
      subtitle: "Suivez les comptes ouverts et encaissez les échéances",
      openAccounts: "Comptes ouverts",
      totalReceivable: "Total des créances",
      collected: "Encaissé",

      // Formulaire
      newDebt: "Nouvelle créance / échéance",
      customerName: "Nom du client",
      phoneOptional: "Téléphone (facultatif)",
      amountWithSymbol: "Montant (₺)",
      installment: "Échéance",
      noteOptional: "Note (facultatif)",
      errEnterCustomer: "Saisissez le nom du client.",
      errEnterValidAmount: "Saisissez un montant valide.",
      saving: "Enregistrement en cours...",
      addDebtRecord: "Ajouter une créance",

      // Liste / ligne
      emptyTitle: "Aucun compte ouvert",
      emptyDesc: "Suivez les ventes à crédit/à échéances en les ajoutant depuis la gauche.",
      closedAccounts: "Comptes soldés",
      installmentCount: "{n} échéances",
      closed: "Soldé",
      remaining: "restant",
      paidOf: "{paid} / {total} payé",
      errEnterAmount: "Saisissez un montant.",
      collectMax: "Encaissement (maximum {n})",
      collect: "Encaisser",
      deleteConfirm: "Supprimer cette créance ?",
      paymentHistory: "Historique des encaissements",
      noPaymentsYet: "Aucun encaissement pour le moment.",
    },

    // ── Points fidélité (para-puan/page + loyalty-manager) ──
    loyalty: {
      metaTitle: "Points fidélité — Salonor",
      title: "Points fidélité",
      subtitle: "Points de fidélité client — faites gagner, cumulez, dépensez",
      totalMembers: "Total des membres",
      circulatingPoints: "Points en circulation",
      pointValue: "Valeur du point",
      pointValueHint: "1 point = 1 ₺",

      // Ajouter des points
      addPoints: "Ajouter des points",
      customerName: "Nom du client",
      phonePlaceholder: "05xx xxx xx xx",
      pointsAmount: "Nombre de points",
      errEnterCustomer: "Saisissez le nom du client.",
      errEnterValidPoints: "Saisissez un nombre de points valide.",
      adding: "Ajout en cours...",
      hint: "Astuce : sur l’écran Caisse et addition, si vous saisissez le téléphone du client lors de l’encaissement, la vente attribue automatiquement des points (5 points par tranche de 100 ₺).",

      // Liste des membres
      searchPlaceholder: "Rechercher par nom ou téléphone",
      emptyNoMembers: "Aucun client avec des points pour le moment",
      emptyNoMatch: "Aucun client correspondant",
      emptyDesc: "Commencez en ajoutant le premier point depuis la gauche.",
      points: "points",
      spend: "Dépenser",
      errEnterQuantity: "Saisissez une quantité.",
      redeemMax: "Maximum {n}",
      use: "Utiliser",
    },

    // ── Carte cadeau (hediye-ceki/page + giftcard-manager) ──
    giftcard: {
      metaTitle: "Carte cadeau — Salonor",
      title: "Carte cadeau",
      subtitle: "Créez des cartes cadeaux, attribuez un code et utilisez-le à la vente",
      activeCards: "Cartes actives",
      unusedBalance: "Solde non utilisé",
      totalIssued: "Total émis",

      // Formulaire
      newGiftcard: "Nouvelle carte cadeau",
      amountWithSymbol: "Montant (₺)",
      amountPlaceholder: "ex. 500",
      buyerPlaceholder: "Acheteur (facultatif)",
      recipientPlaceholder: "Bénéficiaire (facultatif)",
      expiryOptional: "Date d’expiration (facultatif)",
      errEnterValidAmount: "Saisissez un montant valide.",
      creating: "Création en cours...",
      createCard: "Créer la carte",

      // Liste / carte
      emptyTitle: "Aucune carte cadeau pour le moment",
      emptyDesc: "Créez votre première carte depuis la gauche et donnez le code à votre client.",
      copyCode: "Copier le code",
      depleted: "Épuisée",
      active: "Active",
      passive: "Inactive",
      balanceOf: "/ {total} de solde",
      buyerLabel: "Acheteur : {name}. ",
      recipientLabel: "Cadeau : {name}. ",
      expiryLabel: "Expire le : {date}",
      errEnterQuantity: "Saisissez une quantité.",
      redeemMax: "Maximum {n}",
      use: "Utiliser",
      deactivate: "Désactiver",
      activate: "Activer",
      deduct: "Déduire",
    },

    // ── Commissions et performance (prim/page) ──
    commission: {
      metaTitle: "Commissions et performance",
      title: "Commissions et performance",
      subtitle: "30 derniers jours — chiffre d’affaires du personnel et calcul des commissions",
      revenue30d: "Chiffre d’affaires sur 30 jours",
      commissionDue: "Commission à verser",
      emptyTitle: "Aucun membre du personnel actif",
      emptyDesc: "Ajoutez d’abord votre équipe depuis la section Personnel.",
      colStaff: "Personnel",
      colAppointment: "Rendez-vous",
      colRevenue30d: "CA (30 j)",
      colCommissionPct: "Commission %",
      colCommissionAmount: "Montant de la commission",
      footnote:
        'Saisissez le taux de commission puis appuyez sur « Enregistrer » — le montant est calculé automatiquement selon le chiffre d’affaires des 30 derniers jours du membre.',
    },

    // ── Rapports (raporlar/page) ──
    reports: {
      metaTitle: "Rapports",
      title: "Rapports",
      subtitle: "Performance des 30 derniers jours",
      revenue30d: "Chiffre d’affaires sur 30 jours",
      cashSales: "Ventes en caisse",
      appointment: "Rendez-vous",
      avgTicket: "Panier moyen",
      completed: "Terminés",
      dailyRevenueTitle: "Chiffre d’affaires quotidien · 14 derniers jours",
      topServicesTitle: "Prestations les plus rentables",
      timesUsed: "{n} fois",
      staffPerformanceTitle: "Performance du personnel",
      appointmentCount: "{n} rendez-vous",
      busyDaysTitle: "Jours d’affluence de la semaine",
      appointmentStatusTitle: "Statuts des rendez-vous",
      statusCompleted: "Terminés",
      statusConfirmedPending: "Confirmés (à venir)",
      statusCancelled: "Annulés",
      statusNoShow: "Absents",
    },

    // ── Produits et stock (urunler/page) ──
    products: {
      metaTitle: "Produits et stock",
      title: "Produits et stock",
      subtitle: "Suivi des produits de revente et du stock",
      productTypes: "Références produits",
      lowStock: "Stock bas",
      stockValue: "Valeur du stock",
      addProduct: "Ajouter un produit",
      productsCount: "Produits",
      emptyTitle: "Aucun produit pour le moment",
      emptyDesc: "Ajoutez votre premier produit avec le formulaire à gauche.",
      lowStockBadge: "· stock bas !",
    },

    // ── Forfaits (paketler/page) ──
    packages: {
      metaTitle: "Forfaits",
      title: "Forfaits",
      subtitle: "Forfaits de séances et abonnements — générez un revenu régulier",
      addPackage: "Ajouter un forfait",
      packagesCount: "Forfaits",
      emptyTitle: "Aucun forfait pour le moment",
      emptyDesc: "Créez votre premier forfait avec le formulaire à gauche.",
      sessionsValidity: "{sessions} séances · valable {days} jours",
    },
  },

  panelOther: {
    // === Page des clients ===
    customers: {
      title: "Clients",
      subtitle: "{n} clients",
      // CustomersTable
      emptyTitle: "Vous n’avez pas encore de clients",
      emptyDesc: "Au fur et à mesure des rendez-vous, vos clients apparaîtront ici.",
      searchPlaceholder: "Rechercher par nom, téléphone ou e-mail",
      sortLastVisit: "Dernière visite",
      sortVisits: "Nombre de visites",
      sortSpend: "Dépenses",
      noMatch: "Aucun client correspondant à « {q} ».",
      colCustomer: "Client",
      colContact: "Contact",
      colVisit: "Visites",
      colCompleted: "Terminés",
      colNoShow: "Absent",
      colSpend: "Dépenses",
      colLastVisit: "Dernière visite",
      salonCustomer: "Client du salon",
      visitsLabel: "{n} visites",
      completedLabel: "{n} terminés",
      noShowLabel: "{n} absences",
    },

    // === Page des avis ===
    reviews: {
      title: "Avis",
      subtitle: "{count} avis · {unanswered} sans réponse",
      adminHidden: "Masqué par l’administrateur",
      emptyTitle: "Aucun avis pour le moment",
      emptyDesc: "Après les rendez-vous terminés, les avis de vos clients apparaîtront ici.",
      // ReviewReply
      repliedSuffix: "a répondu",
      edit: "Modifier",
      reply: "Répondre",
      replyPlaceholder: "Rédigez une réponse courtoise au client...",
      cancel: "Annuler",
      sending: "Envoi en cours...",
      saveReply: "Enregistrer la réponse",
      // DeleteReviewButton / ReportReviewButton
      deleteConfirm: "Voulez-vous vraiment supprimer cet avis ? Cette action est irréversible.",
      deleteAria: "Supprimer l’avis",
      delete: "Supprimer",
      reported: "Signalé",
      reportConfirm: "Signaler cet avis à l’administrateur ? L’avis n’est pas supprimé, il est seulement marqué pour examen.",
      reportAria: "Signaler l’avis",
      report: "Signaler",
    },

    // === Page SMS ===
    sms: {
      title: "SMS",
      subtitle: "Messages de confirmation de rendez-vous et d’information en masse",
      creditBalance: "Solde de crédits",
      mockTitle: "Mode test (mock)",
      mockDesc:
        "La clé du fournisseur SMS n’est pas encore configurée. Les envois décomptent les crédits et sont consignés dans l’historique, mais aucun SMS réel n’est transmis. Pour un envoi réel, ajoutez les informations du fournisseur aux variables d’environnement (Netgsm : ",
      mockDescEnd: ").",
      historyTitle: "Historique des envois",
      historyEmpty: "Aucun SMS envoyé pour le moment.",
      colNumber: "Numéro",
      colMessage: "Message",
      colKind: "Type",
      colStatus: "Statut",
      colDate: "Date",
      // KIND_TR
      kindManual: "Manuel",
      kindConfirm: "Confirmation de rendez-vous",
      kindReminder: "Rappel",
      kindBulk: "En masse",
      // StatusBadge
      statusSent: "Envoyé",
      statusMock: "Test",
      statusFailed: "Échec",
      statusQueued: "En file d’attente",
      // SmsSender
      messageTitle: "Message",
      messagePlaceholder: "Ex. Cette semaine, {business} vous offre -15 % rien que pour vous !",
      charsCredits: "{chars} caractères · {credits} crédits/SMS",
      charsLeft: "{n} restants",
      template: "Modèle {n}",
      extraNumbersLabel: "Numéros supplémentaires (séparés par une virgule ou un espace)",
      extraNumbersPlaceholder: "0532..., 0505...",
      invalidNumbers: "{n} numéros invalides, ils ne seront pas envoyés : ",
      recipientCount: "{n} destinataires",
      totalCredits: "Total {n} crédits",
      sending: "Envoi en cours...",
      send: "Envoyer",
      contactsTitle: "Clients ({n})",
      deselect: "Tout désélectionner",
      selectAll: "Tout sélectionner",
      searchPlaceholder: "Rechercher par nom / téléphone",
      contactsEmpty: "Les clients enregistrés avec un téléphone apparaîtront ici au fil du temps.",
      errorEmptyBody: "Saisissez le texte du message.",
      errorNoRecipient: "Sélectionnez au moins un destinataire valide ou saisissez un numéro.",
      errorInsufficient: "Crédits insuffisants. Nécessaires : {needed}, disponibles : {have}.",
      resultSent: "{sent} envoyés",
      resultFailed: ", {failed} en échec",
      fallbackCustomer: "Client",
      // Messages d’erreur de l’action serveur (sendBulkSmsAction)
      errorUnauthorized: "Non autorisé.",
      errorBodyEmpty: "Saisissez le texte du message.",
      errorBodyTooLong: "Message trop long (500 caractères maximum).",
      errorNoValidNumber: "Saisissez au moins un numéro valide.",
      errorInsufficientCredits: "Crédits insuffisants.",
      // Templates
      templateText1: "Chère cliente, cher client, cette semaine -15 % sur toutes nos prestations vous attendent. Contactez-nous pour prendre rendez-vous.",
      templateText2: "Nous vous rappelons votre rendez-vous. Nous serons heureux de vous accueillir dans notre salon.",
      templateText3: "Soyez les premiers informés de nos nouvelles prestations et de nos campagnes !",
    },

    // === Page Messagerie ===
    messaging: {
      title: "Messagerie",
      subtitle: "Envoyez à vos clients des rappels et des informations de rendez-vous — multicanal",
      introBadge: "Notifications multicanal",
      introTitle: "Touchez votre client sur le bon canal",
      introDesc: "Salonor réunit deux canaux : WhatsApp gratuit dès aujourd’hui, et le SMS automatisé une fois votre entreprise enregistrée. Utilisez les deux pour ne plus jamais manquer un rendez-vous.",
      statusActive: "Actif",
      statusLocked: "Se débloque avec votre entreprise",
      statusTest: "Mode test",
      waName: "WhatsApp",
      waTagline: "Gratuit · envoi manuel · disponible maintenant",
      waDesc: "Envoyez en un geste, gratuitement et depuis votre propre téléphone, des rappels de rendez-vous et des messages de reconquête à vos clients perdus. Aucune configuration requise.",
      waPoint1: "Zéro coût — aucun crédit",
      waPoint2: "Taux d’ouverture élevé",
      waPoint3: "Partagez images et liens",
      waNumberLabel: "Numéro WhatsApp du salon",
      waNumberMissing: "Aucun numéro dédié défini — votre numéro de téléphone est utilisé",
      waNumberSet: "Définir / modifier",
      waCtaReminders: "Aller aux rappels",
      waCtaLost: "Reconquérir les clients perdus",
      waPublicNote: "Nous avons également ajouté un bouton sur votre page salon pour que vos clients puissent vous joindre sur WhatsApp.",
      smsName: "SMS",
      smsTagline: "Automatisé · fonctionne sur tous les téléphones",
      smsDesc: "Envoyez par SMS des confirmations de rendez-vous et des informations en masse. Aucune application requise, atteint tous les téléphones.",
      smsPoint1: "Envoi entièrement automatisé",
      smsPoint2: "Aucune application requise — atteint tous les téléphones",
      smsPoint3: "Nom d’expéditeur professionnel",
      smsCreditLabel: "Solde de crédits",
      smsCta: "Aller au panneau SMS",
      smsLockedNote: "L’envoi de SMS nécessite une entreprise enregistrée et une inscription à l’IYS (Système de gestion des messages). Dès que vous aurez configuré votre entreprise et saisi les informations du fournisseur, ce canal se débloquera automatiquement.",
      smsTestNote: "Actuellement en mode test : vous pouvez essayer le parcours, les crédits sont décomptés mais aucun SMS réel n’est transmis.",
      compareTitle: "Quel canal, et quand ?",
      compareCol: "Fonctionnalité",
      rowCost: "Coût",
      rowCostWa: "Gratuit",
      rowCostSms: "Par crédit",
      rowSetup: "Configuration",
      rowSetupWa: "Prêt",
      rowSetupSms: "Entreprise + IYS",
      rowAuto: "Envoi",
      rowAutoWa: "Manuel",
      rowAutoSms: "Automatisé",
      rowReach: "Portée",
      rowReachWa: "Clients ayant WhatsApp",
      rowReachSms: "Tous les téléphones",
      roadmapTitle: "Parcours recommandé",
      recommendedBadge: "Recommandé",
      roadmapNowTitle: "Maintenant : WhatsApp",
      roadmapNowDesc: "Commencez sans aucun coût. Envoyez des rappels via WhatsApp et améliorez immédiatement la satisfaction de vos clients.",
      roadmapNextTitle: "Plus tard : SMS",
      roadmapNextDesc: "Une fois le chiffre d’affaires au rendez-vous et votre entreprise configurée, activez le SMS pour que les rappels deviennent automatiques et que le travail manuel disparaisse.",
    },

    // === Page des tâches à faire ===
    todos: {
      title: "Liste des tâches",
      subtitle: "Tâches et rappels quotidiens de votre établissement",
      statOpen: "Tâches en attente",
      statDone: "Terminées",
      addTitle: "Ajouter une tâche",
      listTitle: "Tâches ({n})",
      emptyTitle: "Aucune tâche pour le moment",
      emptyDesc: "Ajoutez votre première tâche avec le formulaire à gauche.",
      overduePrefix: "En retard · ",
      // Étiquettes de priorité
      priorityHigh: "Haute",
      priorityNormal: "Normale",
      priorityLow: "Basse",
      // TodoForm
      taskLabel: "Tâche",
      taskPlaceholder: "Ex. Appeler le fournisseur",
      priorityLabel: "Priorité",
      dueDateLabel: "Échéance",
      adding: "Ajout en cours...",
      addButton: "Ajouter une tâche",
      // TodoToggle
      undo: "Annuler",
      markDone: "Marquer comme terminée",
      deleteAria: "Supprimer la tâche",
      clearDone: "Effacer les tâches terminées ({n})",
    },

    // === Page des campagnes ===
    campaigns: {
      title: "Campagnes",
      subtitle: "Attirez de nouveaux clients avec des codes de réduction",
      createTitle: "Créer une campagne",
      listTitle: "Campagnes ({n})",
      emptyTitle: "Aucune campagne pour le moment",
      emptyDesc: "Créez votre premier code de réduction avec le formulaire à gauche.",
      expired: "Expirée",
      usedCount: "Utilisé {n} fois",
      endedOn: " · terminée le {date}",
      endsOn: " · se termine le {date}",
      noExpiry: " · sans expiration",
    },

    // === Page Analyse IA ===
    ai: {
      title: "Analyse IA",
      subtitle: "Aperçus et recommandations extraits automatiquement des données de votre établissement",
      smartBadge: "Analyse intelligente",
      collectingTitle: "Collecte des données pour l’analyse",
      collectingDesc:
        "Au fur et à mesure que s’accumulent les rendez-vous et les ventes, la tendance du chiffre d’affaires, l’affluence, la performance du personnel et des recommandations sur mesure apparaîtront ici.",
      metricRevenue: "Chiffre d’affaires sur 30 jours",
      metricRevenueSub: "{pct} % par rapport à la période précédente",
      metricBusiest: "Période de plus forte affluence",
      metricBusiestSub: "vers {time}",
      metricAvgTicket: "Panier moyen",
      metricAvgTicketSub: "par transaction",
      metricAtRisk: "Clients à risque",
      metricAtRiskSub: "absents depuis 30 jours et plus",
      none: "—",
      topServicesTitle: "Prestations les plus rentables",
      notEnoughData: "Données insuffisantes.",
      transactions: "{n} transactions",
      staffPerfTitle: "Performance du personnel (60 jours)",
      staffCompleted: "{n} rendez-vous terminés",
      // Composant AiInsights
      insightsTitle: "Recommandations sur mesure",
      geminiBadge: "Gemini AI",
      refresh: "Actualiser",
      analyzing: "L’intelligence artificielle analyse les données de votre établissement…",
      aiUnavailable:
        "L’IA est temporairement indisponible ({reason}) — des recommandations fondées sur des règles sont affichées.",
      aiNotConfigured:
        "L’analyse par IA n’est pas configurée — des recommandations fondées sur des règles sont affichées.",
      // Messages d’erreur de businessInsightsAction
      errorUnauthorized: "Non autorisé.",
      errorTooFrequent: "Actualisation trop fréquente, réessayez dans un instant.",
      errorNoData: "Données insuffisantes.",
      errorNoSuggestion: "Impossible de générer une recommandation.",
      errorInsightsFailed: "Impossible d’obtenir les recommandations de l’IA.",
      // Textes de recommandations fondées sur des règles (moteur d’aperçus)
      tipRevenueDown: "Le chiffre d’affaires a baissé de {pct} % au cours des 30 derniers jours. ",
      tipRevenueDownAtRisk: "{n} clients ne sont pas revenus depuis longtemps — envoyez-leur une campagne par SMS.",
      tipRevenueDownLoyal: "Envisagez une campagne réservée à vos clients fidèles.",
      tipRevenueUp: "Le chiffre d’affaires est en hausse ({pct} %). Pour maintenir l’élan, concentrez-vous sur les prestations les plus rentables.",
      tipBusiestHour: "L’heure de pointe se situe vers {time}. Planifiez du personnel supplémentaire à ces heures pour réduire l’attente.",
      tipQuietDays: "Étalez la demande sur la semaine grâce à des remises ciblées les jours creux ; rééquilibrez la charge des jours d’affluence.",
      tipAtRisk: "Vous avez {n} clients à risque (absents depuis 30 jours et plus). Reconquérez-les avec les points fidélité + SMS.",
      tipLowStock: "Le stock est critique pour {n} produits : {names}. Il est temps de commander.",
      tipNoShow: "Le taux de rendez-vous non honorés (no-show) est élevé, à {pct} %. Un SMS de confirmation de rendez-vous peut réduire les absences.",
      tipTopService: "« {name} » est votre prestation la plus rentable. Augmentez sa valeur avec un forfait ou une vente additionnelle (upsell).",
      tipNoData: "À mesure que les données s’accumulent, vous verrez ici des recommandations intelligentes propres à votre établissement. Continuez d’enregistrer les rendez-vous et les ventes.",
    },

    // === Page des clients perdus ===
    lost: {
      title: "Clients perdus",
      subtitle: "Clients absents depuis {days} jours et plus — reconquérez-les via WhatsApp",
      fallbackCustomer: "Client du salon",
      emptyTitle: "Parfait — vous n’avez aucun client perdu !",
      emptyDesc: "Tous vos clients sont passés au cours des {days} derniers jours. Continuez comme ça !",
      waMessage:
        "Bonjour {name}, chez {business}, vous nous avez manqué ! 💜 Nous serions ravis de vous accueillir à nouveau — nous avons une offre rien que pour vous, prenez rendez-vous quand vous voulez.",
      lastVisit: "Dernière visite : {date} · ",
      daysAgo: "il y a {n} jours",
      visits: "{n} visites",
      recover: "Reconquérir",
      noPhone: "Pas de téléphone",
    },
  },

  onboarding: {
    metaTitle: "Configuration de l’établissement",

    // En-tête (salutation)
    greeting: "Bonjour, {name} 👋",

    // Libellés de l’indicateur d’étapes
    steps: {
      business: "Établissement",
      category: "Catégorie",
      location: "Emplacement",
      hours: "Horaires",
      services: "Prestations",
    },

    // Étape 1 : Établissement
    step1: {
      title: "Présentons votre établissement",
      subtitle: "Comment vos clients vous verront-ils ?",
      nameLabel: "Nom de l’établissement",
      namePlaceholder: "Ex. Atelier Capillaire Nova",
      phoneLabel: "Téléphone",
      phonePlaceholder: "0212 000 00 00",
      descLabel: "Brève description (facultatif)",
      descPlaceholder: "Décrivez votre salon en quelques phrases...",
    },

    // Étape 2 : Catégorie
    step2: {
      title: "Dans quel domaine exercez-vous ?",
      subtitle: "Choisissez la catégorie qui correspond le mieux à votre établissement.",
    },

    // Étape 3 : Emplacement
    step3: {
      title: "Où êtes-vous situé ?",
      subtitle: "Pour que vos clients vous trouvent sur la carte.",
      cityLabel: "Ville",
      districtLabel: "Arrondissement",
      districtPlaceholder: "Ex. Kadıköy",
      addressLabel: "Adresse complète",
      addressPlaceholder: "Quartier, rue, numéro",
    },

    // Étape 4 : Horaires
    step4: {
      title: "Vos horaires d’ouverture",
      subtitle: "Indiquez les heures et les jours où vous êtes ouvert.",
      openLabel: "Ouverture",
      closeLabel: "Fermeture",
      closedDaysLabel: "Jours de fermeture",
      hoursHint: "Les jours non marqués comme fermés, vous êtes ouvert de {open} à {close}.",
    },

    // Étape 5 : Prestations
    step5: {
      title: "Vos premières prestations",
      subtitle: "Ajoutez quelques prestations — vous pourrez ensuite les modifier autant que vous voulez depuis l’espace de gestion.",
      servicePlaceholder: "Nom de la prestation",
      minUnit: "min",
      priceUnit: "₺",
      removeService: "Retirer",
      addService: "Ajouter une prestation",
    },

    // Navigation
    back: "Retour",
    creating: "Création en cours...",
    publish: "Publier mon établissement",
    continue: "Continuer",

    // Carte (LocationPicker)
    mapHint: "Réglez votre position en cliquant sur la carte ou en faisant glisser le marqueur.",
  },

  admin: {
    // Titre de la page (metadata)
    metaTitle: "Administration",

    // Erreur d’action commune (avertissement en ligne lorsqu’une action serveur échoue)
    actionFailed: "Échec de l’opération. Veuillez réessayer.",

    // Layout (barre supérieure)
    consoleBadge: "Console de la plateforme",
    refresh: "Actualiser",
    refreshAria: "Actualiser",
    backToSite: "Retour au site",
    logout: "Déconnexion",

    // Titre de la vue d’ensemble
    overviewTitle: "Vue d’ensemble",
    overviewSubtitle: "Tous les établissements et utilisateurs sur un seul écran.",

    // Cartes de statistiques
    statBusiness: "Établissements",
    statBusinessSub: "{active} actifs · {suspended} suspendus",
    statUser: "Utilisateurs",
    statAppointment: "Rendez-vous",
    statRevenue: "Chiffre d’affaires total",

    // Étiquettes de rôle
    roleCustomer: "Client",
    roleOwner: "Établissement",
    roleAdmin: "Administrateur",

    // Tableau des établissements
    businessesTitle: "Établissements",
    businessesShowing: "les {shown} plus récents / {total} affichés",
    colBusiness: "Établissement",
    colOwner: "Propriétaire",
    colPlanCredits: "Formule et crédits",
    colAppointment: "Rendez-vous",
    colRevenue: "Chiffre d’affaires",
    colFeatured: "À la une",
    colStatus: "Statut",
    colAction: "Action",
    emptyBusinesses: "Aucun établissement pour le moment. En haut à droite,",
    emptyBusinessesCta: "Créer un nouvel établissement",
    emptyBusinessesEnd: "pour commencer.",
    incompleteProfile: "Profil incomplet",
    incompleteProfileTitle: "Téléphone, adresse ou description manquant",
    view: "Voir",

    // Dernières inscriptions
    recentTitle: "Dernières inscriptions",

    // CreateBusiness (modale)
    createButton: "Créer un nouvel établissement",
    createdTitle: "Établissement créé",
    createTitle: "Créer un nouvel établissement",
    close: "Fermer",
    createdNote: "L’établissement est en ligne dans la vitrine. Son propriétaire peut se connecter avec les informations ci-dessous pour le personnaliser.",
    loginEmail: "E-mail de connexion",
    tempPassword: "Mot de passe temporaire",
    viewStorefront: "Voir la vitrine",
    ok: "OK",
    nameLabel: "Nom de l’établissement",
    namePlaceholder: "Glow Studio",
    ownerNameLabel: "Nom du propriétaire (facultatif)",
    ownerNamePlaceholder: "Prénom et nom",
    emailLabel: "E-mail de connexion",
    emailPlaceholder: "isletme@ornek.com",
    passwordLabel: "Mot de passe temporaire",
    planLabel: "Formule",
    submit: "Créer l’établissement",
    createHint: "L’établissement apparaît automatiquement dans la vitrine (établissements).",

    // PlanControl
    creditAmountAria: "Quantité de crédits",
    addCreditsTitle: "Ajouter {amount} crédits",
    removeCreditsTitle: "Retirer {amount} crédits",
    planUpdateError: "Impossible de mettre à jour la formule. Veuillez réessayer.",
    creditUpdateError: "Impossible de mettre à jour les crédits. Veuillez réessayer.",

    // ActiveToggle
    suspend: "Suspendre",
    activate: "Activer",
    activeUpdateError: "Impossible de mettre à jour le statut. Veuillez réessayer.",

    // FeaturedToggle
    featuredOn: "À la une",
    featuredOff: "Mettre à la une",
    featuredUpdateError: "Mise à jour impossible. Veuillez réessayer.",

    // DeleteBusiness
    deleteConfirm:
      "L’établissement « {name} » et TOUS ses enregistrements (rendez-vous, avis, ventes, compte du propriétaire) seront supprimés définitivement. Cette action est irréversible. Continuer ?",
    deleteError: "Impossible de supprimer l’établissement. Veuillez réessayer.",
    deleteTitle: "Supprimer l’établissement",

    // ContactRequests
    contactTitle: "Demandes d’établissements",
    contactNewBadge: "{n} nouvelles",
    contactEmpty: "Aucune demande de partenariat pour le moment.",
    contactHandled: "Contact établi",
    contactNew: "Nouvelle",
    contactUndo: "Annuler",
    contactMarkHandled: "Contact établi",
    contactDeleteConfirm: "Voulez-vous vraiment supprimer cette demande ?",
    contactDeleteAria: "Supprimer",

    // ReviewModeration
    reviewTitle: "Modération des avis",
    reviewReportedBadge: "{n} signalements en attente",
    reviewEmpty: "Aucun avis pour le moment.",
    reviewShow: "Afficher",
    reviewHide: "Masquer",
    reviewDeleteConfirm: "Supprimer définitivement l’avis ? Cette action est irréversible.",
    reviewDeleteAria: "Supprimer",
    reviewReported: "Signalé",
    reviewHidden: "Masqué",
  },

  consent: {
    message:
      "Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. Les cookies essentiels sont toujours actifs ; vous décidez d’accepter ou non les cookies d’analyse.",
    accept: "Tout accepter",
    reject: "Essentiels uniquement",
    learnMore: "En savoir plus",
  },
};
