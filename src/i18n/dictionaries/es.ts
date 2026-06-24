// Diccionario en español. Cumple AL PIE DE LA LETRA con la firma de tipo de `tr.ts`
// (Dictionary = typeof tr); una clave de más o de menos provoca un error de compilación.
import type { Dictionary } from "../types";

export const es: Dictionary = {
  common: {
    viewAll: "Ver todo",
    scrollBack: "Desplazar atrás",
    scrollForward: "Desplazar adelante",
    close: "Cerrar",

    // Límite de error (error.tsx)
    errorTitle: "Algo ha salido mal",
    errorDesc: "Se ha producido un error inesperado. Puedes intentarlo de nuevo o volver al inicio.",
    retry: "Inténtalo de nuevo",
    backHome: "Volver al inicio",

    // 404 (not-found.tsx)
    notFoundTitle: "Página no encontrada",
    notFoundDesc: "Es posible que la página que buscas se haya movido o que nunca haya existido.",
    searchSalons: "Buscar salón",

    // Estado del carrusel vacío
    carouselEmpty: "Pronto habrá más salones aquí.",

    // Insignias de tienda (App Store / Google Play)
    comingSoon: "Próximamente",

    // Atribución del mapa
    mapAttribution: "© Colaboradores de OpenStreetMap · © CARTO",

    // Valores por defecto de SEO / OpenGraph
    ogTitle: "Salonor — Tu cita de belleza y cuidado, en segundos",
    ogDescription:
      "Descubre peluquerías, barberías, spas y expertos en belleza cerca de ti; elige la hora que te conviene y reserva tu lugar al instante.",
  },

  nav: {
    signIn: "Iniciar sesión",
    listBusiness: "Publica tu negocio",
    menu: "Menú",
    account: "Mi cuenta",
    forCustomers: "Para clientes",
    signInOrUp: "Inicia sesión o regístrate",
    downloadApp: "Descarga la app",
    helpSupport: "Ayuda y soporte",
    forBusinesses: "Para negocios",
    businessLogin: "Acceso para negocios",
    businessPanel: "Panel del negocio",
    adminPanel: "Panel de administración",
    myAppointments: "Mis citas",
    myFavorites: "Mis favoritos",
    myProfile: "Mi perfil",
    logout: "Cerrar sesión",
    language: "Idioma",
  },

  footer: {
    tagline: "Reserva tu cita de belleza y cuidado en segundos. Gratis, rápido y 24/7.",
    exploreTitle: "Explorar",
    hairdressers: "Peluquerías",
    barbers: "Barberías",
    spaMassage: "Spa y masajes",
    nailStudios: "Estudios de uñas",
    skincare: "Cuidado de la piel",
    forBusinessesTitle: "Para negocios",
    salonorBusiness: "Salonor Business",
    pricing: "Precios",
    addBusiness: "Añade tu negocio",
    businessLogin: "Acceso para negocios",
    companyTitle: "Salonor",
    about: "Sobre nosotros",
    helpFaq: "Ayuda y preguntas frecuentes",
    privacy: "Privacidad y RGPD",
    terms: "Términos de uso",
    contact: "Contacto",
    legalTitle: "Legal",
    distanceSales: "Contrato de venta a distancia",
    preInfo: "Formulario de información previa",
    withdrawal: "Desistimiento y reembolso",
    cookiePolicy: "Política de cookies",
    rights: "© 2026 Salonor. Todos los derechos reservados.",
    designedIn: "Diseñado en Türkiye 🇹🇷",
  },

  home: {
    heroBadge: "La plataforma de reservas n.º 1 de Türkiye",
    heroTitleA: "Tu cita en segundos, ",
    heroTitleHighlight: "en tu bolsillo",
    heroTitleEnd: ".",
    heroSubtitle:
      "Descubre peluquerías, barberías, spas y expertos en belleza cerca de ti; elige la hora y reserva tu lugar al instante: gratis y 24/7.",
    popular: "Popular:",
    ratingAvg: "valoración media",
    verifiedReviews: "reseñas verificadas",
    selectSalons: "salones selectos",
    categoriesSr: "Categorías",
    featuredTitle: "Salones recomendados",
    featuredSubtitle: "Los mejor valorados y más elegidos",
    newestTitle: "Recién añadidos",
    newestSubtitle: "Negocios que acaban de unirse a Salonor",

    stats: {
      heading: "El lugar ideal para la belleza y el cuidado personal",
      sub: "Una plataforma, una app: donde se reúnen los salones y expertos más selectos de las 81 provincias.",
      bigGradient: "En segundos",
      bigSub: "reserva: gratis y 24/7",
      selectSalons: "salones selectos",
      provincesNum: "81 provincias",
      provincesLabel: "en toda Türkiye",
      verifiedReviews: "reseñas verificadas",
      footnote: "{n}+ servicios reservables · confirmación instantánea · pago seguro",
    },

    bizPromo: {
      kicker: "Salonor Business",
      heading: "Salonor para tu negocio",
      desc: "Citas, calendario, gestión de personal y clientes en un solo panel para salones y spas. La forma profesional de hacer crecer tu negocio.",
      feat1: "Reservas online 24/7: se acabó esperar al teléfono",
      feat2: "Calendario, personal y servicios en una sola pantalla",
      feat3: "Gana confianza con las reseñas y fideliza a tus clientes",
      learnMore: "Saber más",
      perfect: "Perfecto 5/5",
      satisfaction: "satisfacción de los negocios",
      calendar: "Calendario",
      today: "Hoy",
      date: "Sáb, 14 de junio",
      blockHaircut: "Corte de pelo",
      blockBlowDry: "Secado",
      blockBeard: "Afeitado de barba",
      blockSkincare: "Cuidado de la piel",
      blockManicure: "Manicura",
      blockColor: "Coloración",
      featured: "Destacado",
      reviewsCount: "({n} reseñas)",
      apptConfirmed: "Cita confirmada",
      apptDetail: "Hoy 14:30 · Corte de pelo",
    },

    reviews: {
      title: "Reseñas",
      subtitle: "Citas reales, experiencias reales",
    },

    directory: {
      kicker: "Todos los servicios",
      heading: "Cada servicio que buscas, en Salonor",
      groups: [
        {
          title: "Tipos de salón",
          items: ["Peluquería de mujer", "Barbería de hombre", "Centro de belleza y estética", "Estudio de uñas", "Centro de spa y masajes", "Estudio de maquillaje"],
        },
        {
          title: "Servicios de peluquería",
          items: ["Corte de pelo", "Secado y peinado", "Coloración", "Mechas y balayage", "Keratina y cuidado capilar", "Peinado de novia"],
        },
        {
          title: "Servicios de uñas",
          items: ["Manicura", "Pedicura", "Esmaltado permanente", "Uñas acrílicas", "Uñas de gel", "Nail art"],
        },
        {
          title: "Maquillaje, cejas y pestañas",
          items: ["Maquillaje de día y de noche", "Maquillaje de novia", "Pestañas de seda", "Lifting de pestañas", "Laminado de cejas", "Diseño de cejas"],
        },
        {
          title: "Cuidado de la piel",
          items: ["Limpieza facial clásica", "Tratamiento facial profesional", "Tratamiento de manchas y acné", "Hydrafacial", "Depilación de cejas", "Depilación facial con cera"],
        },
        {
          title: "Spa y masajes",
          items: ["Masaje sueco", "Aromaterapia", "Masaje de tejido profundo", "Masaje con piedras calientes", "Reflexología", "Ritual de hammam"],
        },
        {
          title: "Depilación láser",
          items: ["Cuerpo entero", "Axilas", "Piernas", "Brazos", "Espalda", "Rostro y zonas"],
        },
        {
          title: "Cuidado masculino",
          items: ["Corte de pelo de hombre", "Arreglo y diseño de barba", "Coloración masculina", "Tratamiento facial masculino", "Depilación masculina", "Combo de pelo y barba"],
        },
      ],
    },

    appDownload: {
      heading: "Lleva Salonor en tu bolsillo",
      desc: "Gestiona tus citas, sigue a tus salones favoritos y descubre nuevos lugares: todo con un solo toque, siempre contigo.",
      feat1: "Reserva de nuevo con un solo toque",
      feat2: "Recordatorios de citas y notificaciones",
      feat3: "Recomendaciones de salones a tu medida",
      qrText: "Escanea con la cámara y descárgala ya",
      bookNow: "Reserva ahora",
      nearbyCount: "{n} salones cerca de ti",
      exploreMap: "Explorar en el mapa →",
      mockHaircut: "Corte de pelo",
      mockBlowDry: "Secado",
      mockColor: "Coloración",
    },
  },

  search: {
    metaTitle: "Buscar salón",

    // Encabezado de resultados / contador
    allSalons: "Todos los salones",
    resultsCount: "{n} resultados",
    resultsForQuery: "· para “{q}”",

    // Estado vacío
    emptyTitle: "No se encontraron resultados",
    emptyDesc: "Prueba a ampliar tu búsqueda o a limpiar los filtros.",
    clearFilters: "Limpiar filtros",

    // Barra de búsqueda (SearchBar)
    typeLabel: "Tipo",
    allServices: "Todos los servicios",
    locationLabel: "Ubicación",
    locationPlaceholder: "Ciudad y distrito",
    salonNameLabel: "Nombre del salón",
    salonNamePlaceholder: "Busca un salón o servicio…",
    salonNameAria: "Salón o servicio",
    searchButton: "Buscar",
    close: "Cerrar",
    serviceTypeTitle: "Tipo de servicio",

    // Filtros secundarios (SearchControls)
    filterAll: "Todos",
    sortLabel: "Ordenar:",
    sortRecommended: "Recomendados",
    sortRating: "Mejor valorados",
    sortReviews: "Más reseñas",

    // Selector de ubicación (LocationList)
    provinceSearchPlaceholder: "Busca una provincia… (p. ej. Estambul)",
    allTurkey: "Toda Türkiye",
    backToProvinces: "Volver a provincias",
    allProvince: "Todo {province}",
    districtSearchPlaceholder: "Busca un distrito en {province}…",
    districtCount: "{n} distritos",
    noResults: "No se encontraron resultados",

    // Panel del mapa (SalonMapPanel)
    viewSalon: "Ver salón →",
    backToList: "Volver a la lista",
    mapButton: "Mapa",
  },

  salon: {
    // Metadatos
    notFoundTitle: "Salón no encontrado",
    metaDescriptionFallback: "Consulta los precios de {name}, lee las reseñas y reserva tu cita online.",

    // Breadcrumb
    breadcrumbLabel: "Ruta de la página",
    home: "Inicio",

    // Título / estado
    reviewsCountInline: "({n} reseñas)",
    openNow: "Abierto ahora",
    closedNow: "Cerrado ahora",

    // Secciones
    servicesTitle: "Servicios",
    select: "Elegir",
    teamTitle: "Equipo",
    reviewsTitle: "Reseñas",
    guest: "Invitado",
    ratingSummary: "{label} · {n} reseñas",

    // Etiquetas de puntuación (según la media)
    ratingExcellent: "Excepcional",
    ratingVeryGood: "Excelente",
    ratingGood: "Muy bueno",
    ratingAverage: "Bueno",
    ratingPoor: "Regular",
    businessReplied: "{name} respondió",
    aboutTitle: "Acerca de",
    openingHours: "Horario de atención",
    today: "· Hoy",
    closed: "Cerrado",

    // Tarjeta de reserva
    book: "Reservar cita",
    bookNote: "Confirmación instantánea · Cancelación gratuita",
    todayHours: "Hoy: {open} – {close}",
    getDirections: "Cómo llegar",
    whatsappChat: "Escríbenos por WhatsApp",
    whatsappGreeting: "Hola, me gustaría obtener información / preguntar por una cita en {name}.",

    // Galería
    openGallery: "Abrir galería",
    photoAlt: "{name} foto {n}",
    allPhotos: "Todas las fotos ({n})",
    close: "Cerrar",

    // Favorito
    inFavorites: "En favoritos",
    addToFavorites: "Añadir a favoritos",
    removeFromFavorites: "Quitar de favoritos",

    // Añadir reseña
    addReview: "Escribir una reseña",
    thanksTitle: "¡Gracias!",
    reviewPublished: "Tu reseña se ha publicado. ¡Gracias por compartir tu experiencia! 💛",
    yourRating: "Tu valoración",
    starsLabel: "{n} estrellas",
    yourName: "Tu nombre",
    yourNamePlaceholder: "Nombre y apellidos",
    yourReview: "Tu reseña",
    yourReviewPlaceholder: "Comparte tu experiencia en unas líneas...",
    cancel: "Cancelar",
    submitting: "Enviando...",
    submitReview: "Enviar reseña",
    selectRatingFirst: "Por favor, elige primero una valoración.",

    // Tarjeta de salón
    featured: "Destacado",
    reviewWord: "valoración",

    // Mapa
    mapAriaLabel: "Mapa que muestra la ubicación de {name}",
  },

  booking: {
    // Título meta de la página de reserva
    metaTitle: "Reservar cita",

    // Título del layout del flujo
    secureHeader: "Reserva segura · Salonor",

    // Pasos del asistente
    steps: {
      services: "Servicios",
      staff: "Personal",
      dateTime: "Fecha y hora",
      confirm: "Confirmación",
    },

    // Pantalla de éxito
    success: {
      title: "¡Tu cita está confirmada!",
      codeLabel: "Tu código de cita",
      viewAppointments: "Ver mis citas",
      backHome: "Volver al inicio",
    },

    // Paso 1: Servicios
    services: {
      heading: "Elige un servicio",
    },

    // Paso 2: Personal
    staff: {
      heading: "Elige el personal",
      anyTitle: "Sin preferencia",
      anyDesc: "El primer profesional disponible",
      noEligible:
        'No hay ningún profesional que pueda realizar por sí solo la combinación de servicios que has elegido. Puedes continuar con "Sin preferencia" o cambiar tu selección de servicios.',
    },

    // Paso 3: Fecha y hora
    dateTime: {
      heading: "Elige fecha y hora",
      noStaffForCombo: "Ningún profesional puede realizar todos los servicios que has elegido.",
      noStaffForComboHint: "Prueba a reservar los servicios en citas separadas o a cambiar tu selección.",
      noSlots: "No quedan horas disponibles para este día.",
      noSlotsHint: "Prueba a elegir otro día.",
      noOpenDays: "Este salón aparece cerrado durante los próximos 14 días.",
      noOpenDaysHint: "Ahora mismo no se pueden reservar citas online. Por favor, contacta directamente con el salón.",
      slotLoadError: "No se han podido cargar las horas disponibles.",
      retry: "Inténtalo de nuevo",
      morning: "Mañana",
      afternoon: "Tarde",
      evening: "Noche",
    },

    // Paso 4: Confirmación
    confirm: {
      heading: "Confirma tu cita",
      anyStaff: "Personal disponible",
      discountLine: "Descuento · {pct}%",
      totalLabel: "Total · {duration}",
      couponQuestion: "¿Tienes un código de descuento?",
      couponApplied: "{code} · descuento del {pct}% aplicado",
      couponRemove: "Quitar",
      couponPlaceholder: "CÓDIGO",
      couponApply: "Aplicar",
      contactHeading: "Tus datos de contacto",
      nameLabel: "Nombre y apellidos",
      namePlaceholder: "Nombre y apellidos",
      phoneLabel: "Teléfono",
      phoneLabelOptional: "Teléfono (opcional)",
      phonePlaceholder: "05XX XXX XX XX",
      phoneHint: "Te enviaremos un SMS/WhatsApp con la confirmación y el recordatorio de la cita.",
      noteLabel: "Nota (opcional)",
      notePlaceholder: "¿Hay algo que quieras comunicar al salón?",
      submitBooking: "Confirmar cita — {total}",
      submitting: "Confirmando...",
      paymentNote: "El pago se realiza en el salón. Tienes derecho a cancelación gratuita.",
      consentBefore: "Acepto que los datos personales que proporciono para esta cita se traten conforme al ",
      consentLink: "Aviso de Privacidad (KVKK)",
      consentAfter: " y se compartan con el salón correspondiente para la cita.",
    },

    // Mensajes de error
    errors: {
      nameRequired: "Introduce tu nombre y apellidos.",
      phoneRequired: "Introduce un número de móvil válido para poder enviarte la confirmación por SMS (05XX XXX XX XX).",
      connection: "Se ha producido un error de conexión. Inténtalo de nuevo.",
      consentRequired: "Debes aceptar el aviso de privacidad para continuar.",
    },

    // Tarjeta de resumen (sidebar) y barra móvil
    summary: {
      noServices: "Aún no has elegido ningún servicio.",
      continue: "Continuar",
      servicesCount: "{count} servicios · {total}",
    },

    // General
    ellipsis: "...",

    // Se muestra si el código de descuento queda invalidado (caducado/inactivo) en el momento de reservar.
    couponDropped:
      "Tu código de descuento no se ha podido aplicar porque perdió su validez durante la reserva. Tu cita se ha creado con el precio completo.",

    // Asesor de Estilo con IA
    advisor: {
      cardTitle: "Asesor de Estilo con IA",
      newBadge: "Nuevo",
      cardDesc: "Sube tu foto y te recomendamos el estilo que mejor te queda",
      modalTitle: "Asesor de Estilo con IA",
      intro: "Sube una foto nítida de tu cara/cabello. La inteligencia artificial analizará la forma de tu rostro y tu tipo de pelo para",
      introStrong: "los servicios de este salón",
      introEnd: "hacerte una recomendación personalizada.",
      uploadCta: "Subir foto",
      uploadHint: "JPG / PNG · máximo 5 MB",
      previewAlt: "Vista previa",
      changePhoto: "Elegir otra foto",
      prefsPlaceholder: "Opcional: p. ej. 'que sea corto y fácil de cuidar'",
      analyzing: "Analizando…",
      suggestCta: "Recomiéndame un estilo",
      evaluation: "Evaluación",
      selectAndContinue: "Elegir este servicio y continuar",
      noMatchedService:
        "No se ha encontrado un servicio de peluquería que coincida exactamente en este salón — puedes seleccionar manualmente el servicio adecuado más abajo.",
      reanalyze: "Analizar de nuevo",
      disclaimer: "Las recomendaciones de la IA son solo orientativas; toma la decisión final junto con tu profesional.",
      consent: "Acepto que mi foto se envíe y sea tratada por un servicio de inteligencia artificial (Google, ubicado en el extranjero) para generar recomendaciones de estilo.",
      consentRequired: "Debes marcar la casilla de verificación para continuar.",
      photoLoadError: "No se ha podido cargar la foto, prueba con otra imagen.",
      genericError: "Se ha producido un error, inténtalo de nuevo.",
    },
  },

  pricing: {
    metaTitle: "Precios — Salonor Business",
    metaDescription:
      "Planes de Salonor Business: Inicial, Profesional y Empresa. Reservas, comandas, SMS, puntos, tarjetas regalo, stock, comisiones y análisis con IA: todo en un solo panel. Mensual o anual (2 meses gratis).",

    badge: "Salonor Business",
    title: "Elige el plan ideal para tu negocio",
    subtitlePrefix: "Cada plan incluye ",
    subtitleEmphasis: "todos los sistemas del anterior",
    subtitleSuffix:
      " y añade nuevas herramientas para hacer crecer tu negocio. Instalación gratuita, sin compromiso de larga duración.",

    trust: {
      noContract: "Sin compromiso de larga duración, cancela cuando quieras",
      freeSetup: "Instalación gratuita — la prepara nuestro equipo",
      liveSupport: "Soporte en vivo por WhatsApp",
    },

    footnotePrefix:
      "Los precios no incluyen IVA. Salonor solo presta servicio en Türkiye. Nuestro equipo configura tu cuenta y te enviamos tus datos de acceso. Para cualquier duda, escribe a ",
    footnoteEmail: "isletme@salonor.com",

    billingAriaLabel: "Periodo de facturación",
    monthly: "Mensual",
    annual: "Anual",
    annualBadge: "2 meses gratis",

    mostPopular: "El más popular",
    perMonth: "/ mes",
    annualBilledPrefix: "Facturación anual ",
    annualBilledSuffix: " facturado",
    annualSavingsPrefix: "· ahorra ",
    annualSavingsSuffix: " al año",
    monthlyBilled: "Facturación mensual · puedes cancelar cuando quieras",

    staffLabel: "Empleados / Usuarios",
    smsBonusLabel: "Créditos SMS de regalo",

    contactCta: "Contáctanos",

    planBaslangicName: "Inicial",
    planBaslangicTagline: "Para salones principiantes y boutique",
    planProfesyonelName: "Profesional",
    planProfesyonelTagline: "El favorito de los salones en crecimiento",
    planKurumsalName: "Empresa",
    planKurumsalTagline: "Para negocios con mucho movimiento y personal numeroso",

    feature1: "Registro de clientes ilimitado",
    feature2: "Alta de servicios ilimitada",
    feature3: "Gestión de citas ilimitada",
    feature4: "Sistema de confirmación de citas por SMS",
    feature5: "Envío de SMS",
    feature6: "Sistema de comandas",
    feature7: "Sistema de venta por paquetes",
    feature8: "Seguimiento de deudas / ventas a plazos",
    feature9: "Seguimiento de ingresos y gastos",
    feature10: "Sistema de comisiones del personal",
    feature11: "Sistema de puntos",
    feature12: "Sistema de tarjetas regalo",
    feature13: "Gestión de productos / stock",
    feature14: "Análisis con IA",
    feature15: "Informes",
  },

  business: {
    meta: {
      title: "Salonor para tu negocio — Software de gestión de salones",
      description:
        "Reservas online, calendario inteligente, comandas, puntos, tarjetas regalo, stock, comisiones y análisis con IA: todo tu salón en un único panel inteligente. Instalación gratuita, en línea en 5 minutos.",
    },

    modules: {
      smartCalendar: "Calendario inteligente",
      onlineBooking: "Reservas online",
      checkoutCashbox: "Comandas y caja",
      loyaltyPoints: "Puntos de fidelidad",
      giftCard: "Tarjeta regalo",
      productStock: "Productos y stock",
      staffCommission: "Comisiones del personal",
      debtTracking: "Seguimiento de deudas",
      smsReminder: "SMS y recordatorios",
      aiAnalysis: "Análisis con IA",
      reports: "Informes",
      reviewReputation: "Reseñas y reputación",
    },

    steps: {
      step1Title: "Contáctanos",
      step1Desc: "Rellena el formulario de contacto; nuestro equipo te responde el mismo día.",
      step1Badge: "Unos minutos",
      step2Title: "Configuramos tu salón",
      step2Desc: "Nosotros preparamos tu equipo, tus servicios y tus horarios.",
      step2Badge: "Gratis para ti",
      step3Title: "Publica y recibe citas",
      step3Desc: "Tu página de salón ya está online; tus clientes pueden reservar al instante.",
      step3Badge: "El mismo día",
    },

    testimonials: {
      quote1:
        "Desde que pasamos a Salonor dejamos de perseguir citas por teléfono. El calendario se llena solo y los clientes están encantados.",
      role1: "Peluquería · Kadıköy",
      quote2:
        "Comandas, caja, comisiones y stock en un solo panel. Las cuentas de fin de mes tardan minutos, se acabaron los cuadernos.",
      role2: "Barbería · Beşiktaş",
      quote3:
        "Gracias a los puntos y las tarjetas regalo, los clientes vuelven. Nuestra tasa de ausencias ha bajado notablemente.",
      role3: "Centro de belleza · Bornova",
    },

    hero: {
      badge: "Salonor Business",
      titleLine1: "Todo tu salón",
      titleHighlight: "en un único panel inteligente",
      subtitle:
        "Desde las reservas online hasta las comandas, desde los puntos hasta el análisis con IA: todo lo que hace crecer tu salón en un solo lugar. Reduce las llamadas, llena los asientos vacíos y cierra los cuadernos.",
      ctaStart: "Empieza ya",
      ctaPackages: "Ver planes",
      proofFreeSetup: "Instalación gratuita",
      proofNoContract: "Sin contrato",
      proofLive: "En línea en 5 minutos",
      notifNewAppt: "Nueva cita · Ayşe K.",
      notifApptDetail: "14:30 · Coloración",
      revenueLabel: "Facturación de hoy",
    },

    stats: {
      selectBusiness: "negocios selectos",
      bookableService: "servicios reservables",
      verifiedReview: "reseñas verificadas",
    },

    modulesSection: {
      kicker: "Una suscripción · sistemas ilimitados",
      heading: "Todo lo necesario para gestionar tu salón",
      descBefore: "Olvídate de los cuadernos desordenados, las llamadas perdidas y las apps por separado. Todos los planes incluyen ",
      descBold: "todos",
      descAfter: " los sistemas siguientes.",
    },

    calendarShowcase: {
      kicker: "Calendario inteligente",
      heading: "Todo tu día, en una sola pantalla",
      descBefore:
        "Con el calendario en color por empleado, ve al instante quién, cuándo y qué servicio realiza. Gracias a la protección contra solapamientos, dos citas",
      descBold: " nunca",
      descAfter: " caen en el mismo asiento.",
      feat1Title: "Protección contra dobles reservas",
      feat1Desc: "Dos clientes no pueden reservar a la misma hora: el sistema lo impide.",
      feat2Title: "Añadir clientes walk-in",
      feat2Desc: "Añade al calendario con un solo toque al cliente que llega sin cita.",
      feat3Title: "Seguimiento de estado",
      feat3Desc: "Confirmada, completada, no presentada: todo claro y en color.",
    },

    bookingShowcase: {
      kicker: "Reservas online",
      heading: "Que tu calendario se llene mientras duermes",
      desc:
        "Tus clientes reservan en segundos, de día y de noche, sin esperar al teléfono. La confirmación y el recordatorio se envían solos; las ausencias bajan y tus asientos no quedan vacíos.",
      feat1: "Confirmación instantánea 24/7",
      feat2: "Recordatorios por SMS y WhatsApp",
      feat3: "Reseñas verificadas",
      feat4: "Conforme al RGPD y seguro",
    },

    comparison: {
      heading: "Deja atrás el método antiguo",
      sub: "¿Caos de cuaderno y teléfono, o un sistema que funciona solo?",
      oldTitle: "Método antiguo",
      old1: "Citas por teléfono, llamadas perdidas",
      old2: "Calendario enredado en el cuaderno, dobles reservas",
      old3: "Citas olvidadas, asientos vacíos",
      old4: "No se sabe a dónde va la facturación",
      old5: "El cliente viene una vez y no vuelve",
      newTitle: "Con Salonor",
      new1: "Reservas online 24/7, cero llamadas perdidas",
      new2: "Calendario en color + protección automática contra solapamientos",
      new3: "Recordatorios automáticos, asientos llenos",
      new4: "Informes en tiempo real de facturación, ocupación y servicios",
      new5: "Clientes que vuelven con puntos y tarjetas regalo",
    },

    testimonialsSection: {
      heading: "¿Qué dicen los dueños de salones?",
    },

    stepsSection: {
      heading: "En línea en 3 pasos",
      sub: "Nosotros nos encargamos de la instalación. Tú solo recibe a tus clientes.",
    },

    finalCta: {
      badge: "La instalación corre de nuestra cuenta",
      heading: "Lleva tu salón a Salonor hoy mismo",
      desc:
        "Instalación gratuita, lista en 5 minutos. Que tus clientes actuales empiecen a reservar online hoy mismo.",
      ctaStart: "Empieza ya",
      ctaPackages: "Ver planes",
      proofNoContract: "Sin contrato",
      proofCancel: "Cancela cuando quieras",
      proofSupport: "Soporte específico para Türkiye",
    },

    calendarMock: {
      windowTitle: "Salonor · Calendario",
      today: "Hoy",
      dayTitle: "Sábado, 14 de junio",
      staffActive: "3 empleados activos",
    },

    walkInErrors: {
      unauthorized: "No autorizado.",
      staffNotFound: "Empleado no encontrado.",
      selectService: "Elige al menos un servicio.",
      servicesNotFound: "No se han encontrado los servicios seleccionados.",
      invalidTime: "Hora no válida.",
      staffServiceMismatch: "Este empleado no realiza todos los servicios seleccionados.",
      invalidPhone: "Introduce un número de móvil válido (05XX XXX XX XX).",
      pastDayEnd: "La cita supera el fin de la jornada (24:00).",
      slotTaken: "El empleado ya tiene otra cita a esa hora.",
      createFailed: "No se ha podido añadir la cita. Inténtalo de nuevo.",
    },

    phoneMock: {
      salonName: "Studio Lumière",
      salonMeta: "4.9 (210) · Nişantaşı",
      svc1Name: "Corte de pelo",
      svc1Dur: "45 min",
      svc1Price: "₺350",
      svc2Name: "Coloración",
      svc2Dur: "90 min",
      svc2Price: "₺900",
      svc3Name: "Cuidado de la piel",
      svc3Dur: "60 min",
      svc3Price: "₺600",
      bookCta: "Reservar cita",
      confirmTitle: "Tu cita está confirmada",
      confirmDate: "14 de junio · 14:30",
      confirmCode: "SLNR-7K2P9",
      waMessage: "Hola Ayşe 👋 Te recordamos tu cita de mañana a las 14:30 💇‍♀️",
      waLabel: "WhatsApp ✓✓",
    },
  },

  auth: {
    login: {
      metaTitle: "Iniciar sesión",
      title: "Bienvenido de nuevo",
      subtitle: "Inicia sesión para gestionar tus citas.",
      demoTitle: "Cuentas de demostración",
      demoCustomer: "Cliente:",
      demoBusiness: "Negocio:",
      demoPassword: "Contraseña (para ambas):",
    },

    fields: {
      email: "Correo electrónico",
      password: "Contraseña",
      name: "Nombre y apellidos",
      phoneOptional: "Teléfono (opcional)",
      businessEmail: "Tu correo profesional",
    },

    placeholders: {
      email: "ejemplo@correo.com",
      password: "••••••••",
      name: "Nombre y apellidos",
      phone: "05xx xxx xx xx",
      passwordMin: "Mínimo 6 caracteres",
      businessEmail: "salon@correo.com",
    },

    loginForm: {
      submit: "Iniciar sesión",
      submitPending: "Iniciando sesión...",
      noAccount: "¿No tienes cuenta?",
      contactUs: "Contáctanos",
      tooManyAttempts: "Has hecho demasiados intentos de inicio de sesión. Por favor, vuelve a intentarlo dentro de unos minutos.",
    },

    registerForm: {
      submit: "Crear cuenta",
      submitPending: "Creando cuenta...",
      haveAccount: "¿Ya tienes cuenta?",
      signIn: "Iniciar sesión",
      consentBefore: "Acepto el tratamiento de mis datos personales conforme al ",
      consentLink: "Aviso de Privacidad (KVKK)",
      consentAfter: ".",
      consentRequired: "Debes aceptar el aviso de privacidad para crear una cuenta.",
    },

    businessForm: {
      submit: "Continuar — configura tu negocio",
      submitPending: "Creando cuenta...",
      termsNotice: "Al continuar, aceptas los Términos de uso.",
    },
  },

  account: {
    // Layout de la cuenta (encabezado superior)
    greeting: "Hola, {name} 👋",
    layoutSubtitle: "Gestiona tus citas y tu cuenta desde aquí.",

    // Navegación por pestañas
    tabs: {
      appointments: "Mis citas",
      favorites: "Mis favoritos",
      profile: "Mi perfil",
    },

    // Títulos de página (metadatos)
    meta: {
      appointments: "Mis citas",
      profile: "Mi perfil",
      favorites: "Mis favoritos",
    },

    // Página de citas
    appointments: {
      statusConfirmed: "Confirmada",
      statusCompleted: "Completada",
      statusCancelled: "Cancelada",
      statusNoShow: "No presentada",
      emptyTitle: "Aún no tienes citas",
      emptyDesc: "Descubre los mejores salones cerca de ti y reserva tu primera cita en segundos.",
      discoverSalons: "Descubrir salones",
      upcomingTitle: "Próximas citas ({n})",
      noUpcoming: "No tienes citas próximas.",
      newAppointment: "Reservar nueva cita →",
      pastTitle: "Pasadas",
      withStaff: "con {name}",
      codeAndTotal: "Código: {code} · {total}",
      rebook: "Reservar de nuevo",
    },

    // Página de favoritos
    favorites: {
      emptyTitle: "Aún no tienes favoritos",
      emptyDesc: "Guarda los salones que te gustan tocando el corazón; aquí te esperarán todos.",
      discoverSalons: "Descubrir salones",
    },

    // Formulario de perfil
    profile: {
      nameLabel: "Nombre y apellidos",
      emailLabel: "Correo electrónico",
      emailHint: "La dirección de correo no se puede cambiar.",
      phoneLabel: "Teléfono",
      phonePlaceholder: "05xx xxx xx xx",
      passwordSectionTitle: "Cambiar contraseña (opcional)",
      currentPasswordLabel: "Contraseña actual",
      newPasswordLabel: "Nueva contraseña",
      updated: "Tu perfil se ha actualizado.",
      save: "Guardar cambios",
    },

    // Botón de cancelar cita
    cancel: {
      cancel: "Cancelar",
      confirm: "¿Estás seguro?",
      cancelling: "Cancelando...",
      yesCancel: "Sí, cancelar",
      dismiss: "No, conservar",
    },

    // Modal de valoración (reseña)
    review: {
      shareOnGoogle: "Compartir en Google",
      rate: "Valorar",
      thanksTitle: "¡Gracias!",
      thanksDesc: "Tu reseña se ha publicado, has ayudado a otros usuarios.",
      alsoGoogleTitle: "¿La compartes también en Google?",
      alsoGoogleDesc: "Tu valoración en Google de {name} también es muy valiosa.",
      rateOnGoogle: "Valorar en Google",
      close: "Cerrar",
      ratingLabel: "Tu valoración",
      starsAria: "{n} estrellas",
      experienceLabel: "Tu experiencia",
      commentPlaceholder: "¿Qué tal el servicio? Orienta a otros usuarios...",
      submitting: "Enviando...",
      submitReview: "Enviar reseña",
    },
  },

  legal: {
    // Componente auxiliar común (info-page.tsx)
    brand: "Salonor",
    lastUpdated: "Última actualización:",

    // Sobre nosotros
    about: {
      metaTitle: "Sobre nosotros",
      title: "Sobre nosotros",
      intro:
        "Salonor es una plataforma de reservas diseñada para Türkiye que te permite reservar tus citas de belleza y cuidado personal en segundos.",
      missionTitle: "Nuestra misión",
      missionBody:
        "Queremos hacer que el acceso a los servicios de peluquería, barbería, spa, uñas y belleza sea fácil, transparente y fiable para todos. Acabamos con la época de perseguir citas por teléfono; reunimos en una sola pantalla la hora disponible, las reseñas reales y los precios claros.",
      customersTitle: "Para los clientes",
      customersBody:
        "Descubre los mejores salones cerca de ti, mira las fotos y las reseñas verificadas, elige la hora que te conviene y reserva tu lugar al instante; además, totalmente gratis.",
      businessesTitle: "Para los negocios",
      businessesBody:
        "Con Salonor Business reúnes en un solo panel la gestión de citas, calendario, personal y servicios; recibe reservas online 24/7, gana confianza con las reseñas y llega a nuevos clientes.",
      valuesTitle: "Nuestros valores",
      valuesBody:
        "Transparencia, rapidez y confianza. Trabajamos para crear un mercado justo y útil en el que ganan tanto los clientes como los negocios.",
    },

    // Privacidad y RGPD
    privacy: {
      metaTitle: "Privacidad y RGPD",
      title: "Texto informativo de Privacidad y RGPD",
      updated: "13 de junio de 2026",
      intro:
        "La seguridad de tus datos personales es importante para nosotros. Este texto resume cómo se tratan tus datos cuando usas Salonor.",
      controllerTitle: "Responsable del tratamiento",
      controllerBody:
        "En el marco de la Ley n.º 6698 de Protección de Datos Personales (KVKK), el responsable del tratamiento es Ferhat Gökel, que opera la plataforma Salonor como persona física / empresa individual. Salonor no es actualmente una sociedad anónima. Puedes enviar tus preguntas y solicitudes relativas a la KVKK a destek@salonor.com.",
      dataTitle: "Datos tratados",
      dataBody:
        "Se tratan los datos de tu cuenta (nombre, correo electrónico, teléfono), tu historial de citas, tus salones favoritos y las reseñas que escribes; además de datos de uso básicos para la calidad del servicio.",
      purposesTitle: "Fines del tratamiento",
      purposesBody:
        "Tratamos tus datos para crear y gestionar tus citas, enviarte recordatorios de citas (SMS/WhatsApp/correo electrónico), garantizar la seguridad de tu cuenta y mejorar la plataforma.",
      sharingTitle: "Compartición",
      sharingBody:
        "Se comparte con el negocio en el que reservas la información necesaria para realizar tu cita. Tus datos no se venden a terceros con fines de marketing.",
      aiTitle: "Tratamiento de datos con inteligencia artificial",
      aiBody:
        "Cuando utilizas la función Asesor de Estilo con IA, la foto que subes y las notas que añades se transfieren a nuestro proveedor de servicios de inteligencia artificial, Google (servidores ubicados en el extranjero), y se tratan allí para generar recomendaciones de estilo. Esta función es totalmente opcional y solo funciona con tu consentimiento explícito; si no das tu consentimiento, tu foto no se envía a ningún lugar. Salonor no conserva las fotos una vez generada la recomendación.",
      rightsTitle: "Tus derechos",
      rightsBody:
        "De acuerdo con el artículo 11 de la KVKK, tienes derecho a acceder, rectificar y suprimir tus datos, así como a oponerte a su tratamiento. Para tus solicitudes, escribe a destek@salonor.com.",
    },

    // Términos de uso
    terms: {
      metaTitle: "Términos de uso",
      title: "Términos de uso",
      updated: "13 de junio de 2026",
      intro: "Al usar Salonor, aceptas los siguientes términos.",
      serviceTitle: "Servicio",
      serviceBody:
        "Salonor es una plataforma de reservas que conecta a los clientes con los negocios de belleza y cuidado personal. Los servicios los prestan los negocios; Salonor actúa como intermediario.",
      accountTitle: "Cuenta",
      accountBody:
        "Eres responsable de la seguridad de tu cuenta y de la veracidad de los datos que facilitas. Los menores de 18 años deben usar la plataforma con el consentimiento de un tutor.",
      bookingsTitle: "Citas y cancelación",
      bookingsBody:
        "Se espera que acudas puntualmente a las citas que reservas. Las normas de cancelación y cambio pueden variar de un negocio a otro; se aplican las condiciones indicadas en la página de la cita.",
      reviewsTitle: "Reseñas",
      reviewsBody:
        "Solo debes compartir reseñas honestas y respetuosas sobre servicios que realmente hayas experimentado. Los insultos, el spam y el contenido engañoso se eliminan.",
      liabilityTitle: "Responsabilidad",
      liabilityBody:
        "La calidad del servicio es responsabilidad del negocio correspondiente. Salonor se esfuerza por mantener la plataforma en funcionamiento continuo, pero pueden producirse incidencias técnicas.",
    },

    // Preguntas frecuentes
    faq: {
      metaTitle: "Ayuda y preguntas frecuentes",
      title: "Ayuda y preguntas frecuentes",
      intro:
        "Aquí encontrarás la respuesta a la mayoría de tus preguntas. Si no la encuentras, destek@salonor.com siempre está disponible.",
      q1: "¿Usar Salonor tiene algún coste?",
      a1: "No. Reservar es totalmente gratis para los clientes; solo pagas el importe del servicio que recibes en el salón.",
      q2: "¿Cómo cancelo mi cita?",
      a2: "Puedes ver y cancelar tu cita desde Mi cuenta → Mis citas. Las condiciones de cancelación pueden variar según el negocio.",
      q3: "¿Recibiré un recordatorio de la cita?",
      a3: "Sí. Cuando tu cita se acerque, recibirás un recordatorio por el canal que hayas elegido (SMS, WhatsApp o correo electrónico).",
      q4: "¿Las reseñas son reales?",
      a4: "Las reseñas las escriben únicamente los clientes que han completado su cita; así, las valoraciones que ves se basan en experiencias reales.",
      q5: "¿Cómo añado mi negocio?",
      a5: "Regístrate gratis desde la página Salonor para tu negocio; con una instalación de 5 minutos puedes poner tu salón en línea.",
    },

    // Contacto
    contact: {
      metaTitle: "Contacto",
      title: "Contacto",
      intro:
        "¿Quieres añadir tu negocio a Salonor? Rellena el formulario de abajo y nuestro equipo se pondrá en contacto contigo.",
      addBusinessTitle: "Añade tu negocio a Salonor",
      addBusinessBody:
        "No importa si es un salón, una peluquería, una barbería, un spa o un centro de belleza: déjanos tus datos, configuramos tu negocio gratis y empieza a recibir reservas online de inmediato.",
      cardSupportTitle: "Atención al cliente",
      cardPartnerTitle: "Colaboración con negocios",
      cardPressTitle: "Prensa y otros",
      hoursTitle: "Horario de atención",
      hoursBody:
        "Nuestro equipo de soporte atiende las solicitudes por escrito de lunes a viernes, de 09:00 a 18:00. Normalmente respondemos el mismo día.",
      businessTitle: "¿Eres un negocio?",
      businessBodyBefore: "Para conocer Salonor Business y añadir tu negocio, puedes escribir a ",
      businessBodyAfter:
        " o empezar ya desde la página de registro.",
    },

    // Formulario de contacto (contact-form.tsx, componente de cliente)
    contactForm: {
      successTitle: "Hemos recibido tu solicitud 🎉",
      successBody:
        "Nuestro equipo se pondrá en contacto contigo lo antes posible para añadir tu negocio a Salonor.",
      nameLabel: "Nombre y apellidos",
      namePlaceholder: "Nombre y apellidos",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "ejemplo@correo.com",
      phoneLabel: "Teléfono",
      phonePlaceholder: "05xx xxx xx xx",
      messageLabel: "Sobre tu negocio (opcional)",
      messagePlaceholder: "Cuéntanos brevemente el nombre de tu salón, la ciudad y los servicios...",
      pendingText: "Enviando...",
      submit: "Enviar solicitud",
      disclaimer: "Tus datos solo se usan para ponernos en contacto contigo.",
      consentBefore: "Acepto el tratamiento de mis datos personales conforme al ",
      consentLink: "Aviso de Privacidad (KVKK)",
      consentAfter: " y que se pongan en contacto conmigo.",
      consentRequired: "Debes aceptar el aviso de privacidad para continuar.",
    },

    distanceSales: {
      metaTitle: "Contrato de Venta a Distancia",
      title: "Contrato de Venta a Distancia",
      updated: "23 de junio de 2026",
      intro:
        "Este contrato regula los derechos y obligaciones de las partes en relación con la venta en línea de los paquetes de pago de Salonor Business, de conformidad con la Ley de Protección al Consumidor de Türkiye n.º 6502 y el Reglamento sobre Contratos a Distancia.",
      partiesTitle: "1. Partes",
      partiesBody:
        "VENDEDOR: Ferhat Gökel, que opera la plataforma Salonor como persona física / empresa individual. Consulta el Formulario de Información Previa y la página de Contacto para los datos de contacto y dirección. COMPRADOR: el negocio/usuario que adquiere un paquete de Salonor Business.",
      subjectTitle: "2. Objeto del contrato",
      subjectBody:
        "El objeto del contrato es la venta y entrega de la suscripción al software Salonor Business (paquete Inicial, Profesional o Empresarial) pedida electrónicamente por el Comprador, cuyas características y precio de venta se indican en la página de Precios.",
      productTitle: "3. Servicio y precio",
      productBody:
        "El servicio es un software por suscripción que abarca citas, calendario, caja, SMS, informes y otras funciones del panel según el paquete elegido. Los precios de los paquetes, el período de facturación (mensual/anual) y los impuestos aplicables se muestran actualizados en la página de Precios. Los precios no incluyen IVA.",
      paymentTitle: "4. Pago",
      paymentBody:
        "El pago se cobra según el paquete elegido y el período de facturación. Se requiere el pago para que comience la suscripción; tu cuenta la configura nuestro equipo y tus datos de acceso se te envían.",
      deliveryTitle: "5. Entrega / cumplimiento",
      deliveryBody:
        "El servicio es digital; una vez aprobado el pago se configura tu cuenta y se habilita el acceso al panel. Las excepciones al derecho de desistimiento para servicios digitales prestados de inmediato se explican en la Política de Derecho de Desistimiento y Reembolso.",
      withdrawalTitle: "6. Derecho de desistimiento",
      withdrawalBody:
        "El Comprador dispone del derecho de desistimiento de 14 días previsto por la ley. Consulta la página Política de Derecho de Desistimiento y Reembolso para el ejercicio, las excepciones y el proceso de reembolso.",
      disputeTitle: "7. Resolución de conflictos",
      disputeBody:
        "Para los conflictos derivados de este contrato, son competentes los Comités de Arbitraje del Consumidor y los Tribunales del Consumidor dentro de los límites monetarios correspondientes. Para reclamaciones y solicitudes: destek@salonor.com.",
    },

    preInfo: {
      metaTitle: "Formulario de Información Previa",
      title: "Formulario de Información Previa",
      updated: "23 de junio de 2026",
      intro:
        "Este formulario contiene los asuntos sobre los que debes ser informado antes de adquirir los paquetes de pago de Salonor Business, de conformidad con la Ley n.º 6502 y el Reglamento sobre Contratos a Distancia.",
      sellerTitle: "Información del vendedor",
      sellerBody:
        "El vendedor es Ferhat Gökel, que opera la plataforma Salonor como persona física / empresa individual (no una sociedad anónima). Para la dirección completa y los datos fiscales/de contacto rigen los valores actuales del registro company-info; para consultas: destek@salonor.com e isletme@salonor.com.",
      productTitle: "Características esenciales del servicio",
      productBody:
        "El servicio es el software por suscripción Salonor Business para la gestión de citas y del negocio. Las funciones incluidas en los paquetes (Inicial, Profesional, Empresarial) se detallan en la página de Precios.",
      priceTitle: "Precio y pago",
      priceBody:
        "El precio total (impuestos incluidos/excluidos), el período de facturación y la forma de pago se muestran en la pantalla de pedido y en la página de Precios. Los precios no incluyen IVA. La suscripción se renueva según el período elegido.",
      deliveryTitle: "Cumplimiento y duración",
      deliveryBody:
        "El servicio es digital y el acceso se habilita tras la confirmación del pago mediante la configuración de tu cuenta. La duración de la suscripción se determina según el período mensual o anual que elijas.",
      withdrawalTitle: "Derecho de desistimiento",
      withdrawalBody:
        "Tu derecho de desistimiento de 14 días y sus excepciones para los servicios digitales se explican en la página Política de Derecho de Desistimiento y Reembolso. Puedes enviar tu aviso de desistimiento a destek@salonor.com.",
      complaintTitle: "Reclamaciones y solicitudes",
      complaintBody:
        "Puedes enviar tus solicitudes y reclamaciones a destek@salonor.com; para conflictos no resueltos puedes acudir al Comité de Arbitraje del Consumidor o al Tribunal del Consumidor según los límites monetarios legales.",
    },

    withdrawal: {
      metaTitle: "Política de Derecho de Desistimiento y Reembolso",
      title: "Política de Derecho de Desistimiento y Reembolso",
      updated: "23 de junio de 2026",
      intro:
        "Tu derecho de desistimiento y las condiciones de reembolso para los paquetes de pago de Salonor Business se explican a continuación.",
      rightTitle: "Plazo de desistimiento",
      rightBody:
        "En los contratos a distancia, tienes derecho a desistir del contrato en un plazo de 14 días desde la fecha de compra sin necesidad de justificar motivo alguno y sin pagar penalización.",
      howTitle: "Ejercicio del derecho de desistimiento",
      howBody:
        "Para ejercer tu derecho de desistimiento, basta con enviar un aviso claro a destek@salonor.com en un plazo de 14 días. Indica en tu aviso los datos de tu cuenta/negocio y tu solicitud de desistimiento.",
      exceptionTitle: "Excepción al derecho de desistimiento (servicio digital)",
      exceptionBody:
        "Conforme a la legislación, el derecho de desistimiento puede no aplicarse a contenidos/servicios digitales cuya ejecución haya comenzado con el consentimiento del consumidor antes de que expire el plazo de desistimiento y que se presten de inmediato. Por ello, cuando tu cuenta haya sido configurada y se haya habilitado el acceso al panel (iniciada la ejecución), el derecho de desistimiento puede quedar limitado; esto se presenta por separado para tu aprobación durante la compra.",
      refundTitle: "Proceso de reembolso",
      refundBody:
        "Ante una solicitud de desistimiento válida, el importe que has pagado se reembolsa en un plazo de 14 días desde que nos llega tu aviso de desistimiento, con el mismo método de pago que utilizaste y sin coste adicional.",
      contactTitle: "Contacto",
      contactBody:
        "Puedes escribir a destek@salonor.com para tus solicitudes de desistimiento y reembolso.",
    },

    cookies: {
      metaTitle: "Política de Cookies",
      title: "Política de Cookies",
      updated: "23 de junio de 2026",
      intro:
        "Esta política explica qué cookies y tecnologías similares utilizamos cuando usas Salonor y cómo puedes gestionar tus preferencias.",
      whatTitle: "¿Qué es una cookie?",
      whatBody:
        "Las cookies son pequeños archivos de texto que los sitios que visitas almacenan en tu dispositivo. Se utilizan para recordar tus preferencias y mejorar el sitio.",
      typesTitle: "Cookies que utilizamos",
      typesBody:
        "Cookies esenciales: necesarias para funciones básicas como la sesión y la preferencia de idioma (p. ej. la cookie salonor_locale que almacena tu preferencia de idioma y la cookie salonor_cookie_consent que almacena tu consentimiento de cookies). Estas cookies están siempre activas. Cookies analíticas: se usa Vercel Analytics para medir el tráfico y mejorar la experiencia, y solo se cargan si aceptas el consentimiento de cookies.",
      analyticsTitle: "Analítica y terceros",
      analyticsBody:
        "Utilizamos el servicio Vercel Analytics para entender el tráfico del sitio. Las cookies analíticas no se ejecutan a menos que hagas clic en «Aceptar» en el banner de cookies de la parte inferior del sitio; puedes rechazarlas con la opción «Solo esenciales».",
      manageTitle: "Gestionar tus preferencias",
      manageBody:
        "Puedes definir tu preferencia de cookies desde el banner de cookies de la parte inferior del sitio; además, puedes eliminar o bloquear cookies desde la configuración de tu navegador. Bloquear las cookies esenciales puede afectar a algunas funciones del sitio.",
      contactTitle: "Contacto",
      contactBody:
        "Puedes enviar tus preguntas sobre cookies a destek@salonor.com.",
    },
  },

  panelCore: {
    // Sidebar — títulos de sección
    navDailyTitle: "Día a día",
    navSalesTitle: "Ventas y finanzas",
    navCatalogTitle: "Catálogo",
    navMarketingTitle: "Marketing",
    navCustomerTitle: "Clientes",
    navToolsTitle: "Herramientas y ajustes",

    // Sidebar — etiquetas de menú
    navOverview: "Resumen",
    navCalendar: "Calendario",
    navNotifications: "Notificaciones",
    navCashbox: "Caja y comandas",
    navDebts: "Deudas y plazos",
    navReports: "Informes",
    navExpenses: "Gastos",
    navServices: "Servicios",
    navStaff: "Personal",
    navCommission: "Comisiones y rendimiento",
    navPackages: "Paquetes",
    navProducts: "Productos y stock",
    navCampaigns: "Campañas",
    navGiftCard: "Tarjeta regalo",
    navLoyalty: "Puntos",
    navSms: "SMS",
    navMessaging: "Mensajería",
    navCustomers: "Clientes",
    navLostCustomers: "Clientes perdidos",
    navReviews: "Reseñas",
    navAiAnalysis: "Análisis con IA",
    navTodos: "Tareas pendientes",
    navSettings: "Ajustes",

    // Sidebar — acciones / etiquetas inferiores
    businessLabel: "Negocio",
    viewMyPage: "Ver mi página",
    logout: "Cerrar sesión",
    loggingOut: "Cerrando sesión...",
    menu: "Menú",
    close: "Cerrar",

    // Panel (Resumen)
    dashboardTitle: "Resumen",
    goToCalendar: "Ir al calendario",
    statTodayAppts: "Citas de hoy",
    statTodayRevenue: "Facturación de hoy",
    statWeekRevenue: "Facturación de 7 días",
    statRating: "Valoración",
    todaySchedule: "Agenda de hoy",
    calendar: "Calendario",
    noApptsToday: "No hay citas para hoy",
    noApptsTodayDesc: "Puedes añadir citas manualmente desde el calendario.",
    noShowTag: "No presentado",
    last7Days: "Últimos 7 días",
    summary: "Resumen",
    nextAppt: "Próxima cita",
    upcomingAppts: "Próximas citas",
    totalReviews: "Total de reseñas",
    activeStaff: "Personal activo",

    // Calendario (CalendarBoard)
    calendarTitle: "Calendario",
    newAppt: "Cita",
    prevDay: "Día anterior",
    nextDay: "Día siguiente",
    today: "Hoy",
    noStaffTitle: "Aún no hay personal",
    noStaffDesc: "Para usar el calendario, primero debes añadir a tu equipo.",
    addStaff: "Añadir personal",
    closedNotice: "Este día aparece como cerrado en tu horario de atención, pero igualmente puedes añadir una cita.",

    // Calendario — leyenda
    legendConfirmed: "Confirmada",
    legendCompleted: "Completada",
    legendNoShow: "No presentada",

    // Modal de nueva cita
    newApptTitle: "Nueva cita",
    staffField: "Personal",
    startField: "Inicio",
    customerNameField: "Nombre del cliente",
    customerNamePlaceholder: "P. ej. Ayşe K. (puede dejarse vacío)",
    phoneField: "Teléfono (para el recordatorio)",
    phonePlaceholder: "05XX XXX XX XX (opcional)",
    pickFromContacts: "Elegir de contactos",
    pickedNoMobile: "El contacto seleccionado no tiene un número móvil válido.",
    servicesField: "Servicios",
    selectAtLeastOneService: "Elige al menos un servicio.",
    overflowsDay: "Esta cita supera el fin de la jornada ({end}).",
    cancel: "Cancelar",
    adding: "Añadiendo...",
    addAppt: "Añadir cita",

    // Modal de detalle de cita
    statusConfirmed: "Confirmada",
    statusCompleted: "Completada",
    statusNoShow: "No presentada",
    statusCancelled: "Cancelada",
    withStaff: "con {staff}",
    noteLabel: "Nota:",
    markCompleted: "Marcar como completada",
    markNoShow: "Marcar como no presentada",
    cancelAppt: "Cancelar cita",
    apptStatusInfo: "Esta cita está en estado {status}.",

    // Página de notificaciones
    notificationsMetaTitle: "Notificaciones",
    notificationsTitle: "Notificaciones",
    notificationsSubtitle:
      "Confirma las nuevas solicitudes de cita y envía recordatorios de las próximas citas",
    reminderInfoReady: "listo y completado",
    reminderInfoMarked: "“Recordado”",
    reminderInfoBefore: "Al pulsar el botón, el mensaje se abre ",
    reminderInfoMiddle:
      " ya redactado en tu app de WhatsApp/SMS; tú lo envías. Lo que envías se marca automáticamente como ",
    reminderInfoAfter:
      " así no escribes dos veces a la misma persona. Sin coste adicional ni configuración.",
    noUpcomingTitle: "No hay citas próximas",
    noUpcomingDesc: "No hay citas confirmadas para los próximos 3 días.",
    reminderMessageBody:
      "Hola {name}, recordatorio de cita de {business}: {date} {time}. ¡Te esperamos! 😊",

    // Nuevas solicitudes de cita (NewBookings)
    newBookingRequests: "Nueva solicitud de cita",
    approveAll: "Confirmar todas",
    approve: "Confirmar",
    approveFailed: "No se ha podido confirmar. Inténtalo de nuevo.",

    // Lista de recordatorios (ReminderList)
    reminderSaveFailed: "No se ha podido guardar la marca, inténtalo de nuevo.",
    remindNow: "Recordar ahora",
    pendingCount: "{n} pendientes",
    upcomingSection: "Próximas (próximos 3 días)",
    noPhone: "Sin teléfono",
    reminded: "Recordado",
    undo: "Deshacer",
    whatsapp: "WhatsApp",
    call: "Llamar",
    sms: "SMS",

    // Etiquetas de respaldo comunes (texto estático mostrado cuando faltan datos de la BD)
    fallbackCustomer: "Cliente",
    fallbackAppt: "Cita",
  },

  panelCatalog: {
    // ── Página de servicios / ServicesManager ──
    services: {
      title: "Servicios",
      subtitle: "{count} servicios · {sections} secciones",
      addSection: "Sección",
      addService: "Añadir servicio",
      addServiceShort: "Servicio",
      emptyTitle: "Aún no hay secciones",
      emptyDesc: 'Para agrupar tus servicios, crea primero una sección (p. ej. "Corte", "Color").',
      addFirstSection: "Añadir la primera sección",
      deleteSectionAria: "Eliminar sección",
      emptySection: "Esta sección aún no tiene servicios.",
      editAria: "Editar",
      deleteAria: "Eliminar",
      confirmDeleteSection: 'Se eliminará la sección "{name}". ¿Estás seguro?',
      confirmDeleteService: 'Se eliminará el servicio "{name}". ¿Estás seguro?',

      // Modal de añadir/editar servicio
      modalEditTitle: "Editar servicio",
      modalNewTitle: "Nuevo servicio",
      sectionLabel: "Sección",
      nameLabel: "Nombre del servicio",
      namePlaceholder: "P. ej. Corte de pelo de mujer",
      descLabel: "Descripción (opcional)",
      descPlaceholder: "P. ej. Incluye análisis capilar + lavado + corte + secado",
      durationLabel: "Duración (min)",
      priceLabel: "Precio (₺)",
      cancel: "Cancelar",
      save: "Guardar",
      add: "Añadir",

      // Modal de añadir sección
      categoryModalTitle: "Nueva sección",
      categoryNameLabel: "Nombre de la sección",
      categoryNamePlaceholder: "P. ej. Corte y peinado",
    },

    // ── Página de personal / StaffManager ──
    staff: {
      title: "Personal",
      subtitle: "{count} empleados activos",
      addStaff: "Añadir personal",
      emptyTitle: "Aún no hay personal",
      emptyDesc: "Añade a tu equipo para poder asignarles las citas.",
      addFirstStaff: "Añadir al primer empleado",
      inactiveBadge: "Inactivo",
      summary: "{services} servicios · {appointments} citas",
      edit: "Editar",
      deactivate: "Desactivar",
      activate: "Activar",
      deleteAria: "Eliminar",
      confirmDeactivate:
        "{name} no se puede eliminar porque tiene citas pasadas. En su lugar se desactivará. ¿Quieres continuar?",
      confirmDelete:
        "{name} se eliminará de forma permanente (incluidas las comisiones y las asignaciones de servicios). Esta acción no se puede deshacer. ¿Estás seguro?",

      // Modal de añadir/editar personal
      modalEditTitle: "Editar empleado",
      modalNewTitle: "Nuevo empleado",
      nameLabel: "Nombre y apellidos",
      namePlaceholder: "P. ej. Elif Aydın",
      titleLabel: "Cargo",
      titlePlaceholder: "P. ej. Especialista en color",
      cancel: "Cancelar",
      save: "Guardar",
      add: "Añadir",
      saving: "Guardando...",

      // Asignación de servicios (servicios que puede realizar el empleado)
      manageServices: "Servicios",
      servicesModalTitle: "{name} — servicios",
      saveServices: "Guardar servicios",
      noServices: "Añade primero un servicio; luego podrás asignarlo al personal.",

      // Límite de personal del plan
      staffLimitReached:
        "En el plan {plan} puedes añadir como máximo {limit} empleados activos. Para más, mejora tu plan.",
    },

    // ── Página de ajustes ──
    settings: {
      title: "Ajustes",
      subtitle: "Gestiona el perfil de tu negocio y tu horario de atención",
      publicPage: "Mi página publicada",
      businessInfo: "Datos del negocio",
      workingHours: "Horario de atención",
      coverTitle: "Foto de portada",
      coverDesc: "Elige la imagen superior de la página de tu salón. (Imágenes de muestra listas para la demo)",
    },

    // ── Formulario del perfil del negocio ──
    profile: {
      nameLabel: "Nombre del negocio",
      descLabel: "Descripción",
      promoLabel: "📣 Campaña / aviso destacado",
      promoPlaceholder: "P. ej. ¡Esta semana, 20% de descuento en coloración!",
      promoUntilLabel: "Fecha de fin (opcional):",
      promoHint:
        "Si lo escribes, aparece como una franja llamativa en la parte superior de la página de tu salón. Si lo dejas vacío, no se muestra. Se oculta automáticamente al pasar la fecha de fin.",
      phoneLabel: "Teléfono",
      phonePlaceholder: "0212 000 00 00",
      whatsappLabel: "Número de WhatsApp",
      whatsappPlaceholder: "05XX XXX XX XX (si está vacío, se usa el teléfono)",
      whatsappHint:
        "El botón \"Escríbenos por WhatsApp\" de la página de tu salón abre este número. Si lo dejas vacío, se usa tu número de teléfono.",
      cityLabel: "Ciudad",
      addressLabel: "Dirección",
      districtLabel: "Distrito",
      mapLabel: "Ubicación en el mapa",
      mapHint: "Tus clientes te encuentran en el mapa. Arrastra el marcador o haz clic en el mapa.",
      placeIdLabel: "Identificador de lugar de Google (Place ID)",
      placeIdPlaceholder: "p. ej. ChIJN1t_tDeuEmsRUsoyG83frY4",
      placeIdHintBefore: "Si lo introduces, los clientes podrán compartir sus reseñas también ",
      placeIdHintGoogle: "en Google",
      placeIdHintMid: " . Puedes encontrar tu Place ID ",
      placeIdHintLink: "aquí",
      placeIdHintAfter: " buscando el nombre de tu negocio. También puedes pegar el enlace completo.",
      saveSuccess: "Los datos de tu negocio se han actualizado.",
      saveButton: "Guardar cambios",
    },

    // ── Editor del horario de atención ──
    hours: {
      closed: "Cerrado",
      open: "Abierto",
      saving: "Guardando...",
      saveButton: "Guardar horario",
      saved: "Guardado",
      invalidError: "Horario no válido: la apertura debe ser antes que el cierre.",
    },

    // ── Selector de foto de portada ──
    cover: {
      optionAlt: "Opción de portada",
    },

    // ── Formularios del catálogo (paquete / campaña / producto / comisión / stock) ──
    catalog: {
      adding: "Añadiendo...",
      saving: "Guardando...",
      deleteAria: "Eliminar",
      editAria: "Editar",
      cancel: "Cancelar",
      saveChanges: "Guardar cambios",
      editProduct: "Editar producto",
      editPackage: "Editar paquete",
      editCampaign: "Editar campaña",
      active: "Activo",
      inactive: "Inactivo",
      decreaseAria: "Reducir",
      increaseAria: "Aumentar",
      saveCommission: "Guardar",
      commissionLabel: "Tasa de comisión (%)",

      // Formulario de paquete
      packageNameLabel: "Nombre del paquete",
      packageNamePlaceholder: "P. ej. 5 sesiones de cuidado facial",
      priceLabel: "Precio (₺)",
      sessionsLabel: "Sesiones",
      daysLabel: "Días",
      descLabel: "Descripción (opcional)",
      addPackage: "Añadir paquete",

      // Formulario de campaña
      codeLabel: "Código de descuento",
      codePlaceholder: "YAZ25",
      discountLabel: "Descuento (%)",
      expiresLabel: "Fecha de fin (opcional)",
      createCampaign: "Crear campaña",
      expiryInPast: "La fecha de fin no puede ser anterior a hoy.",

      // Formulario de producto
      productNameLabel: "Nombre del producto",
      productNamePlaceholder: "P. ej. Champú 500 ml",
      stockLabel: "Stock",
      lowStockLabel: "Umbral bajo",
      addProduct: "Añadir producto",
    },
  },

  panelFinance: {
    // ── Común ──
    noDataYet: "Aún no hay datos.",

    // ── Caja y comandas (kasa/page + kasa-pos) ──
    kasa: {
      metaTitle: "Caja y comandas",
      title: "Caja y comandas",
      subtitle: "Registra ventas rápidas y controla tu caja diaria",
      todayCash: "Caja de hoy",
      todayTxns: "Operaciones de hoy",
      todaySales: "Ventas de hoy",
      noSalesToday: "Aún no hay ventas hoy.",
      defaultCustomer: "Cliente",

      // POS — catálogo
      services: "Servicios",
      products: "Productos",
      noProductsHint: "Aún no hay productos: puedes añadirlos desde Productos y stock.",
      outOfStock: "sin stock",
      stockCount: "stock {n}",
      stockExactNone: '"{name}" no tiene stock.',
      stockLimit: '"{name}" tiene {n} unidades en stock: no se pueden añadir más.',

      // POS — línea manual
      manualLine: "Línea manual",
      descriptionPlaceholder: "Descripción",
      priceTlSymbol: "₺",
      manualHint: "El importe se introduce en TL enteros; puedes editarlo de nuevo en el carrito.",
      unitPriceAria: "Precio unitario",
      perUnit: "₺ / unidad",

      // POS — carrito/comanda
      receipt: "Comanda",
      saleSaved: "Venta guardada ✓ Puedes añadir una nueva comanda.",
      emptyCart: "Añade productos/servicios desde la izquierda.",
      decrease: "Reducir",
      increase: "Aumentar",
      remove: "Quitar",
      customerNamePlaceholder: "Nombre del cliente (opcional)",
      customerPhonePlaceholder: "Teléfono — para acumular puntos (opcional)",
      earnPointsNote: "Esta venta acumula {n} puntos (cada 100 ₺ = 5 puntos).",
      total: "Total",
      saving: "Guardando...",
      charge: "Cobrar",
    },

    // ── Gastos (giderler/page + expenses) ──
    expenses: {
      metaTitle: "Gastos",
      title: "Gastos",
      subtitle: "Seguimiento mensual de gastos y beneficio neto",
      revenueOfMonth: "Facturación de {month}",
      cashSales: "Ventas de caja",
      monthExpense: "Gastos del mes",
      netProfit: "Beneficio neto",
      addExpense: "Añadir gasto",
      expensesOfMonth: "Gastos de {month}",
      emptyTitle: "Este mes no hay gastos",
      emptyDesc: "Añade tu primer gasto con el formulario de la izquierda.",

      // Formulario
      description: "Descripción",
      descriptionPlaceholder: "P. ej. Alquiler mensual",
      category: "Categoría",
      amountWithSymbol: "Importe (₺)",
      date: "Fecha",
      note: "Nota (opcional)",
      notePlaceholder: "Detalle...",
      adding: "Añadiendo...",
      submit: "Añadir gasto",
      deleteConfirm: "¿Eliminar este registro de gasto? Esta acción no se puede deshacer.",
      deleteAria: "Eliminar gasto",
    },

    // ── Deudas y plazos (borclar/page + debt-manager) ──
    debt: {
      metaTitle: "Deudas y plazos — Salonor",
      title: "Deudas y ventas a plazos",
      subtitle: "Controla las cuentas abiertas y cobra los plazos",
      openAccounts: "Cuentas abiertas",
      totalReceivable: "Total por cobrar",
      collected: "Cobrado",

      // Formulario
      newDebt: "Nueva deuda / plazo",
      customerName: "Nombre del cliente",
      phoneOptional: "Teléfono (opcional)",
      amountWithSymbol: "Importe (₺)",
      installment: "Plazo",
      noteOptional: "Nota (opcional)",
      errEnterCustomer: "Introduce el nombre del cliente.",
      errEnterValidAmount: "Introduce un importe válido.",
      saving: "Guardando...",
      addDebtRecord: "Añadir registro de deuda",

      // Lista / fila
      emptyTitle: "No hay cuentas abiertas",
      emptyDesc: "Controla las deudas/ventas a plazos añadiéndolas desde la izquierda.",
      closedAccounts: "Cuentas cerradas",
      installmentCount: "{n} plazos",
      closed: "Cerrada",
      remaining: "restante",
      paidOf: "{paid} / {total} pagado",
      errEnterAmount: "Introduce el importe.",
      collectMax: "Cobro (máximo {n})",
      collect: "Cobrar",
      deleteConfirm: "¿Eliminar este registro de deuda?",
      paymentHistory: "Historial de cobros",
      noPaymentsYet: "Aún no hay cobros.",
    },

    // ── Puntos (para-puan/page + loyalty-manager) ──
    loyalty: {
      metaTitle: "Puntos — Salonor",
      title: "Puntos",
      subtitle: "Puntos de fidelidad de los clientes: gánalos, acumúlalos, canjéalos",
      totalMembers: "Total de miembros",
      circulatingPoints: "Puntos en circulación",
      pointValue: "Valor del punto",
      pointValueHint: "1 punto = 1 ₺",

      // Añadir puntos
      addPoints: "Añadir puntos",
      customerName: "Nombre del cliente",
      phonePlaceholder: "05xx xxx xx xx",
      pointsAmount: "Cantidad de puntos",
      errEnterCustomer: "Introduce el nombre del cliente.",
      errEnterValidPoints: "Introduce un número de puntos válido.",
      adding: "Añadiendo...",
      hint: "Consejo: Si introduces el teléfono del cliente al cobrar en la pantalla de Caja y comandas, la venta acumula puntos automáticamente (cada 100 ₺ = 5 puntos).",

      // Lista de miembros
      searchPlaceholder: "Buscar por nombre o teléfono",
      emptyNoMembers: "Aún no hay clientes con puntos",
      emptyNoMatch: "No hay clientes coincidentes",
      emptyDesc: "Empieza añadiendo el primer punto desde la izquierda.",
      points: "puntos",
      spend: "Canjear",
      errEnterQuantity: "Introduce la cantidad.",
      redeemMax: "Máximo {n}",
      use: "Usar",
    },

    // ── Tarjeta regalo (hediye-ceki/page + giftcard-manager) ──
    giftcard: {
      metaTitle: "Tarjeta regalo — Salonor",
      title: "Tarjeta regalo",
      subtitle: "Crea tarjetas regalo, entrega el código y úsalas en las ventas",
      activeCards: "Tarjetas activas",
      unusedBalance: "Saldo sin usar",
      totalIssued: "Total emitido",

      // Formulario
      newGiftcard: "Nueva tarjeta regalo",
      amountWithSymbol: "Importe (₺)",
      amountPlaceholder: "p. ej. 500",
      buyerPlaceholder: "Comprador (opcional)",
      recipientPlaceholder: "Destinatario (opcional)",
      expiryOptional: "Caducidad (opcional)",
      errEnterValidAmount: "Introduce un importe válido.",
      creating: "Creando...",
      createCard: "Crear tarjeta",

      // Lista / tarjeta
      emptyTitle: "Aún no hay tarjetas regalo",
      emptyDesc: "Crea tu primera tarjeta desde la izquierda y entrega el código a tu cliente.",
      copyCode: "Copiar código",
      depleted: "Agotada",
      active: "Activa",
      passive: "Inactiva",
      balanceOf: "/ {total} de saldo",
      buyerLabel: "Comprador: {name}. ",
      recipientLabel: "Regalo: {name}. ",
      expiryLabel: "Caduca: {date}",
      errEnterQuantity: "Introduce la cantidad.",
      redeemMax: "Máximo {n}",
      use: "Usar",
      deactivate: "Desactivar",
      activate: "Activar",
      deduct: "Descontar",
    },

    // ── Comisiones y rendimiento (prim/page) ──
    commission: {
      metaTitle: "Comisiones y rendimiento",
      title: "Comisiones y rendimiento",
      subtitle: "Últimos 30 días: facturación del personal y cálculo de comisiones",
      revenue30d: "Facturación de 30 días",
      commissionDue: "Comisión a pagar",
      emptyTitle: "No hay personal activo",
      emptyDesc: "Primero añade a tu equipo desde la sección Personal.",
      colStaff: "Personal",
      colAppointment: "Citas",
      colRevenue30d: "Facturación (30 d)",
      colCommissionPct: "Comisión %",
      colCommissionAmount: "Importe de comisión",
      footnote:
        'Introduce el porcentaje de comisión y pulsa "Guardar": el importe se calcula automáticamente según la facturación de los últimos 30 días del empleado.',
    },

    // ── Informes (raporlar/page) ──
    reports: {
      metaTitle: "Informes",
      title: "Informes",
      subtitle: "Rendimiento de los últimos 30 días",
      revenue30d: "Facturación de 30 días",
      cashSales: "Ventas de caja",
      appointment: "Citas",
      avgTicket: "Ticket medio",
      completed: "Completadas",
      dailyRevenueTitle: "Facturación diaria · últimos 14 días",
      topServicesTitle: "Servicios más rentables",
      timesUsed: "{n} veces",
      staffPerformanceTitle: "Rendimiento del personal",
      appointmentCount: "{n} citas",
      busyDaysTitle: "Días de mayor afluencia de la semana",
      appointmentStatusTitle: "Estados de las citas",
      statusCompleted: "Completadas",
      statusConfirmedPending: "Confirmadas (pendientes)",
      statusCancelled: "Canceladas",
      statusNoShow: "No presentadas",
    },

    // ── Productos y stock (urunler/page) ──
    products: {
      metaTitle: "Productos y stock",
      title: "Productos y stock",
      subtitle: "Seguimiento de productos de venta y stock",
      productTypes: "Tipos de producto",
      lowStock: "Stock bajo",
      stockValue: "Valor del stock",
      addProduct: "Añadir producto",
      productsCount: "Productos",
      emptyTitle: "Aún no hay productos",
      emptyDesc: "Añade tu primer producto con el formulario de la izquierda.",
      lowStockBadge: "· ¡stock bajo!",
    },

    // ── Paquetes (paketler/page) ──
    packages: {
      metaTitle: "Paquetes",
      title: "Paquetes",
      subtitle: "Paquetes de sesiones y membresías: genera ingresos recurrentes",
      addPackage: "Añadir paquete",
      packagesCount: "Paquetes",
      emptyTitle: "Aún no hay paquetes",
      emptyDesc: "Crea tu primer paquete con el formulario de la izquierda.",
      sessionsValidity: "{sessions} sesiones · válido {days} días",
    },
  },

  panelOther: {
    // === Página de clientes ===
    customers: {
      title: "Clientes",
      subtitle: "{n} clientes",
      // CustomersTable
      emptyTitle: "Aún no tienes clientes",
      emptyDesc: "A medida que lleguen las citas, tus clientes aparecerán aquí.",
      searchPlaceholder: "Buscar por nombre, teléfono o correo",
      sortLastVisit: "Última visita",
      sortVisits: "Número de visitas",
      sortSpend: "Gasto",
      noMatch: "No se encontró ningún cliente que coincida con “{q}”.",
      colCustomer: "Cliente",
      colContact: "Contacto",
      colVisit: "Visitas",
      colCompleted: "Completadas",
      colNoShow: "No presentadas",
      colSpend: "Gasto",
      colLastVisit: "Última visita",
      salonCustomer: "Cliente del salón",
      visitsLabel: "{n} visitas",
      completedLabel: "{n} completadas",
      noShowLabel: "{n} no presentadas",
    },

    // === Página de reseñas ===
    reviews: {
      title: "Reseñas",
      subtitle: "{count} reseñas · {unanswered} sin responder",
      adminHidden: "Ocultada por el administrador",
      emptyTitle: "Aún no hay reseñas",
      emptyDesc: "Tras las citas completadas, las reseñas de tus clientes aparecerán aquí.",
      // ReviewReply
      repliedSuffix: "respondió",
      edit: "Editar",
      reply: "Responder",
      replyPlaceholder: "Escribe una respuesta amable al cliente...",
      cancel: "Cancelar",
      sending: "Enviando...",
      saveReply: "Guardar respuesta",
      // DeleteReviewButton / ReportReviewButton
      deleteConfirm: "¿Seguro que quieres eliminar esta reseña? Esta acción no se puede deshacer.",
      deleteAria: "Eliminar reseña",
      delete: "Eliminar",
      reported: "Denunciada",
      reportConfirm: "¿Denunciar esta reseña al administrador? La reseña no se elimina, solo se marca para revisión.",
      reportAria: "Denunciar reseña",
      report: "Denunciar",
    },

    // === Página de SMS ===
    sms: {
      title: "SMS",
      subtitle: "Mensajes de confirmación de citas e información masiva",
      creditBalance: "Saldo de créditos",
      mockTitle: "Modo de prueba (mock)",
      mockDesc:
        "Aún no se ha definido la clave del proveedor de SMS. Los envíos descuentan créditos y se registran en el historial, pero no se entrega ningún SMS real. Para el envío real, añade los datos del proveedor a las variables de entorno (Netgsm: ",
      mockDescEnd: ").",
      historyTitle: "Historial de envíos",
      historyEmpty: "Aún no se ha enviado ningún SMS.",
      colNumber: "Número",
      colMessage: "Mensaje",
      colKind: "Tipo",
      colStatus: "Estado",
      colDate: "Fecha",
      // KIND_TR
      kindManual: "Manual",
      kindConfirm: "Confirmación de cita",
      kindReminder: "Recordatorio",
      kindBulk: "Masivo",
      // StatusBadge
      statusSent: "Enviado",
      statusMock: "Prueba",
      statusFailed: "Fallido",
      statusQueued: "En cola",
      // SmsSender
      messageTitle: "Mensaje",
      messagePlaceholder: "P. ej. ¡En {business} tienes esta semana un 15% de descuento especial para ti!",
      charsCredits: "{chars} caracteres · {credits} créditos/SMS",
      charsLeft: "quedan {n}",
      template: "Plantilla {n}",
      extraNumbersLabel: "Números adicionales (separa con coma o espacio)",
      extraNumbersPlaceholder: "0532..., 0505...",
      invalidNumbers: "{n} números no válidos, no se enviarán: ",
      recipientCount: "{n} destinatarios",
      totalCredits: "Total {n} créditos",
      sending: "Enviando...",
      send: "Enviar",
      contactsTitle: "Clientes ({n})",
      deselect: "Quitar selección",
      selectAll: "Seleccionar todos",
      searchPlaceholder: "Buscar por nombre / teléfono",
      contactsEmpty: "A medida que se creen clientes con teléfono, aparecerán aquí.",
      errorEmptyBody: "Escribe el texto del mensaje.",
      errorNoRecipient: "Selecciona al menos un destinatario válido o introduce un número.",
      errorInsufficient: "Créditos insuficientes. Necesarios: {needed}, disponibles: {have}.",
      resultSent: "{sent} enviados",
      resultFailed: ", {failed} fallidos",
      fallbackCustomer: "Cliente",
      // Mensajes de error de la acción de servidor (sendBulkSmsAction)
      errorUnauthorized: "No autorizado.",
      errorBodyEmpty: "Escribe el texto del mensaje.",
      errorBodyTooLong: "El mensaje es demasiado largo (máximo 500 caracteres).",
      errorNoValidNumber: "Introduce al menos un número válido.",
      errorInsufficientCredits: "Créditos insuficientes.",
      // Templates
      templateText1: "Estimado cliente, esta semana te espera un 15% de descuento en todos los servicios. Contáctanos para reservar tu cita.",
      templateText2: "Te recordamos tu cita. Estaremos encantados de recibirte en nuestro salón.",
      templateText3: "¡Sé el primero en enterarte de nuestros nuevos servicios y campañas!",
    },

    // === Página de mensajería ===
    messaging: {
      title: "Mensajería",
      subtitle: "Envía a tus clientes recordatorios y novedades de sus citas: multicanal",
      introBadge: "Notificaciones multicanal",
      introTitle: "Llega a tu cliente por el canal adecuado",
      introDesc:
        "Salonor reúne dos canales: WhatsApp gratis hoy y SMS automático cuando tengas tu empresa dada de alta. Usa ambos para no perder ninguna cita.",
      statusActive: "Activo",
      statusLocked: "Se activa con tu empresa",
      statusTest: "Modo de prueba",
      waName: "WhatsApp",
      waTagline: "Gratis · envío manual · listo ya",
      waDesc:
        "Envía recordatorios de cita y mensajes de recuperación a clientes perdidos con un solo toque, gratis y desde tu propio teléfono. Sin ninguna configuración.",
      waPoint1: "Coste cero, sin créditos",
      waPoint2: "Alta tasa de apertura",
      waPoint3: "Comparte imágenes y enlaces",
      waNumberLabel: "Número de WhatsApp del salón",
      waNumberMissing: "No has definido un número específico: se usa tu número de teléfono",
      waNumberSet: "Definir / cambiar",
      waCtaReminders: "Ir a recordatorios",
      waCtaLost: "Recuperar clientes perdidos",
      waPublicNote:
        "También hemos añadido un botón en la página de tu salón para que los clientes puedan contactarte por WhatsApp.",
      smsName: "SMS",
      smsTagline: "Automático · funciona en cualquier teléfono",
      smsDesc:
        "Envía confirmaciones de cita y novedades masivas por SMS. No requiere app y llega a cualquier teléfono.",
      smsPoint1: "Envío totalmente automático",
      smsPoint2: "Sin app: llega a cualquier teléfono",
      smsPoint3: "Nombre de remitente profesional",
      smsCreditLabel: "Saldo de créditos",
      smsCta: "Ir al panel de SMS",
      smsLockedNote:
        "Enviar SMS requiere una empresa registrada y el registro en IYS (Sistema de Gestión de Mensajes). En cuanto des de alta tu empresa e introduzcas los datos del proveedor, este canal se activa automáticamente.",
      smsTestNote:
        "Actualmente en modo de prueba: puedes probar el flujo, se descuentan créditos pero no se entrega ningún SMS real.",
      compareTitle: "¿Qué canal y cuándo?",
      compareCol: "Característica",
      rowCost: "Coste",
      rowCostWa: "Gratis",
      rowCostSms: "Por crédito",
      rowSetup: "Configuración",
      rowSetupWa: "Listo",
      rowSetupSms: "Empresa + IYS",
      rowAuto: "Envío",
      rowAutoWa: "Manual",
      rowAutoSms: "Automático",
      rowReach: "Alcance",
      rowReachWa: "Clientes con WhatsApp",
      rowReachSms: "Cualquier teléfono",
      roadmapTitle: "Camino recomendado",
      recommendedBadge: "Recomendado",
      roadmapNowTitle: "Ahora: WhatsApp",
      roadmapNowDesc:
        "Empieza con coste cero. Envía recordatorios por WhatsApp y aumenta la satisfacción de tus clientes desde ya.",
      roadmapNextTitle: "Más adelante: SMS",
      roadmapNextDesc:
        "Cuando lleguen los ingresos y tengas tu empresa dada de alta, activa el SMS para que los recordatorios sean automáticos y se acabe el trabajo manual.",
    },

    // === Página de tareas pendientes ===
    todos: {
      title: "Lista de tareas pendientes",
      subtitle: "Tareas y recordatorios diarios de tu negocio",
      statOpen: "Tareas pendientes",
      statDone: "Completadas",
      addTitle: "Añadir tarea",
      listTitle: "Tareas ({n})",
      emptyTitle: "Aún no hay tareas",
      emptyDesc: "Añade tu primera tarea con el formulario de la izquierda.",
      overduePrefix: "Vencida · ",
      // Etiquetas de prioridad
      priorityHigh: "Alta",
      priorityNormal: "Normal",
      priorityLow: "Baja",
      // TodoForm
      taskLabel: "Tarea",
      taskPlaceholder: "P. ej. Llamar al proveedor",
      priorityLabel: "Prioridad",
      dueDateLabel: "Fecha límite",
      adding: "Añadiendo...",
      addButton: "Añadir tarea",
      // TodoToggle
      undo: "Deshacer",
      markDone: "Marcar como completada",
      deleteAria: "Eliminar tarea",
      clearDone: "Limpiar completadas ({n})",
    },

    // === Página de campañas ===
    campaigns: {
      title: "Campañas",
      subtitle: "Atrae nuevos clientes con códigos de descuento",
      createTitle: "Crear campaña",
      listTitle: "Campañas ({n})",
      emptyTitle: "Aún no hay campañas",
      emptyDesc: "Crea tu primer código de descuento con el formulario de la izquierda.",
      expired: "Caducada",
      usedCount: "Usada {n} veces",
      endedOn: " · terminó el {date}",
      endsOn: " · termina el {date}",
      noExpiry: " · sin caducidad",
    },

    // === Página de análisis con IA ===
    ai: {
      title: "Análisis con IA",
      subtitle: "Información y recomendaciones extraídas automáticamente de los datos de tu negocio",
      smartBadge: "Análisis inteligente",
      collectingTitle: "Recopilando datos para el análisis",
      collectingDesc:
        "A medida que se acumulen citas y ventas, aquí aparecerán la tendencia de ingresos, la afluencia, el rendimiento del personal y recomendaciones a tu medida.",
      metricRevenue: "Ingresos de 30 días",
      metricRevenueSub: "{pct}% respecto al periodo anterior",
      metricBusiest: "Hora de mayor afluencia",
      metricBusiestSub: "alrededor de las {time}",
      metricAvgTicket: "Ticket medio",
      metricAvgTicketSub: "por operación",
      metricAtRisk: "Clientes en riesgo",
      metricAtRiskSub: "sin venir desde hace 30+ días",
      none: "—",
      topServicesTitle: "Servicios más rentables",
      notEnoughData: "No hay datos suficientes.",
      transactions: "{n} operaciones",
      staffPerfTitle: "Rendimiento del personal (60 días)",
      staffCompleted: "{n} citas completadas",
      // Componente AiInsights
      insightsTitle: "Recomendaciones a tu medida",
      geminiBadge: "Gemini AI",
      refresh: "Actualizar",
      analyzing: "La inteligencia artificial está analizando los datos de tu negocio…",
      aiUnavailable:
        "La IA no está disponible temporalmente ({reason}): se muestran recomendaciones basadas en reglas.",
      aiNotConfigured:
        "El análisis con IA no está configurado: se muestran recomendaciones basadas en reglas.",
      // Mensajes de error de businessInsightsAction
      errorUnauthorized: "No autorizado.",
      errorTooFrequent: "Se ha actualizado demasiado a menudo, vuelve a intentarlo en un momento.",
      errorNoData: "No hay datos suficientes.",
      errorNoSuggestion: "No se han podido generar recomendaciones.",
      errorInsightsFailed: "No se han podido obtener las recomendaciones de IA.",
      // Textos de recomendación basados en reglas (motor de insights)
      tipRevenueDown: "Los ingresos han caído un {pct}% en los últimos 30 días. ",
      tipRevenueDownAtRisk: "{n} clientes llevan tiempo sin venir: envía una campaña por SMS.",
      tipRevenueDownLoyal: "Plantéate una campaña especial para tus clientes fieles.",
      tipRevenueUp: "Los ingresos están al alza ({pct}%). Para mantener el impulso, céntrate en los servicios más rentables.",
      tipBusiestHour: "La hora de mayor afluencia es alrededor de las {time}. Planifica personal adicional en esas horas para reducir el tiempo de espera.",
      tipQuietDays: "Reparte la demanda a lo largo de la semana con descuentos especiales en los días tranquilos; equilibra la carga de los días con más afluencia.",
      tipAtRisk: "Tienes {n} clientes en riesgo (sin venir desde hace 30+ días). Recupéralos con Puntos + SMS.",
      tipLowStock: "{n} productos con stock crítico: {names}. Es hora de hacer pedido.",
      tipNoShow: "La tasa de ausencias es alta ({pct}%). Puedes reducir las ausencias con un SMS de confirmación de cita.",
      tipTopService: "“{name}” es tu servicio más rentable. Aumenta su valor con un paquete o una venta adicional (upsell).",
      tipNoData: "A medida que se acumulen datos, aquí verás recomendaciones inteligentes a la medida de tu negocio. Sigue registrando citas y ventas.",
    },

    // === Página de clientes perdidos ===
    lost: {
      title: "Clientes perdidos",
      subtitle: "Clientes sin venir desde hace {days}+ días: recupéralos por WhatsApp",
      fallbackCustomer: "Cliente del salón",
      emptyTitle: "¡Genial, no tienes clientes perdidos!",
      emptyDesc: "Todos tus clientes han pasado en los últimos {days} días. ¡Sigue así!",
      waMessage:
        "Hola {name}, ¡en {business} te echamos de menos! 💜 Estaremos encantados de recibirte de nuevo; tenemos una oferta especial para ti, te esperamos para reservar tu cita.",
      lastVisit: "Última visita: {date} · ",
      daysAgo: "hace {n} días",
      visits: "{n} visitas",
      recover: "Recuperar",
      noPhone: "Sin teléfono",
    },
  },

  onboarding: {
    metaTitle: "Configuración del negocio",

    // Encabezado superior (saludo)
    greeting: "Hola, {name} 👋",

    // Etiquetas del indicador de pasos
    steps: {
      business: "Negocio",
      category: "Categoría",
      location: "Ubicación",
      hours: "Horario",
      services: "Servicios",
    },

    // Paso 1: Negocio
    step1: {
      title: "Vamos a presentar tu negocio",
      subtitle: "¿Cómo te verán tus clientes?",
      nameLabel: "Nombre del negocio",
      namePlaceholder: "P. ej. Nova Saç Atölyesi",
      phoneLabel: "Teléfono",
      phonePlaceholder: "0212 000 00 00",
      descLabel: "Descripción breve (opcional)",
      descPlaceholder: "Describe tu salón en unas pocas frases...",
    },

    // Paso 2: Categoría
    step2: {
      title: "¿En qué te especializas?",
      subtitle: "Elige la categoría que mejor encaje con tu negocio.",
    },

    // Paso 3: Ubicación
    step3: {
      title: "¿Dónde estás?",
      subtitle: "Para que tus clientes te encuentren en el mapa.",
      cityLabel: "Ciudad",
      districtLabel: "Distrito",
      districtPlaceholder: "P. ej. Kadıköy",
      addressLabel: "Dirección completa",
      addressPlaceholder: "Barrio, calle, número",
    },

    // Paso 4: Horario
    step4: {
      title: "Tu horario de atención",
      subtitle: "Indica las horas y los días en que estás abierto.",
      openLabel: "Apertura",
      closeLabel: "Cierre",
      closedDaysLabel: "Días cerrados",
      hoursHint: "Los días que no marques como cerrados estarás abierto de {open} a {close}.",
    },

    // Paso 5: Servicios
    step5: {
      title: "Tus primeros servicios",
      subtitle: "Añade algunos servicios; luego podrás cambiarlos cuanto quieras desde el panel.",
      servicePlaceholder: "Nombre del servicio",
      minUnit: "min",
      priceUnit: "₺",
      removeService: "Quitar",
      addService: "Añadir servicio",
    },

    // Navegación
    back: "Atrás",
    creating: "Creando...",
    publish: "Publicar mi negocio",
    continue: "Continuar",

    // Mapa (LocationPicker)
    mapHint: "Ajusta tu ubicación haciendo clic en el mapa o arrastrando el marcador.",
  },

  admin: {
    // Título de página (metadata)
    metaTitle: "Administración",

    // Error de acción común (aviso en línea cuando una acción de servidor falla)
    actionFailed: "Acción fallida. Inténtalo de nuevo.",

    // Layout (barra superior)
    consoleBadge: "Consola de la plataforma",
    refresh: "Actualizar",
    refreshAria: "Actualizar",
    backToSite: "Volver al sitio",
    logout: "Salir",

    // Título del resumen
    overviewTitle: "Resumen",
    overviewSubtitle: "Todos los negocios y usuarios en una sola pantalla.",

    // Tarjetas de estadísticas
    statBusiness: "Negocios",
    statBusinessSub: "{active} activos · {suspended} suspendidos",
    statUser: "Usuarios",
    statAppointment: "Citas",
    statRevenue: "Facturación total",

    // Etiquetas de rol
    roleCustomer: "Cliente",
    roleOwner: "Negocio",
    roleAdmin: "Administrador",

    // Tabla de negocios
    businessesTitle: "Negocios",
    businessesShowing: "mostrando los {shown} más recientes / {total}",
    colBusiness: "Negocio",
    colOwner: "Propietario",
    colPlanCredits: "Plan y créditos",
    colAppointment: "Citas",
    colRevenue: "Facturación",
    colFeatured: "Destacado",
    colStatus: "Estado",
    colAction: "Acción",
    emptyBusinesses: "Aún no hay negocios. Empieza con el botón",
    emptyBusinessesCta: "Crear nuevo negocio",
    emptyBusinessesEnd: "de arriba a la derecha.",
    incompleteProfile: "Perfil incompleto",
    incompleteProfileTitle: "Falta el teléfono, la dirección o la descripción",
    view: "Ver",

    // Últimos registros
    recentTitle: "Últimos registros",

    // CreateBusiness (modal)
    createButton: "Crear nuevo negocio",
    createdTitle: "Negocio creado",
    createTitle: "Crear nuevo negocio",
    close: "Cerrar",
    createdNote: "El negocio ya está publicado en el escaparate. El propietario puede entrar con los siguientes datos y personalizarlo.",
    loginEmail: "Correo de acceso",
    tempPassword: "Contraseña temporal",
    viewStorefront: "Ver escaparate",
    ok: "Aceptar",
    nameLabel: "Nombre del negocio",
    namePlaceholder: "Glow Studio",
    ownerNameLabel: "Nombre del propietario (opcional)",
    ownerNamePlaceholder: "Nombre y apellidos",
    emailLabel: "Correo de acceso",
    emailPlaceholder: "isletme@ornek.com",
    passwordLabel: "Contraseña temporal",
    planLabel: "Plan",
    submit: "Crear negocio",
    createHint: "El negocio aparece automáticamente en el escaparate (negocios).",

    // PlanControl
    creditAmountAria: "Cantidad de créditos",
    addCreditsTitle: "Añadir {amount} créditos",
    removeCreditsTitle: "Restar {amount} créditos",
    planUpdateError: "No se ha podido actualizar el plan. Inténtalo de nuevo.",
    creditUpdateError: "No se han podido actualizar los créditos. Inténtalo de nuevo.",

    // ActiveToggle
    suspend: "Suspender",
    activate: "Activar",
    activeUpdateError: "No se ha podido actualizar el estado. Inténtalo de nuevo.",

    // FeaturedToggle
    featuredOn: "Destacado",
    featuredOff: "Destacar",
    featuredUpdateError: "No se ha podido actualizar. Inténtalo de nuevo.",

    // DeleteBusiness
    deleteConfirm:
      "El negocio \"{name}\" y TODOS sus registros (citas, reseñas, ventas, cuenta del propietario) se eliminarán de forma permanente. Esta acción no se puede deshacer. ¿Quieres continuar?",
    deleteError: "No se ha podido eliminar el negocio. Inténtalo de nuevo.",
    deleteTitle: "Eliminar negocio",

    // ContactRequests
    contactTitle: "Solicitudes de negocios",
    contactNewBadge: "{n} nuevas",
    contactEmpty: "Aún no ha llegado ninguna solicitud de colaboración.",
    contactHandled: "Contactado",
    contactNew: "Nueva",
    contactUndo: "Deshacer",
    contactMarkHandled: "Contactado",
    contactDeleteConfirm: "¿Seguro que quieres eliminar esta solicitud?",
    contactDeleteAria: "Eliminar",

    // ReviewModeration
    reviewTitle: "Moderación de reseñas",
    reviewReportedBadge: "{n} denuncias pendientes",
    reviewEmpty: "Aún no hay reseñas.",
    reviewShow: "Mostrar",
    reviewHide: "Ocultar",
    reviewDeleteConfirm: "¿Eliminar la reseña de forma permanente? Esta acción no se puede deshacer.",
    reviewDeleteAria: "Eliminar",
    reviewReported: "Denunciada",
    reviewHidden: "Oculta",
  },

  consent: {
    message:
      "Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. Las cookies necesarias están siempre activas; tú decides si aceptas las cookies de análisis.",
    accept: "Aceptar",
    reject: "Solo las necesarias",
    learnMore: "Más información",
  },
};
