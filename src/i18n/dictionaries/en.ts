// İngilizce sözlük. `tr.ts`'in tip imzasına (Dictionary = typeof tr) BİREBİR uyar;
// eksik/fazla anahtar veya yanlış fonksiyon imzası derleme hatası verir.
import type { Dictionary } from "../types";

export const en: Dictionary = {
  common: {
    viewAll: "View all",
    scrollBack: "Scroll back",
    scrollForward: "Scroll forward",
    close: "Close",

    errorTitle: "Something went wrong",
    errorDesc: "An unexpected error occurred. You can try again or go back to the home page.",
    retry: "Try again",
    backHome: "Back to home",

    notFoundTitle: "Page not found",
    notFoundDesc: "The page you're looking for may have moved or never existed.",
    searchSalons: "Search salons",

    carouselEmpty: "More salons will be here soon.",

    comingSoon: "Coming soon",

    mapAttribution: "© OpenStreetMap contributors · © CARTO",

    ogTitle: "Salonor — Beauty and grooming appointments, in seconds",
    ogDescription:
      "Discover hairdressers, barbers, spas and beauty experts near you; pick a time and book your spot instantly.",
  },

  nav: {
    signIn: "Sign in",
    listBusiness: "List your business",
    menu: "Menu",
    account: "My account",
    forCustomers: "For customers",
    signInOrUp: "Sign in or sign up",
    downloadApp: "Download the app",
    helpSupport: "Help & support",
    forBusinesses: "For businesses",
    businessLogin: "Business login",
    businessPanel: "Business dashboard",
    adminPanel: "Admin panel",
    myAppointments: "My appointments",
    myFavorites: "My favorites",
    myProfile: "My profile",
    logout: "Log out",
    language: "Language",
  },

  footer: {
    tagline: "Book your beauty and grooming appointment in seconds. Free, fast, 24/7.",
    exploreTitle: "Explore",
    hairdressers: "Hair salons",
    barbers: "Barbershops",
    spaMassage: "Spa & massage",
    nailStudios: "Nail studios",
    skincare: "Skincare",
    forBusinessesTitle: "For businesses",
    salonorBusiness: "Salonor Business",
    pricing: "Pricing",
    addBusiness: "Add your business",
    businessLogin: "Business login",
    companyTitle: "Salonor",
    about: "About us",
    helpFaq: "Help & FAQ",
    privacy: "Privacy & GDPR",
    terms: "Terms of use",
    contact: "Contact",
    legalTitle: "Legal",
    distanceSales: "Distance sales agreement",
    preInfo: "Pre-information form",
    withdrawal: "Withdrawal & refund",
    cookiePolicy: "Cookie policy",
    rights: "© 2026 Salonor. All rights reserved.",
    designedIn: "Designed in Türkiye 🇹🇷",
  },

  home: {
    heroBadge: "Türkiye’s #1 booking platform",
    heroTitleA: "Your appointment in seconds, ",
    heroTitleHighlight: "in your pocket",
    heroTitleEnd: ".",
    heroSubtitle:
      "Discover hairdressers, barbers, spas and beauty experts near you; pick a time and book your spot instantly — free and 24/7.",
    popular: "Popular:",
    ratingAvg: "average rating",
    verifiedReviews: "verified reviews",
    selectSalons: "select salons",
    categoriesSr: "Categories",
    featuredTitle: "Recommended salons",
    featuredSubtitle: "Top-rated and most preferred",
    newestTitle: "Newly added",
    newestSubtitle: "Businesses that just joined Salonor",

    stats: {
      heading: "The right place for beauty and grooming",
      sub: "One platform, one app — where select salons and experts from all 81 provinces meet.",
      bigGradient: "In seconds",
      bigSub: "booking — free and 24/7",
      selectSalons: "select salons",
      provincesNum: "81 provinces",
      provincesLabel: "across Türkiye",
      verifiedReviews: "verified reviews",
      footnote: "{n}+ bookable services · instant confirmation · secure payment",
    },

    bizPromo: {
      kicker: "Salonor Business",
      heading: "Salonor for your business",
      desc: "Appointments, calendar, staff and client management in one panel for salons and spas. The professional way to make your work easier.",
      feat1: "24/7 online booking — no more waiting by the phone",
      feat2: "Calendar, staff and services on one screen",
      feat3: "Build trust with reviews, keep clients coming back",
      learnMore: "Learn more",
      perfect: "Perfect 5/5",
      satisfaction: "business satisfaction",
      calendar: "Calendar",
      today: "Today",
      date: "Sat, June 14",
      blockHaircut: "Haircut",
      blockBlowDry: "Blow-dry",
      blockBeard: "Beard shave",
      blockSkincare: "Skincare",
      blockManicure: "Manicure",
      blockColor: "Hair color",
      featured: "Featured",
      reviewsCount: "({n} reviews)",
      apptConfirmed: "Appointment confirmed",
      apptDetail: "Today 2:30 PM · Haircut",
    },

    reviews: {
      title: "Reviews",
      subtitle: "Real appointments, real experiences",
    },

    directory: {
      kicker: "All services",
      heading: "Every service you need, on Salonor",
      groups: [
        {
          title: "Salon types",
          items: ["Women’s hair salon", "Men’s barbershop", "Beauty & aesthetics center", "Nail studio", "Spa & massage center", "Makeup studio"],
        },
        {
          title: "Hair services",
          items: ["Haircut", "Blow-dry & styling", "Hair color", "Ombre & balayage", "Keratin & hair care", "Bridal hair"],
        },
        {
          title: "Nail services",
          items: ["Manicure", "Pedicure", "Gel polish", "Acrylic nails", "Gel nails", "Nail art"],
        },
        {
          title: "Makeup, brows & lashes",
          items: ["Day & evening makeup", "Bridal makeup", "Silk lashes", "Lash lift", "Brow lamination", "Brow design"],
        },
        {
          title: "Skincare",
          items: ["Classic facial", "Professional facial", "Pigmentation & acne care", "Hydrafacial", "Brow shaping", "Facial waxing"],
        },
        {
          title: "Spa & massage",
          items: ["Swedish massage", "Aromatherapy", "Deep tissue massage", "Hot stone massage", "Reflexology", "Hammam ritual"],
        },
        {
          title: "Laser hair removal",
          items: ["Full body", "Underarms", "Legs", "Arms", "Back", "Face & areas"],
        },
        {
          title: "Men’s grooming",
          items: ["Men’s haircut", "Beard trim & styling", "Men’s hair color", "Men’s facial", "Men’s waxing", "Hair & beard combo"],
        },
      ],
    },

    appDownload: {
      heading: "Get Salonor on your phone",
      desc: "Manage your appointments, follow your favorite salons and discover new places — all in one tap, always with you.",
      feat1: "Rebook in a single tap",
      feat2: "Appointment reminders and notifications",
      feat3: "Personalized salon recommendations",
      qrText: "Scan with your camera to download",
      bookNow: "Book now",
      nearbyCount: "{n} salons near you",
      exploreMap: "Explore on the map →",
      mockHaircut: "Haircut",
      mockBlowDry: "Blow-dry",
      mockColor: "Hair color",
    },
  },

  search: {
    metaTitle: "Find a salon",

    allSalons: "All salons",
    resultsCount: "{n} results",
    resultsForQuery: "· for “{q}”",

    emptyTitle: "No results found",
    emptyDesc: "Try broadening your search or clearing the filters.",
    clearFilters: "Clear filters",

    typeLabel: "Type",
    allServices: "All services",
    locationLabel: "Location",
    locationPlaceholder: "City & district",
    salonNameLabel: "Salon name",
    salonNamePlaceholder: "Search salons, services…",
    salonNameAria: "Salon or service",
    searchButton: "Search",
    close: "Close",
    serviceTypeTitle: "Service type",

    filterAll: "All",
    sortLabel: "Sort:",
    sortRecommended: "Recommended",
    sortRating: "Highest rated",
    sortReviews: "Most reviewed",

    provinceSearchPlaceholder: "Search a province… (e.g. Istanbul)",
    allTurkey: "All of Türkiye",
    backToProvinces: "Back to provinces",
    allProvince: "All {province}",
    districtSearchPlaceholder: "Search a district in {province}…",
    districtCount: "{n} districts",
    noResults: "No results found",

    viewSalon: "View salon →",
    backToList: "Back to list",
    mapButton: "Map",
  },

  salon: {
    notFoundTitle: "Salon not found",
    metaDescriptionFallback: "View prices, read reviews and book online for {name}.",

    breadcrumbLabel: "Breadcrumb",
    home: "Home",

    reviewsCountInline: "({n} reviews)",
    openNow: "Open now",
    closedNow: "Closed now",

    servicesTitle: "Services",
    select: "Select",
    teamTitle: "Team",
    reviewsTitle: "Reviews",
    guest: "Guest",
    ratingSummary: "{label} · {n} reviews",

    ratingExcellent: "Exceptional",
    ratingVeryGood: "Excellent",
    ratingGood: "Very good",
    ratingAverage: "Good",
    ratingPoor: "Average",
    businessReplied: "{name} replied",
    aboutTitle: "About",
    openingHours: "Opening hours",
    today: "· Today",
    closed: "Closed",

    book: "Book now",
    bookNote: "Instant confirmation · Free cancellation",
    todayHours: "Today: {open} – {close}",
    getDirections: "Get directions",
    whatsappChat: "Message on WhatsApp",
    whatsappGreeting: "Hello, I'd like to get information / ask about an appointment at {name}.",

    openGallery: "Open gallery",
    photoAlt: "{name} photo {n}",
    allPhotos: "All photos ({n})",
    close: "Close",

    inFavorites: "In favorites",
    addToFavorites: "Add to favorites",
    removeFromFavorites: "Remove from favorites",

    addReview: "Add a review",
    thanksTitle: "Thank you!",
    reviewPublished: "Your review is live. Thanks for sharing your experience! 💛",
    yourRating: "Your rating",
    starsLabel: "{n} stars",
    yourName: "Your name",
    yourNamePlaceholder: "Your full name",
    yourReview: "Your review",
    yourReviewPlaceholder: "Share your experience in a few words...",
    cancel: "Cancel",
    submitting: "Submitting...",
    submitReview: "Submit review",
    selectRatingFirst: "Please select a rating first.",

    featured: "Featured",
    reviewWord: "review",

    mapAriaLabel: "Map showing the location of {name}",
  },

  booking: {
    metaTitle: "Book an appointment",

    secureHeader: "Secure booking · Salonor",

    steps: {
      services: "Services",
      staff: "Staff",
      dateTime: "Date & Time",
      confirm: "Confirm",
    },

    success: {
      title: "Your appointment is confirmed!",
      codeLabel: "Your booking code",
      viewAppointments: "View my appointments",
      backHome: "Back to home",
    },

    services: {
      heading: "Choose a service",
    },

    staff: {
      heading: "Choose a staff member",
      anyTitle: "No preference",
      anyDesc: "First available staff member",
      noEligible:
        'No single staff member can provide the service combination you selected. You can continue with "No preference" or change your service selection.',
    },

    dateTime: {
      heading: "Pick a date and time",
      noStaffForCombo: "No single staff member can provide all the services you selected.",
      noStaffForComboHint: "Try booking the services in separate appointments or changing your selection.",
      noSlots: "No times left available on this day.",
      noSlotsHint: "Try choosing another day.",
      noOpenDays: "This salon appears to be closed for the next 14 days.",
      noOpenDaysHint: "Online booking isn't available right now. Please contact the salon directly.",
      slotLoadError: "Couldn't load available times.",
      retry: "Try again",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
    },

    confirm: {
      heading: "Confirm your appointment",
      anyStaff: "Available staff",
      discountLine: "Discount · {pct}%",
      totalLabel: "Total · {duration}",
      couponQuestion: "Have a discount code?",
      couponApplied: "{code} · {pct}% discount applied",
      couponRemove: "Remove",
      couponPlaceholder: "CODE",
      couponApply: "Apply",
      contactHeading: "Your contact details",
      nameLabel: "Full name",
      namePlaceholder: "Your full name",
      phoneLabel: "Phone",
      phoneLabelOptional: "Phone (optional)",
      phonePlaceholder: "05XX XXX XX XX",
      phoneHint: "We'll send an SMS/WhatsApp to confirm and remind you of your appointment.",
      noteLabel: "Note (optional)",
      notePlaceholder: "Anything you'd like to tell the salon?",
      submitBooking: "Confirm appointment — {total}",
      submitting: "Confirming...",
      paymentNote: "Payment is made at the salon. You can cancel for free.",
      consentBefore: "I agree that the personal data I provide to make this appointment is processed under the ",
      consentLink: "KVKK Privacy Notice",
      consentAfter: " and shared with the relevant salon for the appointment.",
    },

    errors: {
      nameRequired: "Please enter your first and last name.",
      phoneRequired: "Enter a valid mobile number so we can send your confirmation by SMS (05XX XXX XX XX).",
      connection: "A connection error occurred. Please try again.",
      consentRequired: "You must accept the privacy notice to continue.",
    },

    summary: {
      noServices: "No services selected yet.",
      continue: "Continue",
      servicesCount: "{count} services · {total}",
    },

    ellipsis: "...",

    couponDropped:
      "Your discount code couldn't be applied because it became invalid during booking. Your appointment was created at the full price.",

    advisor: {
      cardTitle: "AI Style Advisor",
      newBadge: "New",
      cardDesc: "Upload your photo and we'll suggest the style that suits you best",
      modalTitle: "AI Style Advisor",
      intro: "Upload a clear photo of your face/hair. Our AI will assess your face shape and hair type and",
      introStrong: "this salon's services",
      introEnd: "to give you a personalized recommendation.",
      uploadCta: "Upload a photo",
      uploadHint: "JPG / PNG · up to 5MB",
      previewAlt: "Preview",
      changePhoto: "Choose another photo",
      prefsPlaceholder: "Optional: e.g. 'something short and low-maintenance'",
      analyzing: "Analyzing…",
      suggestCta: "Suggest my style",
      evaluation: "Assessment",
      selectAndContinue: "Select this service and continue",
      noMatchedService:
        "We couldn't find an exact matching hair service at this salon — you can pick a suitable service manually below.",
      reanalyze: "Re-analyze",
      disclaimer: "AI suggestions are for guidance only; make the final call together with your expert.",
      consent: "I agree that my photo will be sent to and processed by an AI service (Google, located abroad) to generate style suggestions.",
      consentRequired: "You must tick the checkbox to continue.",
      photoLoadError: "We couldn't load the photo, please try another image.",
      genericError: "Something went wrong, please try again.",
    },
  },

  pricing: {
    metaTitle: "Pricing — Salonor Business",
    metaDescription:
      "Salonor Business plans: Starter, Professional and Enterprise. Booking, checkout, SMS, loyalty points, gift cards, inventory, commission and AI insights — all in one dashboard. Monthly or yearly (2 months free).",

    badge: "Salonor Business",
    title: "Choose the plan that fits your business",
    subtitlePrefix: "Each plan includes ",
    subtitleEmphasis: "everything in the one below",
    subtitleSuffix:
      ", plus new tools to grow your business. Free setup, no long-term commitment.",

    trust: {
      noContract: "No long-term commitment, cancel anytime",
      freeSetup: "Free setup — our team handles it",
      liveSupport: "Live support on WhatsApp",
    },

    footnotePrefix:
      "Prices exclude VAT. Salonor operates in Türkiye only. Your account is set up by our team and your login details are sent to you. For questions, reach us at ",
    footnoteEmail: "isletme@salonor.com",

    billingAriaLabel: "Billing period",
    monthly: "Monthly",
    annual: "Yearly",
    annualBadge: "2 months free",

    mostPopular: "Most popular",
    perMonth: "/ mo",
    annualBilledPrefix: "Billed ",
    annualBilledSuffix: " yearly",
    annualSavingsPrefix: "· save ",
    annualSavingsSuffix: " a year",
    monthlyBilled: "Billed monthly · cancel anytime",

    staffLabel: "Staff / Users",
    smsBonusLabel: "Bonus SMS credits",

    contactCta: "Get in touch",

    planBaslangicName: "Starter",
    planBaslangicTagline: "For new and boutique salons",
    planProfesyonelName: "Professional",
    planProfesyonelTagline: "The favorite of growing salons",
    planKurumsalName: "Enterprise",
    planKurumsalTagline: "For busy, multi-staff businesses",

    feature1: "Unlimited Client Records",
    feature2: "Unlimited Service Listings",
    feature3: "Unlimited Appointment Management",
    feature4: "SMS Appointment Confirmation System",
    feature5: "SMS Sending",
    feature6: "Checkout & Tab System",
    feature7: "Package Sales System",
    feature8: "Debt / Installment Sales Tracking",
    feature9: "Income – Expense Tracking",
    feature10: "Staff Commission System",
    feature11: "Loyalty Points System",
    feature12: "Gift Card System",
    feature13: "Product / Inventory Management",
    feature14: "AI Insights",
    feature15: "Reporting",
  },

  business: {
    meta: {
      title: "Salonor for your business — salon management software",
      description:
        "Online booking, smart calendar, checkout, loyalty points, gift cards, inventory, commission and AI insights — your entire salon in one smart dashboard. Free setup, live in 5 minutes.",
    },

    modules: {
      smartCalendar: "Smart Calendar",
      onlineBooking: "Online Booking",
      checkoutCashbox: "Checkout & Cash Register",
      loyaltyPoints: "Loyalty Points",
      giftCard: "Gift Cards",
      productStock: "Products & Inventory",
      staffCommission: "Staff Commission",
      debtTracking: "Debt Tracking",
      smsReminder: "SMS & Reminders",
      aiAnalysis: "AI Insights",
      reports: "Reports",
      reviewReputation: "Reviews & Reputation",
    },

    steps: {
      step1Title: "Reach out",
      step1Desc: "Fill out the contact form; our team gets back to you the same day.",
      step1Badge: "A few minutes",
      step2Title: "We set up your salon",
      step2Desc: "We'll prepare your team, services and hours for you.",
      step2Badge: "Free for you",
      step3Title: "Go live, fill your calendar",
      step3Desc: "Your salon page is live; let your clients start booking right away.",
      step3Badge: "Same day",
    },

    testimonials: {
      quote1:
        "After switching to Salonor, we stopped chasing appointments by phone. The calendar fills itself and our clients love it.",
      role1: "Hairdresser · Kadıköy",
      quote2:
        "Checkout, cash register, commission and inventory in one dashboard. End-of-month accounting takes minutes — no more wrestling with ledgers.",
      role2: "Barber · Beşiktaş",
      quote3:
        "Thanks to loyalty points and gift cards, clients keep coming back. Our no-show rate has dropped noticeably.",
      role3: "Beauty center · Bornova",
    },

    hero: {
      badge: "Salonor Business",
      titleLine1: "Your entire salon",
      titleHighlight: "in one smart dashboard",
      subtitle:
        "From online booking to checkout, from loyalty points to AI insights — everything that grows your salon in one place. Cut down phone traffic, fill empty chairs, close the books.",
      ctaStart: "Get started now",
      ctaPackages: "See plans",
      proofFreeSetup: "Free setup",
      proofNoContract: "No contract",
      proofLive: "Live in 5 minutes",
      notifNewAppt: "New appointment · Ayşe K.",
      notifApptDetail: "2:30 PM · Hair Color",
      revenueLabel: "Today's revenue",
    },

    stats: {
      selectBusiness: "select businesses",
      bookableService: "bookable services",
      verifiedReview: "verified reviews",
    },

    modulesSection: {
      kicker: "One subscription · unlimited systems",
      heading: "Everything you need to run your salon",
      descBefore: "Forget scattered ledgers, missed calls and separate apps. Every plan includes ",
      descBold: "all",
      descAfter: " of the systems below.",
    },

    calendarShowcase: {
      kicker: "Smart calendar",
      heading: "Your whole day, on one screen",
      descBefore:
        "With a color-coded calendar by staff member, see who's doing what and when at a glance. Thanks to conflict protection, two appointments",
      descBold: " never",
      descAfter: " land in the same chair.",
      feat1Title: "Double-booking protection",
      feat1Desc: "Two clients can't be booked at the same time — the system blocks it.",
      feat2Title: "Add walk-in clients",
      feat2Desc: "Add a walk-in client to the calendar in a single tap.",
      feat3Title: "Status tracking",
      feat3Desc: "Confirmed, completed, no-show — all color-coded and clear.",
    },

    bookingShowcase: {
      kicker: "Online booking",
      heading: "Let your calendar fill while you sleep",
      desc:
        "Let your clients book in seconds, day or night, without waiting on the phone. Confirmations and reminders go out automatically; fewer no-shows, no empty chairs.",
      feat1: "Instant confirmation 24/7",
      feat2: "SMS & WhatsApp reminders",
      feat3: "Verified reviews",
      feat4: "GDPR compliant & secure",
    },

    comparison: {
      heading: "Leave the old way behind",
      sub: "Chaos of ledgers and phone calls, or a system that runs itself?",
      oldTitle: "The old way",
      old1: "Bookings by phone, missed calls",
      old2: "Messy calendar in a ledger, double bookings",
      old3: "Forgotten appointments, empty chairs",
      old4: "Unclear where your revenue goes",
      old5: "Clients come once and never return",
      newTitle: "With Salonor",
      new1: "24/7 online booking, zero missed calls",
      new2: "Color-coded calendar + automatic conflict protection",
      new3: "Automatic reminders, full chairs",
      new4: "Real-time revenue, occupancy and service reports",
      new5: "Returning clients with loyalty points & gift cards",
    },

    testimonialsSection: {
      heading: "What salon owners say",
    },

    stepsSection: {
      heading: "Live in 3 steps",
      sub: "We handle the setup. You just welcome your clients.",
    },

    finalCta: {
      badge: "Setup's on us",
      heading: "Move your salon to Salonor today",
      desc:
        "Free setup, ready in 5 minutes. Let your existing clients start booking online as early as today.",
      ctaStart: "Get started now",
      ctaPackages: "Explore plans",
      proofNoContract: "No contract",
      proofCancel: "Cancel anytime",
      proofSupport: "Support tailored for Türkiye",
    },

    calendarMock: {
      windowTitle: "Salonor · Calendar",
      today: "Today",
      dayTitle: "Saturday, June 14",
      staffActive: "3 staff active",
    },

    walkInErrors: {
      unauthorized: "Unauthorized.",
      staffNotFound: "Staff member not found.",
      selectService: "Select at least one service.",
      servicesNotFound: "The selected services were not found.",
      invalidTime: "Invalid time.",
      staffServiceMismatch: "This staff member doesn't perform all of the selected services.",
      invalidPhone: "Enter a valid mobile phone number (05XX XXX XX XX).",
      pastDayEnd: "The appointment runs past the end of the day (24:00).",
      slotTaken: "The staff member already has another appointment at this time.",
      createFailed: "Couldn't add the appointment. Please try again.",
    },

    phoneMock: {
      salonName: "Studio Lumière",
      salonMeta: "4.9 (210) · Nişantaşı",
      svc1Name: "Haircut",
      svc1Dur: "45 min",
      svc1Price: "₺350",
      svc2Name: "Hair Color",
      svc2Dur: "90 min",
      svc2Price: "₺900",
      svc3Name: "Facial Care",
      svc3Dur: "60 min",
      svc3Price: "₺600",
      bookCta: "Book now",
      confirmTitle: "Your appointment is confirmed",
      confirmDate: "June 14 · 2:30 PM",
      confirmCode: "SLNR-7K2P9",
      waMessage: "Hi Ayşe 👋 Just a reminder of your appointment tomorrow at 2:30 PM 💇‍♀️",
      waLabel: "WhatsApp ✓✓",
    },
  },

  auth: {
    login: {
      metaTitle: "Sign in",
      title: "Welcome back",
      subtitle: "Sign in to manage your appointments.",
      demoTitle: "Demo accounts",
      demoCustomer: "Customer:",
      demoBusiness: "Business:",
      demoPassword: "Password (both):",
    },

    fields: {
      email: "Email",
      password: "Password",
      name: "Full name",
      phoneOptional: "Phone (optional)",
      businessEmail: "Your work email",
    },

    placeholders: {
      email: "example@email.com",
      password: "••••••••",
      name: "Your full name",
      phone: "05xx xxx xx xx",
      passwordMin: "At least 6 characters",
      businessEmail: "salon@email.com",
    },

    loginForm: {
      submit: "Sign in",
      submitPending: "Signing in...",
      noAccount: "Don't have an account?",
      contactUs: "Get in touch with us",
      tooManyAttempts: "You've made too many sign-in attempts. Please try again in a few minutes.",
    },

    registerForm: {
      submit: "Create account",
      submitPending: "Creating account...",
      haveAccount: "Already have an account?",
      signIn: "Sign in",
      consentBefore: "I agree to the processing of my personal data under the ",
      consentLink: "KVKK Privacy Notice",
      consentAfter: ".",
      consentRequired: "You must accept the privacy notice to create an account.",
    },

    businessForm: {
      submit: "Continue — set up your business",
      submitPending: "Creating account...",
      termsNotice: "By continuing, you agree to the Terms of Use.",
    },
  },

  account: {
    greeting: "Hi, {name} 👋",
    layoutSubtitle: "Manage your appointments and account here.",

    tabs: {
      appointments: "My appointments",
      favorites: "My favorites",
      profile: "My profile",
    },

    meta: {
      appointments: "My appointments",
      profile: "My profile",
      favorites: "My favorites",
    },

    appointments: {
      statusConfirmed: "Confirmed",
      statusCompleted: "Completed",
      statusCancelled: "Cancelled",
      statusNoShow: "No-show",
      emptyTitle: "You have no appointments yet",
      emptyDesc: "Discover the best salons around you and book your first appointment in seconds.",
      discoverSalons: "Discover salons",
      upcomingTitle: "Upcoming appointments ({n})",
      noUpcoming: "You have no upcoming appointments.",
      newAppointment: "Book a new appointment →",
      pastTitle: "Past",
      withStaff: "with {name}",
      codeAndTotal: "Code: {code} · {total}",
      rebook: "Book again",
    },

    favorites: {
      emptyTitle: "You have no favorites yet",
      emptyDesc: "Save the salons you love with a tap of the heart; they'll all be waiting here for you.",
      discoverSalons: "Discover salons",
    },

    profile: {
      nameLabel: "Full name",
      emailLabel: "Email",
      emailHint: "Your email address can't be changed.",
      phoneLabel: "Phone",
      phonePlaceholder: "05xx xxx xx xx",
      passwordSectionTitle: "Change password (optional)",
      currentPasswordLabel: "Current password",
      newPasswordLabel: "New password",
      updated: "Your profile has been updated.",
      save: "Save changes",
    },

    cancel: {
      cancel: "Cancel",
      confirm: "Are you sure?",
      cancelling: "Cancelling...",
      yesCancel: "Yes, cancel",
      dismiss: "Keep it",
    },

    review: {
      shareOnGoogle: "Share on Google",
      rate: "Rate",
      thanksTitle: "Thank you!",
      thanksDesc: "Your review is live — you've helped guide other users.",
      alsoGoogleTitle: "Would you share it on Google too?",
      alsoGoogleDesc: "Your review on Google means a lot for {name}.",
      rateOnGoogle: "Rate on Google",
      close: "Close",
      ratingLabel: "Your rating",
      starsAria: "{n} stars",
      experienceLabel: "Your experience",
      commentPlaceholder: "How was the service? Help guide other users...",
      submitting: "Submitting...",
      submitReview: "Submit review",
    },
  },

  legal: {
    brand: "Salonor",
    lastUpdated: "Last updated:",

    about: {
      metaTitle: "About us",
      title: "About us",
      intro:
        "Salonor is a booking platform built for Türkiye that lets you book beauty and personal care appointments in seconds.",
      missionTitle: "Our mission",
      missionBody:
        "We want to make beauty and grooming services — hairdressers, barbers, spas, nails and more — easy, transparent and trustworthy to access for everyone. We're ending the era of chasing appointments by phone, bringing available times, real reviews and clear prices together on one screen.",
      customersTitle: "For customers",
      customersBody:
        "Discover the best salons around you, browse photos and verified reviews, pick a time that works for you and reserve your spot instantly — completely free.",
      businessesTitle: "For businesses",
      businessesBody:
        "With Salonor Business, bring appointments, calendar, staff and service management into one dashboard; take bookings online 24/7, build trust through reviews and reach new clients.",
      valuesTitle: "Our values",
      valuesBody:
        "Transparency, speed and trust. We work to build a fair and useful marketplace where both guests and businesses win.",
    },

    privacy: {
      metaTitle: "Privacy & GDPR",
      title: "Privacy and Data Protection Notice",
      updated: "June 13, 2026",
      intro:
        "The security of your personal data matters to us. This notice summarizes how your data is processed when you use Salonor.",
      controllerTitle: "Data controller",
      controllerBody:
        "Under Türkiye's Personal Data Protection Law No. 6698 (KVKK), the data controller is Ferhat Gökel, who operates the Salonor platform as an individual / sole proprietorship. Salonor is not currently a joint-stock company. You can send your questions and KVKK requests to destek@salonor.com.",
      dataTitle: "Data we process",
      dataBody:
        "Your account details (name, email, phone), booking history, favorite salons and the reviews you write; plus basic usage data to maintain service quality. In the business app, we may request access to your device contacts so you can quickly create an appointment on a customer's behalf; in that case only the name and phone of the contact you select are used — your full contact list stays on your device and is never sent to our servers.",
      purposesTitle: "Processing purposes",
      purposesBody:
        "We process your data to create and manage your appointments, send you appointment reminders (SMS/WhatsApp/email), keep your account secure and improve the platform.",
      sharingTitle: "Sharing",
      sharingBody:
        "The information needed to carry out your appointment is shared with the business you book with. Your data is never sold to third parties for marketing.",
      aiTitle: "AI-based data processing",
      aiBody:
        "When you use the AI Style Advisor, the photo you upload and any notes you add are transferred to and processed by our AI service provider Google (servers located abroad) to generate style suggestions. This feature is entirely optional and works only with your explicit consent; if you do not consent, your photo is not sent anywhere. Photos are not stored by Salonor after the suggestion is generated.",
      rightsTitle: "Your rights",
      rightsBody:
        "Under Article 11 of the KVKK, you have the right to access, correct and erase your data and to object to its processing. For requests, email destek@salonor.com.",
    },

    terms: {
      metaTitle: "Terms of Use",
      title: "Terms of Use",
      updated: "June 13, 2026",
      intro: "By using Salonor, you agree to the terms below.",
      serviceTitle: "Service",
      serviceBody:
        "Salonor is a booking platform that connects guests with beauty and grooming businesses. Services are provided by the businesses; Salonor acts as an intermediary.",
      accountTitle: "Account",
      accountBody:
        "You are responsible for the security of your account and the accuracy of the information you provide. Those under 18 must use the platform with parental consent.",
      bookingsTitle: "Appointments and cancellation",
      bookingsBody:
        "You're expected to arrive on time for the appointments you book. Cancellation and change rules may vary from business to business; the terms shown on the booking page apply.",
      reviewsTitle: "Reviews",
      reviewsBody:
        "You should share honest, respectful reviews only for services you've actually experienced. Insults, spam and misleading content will be removed.",
      liabilityTitle: "Liability",
      liabilityBody:
        "The relevant business is responsible for the quality of the service. Salonor strives to keep the platform running smoothly, but technical disruptions may occur.",
    },

    faq: {
      metaTitle: "Help & Frequently Asked Questions",
      title: "Help & Frequently Asked Questions",
      intro:
        "You'll find the answers to most of your questions here. If you can't, destek@salonor.com is always open.",
      q1: "Is using Salonor free?",
      a1: "Yes. Booking is completely free for guests; you only pay for the service you receive at the salon.",
      q2: "How do I cancel my appointment?",
      a2: "Go to My account → My appointments to view and cancel your appointment. Cancellation terms may vary by business.",
      q3: "Will I get an appointment reminder?",
      a3: "Yes. As your appointment approaches, a reminder is sent through the channel you chose (SMS, WhatsApp or email).",
      q4: "Are the reviews real?",
      a4: "Reviews are written only by guests who have completed their appointment, so the ratings you see are based on real experiences.",
      q5: "How do I add my business?",
      a5: "Sign up for free from the Salonor for your business page; you can go live with a 5-minute setup.",
    },

    contact: {
      metaTitle: "Contact",
      title: "Contact",
      intro:
        "Want to add your business to Salonor? Fill out the form below and our team will get in touch with you.",
      addBusinessTitle: "Add your business to Salonor",
      addBusinessBody:
        "Salon, hairdresser, barber, spa or beauty center — it doesn't matter. Leave your details, we'll set up your business for free and you can start taking online bookings right away.",
      cardSupportTitle: "Customer support",
      cardPartnerTitle: "Business partnership",
      cardPressTitle: "Press & other",
      hoursTitle: "Working hours",
      hoursBody:
        "Our support team responds to written requests on weekdays between 9:00 AM and 6:00 PM. We usually get back to you the same day.",
      businessTitle: "Are you a business?",
      businessBodyBefore: "To get to know Salonor Business and add your business, write to ",
      businessBodyAfter:
        " or get started right away from the sign-up page.",
    },

    contactForm: {
      successTitle: "We've received your request 🎉",
      successBody:
        "Our team will reach out to you as soon as possible to add your business to Salonor.",
      nameLabel: "Full name",
      namePlaceholder: "Your full name",
      emailLabel: "Email",
      emailPlaceholder: "example@email.com",
      phoneLabel: "Phone",
      phonePlaceholder: "05xx xxx xx xx",
      messageLabel: "About your business (optional)",
      messagePlaceholder: "Briefly tell us your salon's name, city and services...",
      pendingText: "Submitting...",
      submit: "Send request",
      disclaimer: "Your details are used only to get in touch with you.",
      consentBefore: "I agree to the processing of my personal data under the ",
      consentLink: "KVKK Privacy Notice",
      consentAfter: " and to being contacted.",
      consentRequired: "You must accept the privacy notice to continue.",
    },

    distanceSales: {
      metaTitle: "Distance Sales Agreement",
      title: "Distance Sales Agreement",
      updated: "June 23, 2026",
      intro:
        "This agreement governs the rights and obligations of the parties regarding the online sale of Salonor Business paid packages, in accordance with Türkiye's Consumer Protection Law No. 6502 and the Regulation on Distance Contracts.",
      partiesTitle: "1. Parties",
      partiesBody:
        "SELLER: Ferhat Gökel, who operates the Salonor platform as an individual / sole proprietorship. See the Pre-Information Form and Contact page for contact and address details. BUYER: the business/user purchasing a Salonor Business package.",
      subjectTitle: "2. Subject of the agreement",
      subjectBody:
        "The subject of the agreement is the sale and delivery of the Salonor Business software subscription (Starter, Professional or Enterprise package) ordered electronically by the Buyer, whose features and sale price are stated on the Pricing page.",
      productTitle: "3. Service and price",
      productBody:
        "The service is a subscription software covering appointments, calendar, point of sale, SMS, reporting and other panel features depending on the selected package. Package prices, the billing period (monthly/annual) and any taxes are shown up to date on the Pricing page. Prices are exclusive of VAT.",
      paymentTitle: "4. Payment",
      paymentBody:
        "Payment is collected according to the selected package and billing period. Payment is required for the subscription to start; your account is set up by our team and your login details are sent to you.",
      deliveryTitle: "5. Delivery / performance",
      deliveryBody:
        "The service is digital; once payment is approved your account is set up and panel access is enabled. Exceptions to the right of withdrawal for digital services performed immediately are explained in the Right of Withdrawal and Refund Policy.",
      withdrawalTitle: "6. Right of withdrawal",
      withdrawalBody:
        "The Buyer has the 14-day right of withdrawal provided by law. See the Right of Withdrawal and Refund Policy page for the exercise, exceptions and refund process.",
      disputeTitle: "7. Dispute resolution",
      disputeBody:
        "For disputes arising from this agreement, Consumer Arbitration Committees and Consumer Courts have jurisdiction within the relevant monetary limits. For complaints and requests, contact destek@salonor.com.",
    },

    preInfo: {
      metaTitle: "Pre-Information Form",
      title: "Pre-Information Form",
      updated: "June 23, 2026",
      intro:
        "This form contains the matters you must be informed about before purchasing Salonor Business paid packages, in accordance with Law No. 6502 and the Regulation on Distance Contracts.",
      sellerTitle: "Seller information",
      sellerBody:
        "The seller is Ferhat Gökel, who operates the Salonor platform as an individual / sole proprietorship (not a joint-stock company). The current values in the company-info record apply for the full address and tax/contact details; for questions, contact destek@salonor.com and isletme@salonor.com.",
      productTitle: "Essential characteristics of the service",
      productBody:
        "The service is the Salonor Business subscription software for appointment and business management. The features included in the packages (Starter, Professional, Enterprise) are listed in detail on the Pricing page.",
      priceTitle: "Price and payment",
      priceBody:
        "The total price (taxes included/excluded), the billing period and the payment method are shown on the order screen and the Pricing page. Prices are exclusive of VAT. The subscription renews according to the selected period.",
      deliveryTitle: "Performance and term",
      deliveryBody:
        "The service is digital and access is enabled after payment confirmation by setting up your account. The subscription term is determined by the monthly or annual period you choose.",
      withdrawalTitle: "Right of withdrawal",
      withdrawalBody:
        "Your 14-day right of withdrawal and its exceptions for digital services are explained on the Right of Withdrawal and Refund Policy page. You can send your withdrawal notice to destek@salonor.com.",
      complaintTitle: "Complaints and applications",
      complaintBody:
        "You can send your requests and complaints to destek@salonor.com; for unresolved disputes you may apply to the Consumer Arbitration Committee or Consumer Court according to the legal monetary limits.",
    },

    withdrawal: {
      metaTitle: "Right of Withdrawal and Refund Policy",
      title: "Right of Withdrawal and Refund Policy",
      updated: "June 23, 2026",
      intro:
        "Your right of withdrawal and the refund conditions for Salonor Business paid packages are explained below.",
      rightTitle: "Withdrawal period",
      rightBody:
        "In distance contracts, you have the right to withdraw from the contract within 14 days from the purchase date without giving any reason and without paying a penalty.",
      howTitle: "Exercising the right of withdrawal",
      howBody:
        "To exercise your right of withdrawal, it is sufficient to send a clear notice to destek@salonor.com within 14 days. State your account/business details and your withdrawal request in your notice.",
      exceptionTitle: "Exception to the right of withdrawal (digital service)",
      exceptionBody:
        "Under the legislation, the right of withdrawal may not be exercised for digital content/services whose performance has begun with the consumer's consent before the withdrawal period expires and that are performed immediately. Therefore, where your account has been set up and panel access enabled (performance has begun), the right of withdrawal may be limited; this is presented for your separate approval during purchase.",
      refundTitle: "Refund process",
      refundBody:
        "For a valid withdrawal request, the amount you paid is refunded within 14 days from the date your withdrawal notice reaches us, using the payment method you used and without any additional charge.",
      contactTitle: "Contact",
      contactBody:
        "You can write to destek@salonor.com for your withdrawal and refund requests.",
    },

    cookies: {
      metaTitle: "Cookie Policy",
      title: "Cookie Policy",
      updated: "June 23, 2026",
      intro:
        "This policy explains which cookies and similar technologies we use when you use Salonor and how you can manage your preferences.",
      whatTitle: "What is a cookie?",
      whatBody:
        "Cookies are small text files stored on your device by the sites you visit. They are used to remember your preferences and improve the site.",
      typesTitle: "Cookies we use",
      typesBody:
        "Essential cookies: required for core functions such as session and language preference (e.g. the salonor_locale cookie storing your language preference and the salonor_cookie_consent cookie storing your cookie consent). These cookies are always active. Analytics cookies: Vercel Analytics is used to measure traffic and improve the experience, and these load only if you accept cookie consent.",
      analyticsTitle: "Analytics and third parties",
      analyticsBody:
        "We use the Vercel Analytics service to understand site traffic. Analytics cookies do not run unless you click 'Accept' on the cookie banner at the bottom of the site; you can decline with the 'Essential only' option.",
      manageTitle: "Managing your preferences",
      manageBody:
        "You can set your cookie preference from the cookie banner at the bottom of the site; you can also delete or block cookies from your browser settings. Blocking essential cookies may affect some functions of the site.",
      contactTitle: "Contact",
      contactBody:
        "You can send your questions about cookies to destek@salonor.com.",
    },
  },

  panelCore: {
    // Sidebar — section headings
    navDailyTitle: "Daily",
    navSalesTitle: "Sales & Finance",
    navCatalogTitle: "Catalog",
    navMarketingTitle: "Marketing",
    navCustomerTitle: "Customers",
    navToolsTitle: "Tools & Settings",

    // Sidebar — menu labels
    navOverview: "Overview",
    navCalendar: "Calendar",
    navNotifications: "Notifications",
    navCashbox: "Checkout & Tabs",
    navDebts: "Debts & Installments",
    navReports: "Reports",
    navExpenses: "Expenses",
    navServices: "Services",
    navStaff: "Staff",
    navCommission: "Commission & Performance",
    navPackages: "Packages",
    navProducts: "Products & Inventory",
    navCampaigns: "Campaigns",
    navGiftCard: "Gift Cards",
    navLoyalty: "Loyalty Points",
    navSms: "SMS",
    navMessaging: "Messaging",
    navCustomers: "Clients",
    navLostCustomers: "Lost Clients",
    navReviews: "Reviews",
    navAiAnalysis: "AI Insights",
    navTodos: "To-dos",
    navSettings: "Settings",

    // Sidebar — sub-actions / labels
    businessLabel: "Business",
    viewMyPage: "View my page",
    logout: "Log out",
    loggingOut: "Logging out...",
    menu: "Menu",
    close: "Close",

    // Dashboard (Overview)
    dashboardTitle: "Overview",
    goToCalendar: "Go to calendar",
    statTodayAppts: "Today's appointments",
    statTodayRevenue: "Today's revenue",
    statWeekRevenue: "7-day revenue",
    statRating: "Rating",
    todaySchedule: "Today's schedule",
    calendar: "Calendar",
    noApptsToday: "No appointments for today",
    noApptsTodayDesc: "You can add appointments manually from the calendar.",
    noShowTag: "No-show",
    last7Days: "Last 7 days",
    summary: "Summary",
    nextAppt: "Next appointment",
    upcomingAppts: "Upcoming appointments",
    totalReviews: "Total reviews",
    activeStaff: "Active staff",

    // Calendar (CalendarBoard)
    calendarTitle: "Calendar",
    newAppt: "Appointment",
    prevDay: "Previous day",
    nextDay: "Next day",
    today: "Today",
    noStaffTitle: "No staff yet",
    noStaffDesc: "To use the calendar, you first need to add your team.",
    addStaff: "Add staff",
    closedNotice: "This day appears to be closed in your working hours — you can still add an appointment.",

    // Calendar — legend
    legendConfirmed: "Confirmed",
    legendCompleted: "Completed",
    legendNoShow: "No-show",

    // New appointment modal
    newApptTitle: "New appointment",
    staffField: "Staff",
    startField: "Start",
    customerNameField: "Client name",
    customerNamePlaceholder: "e.g. Ayşe K. (can be left blank)",
    phoneField: "Phone (for reminders)",
    phonePlaceholder: "05XX XXX XX XX (optional)",
    pickFromContacts: "Pick from contacts",
    pickedNoMobile: "The selected contact has no valid mobile number.",
    servicesField: "Services",
    selectAtLeastOneService: "Select at least one service.",
    overflowsDay: "This appointment runs past the end of the day ({end}).",
    cancel: "Cancel",
    adding: "Adding...",
    addAppt: "Add appointment",

    // Appointment detail modal
    statusConfirmed: "Confirmed",
    statusCompleted: "Completed",
    statusNoShow: "No-show",
    statusCancelled: "Cancelled",
    withStaff: "with {staff}",
    noteLabel: "Note:",
    markCompleted: "Mark as completed",
    markNoShow: "No-show",
    cancelAppt: "Cancel",
    apptStatusInfo: "This appointment is marked as {status}.",

    // Notifications page
    notificationsMetaTitle: "Notifications",
    notificationsTitle: "Notifications",
    notificationsSubtitle:
      "Approve new booking requests and send reminders for upcoming appointments",
    reminderInfoReady: "prefilled",
    reminderInfoMarked: "“Reminded”",
    reminderInfoBefore: "When you tap the button, the message opens ",
    reminderInfoMiddle:
      " in your WhatsApp/SMS app, ready to send; you just hit send. Whatever you send is automatically marked as ",
    reminderInfoAfter:
      ", so you never message the same person twice. No extra fees or setup.",
    noUpcomingTitle: "No upcoming appointments",
    noUpcomingDesc: "There are no confirmed appointments for the next 3 days.",
    reminderMessageBody:
      "Hi {name}, a reminder from {business}: your appointment is on {date} at {time}. We look forward to seeing you! 😊",

    // New booking requests (NewBookings)
    newBookingRequests: "New booking request",
    approveAll: "Approve all",
    approve: "Approve",
    approveFailed: "Couldn't approve. Please try again.",

    // Reminder list (ReminderList)
    reminderSaveFailed: "Couldn't save the mark, please try again.",
    remindNow: "Reminder due now",
    pendingCount: "{n} pending",
    upcomingSection: "Upcoming (next 3 days)",
    noPhone: "No phone",
    reminded: "Reminded",
    undo: "Undo",
    whatsapp: "WhatsApp",
    call: "Call",
    sms: "SMS",

    // Shared fallback labels (static text shown when DB data is empty)
    fallbackCustomer: "Client",
    fallbackAppt: "Appointment",
  },

  panelCatalog: {
    // ── Services page / ServicesManager ──
    services: {
      title: "Services",
      subtitle: "{count} services · {sections} sections",
      addSection: "Section",
      addService: "Add service",
      addServiceShort: "Service",
      emptyTitle: "No sections yet",
      emptyDesc: 'To group your services, first create a section (e.g. "Cuts", "Color").',
      addFirstSection: "Add your first section",
      deleteSectionAria: "Delete section",
      emptySection: "There are no services in this section yet.",
      editAria: "Edit",
      deleteAria: "Delete",
      confirmDeleteSection: 'The "{name}" section will be deleted. Are you sure?',
      confirmDeleteService: 'The "{name}" service will be deleted. Are you sure?',

      // Add/edit service modal
      modalEditTitle: "Edit service",
      modalNewTitle: "New service",
      sectionLabel: "Section",
      nameLabel: "Service name",
      namePlaceholder: "e.g. Women's Haircut",
      descLabel: "Description (optional)",
      descPlaceholder: "e.g. Includes hair analysis + wash + cut + blow-dry",
      durationLabel: "Duration (min)",
      priceLabel: "Price (₺)",
      cancel: "Cancel",
      save: "Save",
      add: "Add",

      // Add section modal
      categoryModalTitle: "New section",
      categoryNameLabel: "Section name",
      categoryNamePlaceholder: "e.g. Cut & Styling",
    },

    // ── Staff page / StaffManager ──
    staff: {
      title: "Staff",
      subtitle: "{count} active staff",
      addStaff: "Add staff",
      emptyTitle: "No staff yet",
      emptyDesc: "Add your team so appointments can be assigned to them.",
      addFirstStaff: "Add your first staff member",
      inactiveBadge: "Inactive",
      summary: "{services} services · {appointments} appointments",
      edit: "Edit",
      deactivate: "Deactivate",
      activate: "Activate",
      deleteAria: "Delete",
      confirmDeactivate:
        "{name} can't be deleted because they have past appointments. They'll be deactivated instead. Continue?",
      confirmDelete:
        "{name} will be permanently deleted (including commission and service assignments). This can't be undone. Are you sure?",

      // Add/edit staff modal
      modalEditTitle: "Edit staff member",
      modalNewTitle: "New staff member",
      nameLabel: "Full name",
      namePlaceholder: "e.g. Elif Aydın",
      titleLabel: "Title",
      titlePlaceholder: "e.g. Color Specialist",
      cancel: "Cancel",
      save: "Save",
      add: "Add",
      saving: "Saving...",

      // Service assignment (services this staff member can perform)
      manageServices: "Services",
      servicesModalTitle: "{name} — services",
      saveServices: "Save services",
      noServices: "Add a service first, then you can assign it to staff.",

      // Plan staff limit
      staffLimitReached:
        "Your {plan} plan allows up to {limit} active staff. Upgrade your plan to add more.",
    },

    // ── Settings page ──
    settings: {
      title: "Settings",
      subtitle: "Manage your business profile and working hours",
      publicPage: "My live page",
      businessInfo: "Business information",
      workingHours: "Working hours",
      coverTitle: "Cover photo",
      coverDesc: "Choose the header image for your salon page. (Ready-made image set for the demo)",
    },

    // ── Business profile form ──
    profile: {
      nameLabel: "Business name",
      descLabel: "Description",
      promoLabel: "📣 Featured campaign / announcement",
      promoPlaceholder: "e.g. 20% off hair coloring this week!",
      promoUntilLabel: "End date (optional):",
      promoHint:
        "If you fill this in, it shows as an eye-catching banner at the top of your salon page. Leave it blank to hide it. It's hidden automatically once the end date passes.",
      phoneLabel: "Phone",
      phonePlaceholder: "0212 000 00 00",
      whatsappLabel: "WhatsApp number",
      whatsappPlaceholder: "05XX XXX XX XX (uses phone if empty)",
      whatsappHint: "The \"Message on WhatsApp\" button on your salon page opens this number. If left empty, your phone number is used.",
      cityLabel: "City",
      addressLabel: "Address",
      districtLabel: "District",
      mapLabel: "Map location",
      mapHint: "This is how clients find you on the map. Drag the marker or click on the map.",
      placeIdLabel: "Google Place ID",
      placeIdPlaceholder: "e.g. ChIJN1t_tDeuEmsRUsoyG83frY4",
      placeIdHintBefore: "If you enter it, clients can also share their reviews ",
      placeIdHintGoogle: "on Google",
      placeIdHintMid: " too. You can find your Place ID ",
      placeIdHintLink: "here",
      placeIdHintAfter: " by searching for your business name. Pasting the full link works too.",
      saveSuccess: "Your business information has been updated.",
      saveButton: "Save changes",
    },

    // ── Working hours editor ──
    hours: {
      closed: "Closed",
      open: "Open",
      saving: "Saving...",
      saveButton: "Save hours",
      saved: "Saved",
      invalidError: "Invalid working hours: opening time must be before closing time.",
    },

    // ── Cover photo picker ──
    cover: {
      optionAlt: "Cover option",
    },

    // ── Catalog forms (package / campaign / product / commission / stock) ──
    catalog: {
      adding: "Adding...",
      saving: "Saving...",
      deleteAria: "Delete",
      editAria: "Edit",
      cancel: "Cancel",
      saveChanges: "Save changes",
      editProduct: "Edit product",
      editPackage: "Edit package",
      editCampaign: "Edit campaign",
      active: "Active",
      inactive: "Inactive",
      decreaseAria: "Decrease",
      increaseAria: "Increase",
      saveCommission: "Save",
      commissionLabel: "Commission rate (%)",

      // Package form
      packageNameLabel: "Package name",
      packageNamePlaceholder: "e.g. 5-Session Skincare",
      priceLabel: "Price (₺)",
      sessionsLabel: "Sessions",
      daysLabel: "Days",
      descLabel: "Description (optional)",
      addPackage: "Add package",

      // Campaign form
      codeLabel: "Discount code",
      codePlaceholder: "SUMMER25",
      discountLabel: "Discount (%)",
      expiresLabel: "End date (optional)",
      createCampaign: "Create campaign",
      expiryInPast: "The end date can't be earlier than today.",

      // Product form
      productNameLabel: "Product name",
      productNamePlaceholder: "e.g. Shampoo 500ml",
      stockLabel: "Stock",
      lowStockLabel: "Low threshold",
      addProduct: "Add product",
    },
  },

  panelFinance: {
    // ── Shared ──
    noDataYet: "No data yet.",

    // ── Checkout & Tabs (kasa/page + kasa-pos) ──
    kasa: {
      metaTitle: "Checkout & Tabs",
      title: "Checkout & Tabs",
      subtitle: "Ring up quick sales and track your daily register",
      todayCash: "Today's cash",
      todayTxns: "Today's transactions",
      todaySales: "Today's sales",
      noSalesToday: "No sales yet today.",
      defaultCustomer: "Client",

      // POS — catalog
      services: "Services",
      products: "Products",
      noProductsHint: "No products yet — you can add them from Products & Inventory.",
      outOfStock: "out of stock",
      stockCount: "stock {n}",
      stockExactNone: '"{name}" is out of stock.',
      stockLimit: '"{name}" has {n} in stock — you can\'t add more.',

      // POS — manual line
      manualLine: "Manual item",
      descriptionPlaceholder: "Description",
      priceTlSymbol: "₺",
      manualHint: "Enter the amount in whole liras; you can edit it again in the cart.",
      unitPriceAria: "Unit price",
      perUnit: "₺ / unit",

      // POS — cart/tab
      receipt: "Tab",
      saleSaved: "Sale saved ✓ You can add a new tab.",
      emptyCart: "Add a product/service from the left.",
      decrease: "Decrease",
      increase: "Increase",
      remove: "Remove",
      customerNamePlaceholder: "Client name (optional)",
      customerPhonePlaceholder: "Phone — to earn points (optional)",
      earnPointsNote: "This sale earns {n} points (every ₺100 = 5 points).",
      total: "Total",
      saving: "Saving...",
      charge: "Charge",
    },

    // ── Expenses (giderler/page + expenses) ──
    expenses: {
      metaTitle: "Expenses",
      title: "Expenses",
      subtitle: "Monthly expense tracking and net profit",
      revenueOfMonth: "{month} revenue",
      cashSales: "Register sales",
      monthExpense: "This month's expenses",
      netProfit: "Net profit",
      addExpense: "Add expense",
      expensesOfMonth: "{month} expenses",
      emptyTitle: "No expenses this month",
      emptyDesc: "Add your first expense with the form on the left.",

      // Form
      description: "Description",
      descriptionPlaceholder: "e.g. Monthly rent",
      category: "Category",
      amountWithSymbol: "Amount (₺)",
      date: "Date",
      note: "Note (optional)",
      notePlaceholder: "Details...",
      adding: "Adding...",
      submit: "Add expense",
      deleteConfirm: "Delete this expense record? This can't be undone.",
      deleteAria: "Delete expense",
    },

    // ── Debts & Installments (borclar/page + debt-manager) ──
    debt: {
      metaTitle: "Debts & Installments — Salonor",
      title: "Debt & Installment Sales",
      subtitle: "Track open accounts and collect installments",
      openAccounts: "Open accounts",
      totalReceivable: "Total receivable",
      collected: "Collected",

      // Form
      newDebt: "New debt / installment",
      customerName: "Client name",
      phoneOptional: "Phone (optional)",
      amountWithSymbol: "Amount (₺)",
      installment: "Installment",
      noteOptional: "Note (optional)",
      errEnterCustomer: "Enter a client name.",
      errEnterValidAmount: "Enter a valid amount.",
      saving: "Saving...",
      addDebtRecord: "Add debt record",

      // List / row
      emptyTitle: "No open accounts",
      emptyDesc: "Track debt/installment sales by adding them from the left.",
      closedAccounts: "Closed accounts",
      installmentCount: "{n} installments",
      closed: "Closed",
      remaining: "remaining",
      paidOf: "{paid} / {total} paid",
      errEnterAmount: "Enter an amount.",
      collectMax: "Collect (up to {n})",
      collect: "Collect",
      deleteConfirm: "Delete this debt record?",
      paymentHistory: "Payment history",
      noPaymentsYet: "No payments yet.",
    },

    // ── Loyalty Points (para-puan/page + loyalty-manager) ──
    loyalty: {
      metaTitle: "Loyalty Points — Salonor",
      title: "Loyalty Points",
      subtitle: "Client loyalty points — earn, collect, spend",
      totalMembers: "Total members",
      circulatingPoints: "Points in circulation",
      pointValue: "Point value",
      pointValueHint: "1 point = ₺1",

      // Add points
      addPoints: "Add points",
      customerName: "Client name",
      phonePlaceholder: "05xx xxx xx xx",
      pointsAmount: "Number of points",
      errEnterCustomer: "Enter a client name.",
      errEnterValidPoints: "Enter a valid number of points.",
      adding: "Adding...",
      hint: "Tip: If you enter the client's phone while collecting payment on the Checkout & Tabs screen, the sale earns points automatically (every ₺100 = 5 points).",

      // Member list
      searchPlaceholder: "Search by name or phone",
      emptyNoMembers: "No clients with points yet",
      emptyNoMatch: "No matching clients",
      emptyDesc: "Get started by adding your first points from the left.",
      points: "points",
      spend: "Spend",
      errEnterQuantity: "Enter an amount.",
      redeemMax: "Up to {n}",
      use: "Use",
    },

    // ── Gift Cards (hediye-ceki/page + giftcard-manager) ──
    giftcard: {
      metaTitle: "Gift Cards — Salonor",
      title: "Gift Cards",
      subtitle: "Create gift cards, hand out codes, redeem them at checkout",
      activeCards: "Active cards",
      unusedBalance: "Unused balance",
      totalIssued: "Total issued",

      // Form
      newGiftcard: "New gift card",
      amountWithSymbol: "Amount (₺)",
      amountPlaceholder: "e.g. 500",
      buyerPlaceholder: "Buyer (optional)",
      recipientPlaceholder: "Recipient (optional)",
      expiryOptional: "Expiry (optional)",
      errEnterValidAmount: "Enter a valid amount.",
      creating: "Creating...",
      createCard: "Create card",

      // List / card
      emptyTitle: "No gift cards yet",
      emptyDesc: "Create your first card from the left and give the code to your client.",
      copyCode: "Copy code",
      depleted: "Depleted",
      active: "Active",
      passive: "Inactive",
      balanceOf: "/ {total} balance",
      buyerLabel: "Buyer: {name}. ",
      recipientLabel: "Gift: {name}. ",
      expiryLabel: "Expires: {date}",
      errEnterQuantity: "Enter an amount.",
      redeemMax: "Up to {n}",
      use: "Use",
      deactivate: "Deactivate",
      activate: "Activate",
      deduct: "Deduct",
    },

    // ── Commission & Performance (prim/page) ──
    commission: {
      metaTitle: "Commission & Performance",
      title: "Commission & Performance",
      subtitle: "Last 30 days — staff revenue and commission calculation",
      revenue30d: "30-day revenue",
      commissionDue: "Commission due",
      emptyTitle: "No active staff",
      emptyDesc: "First add your team from the Staff section.",
      colStaff: "Staff",
      colAppointment: "Appointments",
      colRevenue30d: "Revenue (30d)",
      colCommissionPct: "Commission %",
      colCommissionAmount: "Commission amount",
      footnote:
        'Enter the commission rate and tap "Save" — the amount is calculated automatically from the staff member\'s revenue over the last 30 days.',
    },

    // ── Reports (raporlar/page) ──
    reports: {
      metaTitle: "Reports",
      title: "Reports",
      subtitle: "Performance over the last 30 days",
      revenue30d: "30-day revenue",
      cashSales: "Register sales",
      appointment: "Appointments",
      avgTicket: "Average ticket",
      completed: "Completed",
      dailyRevenueTitle: "Daily revenue · last 14 days",
      topServicesTitle: "Top-earning services",
      timesUsed: "{n} times",
      staffPerformanceTitle: "Staff performance",
      appointmentCount: "{n} appointments",
      busyDaysTitle: "Busiest days of the week",
      appointmentStatusTitle: "Appointment statuses",
      statusCompleted: "Completed",
      statusConfirmedPending: "Confirmed (pending)",
      statusCancelled: "Cancelled",
      statusNoShow: "No-show",
    },

    // ── Products & Inventory (urunler/page) ──
    products: {
      metaTitle: "Products & Inventory",
      title: "Products & Inventory",
      subtitle: "Retail product and inventory tracking",
      productTypes: "Product types",
      lowStock: "Low stock",
      stockValue: "Stock value",
      addProduct: "Add product",
      productsCount: "Products",
      emptyTitle: "No products yet",
      emptyDesc: "Add your first product with the form on the left.",
      lowStockBadge: "· low stock!",
    },

    // ── Packages (paketler/page) ──
    packages: {
      metaTitle: "Packages",
      title: "Packages",
      subtitle: "Session packages and memberships — build steady revenue",
      addPackage: "Add package",
      packagesCount: "Packages",
      emptyTitle: "No packages yet",
      emptyDesc: "Create your first package with the form on the left.",
      sessionsValidity: "{sessions} sessions · valid for {days} days",
    },
  },

  panelOther: {
    // === Clients page ===
    customers: {
      title: "Clients",
      subtitle: "{n} clients",
      // CustomersTable
      emptyTitle: "You have no clients yet",
      emptyDesc: "As appointments come in, your clients will be listed here.",
      searchPlaceholder: "Search by name, phone or email",
      sortLastVisit: "Last visit",
      sortVisits: "Number of visits",
      sortSpend: "Spend",
      noMatch: "No clients found matching “{q}”.",
      colCustomer: "Client",
      colContact: "Contact",
      colVisit: "Visits",
      colCompleted: "Completed",
      colNoShow: "No-show",
      colSpend: "Spend",
      colLastVisit: "Last visit",
      salonCustomer: "Salon client",
      visitsLabel: "{n} visits",
      completedLabel: "{n} completed",
      noShowLabel: "{n} no-shows",
    },

    // === Reviews page ===
    reviews: {
      title: "Reviews",
      subtitle: "{count} reviews · {unanswered} unanswered",
      adminHidden: "Hidden by admin",
      emptyTitle: "No reviews yet",
      emptyDesc: "After completed appointments, your clients' reviews will appear here.",
      // ReviewReply
      repliedSuffix: "replied",
      edit: "Edit",
      reply: "Reply",
      replyPlaceholder: "Write a kind reply to the client...",
      cancel: "Cancel",
      sending: "Sending...",
      saveReply: "Save reply",
      // DeleteReviewButton / ReportReviewButton
      deleteConfirm: "Are you sure you want to delete this review? This can't be undone.",
      deleteAria: "Delete review",
      delete: "Delete",
      reported: "Reported",
      reportConfirm: "Report this review to the admin? The review won't be deleted, it's only flagged for review.",
      reportAria: "Report review",
      report: "Report",
    },

    // === SMS page ===
    sms: {
      title: "SMS",
      subtitle: "Appointment confirmations and bulk announcement messages",
      creditBalance: "Credit balance",
      mockTitle: "Test (mock) mode",
      mockDesc:
        "No SMS provider key is set yet. Sends will deduct credits and be logged in history, but no real SMS is delivered. For real delivery, add your provider details to the environment variables (Netgsm: ",
      mockDescEnd: ").",
      historyTitle: "Send history",
      historyEmpty: "No SMS sent yet.",
      colNumber: "Number",
      colMessage: "Message",
      colKind: "Type",
      colStatus: "Status",
      colDate: "Date",
      // KIND_TR
      kindManual: "Manual",
      kindConfirm: "Appointment confirmation",
      kindReminder: "Reminder",
      kindBulk: "Bulk",
      // StatusBadge
      statusSent: "Sent",
      statusMock: "Test",
      statusFailed: "Failed",
      statusQueued: "Queued",
      // SmsSender
      messageTitle: "Message",
      messagePlaceholder: "e.g. Special 15% off this week, just for you, from {business}!",
      charsCredits: "{chars} characters · {credits} credits/SMS",
      charsLeft: "{n} left",
      template: "Template {n}",
      extraNumbersLabel: "Extra numbers (separate with commas or spaces)",
      extraNumbersPlaceholder: "0532..., 0505...",
      invalidNumbers: "{n} numbers are invalid and won't be sent: ",
      recipientCount: "{n} recipients",
      totalCredits: "{n} credits total",
      sending: "Sending...",
      send: "Send",
      contactsTitle: "Clients ({n})",
      deselect: "Deselect",
      selectAll: "Select all",
      searchPlaceholder: "Search name / phone",
      contactsEmpty: "Clients with a phone number will be listed here as records are created.",
      errorEmptyBody: "Enter the message text.",
      errorNoRecipient: "Select at least one valid recipient or enter a number.",
      errorInsufficient: "Insufficient credits. Needed: {needed}, available: {have}.",
      resultSent: "{sent} sent",
      resultFailed: ", {failed} failed",
      fallbackCustomer: "Client",
      // Server action error messages (sendBulkSmsAction)
      errorUnauthorized: "Unauthorized.",
      errorBodyEmpty: "Enter the message text.",
      errorBodyTooLong: "The message is too long (500 characters max).",
      errorNoValidNumber: "Enter at least one valid number.",
      errorInsufficientCredits: "Insufficient credits.",
      // Templates
      templateText1: "Dear client, 15% off all services awaits you this week. Get in touch to book your appointment.",
      templateText2: "A friendly reminder about your appointment. We look forward to welcoming you to our salon.",
      templateText3: "Be the first to hear about our new services and campaigns!",
    },

    // === Messaging page ===
    messaging: {
      title: "Messaging",
      subtitle: "Send appointment reminders and updates to your customers — multi-channel",
      introBadge: "Multi-channel notifications",
      introTitle: "Reach your customer on the right channel",
      introDesc: "Salonor brings two channels together: free WhatsApp today, automated SMS once your company is set up. Use both so you never miss an appointment.",
      statusActive: "Active",
      statusLocked: "Unlocks with your company",
      statusTest: "Test mode",
      waName: "WhatsApp",
      waTagline: "Free · manual sending · ready now",
      waDesc: "Send appointment reminders and win-back messages to lost customers in one tap, free, from your own phone. No setup required.",
      waPoint1: "Zero cost — no credits",
      waPoint2: "High open rate",
      waPoint3: "Share images and links",
      waNumberLabel: "Salon WhatsApp number",
      waNumberMissing: "No dedicated number set — your phone number is used",
      waNumberSet: "Set / change",
      waCtaReminders: "Go to reminders",
      waCtaLost: "Win back lost customers",
      waPublicNote: "We've also added a button on your salon page so customers can reach you on WhatsApp.",
      smsName: "SMS",
      smsTagline: "Automated · works on every phone",
      smsDesc: "Send appointment confirmations and bulk updates by SMS. No app required, reaches every phone.",
      smsPoint1: "Fully automated sending",
      smsPoint2: "No app needed — reaches every phone",
      smsPoint3: "Professional sender name",
      smsCreditLabel: "Credit balance",
      smsCta: "Go to SMS panel",
      smsLockedNote: "Sending SMS requires a registered company and IYS (Message Management System) registration. Once you set up your company and enter provider details, this channel unlocks automatically.",
      smsTestNote: "Currently in test mode: you can try the flow, credits are deducted but no real SMS is delivered.",
      compareTitle: "Which channel, when?",
      compareCol: "Feature",
      rowCost: "Cost",
      rowCostWa: "Free",
      rowCostSms: "Per credit",
      rowSetup: "Setup",
      rowSetupWa: "Ready",
      rowSetupSms: "Company + IYS",
      rowAuto: "Sending",
      rowAutoWa: "Manual",
      rowAutoSms: "Automated",
      rowReach: "Reach",
      rowReachWa: "Customers with WhatsApp",
      rowReachSms: "Every phone",
      roadmapTitle: "Recommended path",
      recommendedBadge: "Recommended",
      roadmapNowTitle: "Now: WhatsApp",
      roadmapNowDesc: "Start at zero cost. Send reminders via WhatsApp and boost customer satisfaction right away.",
      roadmapNextTitle: "Later: SMS",
      roadmapNextDesc: "Once revenue comes in and your company is set up, enable SMS so reminders become automatic and manual work ends.",
    },

    // === To-dos page ===
    todos: {
      title: "To-do List",
      subtitle: "Your business's daily tasks and reminders",
      statOpen: "Pending tasks",
      statDone: "Completed",
      addTitle: "Add task",
      listTitle: "Tasks ({n})",
      emptyTitle: "No tasks yet",
      emptyDesc: "Add your first task with the form on the left.",
      overduePrefix: "Overdue · ",
      // Priority labels
      priorityHigh: "High",
      priorityNormal: "Normal",
      priorityLow: "Low",
      // TodoForm
      taskLabel: "Task",
      taskPlaceholder: "e.g. Call the supplier",
      priorityLabel: "Priority",
      dueDateLabel: "Due date",
      adding: "Adding...",
      addButton: "Add task",
      // TodoToggle
      undo: "Undo",
      markDone: "Mark done",
      deleteAria: "Delete task",
      clearDone: "Clear completed ({n})",
    },

    // === Campaigns page ===
    campaigns: {
      title: "Campaigns",
      subtitle: "Attract new clients with discount codes",
      createTitle: "Create campaign",
      listTitle: "Campaigns ({n})",
      emptyTitle: "No campaigns yet",
      emptyDesc: "Create your first discount code with the form on the left.",
      expired: "Expired",
      usedCount: "used {n} times",
      endedOn: " · ended on {date}",
      endsOn: " · ends {date}",
      noExpiry: " · no expiry",
    },

    // === AI Insights page ===
    ai: {
      title: "AI Insights",
      subtitle: "Insights and recommendations automatically derived from your business data",
      smartBadge: "Smart analysis",
      collectingTitle: "Collecting data for analysis",
      collectingDesc:
        "As appointments and sales build up, revenue trends, peak times, staff performance and tailored recommendations will appear here.",
      metricRevenue: "30-day revenue",
      metricRevenueSub: "{pct}% vs. the previous period",
      metricBusiest: "Busiest time",
      metricBusiestSub: "around {time}",
      metricAvgTicket: "Average ticket",
      metricAvgTicketSub: "per transaction",
      metricAtRisk: "At-risk clients",
      metricAtRiskSub: "not seen in 30+ days",
      none: "—",
      topServicesTitle: "Top-earning services",
      notEnoughData: "Not enough data.",
      transactions: "{n} transactions",
      staffPerfTitle: "Staff performance (60 days)",
      staffCompleted: "{n} completed appointments",
      // AiInsights component
      insightsTitle: "Recommendations for you",
      geminiBadge: "Gemini AI",
      refresh: "Refresh",
      analyzing: "AI is analyzing your business data…",
      aiUnavailable:
        "AI is temporarily unavailable ({reason}) — showing rule-based recommendations.",
      aiNotConfigured:
        "AI analysis is not configured — showing rule-based recommendations.",
      // businessInsightsAction error messages
      errorUnauthorized: "Unauthorized.",
      errorTooFrequent: "Refreshed too often, try again in a moment.",
      errorNoData: "Not enough data.",
      errorNoSuggestion: "Couldn't generate a recommendation.",
      errorInsightsFailed: "Couldn't fetch AI recommendations.",
      // Rule-based recommendation texts (insight engine)
      tipRevenueDown: "Revenue dropped {pct}% over the last 30 days. ",
      tipRevenueDownAtRisk: "{n} clients haven't been in for a while — send a campaign by SMS.",
      tipRevenueDownLoyal: "Consider a special campaign for your loyal clients.",
      tipRevenueUp: "Revenue is up ({pct}%). Focus on your top-earning services to keep the momentum.",
      tipBusiestHour: "Your busiest hour is around {time}. Schedule extra staff for these hours to cut down wait times.",
      tipQuietDays: "Spread demand across the week with special discounts on quiet days; balance the load on busy days.",
      tipAtRisk: "You have {n} at-risk clients (not seen in 30+ days). Win them back with loyalty points + SMS.",
      tipLowStock: "{n} products are critically low on stock: {names}. Time to reorder.",
      tipNoShow: "Your no-show rate is high at {pct}%. You can reduce no-shows with appointment confirmation SMS.",
      tipTopService: "“{name}” is your top-earning service. Boost its value with a package or an upsell.",
      tipNoData: "As data builds up, you'll see smart, tailored recommendations for your business here. Keep recording appointments and sales.",
    },

    // === Lost Clients page ===
    lost: {
      title: "Lost Clients",
      subtitle: "Clients not seen in {days}+ days — win them back via WhatsApp",
      fallbackCustomer: "Salon client",
      emptyTitle: "Great — you have no lost clients!",
      emptyDesc: "All your clients have visited in the last {days} days. Keep it up!",
      waMessage:
        "Hi {name}, we've missed you at {business}! 💜 We'd love to welcome you back — we have a special offer just for you, book any time.",
      lastVisit: "Last visit: {date} · ",
      daysAgo: "{n} days ago",
      visits: "{n} visits",
      recover: "Win back",
      noPhone: "No phone",
    },
  },

  onboarding: {
    metaTitle: "Business setup",

    // Top heading (greeting)
    greeting: "Hi, {name} 👋",

    // Step indicator labels
    steps: {
      business: "Business",
      category: "Category",
      location: "Location",
      hours: "Hours",
      services: "Services",
    },

    // Step 1: Business
    step1: {
      title: "Let's introduce your business",
      subtitle: "How will clients see you?",
      nameLabel: "Business name",
      namePlaceholder: "e.g. Nova Hair Studio",
      phoneLabel: "Phone",
      phonePlaceholder: "0212 000 00 00",
      descLabel: "Short description (optional)",
      descPlaceholder: "Describe your salon in a few sentences...",
    },

    // Step 2: Category
    step2: {
      title: "What's your field?",
      subtitle: "Choose the category that fits your business best.",
    },

    // Step 3: Location
    step3: {
      title: "Where are you?",
      subtitle: "So your clients can find you on the map.",
      cityLabel: "City",
      districtLabel: "District",
      districtPlaceholder: "e.g. Kadıköy",
      addressLabel: "Full address",
      addressPlaceholder: "Neighborhood, street, no.",
    },

    // Step 4: Hours
    step4: {
      title: "Your working hours",
      subtitle: "Set the hours and days you're open.",
      openLabel: "Opening",
      closeLabel: "Closing",
      closedDaysLabel: "Closed days",
      hoursHint: "On days not marked as closed, you're open from {open} to {close}.",
    },

    // Step 5: Services
    step5: {
      title: "Your first services",
      subtitle: "Add a few services — you can change as many as you like later from the dashboard.",
      servicePlaceholder: "Service name",
      minUnit: "min",
      priceUnit: "₺",
      removeService: "Remove",
      addService: "Add service",
    },

    // Navigation
    back: "Back",
    creating: "Creating...",
    publish: "Publish my business",
    continue: "Continue",

    // Map (LocationPicker)
    mapHint: "Set your location by clicking on the map or dragging the marker.",
  },

  admin: {
    // Page title (metadata)
    metaTitle: "Admin",

    // Shared action error (inline warning when a server action fails)
    actionFailed: "Something went wrong. Please try again.",

    // Layout (top bar)
    consoleBadge: "Platform Console",
    refresh: "Refresh",
    refreshAria: "Refresh",
    backToSite: "Back to site",
    logout: "Log out",

    // Overview heading
    overviewTitle: "Overview",
    overviewSubtitle: "All businesses and users on one screen.",

    // Stat cards
    statBusiness: "Businesses",
    statBusinessSub: "{active} active · {suspended} suspended",
    statUser: "Users",
    statAppointment: "Appointments",
    statRevenue: "Total revenue",

    // Role labels
    roleCustomer: "Customer",
    roleOwner: "Business",
    roleAdmin: "Admin",

    // Businesses table
    businessesTitle: "Businesses",
    businessesShowing: "showing the {shown} newest of {total}",
    colBusiness: "Business",
    colOwner: "Owner",
    colPlanCredits: "Plan & Credits",
    colAppointment: "Appointments",
    colRevenue: "Revenue",
    colFeatured: "Featured",
    colStatus: "Status",
    colAction: "Action",
    emptyBusinesses: "No businesses yet. Start with",
    emptyBusinessesCta: "Create new business",
    emptyBusinessesEnd: "in the top right.",
    incompleteProfile: "Incomplete profile",
    incompleteProfileTitle: "Phone, address or description is missing",
    view: "View",

    // Recent sign-ups
    recentTitle: "Recent sign-ups",

    // CreateBusiness (modal)
    createButton: "Create new business",
    createdTitle: "Business created",
    createTitle: "Create new business",
    close: "Close",
    createdNote: "The business is live in the directory. The owner can sign in with the details below and customize it.",
    loginEmail: "Login email",
    tempPassword: "Temporary password",
    viewStorefront: "View storefront",
    ok: "OK",
    nameLabel: "Business name",
    namePlaceholder: "Glow Studio",
    ownerNameLabel: "Owner name (optional)",
    ownerNamePlaceholder: "Full name",
    emailLabel: "Login email",
    emailPlaceholder: "isletme@ornek.com",
    passwordLabel: "Temporary password",
    planLabel: "Plan",
    submit: "Create business",
    createHint: "The business appears automatically in the directory (businesses).",

    // PlanControl
    creditAmountAria: "Credit amount",
    addCreditsTitle: "Add {amount} credits",
    removeCreditsTitle: "Remove {amount} credits",
    planUpdateError: "Couldn't update the plan. Please try again.",
    creditUpdateError: "Couldn't update credits. Please try again.",

    // ActiveToggle
    suspend: "Suspend",
    activate: "Activate",
    activeUpdateError: "Couldn't update the status. Please try again.",

    // FeaturedToggle
    featuredOn: "Featured",
    featuredOff: "Feature",
    featuredUpdateError: "Couldn't update. Please try again.",

    // DeleteBusiness
    deleteConfirm:
      "The \"{name}\" business and ALL its records (appointments, reviews, sales, owner account) will be permanently deleted. This can't be undone. Continue?",
    deleteError: "Couldn't delete the business. Please try again.",
    deleteTitle: "Delete business",

    // ContactRequests
    contactTitle: "Business requests",
    contactNewBadge: "{n} new",
    contactEmpty: "No partnership requests yet.",
    contactHandled: "Contacted",
    contactNew: "New",
    contactUndo: "Undo",
    contactMarkHandled: "Contacted",
    contactDeleteConfirm: "Are you sure you want to delete this request?",
    contactDeleteAria: "Delete",

    // ReviewModeration
    reviewTitle: "Review moderation",
    reviewReportedBadge: "{n} reports pending",
    reviewEmpty: "No reviews yet.",
    reviewShow: "Show",
    reviewHide: "Hide",
    reviewDeleteConfirm: "Permanently delete this review? This can't be undone.",
    reviewDeleteAria: "Delete",
    reviewReported: "Reported",
    reviewHidden: "Hidden",
  },

  consent: {
    message:
      "We use cookies to improve your experience and analyze traffic. Essential cookies are always on; you choose whether to accept analytics cookies.",
    accept: "Accept",
    reject: "Essential only",
    learnMore: "Details",
  },
};
