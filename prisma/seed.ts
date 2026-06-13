import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { todayStr, addDaysStr } from "../src/lib/datetime";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
const avatar = (n: number) => `https://i.pravatar.cc/300?img=${n}`;

// Doğrulanmış Unsplash görsel havuzları (HEAD istekleriyle test edildi)
const POOLS: Record<string, string[]> = {
  hair: [
    "1560066984-138dadb4c035", "1522337660859-02fbefca4702", "1562322140-8baeececf3df",
    "1633681926022-84c23e8cb2d6", "1580618672591-eb180b1a973f", "1595476108010-b4d1f102b1b1",
    "1559599101-f09722fb4948", "1600948836101-f9ffda59d250", "1633681138600-295fcd688876",
    "1487412947147-5cebf100ffc2", "1470259078422-826894b933aa", "1580587771525-78b9dba3b914",
  ],
  barber: [
    "1503951914875-452162b0f3f1", "1521590832167-7bcbfaa6381f", "1599351431202-1e0f0137899a",
    "1622286342621-4bd786c2447c", "1605497788044-5a32c7078486", "1585747860715-2ba37e788b70",
    "1622287162716-f311baa1a2b8", "1593702275687-f8b402bf1fb5", "1552693673-1bf958298935",
    "1526045478516-99145907023c",
  ],
  nails: [
    "1604654894610-df63bc536371", "1610992015732-2449b76344bc", "1632345031435-8727f6897d53",
    "1607779097040-26e80aa78e66", "1519014816548-bf5fe059798b",
  ],
  spa: [
    "1544161515-4ab6ce6db874", "1540555700478-4be289fbecef", "1600334129128-685c5582fd35",
    "1519823551278-64ac92734fb1", "1596178065887-1198b6148b2b", "1571019613454-1cb2f99b2d8b",
    "1583416750470-965b2707b355", "1515377905703-c4788e51af15", "1556228720-195a672e8a03",
  ],
  beauty: [
    "1487412720507-e7ab37603c6f", "1522335789203-aabd1fc54bc9", "1512496015851-a90fb38ba796",
    "1457972729786-0411a3b2b626", "1596462502278-27bfdc403348", "1503236823255-94609f598e71",
    "1521017432531-fbd92d768814", "1559339352-11d035aa65de",
  ],
  skin: [
    "1570172619644-dfd03ed5d881", "1616394584738-fc6e612e71b9", "1612817288484-6f916006741a",
    "1598440947619-2c35fc9aa908",
  ],
};

function gallery(pool: string, offset: number, count = 5): string[] {
  const ids = POOLS[pool];
  return Array.from({ length: count }, (_, i) => img(ids[(offset + i) % ids.length]));
}

type ServiceSpec = [name: string, durationMin: number, priceTl: number, description?: string];
type BizSpec = {
  slug: string;
  name: string;
  pool: string;
  poolOffset: number;
  categorySlug: string;
  description: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  featured: boolean;
  // [haftaiçi açılış, kapanış, pazartesi kapalı mı]
  hours: [open: number, close: number, mondayClosed: boolean];
  staff: [name: string, title: string, avatarN: number][];
  menu: { category: string; services: ServiceSpec[] }[];
};

const BUSINESSES: BizSpec[] = [
  {
    slug: "nova-sac-atolyesi", name: "Nova Saç Atölyesi", pool: "hair", poolOffset: 0,
    categorySlug: "kuafor",
    description:
      "Moda'nın kalbinde, doğal ışık alan ferah bir atölyede kişiye özel saç tasarımı. Renk uzmanlığı ve keratin bakımlarıyla Kadıköy'ün en sevilen salonlarından.",
    phone: "0216 418 23 67", address: "Caferağa Mah. Moda Cad. No:48", district: "Kadıköy", city: "İstanbul",
    lat: 40.9874, lng: 29.0273, featured: true, hours: [600, 1200, true],
    staff: [
      ["Elif Aydın", "Kurucu & Renk Uzmanı", 47],
      ["Deniz Koçak", "Saç Tasarımcısı", 12],
      ["Selin Yurt", "Stilist", 45],
      ["Mert Acar", "Stilist", 14],
    ],
    menu: [
      { category: "Kesim & Şekillendirme", services: [
        ["Kadın Saç Kesimi", 60, 850, "Yıkama, kesim ve fön dahil"],
        ["Erkek Saç Kesimi", 45, 500],
        ["Fön", 45, 450],
        ["Maşa / Dalgalı Şekillendirme", 60, 650],
      ]},
      { category: "Renk & İşlem", services: [
        ["Komple Boya", 120, 2200, "Tek renk uygulama, bakım köpüğü dahil"],
        ["Balyaj / Ombre", 180, 3800, "Kişiye özel renk tasarımı"],
        ["Dip Boya", 90, 1500],
        ["Keratin Bakım", 120, 2800],
      ]},
      { category: "Bakım Ritüelleri", services: [
        ["Saç Botoksu", 90, 1900],
        ["Derin Nem Terapisi", 60, 950],
      ]},
    ],
  },
  {
    slug: "barbers-club-moda", name: "Barber's Club Moda", pool: "barber", poolOffset: 0,
    categorySlug: "berber",
    description:
      "Klasik berberlik geleneğini modern dokunuşlarla buluşturan, sıcak havlu ve ustura ritüelleriyle tanınan Moda'nın köklü erkek bakım kulübü.",
    phone: "0216 346 90 12", address: "Moda Bostanı Sok. No:7", district: "Kadıköy", city: "İstanbul",
    lat: 40.9831, lng: 29.0301, featured: true, hours: [540, 1260, false],
    staff: [
      ["Hakan Demirel", "Usta Berber", 53],
      ["Emre Sözen", "Berber", 56],
      ["Burak Kaplan", "Berber", 59],
    ],
    menu: [
      { category: "Saç & Sakal", services: [
        ["Saç Kesimi", 45, 450, "Yıkama ve şekillendirme dahil"],
        ["Sakal Tıraşı & Şekillendirme", 30, 280, "Sıcak havlu ritüeli ile"],
        ["Saç + Sakal Paketi", 75, 650],
        ["Çocuk Tıraşı (12 yaş altı)", 30, 300],
      ]},
      { category: "Bakım", services: [
        ["Yüz Cilt Bakımı", 40, 480],
        ["Siyah Maske", 25, 300],
        ["Ağda (Yanak/Burun/Kulak)", 20, 220],
      ]},
    ],
  },
  {
    slug: "maison-lumiere", name: "Maison Lumière Beauty", pool: "beauty", poolOffset: 0,
    categorySlug: "makyaj",
    description:
      "Nişantaşı'nda butik bir güzellik evi. Gelin makyajından kirpik tasarımına, ödüllü ekibiyle özel günleriniz için kusursuz hazırlık.",
    phone: "0212 233 41 78", address: "Teşvikiye Mah. Akkavak Sok. No:19", district: "Şişli", city: "İstanbul",
    lat: 41.0494, lng: 28.9938, featured: true, hours: [600, 1230, true],
    staff: [
      ["Yasemin Ekin", "Makyaj Artisti", 31],
      ["İrem Soylu", "Makyaj Artisti", 24],
      ["Naz Korkmaz", "Kirpik & Kaş Uzmanı", 26],
    ],
    menu: [
      { category: "Makyaj", services: [
        ["Gündüz Makyajı", 45, 900],
        ["Gece / Davet Makyajı", 60, 1400],
        ["Gelin Makyajı", 120, 5500, "Prova dahil, kalıcı ürünlerle"],
        ["Nişan / Söz Makyajı", 90, 3200],
      ]},
      { category: "Kirpik & Kaş", services: [
        ["Kirpik Lifting", 60, 950],
        ["İpek Kirpik", 90, 1600],
        ["Kaş Tasarımı & Boyama", 40, 450],
      ]},
    ],
  },
  {
    slug: "the-nail-room", name: "The Nail Room", pool: "nails", poolOffset: 0,
    categorySlug: "tirnak",
    description:
      "Beşiktaş'ın en titiz tırnak stüdyosu. Steril ekipman, geniş renk arşivi ve trend nail art tasarımlarıyla manikürün adresi.",
    phone: "0212 259 36 54", address: "Sinanpaşa Mah. Ihlamurdere Cad. No:82", district: "Beşiktaş", city: "İstanbul",
    lat: 41.0438, lng: 29.0061, featured: true, hours: [600, 1200, false],
    staff: [
      ["Gizem Polat", "Nail Artist", 25],
      ["Ceren Aksu", "Nail Artist", 29],
      ["Melis Doğan", "Manikürist", 32],
    ],
    menu: [
      { category: "Manikür & Pedikür", services: [
        ["Klasik Manikür", 45, 420],
        ["Klasik Pedikür", 60, 520],
        ["Manikür + Pedikür", 100, 850],
        ["SPA Pedikür", 75, 750, "Peeling ve masaj dahil"],
      ]},
      { category: "Kalıcı Oje & Protez", services: [
        ["Kalıcı Oje", 60, 680],
        ["Protez Tırnak (Jel)", 120, 1500],
        ["Dolgu", 90, 950],
        ["Nail Art (tırnak başı)", 15, 120],
      ]},
    ],
  },
  {
    slug: "zen-garden-spa", name: "Zen Garden Spa", pool: "spa", poolOffset: 0,
    categorySlug: "spa-masaj",
    description:
      "Etiler'de şehrin gürültüsünden uzak bir nefes. Uzakdoğu masaj teknikleri, aromaterapi ve hamam ritüelleriyle bütünsel yenilenme.",
    phone: "0212 287 65 09", address: "Etiler Mah. Nispetiye Cad. No:101", district: "Beşiktaş", city: "İstanbul",
    lat: 41.0807, lng: 29.0341, featured: true, hours: [600, 1320, false],
    staff: [
      ["Aylin Kara", "Spa Terapisti", 20],
      ["Jale Öz", "Masaj Terapisti", 16],
      ["Tuna Erkin", "Masaj Terapisti", 60],
      ["Sevgi Akın", "Aromaterapist", 41],
    ],
    menu: [
      { category: "Masajlar", services: [
        ["Klasik İsveç Masajı", 60, 1300],
        ["Aromaterapi Masajı", 75, 1600],
        ["Sıcak Taş Masajı", 90, 1950],
        ["Derin Doku Masajı", 60, 1500],
        ["Bali Masajı", 90, 2100],
      ]},
      { category: "Ritüeller", services: [
        ["Hamam Ritüeli", 120, 2400, "Kese, köpük ve yağ masajı"],
        ["Çift Masajı (2 kişi)", 75, 3400],
      ]},
    ],
  },
  {
    slug: "glow-studio", name: "Glow Studio Cilt Bakımı", pool: "skin", poolOffset: 0,
    categorySlug: "cilt-bakimi",
    description:
      "Bağdat Caddesi'nde medikal estetik yaklaşımıyla cilt bakımı. Cilt analizi sonrası kişiselleştirilmiş protokoller uygulanır.",
    phone: "0216 360 21 44", address: "Caddebostan Mah. Bağdat Cad. No:312", district: "Kadıköy", city: "İstanbul",
    lat: 40.9641, lng: 29.0617, featured: false, hours: [600, 1170, true],
    staff: [
      ["Pınar Üstün", "Estetisyen", 21],
      ["Eda Çelik", "Estetisyen", 38],
    ],
    menu: [
      { category: "Yüz Bakımları", services: [
        ["Klasik Cilt Bakımı", 60, 950],
        ["Hydrafacial", 75, 1900],
        ["Leke Karşıtı Bakım", 60, 1400],
        ["Akne Bakımı", 75, 1250],
        ["Altın Maske Bakımı", 90, 2200],
      ]},
    ],
  },
  {
    slug: "efe-berber", name: "Efe Berber Dükkanı", pool: "barber", poolOffset: 4,
    categorySlug: "berber",
    description:
      "Üsküdar'da üç kuşaktır hizmet veren mahalle berberi. Samimi sohbet, usta makas — babadan oğula geçen zanaat.",
    phone: "0216 553 18 90", address: "Mimar Sinan Mah. Çavuşdere Cad. No:23", district: "Üsküdar", city: "İstanbul",
    lat: 41.0247, lng: 29.0223, featured: false, hours: [540, 1230, false],
    staff: [
      ["Efe Yıldırım", "Usta Berber", 51],
      ["Kerem Yıldırım", "Kalfa", 68],
    ],
    menu: [
      { category: "Tıraş", services: [
        ["Saç Kesimi", 40, 350],
        ["Sakal", 25, 200],
        ["Saç + Sakal", 60, 500],
        ["Ustura Tıraşı", 30, 300],
      ]},
    ],
  },
  {
    slug: "pure-skin-lab", name: "Pure Skin Lab", pool: "skin", poolOffset: 2,
    categorySlug: "epilasyon",
    description:
      "Levent'te son teknoloji buz başlıklı lazer cihazlarıyla ağrısız epilasyon. Tüm cilt tiplerine uygun, uzman kadro eşliğinde.",
    phone: "0212 280 47 31", address: "Levent Mah. Çarşı Cad. No:12", district: "Beşiktaş", city: "İstanbul",
    lat: 41.0784, lng: 29.0125, featured: false, hours: [600, 1200, true],
    staff: [
      ["Şule Erdem", "Lazer Uzmanı", 23],
      ["Berna Tan", "Lazer Uzmanı", 35],
    ],
    menu: [
      { category: "Lazer Epilasyon", services: [
        ["Tüm Vücut (Kadın)", 90, 2600],
        ["Bacak Komple", 45, 950],
        ["Kol Komple", 30, 650],
        ["Yüz Bölgesi", 20, 400],
        ["Erkek Sırt + Omuz", 40, 850],
      ]},
    ],
  },
  {
    slug: "atolye-kas", name: "Atölye Kaş", pool: "beauty", poolOffset: 4,
    categorySlug: "kas-kirpik",
    description:
      "Moda'da yalnızca kaş ve kirpiğe odaklanan butik stüdyo. Yüz hatlarınıza göre altın oran analiziyle kaş tasarımı.",
    phone: "0216 700 52 16", address: "Caferağa Mah. Sakız Sok. No:11", district: "Kadıköy", city: "İstanbul",
    lat: 40.9858, lng: 29.0252, featured: false, hours: [630, 1170, true],
    staff: [
      ["Derya Mutlu", "Kaş Tasarım Uzmanı", 27],
      ["Aslı Genç", "Kirpik Uzmanı", 44],
    ],
    menu: [
      { category: "Kaş & Kirpik", services: [
        ["Kaş Tasarımı (İp/Cımbız)", 30, 380],
        ["Microblading", 120, 3200, "Kalıcı kaş kontürü, 1 retuş dahil"],
        ["Kaş Laminasyonu", 45, 750],
        ["Kirpik Lifting + Boyama", 60, 900],
        ["İpek Kirpik Uygulaması", 90, 1500],
      ]},
    ],
  },
  {
    slug: "studio-aura", name: "Studio Aura Saç Tasarım", pool: "hair", poolOffset: 4,
    categorySlug: "kuafor",
    description:
      "Çankaya'nın ödüllü saç stüdyosu. Renk değişimlerinde ücretsiz ön danışmanlık, organik boya seçenekleri ve usta ekip.",
    phone: "0312 440 87 23", address: "Aziziye Mah. Hoşdere Cad. No:155", district: "Çankaya", city: "Ankara",
    lat: 39.8916, lng: 32.8568, featured: true, hours: [600, 1200, true],
    staff: [
      ["Volkan Sezer", "Kurucu Stilist", 13],
      ["Gamze Ata", "Renk Uzmanı", 40],
      ["Buse Kaya", "Stilist", 49],
    ],
    menu: [
      { category: "Kesim & Fön", services: [
        ["Kadın Saç Kesimi", 60, 700],
        ["Fön", 40, 380],
        ["Gelin Saçı", 120, 3500, "Prova dahil"],
      ]},
      { category: "Renk", services: [
        ["Komple Boya", 120, 1900],
        ["Balyaj", 180, 3200],
        ["Röfle", 150, 2600],
      ]},
    ],
  },
  {
    slug: "gentlemens-corner", name: "Gentlemen's Corner", pool: "barber", poolOffset: 7,
    categorySlug: "berber",
    description:
      "Kızılay'ın merkezinde modern erkek bakım salonu. Randevulu çalışır, bekletmez; espresso ikramı bizden.",
    phone: "0312 418 64 02", address: "Kızılay Mah. Atatürk Bulvarı No:97", district: "Çankaya", city: "Ankara",
    lat: 39.9185, lng: 32.8543, featured: false, hours: [540, 1260, false],
    staff: [
      ["Onur Başak", "Usta Berber", 55],
      ["Tolga Şen", "Berber", 61],
      ["Çağrı Ak", "Berber", 64],
    ],
    menu: [
      { category: "Saç & Sakal", services: [
        ["Saç Kesimi", 45, 400],
        ["Sakal Şekillendirme", 30, 250],
        ["Saç + Sakal + Bakım", 90, 750, "Yüz maskesi dahil"],
      ]},
      { category: "Ekstra", services: [
        ["Keratin Düzleştirme (Erkek)", 90, 1200],
        ["Kaş Alımı", 15, 120],
      ]},
    ],
  },
  {
    slug: "bloom-beauty", name: "Bloom Beauty Lounge", pool: "beauty", poolOffset: 2,
    categorySlug: "makyaj",
    description:
      "Çayyolu'nda ferah bir güzellik salonu. Makyaj, kirpik ve cilt bakımını tek çatı altında toplayan kadınlara özel mekân.",
    phone: "0312 235 90 47", address: "Alacaatlı Mah. 4814. Cad. No:6", district: "Çankaya", city: "Ankara",
    lat: 39.8731, lng: 32.6913, featured: false, hours: [600, 1170, true],
    staff: [
      ["Hande Yüce", "Makyaj Artisti", 30],
      ["Nil Arslan", "Güzellik Uzmanı", 33],
    ],
    menu: [
      { category: "Makyaj & Bakım", services: [
        ["Gündüz Makyajı", 45, 700],
        ["Gece Makyajı", 60, 1100],
        ["Cilt Bakımı", 60, 800],
        ["Kirpik Lifting", 60, 800],
      ]},
    ],
  },
  {
    slug: "riva-hair", name: "Riva Hair Studio", pool: "hair", poolOffset: 8,
    categorySlug: "kuafor",
    description:
      "Alsancak'ta deniz esintili, enerjik bir stüdyo. Kısa saç kesimleri ve cesur renk değişimleriyle İzmir'in trend salonu.",
    phone: "0232 463 75 18", address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:140", district: "Konak", city: "İzmir",
    lat: 38.4382, lng: 27.1442, featured: true, hours: [600, 1200, true],
    staff: [
      ["Rüya Tekin", "Kurucu & Stilist", 36],
      ["Cem Uçar", "Saç Tasarımcısı", 15],
      ["Lara Demir", "Renk Uzmanı", 42],
    ],
    menu: [
      { category: "Kesim", services: [
        ["Kadın Saç Kesimi", 60, 650],
        ["Pixie / Kısa Kesim Tasarımı", 75, 900],
        ["Fön", 40, 350],
      ]},
      { category: "Renk", services: [
        ["Komple Boya", 120, 1800],
        ["Renk Açma + Tonlama", 200, 3600],
      ]},
    ],
  },
  {
    slug: "marin-spa", name: "Marin Spa & Wellness", pool: "spa", poolOffset: 4,
    categorySlug: "spa-masaj",
    description:
      "Karşıyaka sahiline birkaç adım mesafede huzur dolu bir kaçamak. Yosun terapilerinden klasik masaja geniş menü.",
    phone: "0232 364 28 73", address: "Bostanlı Mah. Cemal Gürsel Cad. No:214", district: "Karşıyaka", city: "İzmir",
    lat: 38.4554, lng: 27.0982, featured: false, hours: [600, 1290, false],
    staff: [
      ["Meltem Sarp", "Spa Terapisti", 19],
      ["Okan Güler", "Masaj Terapisti", 62],
    ],
    menu: [
      { category: "Masaj & Terapi", services: [
        ["Klasik Masaj", 60, 1100],
        ["Aromaterapi", 75, 1400],
        ["Refleksoloji", 45, 850],
        ["Yosun Vücut Bakımı", 90, 1800],
      ]},
    ],
  },
];

const CATEGORIES = [
  { slug: "kuafor", name: "Kuaför", emoji: "💇‍♀️", image: img(POOLS.hair[0], 800) },
  { slug: "berber", name: "Berber", emoji: "💈", image: img(POOLS.barber[0], 800) },
  { slug: "tirnak", name: "Tırnak & Manikür", emoji: "💅", image: img(POOLS.nails[0], 800) },
  { slug: "cilt-bakimi", name: "Cilt Bakımı", emoji: "✨", image: img(POOLS.skin[0], 800) },
  { slug: "spa-masaj", name: "Spa & Masaj", emoji: "🌿", image: img(POOLS.spa[0], 800) },
  { slug: "makyaj", name: "Makyaj", emoji: "💄", image: img(POOLS.beauty[0], 800) },
  { slug: "epilasyon", name: "Epilasyon", emoji: "🔆", image: img(POOLS.skin[2], 800) },
  { slug: "kas-kirpik", name: "Kaş & Kirpik", emoji: "👁️", image: img(POOLS.beauty[4], 800) },
];

const REVIEWERS: [name: string, avatarN: number][] = [
  ["Zeynep Arslan", 5], ["Ahmet Kurt", 11], ["Elvan Şahin", 9], ["Murat Özdemir", 52],
  ["Seda Yılmaz", 16], ["Can Erdoğan", 57], ["Büşra Aktaş", 43], ["Oğuz Karaca", 66],
  ["İpek Duman", 28], ["Furkan Çetin", 67], ["Nazlı Güneş", 46], ["Berk Tunç", 58],
  ["Esra Koç", 34], ["Yiğit Avcı", 63], ["Melike Öztürk", 39], ["Sinan Çolak", 69],
];

const COMMENTS: [rating: number, comment: string][] = [
  [5, "Harika bir deneyimdi, tam istediğim gibi oldu. Ekip çok ilgili ve güler yüzlü."],
  [5, "Uzun zamandır gittiğim en iyi salon. Hijyen konusunda gerçekten titizler."],
  [5, "Randevuma dakikası dakikasına alındım, hiç bekletilmedim. Sonuç mükemmel!"],
  [4, "Genel olarak çok memnun kaldım, fiyatlar biraz yüksek ama kalite buna değer."],
  [5, "Arkadaşımın tavsiyesiyle geldim, iyi ki gelmişim. Artık sürekli müşterisiyim."],
  [5, "İlgi ve alaka on numara. İçerisi çok ferah ve temiz, kahveleri de güzeldi."],
  [4, "Sonuçtan memnunum. Hafta sonu biraz kalabalık oluyor, randevuyu erken almak lazım."],
  [5, "Yaptıkları işi gerçekten önemsiyorlar. Detaylara gösterdikleri özen belli oluyor."],
  [5, "Beklentimin çok üzerindeydi. Herkese gönül rahatlığıyla tavsiye ederim."],
  [4, "Personel çok profesyonel. Park yeri bulmak biraz zor, onun dışında kusursuz."],
  [5, "Aylardır düzenli geliyorum, kaliteleri hiç düşmedi. Emin ellerdesiniz."],
  [3, "Fena değildi ama beklediğim kadar da iyi değildi. Belki yoğun bir güne denk geldim."],
  [5, "Özel günüm için hazırlandım, herkes fotoğraflardaki halime bayıldı. Teşekkürler!"],
  [5, "Salon çok şık dekore edilmiş, insanın içi açılıyor. İşçilik de bir o kadar iyi."],
  [4, "Randevu sistemi çok pratik, telefonla uğraşmadan iki dakikada hallettim."],
  [5, "Fiyat/performans açısından bölgedeki en iyisi. Güvenle gidebilirsiniz."],
  [5, "Ne istediğimi tam anlattım, birebir uyguladılar. İletişimleri çok iyi."],
  [4, "Temizlik ve düzen çok iyiydi. Müzik biraz yüksekti, onun dışında harika."],
  [5, "Buranın müdavimi oldum. Her seferinde aynı kalite, aynı güler yüz."],
  [5, "Tavsiye üzerine geldim ve hiç pişman olmadım. Sonuç tam istediğim gibi."],
  [3, "Ortalama bir deneyimdi. İşçilik iyi ama randevum 15 dakika geç başladı."],
  [5, "Yılların tecrübesi her detayda hissediliyor. Kesinlikle 5 yıldızı hak ediyorlar."],
  [4, "Çok memnun kaldım, tek eksik kapıda biraz bekletilmem oldu. Telafi ettiler."],
  [5, "Buradan çıkınca insanın özgüveni yerine geliyor. Ellerinize sağlık!"],
];

const REPLIES = [
  "Değerli yorumunuz için çok teşekkür ederiz! Sizi yeniden ağırlamaktan mutluluk duyarız. 💜",
  "Güzel sözleriniz için teşekkürler, tekrar bekleriz!",
  "Geri bildiriminiz bizim için çok kıymetli. İlginiz için teşekkür ederiz.",
  "Memnuniyetiniz en büyük motivasyonumuz. Teşekkürler, yine bekleriz!",
];

// Basit deterministik sözde-rastgele üreteç (her seed çalışmasında aynı veri)
let _seed = 42;
function rand(): number {
  _seed = (_seed * 16807) % 2147483647;
  return (_seed - 1) / 2147483646;
}
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

const usedCodes = new Set<string>();
function code(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVYZ23456789";
  let c = "";
  do {
    c = "SLNR-" + Array.from({ length: 6 }, () => chars[Math.floor(rand() * chars.length)]).join("");
  } while (usedCodes.has(c));
  usedCodes.add(c);
  return c;
}

async function main() {
  console.log("Mevcut veriler temizleniyor...");
  await db.appointmentItem.deleteMany();
  await db.review.deleteMany();
  await db.favorite.deleteMany();
  await db.appointment.deleteMany();
  await db.staffService.deleteMany();
  await db.service.deleteMany();
  await db.serviceCategory.deleteMany();
  await db.staff.deleteMany();
  await db.workingHour.deleteMany();
  await db.businessImage.deleteMany();
  await db.business.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash("salonor123", 10);

  console.log("Kategoriler oluşturuluyor...");
  const categories = new Map<string, string>();
  for (const c of CATEGORIES) {
    const created = await db.category.create({ data: c });
    categories.set(c.slug, created.id);
  }

  console.log("Kullanıcılar oluşturuluyor...");
  const demoCustomer = await db.user.create({
    data: {
      name: "Ferhat Gökel", email: "musteri@salonor.com", phone: "0532 111 22 33",
      passwordHash, role: "CUSTOMER", image: avatar(8),
    },
  });

  const reviewers: { id: string; name: string }[] = [];
  for (let i = 0; i < REVIEWERS.length; i++) {
    const [name, av] = REVIEWERS[i];
    const u = await db.user.create({
      data: {
        name, email: `yorumcu${i + 1}@salonor.com`, passwordHash,
        role: "CUSTOMER", image: avatar(av),
      },
    });
    reviewers.push({ id: u.id, name: u.name });
  }

  console.log("İşletmeler oluşturuluyor...");
  const bizRecords: {
    id: string; slug: string; name: string;
    staffIds: string[]; serviceList: { id: string; name: string; durationMin: number; priceTl: number }[];
  }[] = [];

  for (let bi = 0; bi < BUSINESSES.length; bi++) {
    const spec = BUSINESSES[bi];
    const ownerEmail = bi === 0 ? "isletme@salonor.com" : `sahip${bi + 1}@salonor.com`;
    const owner = await db.user.create({
      data: {
        name: spec.staff[0][0], email: ownerEmail, passwordHash, role: "OWNER",
        image: avatar(spec.staff[0][2]),
      },
    });

    const images = gallery(spec.pool, spec.poolOffset);
    const [open, close, mondayClosed] = spec.hours;

    const biz = await db.business.create({
      data: {
        slug: spec.slug, name: spec.name, description: spec.description,
        phone: spec.phone, address: spec.address, district: spec.district, city: spec.city,
        lat: spec.lat, lng: spec.lng, coverImage: images[0], featured: spec.featured,
        ownerId: owner.id, categoryId: categories.get(spec.categorySlug)!,
        images: { create: images.map((url, i) => ({ url, sort: i })) },
        hours: {
          create: Array.from({ length: 7 }, (_, weekday) => ({
            weekday,
            openMin: open,
            closeMin: close,
            closed: weekday === 0 ? true : weekday === 1 ? mondayClosed : false,
          })),
        },
      },
    });

    const staffIds: string[] = [];
    for (const [name, title, av] of spec.staff) {
      const st = await db.staff.create({
        data: { businessId: biz.id, name, title, image: avatar(av) },
      });
      staffIds.push(st.id);
    }

    const serviceList: { id: string; name: string; durationMin: number; priceTl: number }[] = [];
    for (let ci = 0; ci < spec.menu.length; ci++) {
      const sc = await db.serviceCategory.create({
        data: { businessId: biz.id, name: spec.menu[ci].category, sort: ci },
      });
      for (let si = 0; si < spec.menu[ci].services.length; si++) {
        const [name, durationMin, priceTl, description] = spec.menu[ci].services[si];
        const sv = await db.service.create({
          data: {
            businessId: biz.id, categoryId: sc.id, name, description: description ?? null,
            durationMin, priceTl, sort: si,
          },
        });
        serviceList.push({ id: sv.id, name, durationMin, priceTl });
      }
    }

    // Tüm personel tüm hizmetleri verebilir (demo basitliği)
    await db.staffService.createMany({
      data: staffIds.flatMap((staffId) =>
        serviceList.map((s) => ({ staffId, serviceId: s.id }))
      ),
    });

    bizRecords.push({ id: biz.id, slug: spec.slug, name: spec.name, staffIds, serviceList });
  }

  console.log("Yorumlar oluşturuluyor...");
  for (let bi = 0; bi < bizRecords.length; bi++) {
    const biz = bizRecords[bi];
    const count = 6 + Math.floor(rand() * 8); // 6-13 yorum
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const [rating, comment] = COMMENTS[(bi * 7 + i * 3) % COMMENTS.length];
      const reviewer = reviewers[(bi * 5 + i) % reviewers.length];
      const daysAgo = 3 + Math.floor(rand() * 240);
      const withReply = BUSINESSES[bi].featured && i % 3 === 0;
      sum += rating;
      await db.review.create({
        data: {
          businessId: biz.id, customerId: reviewer.id, rating, comment,
          reply: withReply ? pick(REPLIES) : null,
          createdAt: new Date(Date.now() - daysAgo * 86_400_000),
        },
      });
    }
    await db.business.update({
      where: { id: biz.id },
      data: { ratingAvg: Math.round((sum / count) * 10) / 10, ratingCount: count },
    });
  }

  console.log("Randevular oluşturuluyor...");
  const today = todayStr();
  const nova = bizRecords[0];
  const zen = bizRecords[4];
  const nailRoom = bizRecords[3];

  type ApptSpec = {
    biz: typeof nova; dayOffset: number; staffIdx: number; startMin: number;
    serviceIdxs: number[]; status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    customerId?: string; walkInName?: string; note?: string;
  };

  const appts: ApptSpec[] = [
    // Nova — bugün (panel takvimi dolu görünsün)
    { biz: nova, dayOffset: 0, staffIdx: 0, startMin: 615, serviceIdxs: [0], status: "CONFIRMED", customerId: reviewers[0].id },
    { biz: nova, dayOffset: 0, staffIdx: 1, startMin: 630, serviceIdxs: [4], status: "CONFIRMED", customerId: reviewers[2].id, note: "Küllü kumral tonlar konuşuldu" },
    { biz: nova, dayOffset: 0, staffIdx: 2, startMin: 660, serviceIdxs: [2], status: "CONFIRMED", walkInName: "Hülya T." },
    { biz: nova, dayOffset: 0, staffIdx: 0, startMin: 750, serviceIdxs: [5], status: "CONFIRMED", customerId: reviewers[4].id },
    { biz: nova, dayOffset: 0, staffIdx: 3, startMin: 780, serviceIdxs: [1], status: "CONFIRMED", walkInName: "Selçuk A." },
    { biz: nova, dayOffset: 0, staffIdx: 1, startMin: 870, serviceIdxs: [0, 2], status: "CONFIRMED", customerId: reviewers[6].id },
    { biz: nova, dayOffset: 0, staffIdx: 2, startMin: 990, serviceIdxs: [8], status: "CONFIRMED", customerId: reviewers[8].id },
    // Nova — dün (tamamlandı)
    { biz: nova, dayOffset: -1, staffIdx: 0, startMin: 600, serviceIdxs: [4], status: "COMPLETED", customerId: reviewers[1].id },
    { biz: nova, dayOffset: -1, staffIdx: 1, startMin: 720, serviceIdxs: [0], status: "COMPLETED", walkInName: "Meral K." },
    { biz: nova, dayOffset: -1, staffIdx: 3, startMin: 900, serviceIdxs: [1, 2], status: "COMPLETED", customerId: reviewers[3].id },
    { biz: nova, dayOffset: -1, staffIdx: 2, startMin: 1020, serviceIdxs: [3], status: "NO_SHOW", customerId: reviewers[5].id },
    // Nova — yarın ve sonrası
    { biz: nova, dayOffset: 1, staffIdx: 0, startMin: 600, serviceIdxs: [5], status: "CONFIRMED", customerId: reviewers[7].id },
    { biz: nova, dayOffset: 1, staffIdx: 1, startMin: 690, serviceIdxs: [0], status: "CONFIRMED", walkInName: "Aysel D." },
    { biz: nova, dayOffset: 1, staffIdx: 2, startMin: 840, serviceIdxs: [7], status: "CONFIRMED", customerId: reviewers[9].id },
    { biz: nova, dayOffset: 2, staffIdx: 0, startMin: 660, serviceIdxs: [4], status: "CONFIRMED", customerId: reviewers[10].id },
    { biz: nova, dayOffset: 2, staffIdx: 3, startMin: 750, serviceIdxs: [1], status: "CONFIRMED", customerId: reviewers[11].id },
    // Demo müşterinin randevuları
    { biz: zen, dayOffset: 3, staffIdx: 0, startMin: 840, serviceIdxs: [0], status: "CONFIRMED", customerId: demoCustomer.id, note: "İlk ziyaret" },
    { biz: nova, dayOffset: -10, staffIdx: 0, startMin: 660, serviceIdxs: [0], status: "COMPLETED", customerId: demoCustomer.id },
    { biz: nailRoom, dayOffset: -40, staffIdx: 1, startMin: 720, serviceIdxs: [4], status: "COMPLETED", customerId: demoCustomer.id },
  ];

  let nailRoomApptId: string | null = null;

  for (const a of appts) {
    const services = a.serviceIdxs.map((i) => a.biz.serviceList[i]);
    const totalDur = services.reduce((s, x) => s + x.durationMin, 0);
    const totalTl = services.reduce((s, x) => s + x.priceTl, 0);
    const created = await db.appointment.create({
      data: {
        code: code(),
        businessId: a.biz.id,
        customerId: a.customerId ?? null,
        customerName: a.walkInName ?? null,
        staffId: a.biz.staffIds[a.staffIdx],
        date: addDaysStr(today, a.dayOffset),
        startMin: a.startMin,
        endMin: a.startMin + totalDur,
        status: a.status,
        totalTl,
        note: a.note ?? null,
        items: {
          create: services.map((s) => ({
            serviceId: s.id, name: s.name, durationMin: s.durationMin, priceTl: s.priceTl,
          })),
        },
      },
    });
    if (a.biz === nailRoom && a.customerId === demoCustomer.id) nailRoomApptId = created.id;
  }

  // Demo müşterinin geçmiş Nail Room randevusuna bağlı yorumu
  if (nailRoomApptId) {
    await db.review.create({
      data: {
        businessId: nailRoom.id, customerId: demoCustomer.id, appointmentId: nailRoomApptId,
        rating: 5, comment: "Kalıcı ojem üç haftadır ilk günkü gibi duruyor, bayıldım!",
        createdAt: new Date(Date.now() - 38 * 86_400_000),
      },
    });
    const agg = await db.review.aggregate({
      where: { businessId: nailRoom.id },
      _avg: { rating: true }, _count: true,
    });
    await db.business.update({
      where: { id: nailRoom.id },
      data: { ratingAvg: Math.round((agg._avg.rating ?? 0) * 10) / 10, ratingCount: agg._count },
    });
  }

  // Demo müşterinin favorileri
  await db.favorite.createMany({
    data: [
      { userId: demoCustomer.id, businessId: nova.id },
      { userId: demoCustomer.id, businessId: zen.id },
      { userId: demoCustomer.id, businessId: bizRecords[3].id },
    ],
  });

  const counts = {
    kullanici: await db.user.count(),
    isletme: await db.business.count(),
    hizmet: await db.service.count(),
    personel: await db.staff.count(),
    yorum: await db.review.count(),
    randevu: await db.appointment.count(),
  };
  console.log("Seed tamamlandı:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
