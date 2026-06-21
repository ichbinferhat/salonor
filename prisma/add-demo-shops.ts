/**
 * İki tam donanımlı, gerçekçi demo işletme ekler: "Demo Kuaför" ve "Demo Berber".
 * Amaç: AI stil danışmanını gerçek bir hizmet kataloğu üzerinde sergilemek.
 *
 * Idempotent: aynı e-postalı sahip varsa cascade ile (işletme + tüm verisi) silinir,
 * sonra yeniden oluşturulur. Mevcut diğer veriye DOKUNMAZ.
 *
 * Çalıştır:  npx tsx prisma/add-demo-shops.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { todayStr } from "../src/lib/datetime";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
const avatar = (n: number) => `https://i.pravatar.cc/300?img=${n}`;

const HAIR = [
  "1560066984-138dadb4c035", "1522337660859-02fbefca4702", "1562322140-8baeececf3df",
  "1633681926022-84c23e8cb2d6", "1580618672591-eb180b1a973f", "1595476108010-b4d1f102b1b1",
];
const BARBER = [
  "1503951914875-452162b0f3f1", "1521590832167-7bcbfaa6381f", "1599351431202-1e0f0137899a",
  "1622286342621-4bd786c2447c", "1605497788044-5a32c7078486", "1585747860715-2ba37e788b70",
];

type ServiceSpec = [name: string, durationMin: number, priceTl: number, description?: string];

type ShopSpec = {
  slug: string;
  name: string;
  email: string;
  categorySlug: string;
  description: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  imageIds: string[];
  staff: [name: string, title: string, avatarN: number][];
  menu: { category: string; services: ServiceSpec[] }[];
};

const SHOPS: ShopSpec[] = [
  {
    slug: "demo-kuafor",
    name: "Demo Kuaför",
    email: "demo-kuafor@salonor.com",
    categorySlug: "kuafor",
    description:
      "Nişantaşı'nın kalbinde, modern ve ferah bir atölyede kişiye özel saç tasarımı. Renk uzmanlığı, balyaj ve keratin bakımlarındaki deneyimimizle her saç tipine en doğal sonucu sunuyoruz. Doğal ışık alan istasyonlar, premium ürünler ve sıcak bir karşılama.",
    phone: "0212 100 10 10",
    address: "Teşvikiye Mah. Valikonağı Cad. No:42",
    district: "Şişli",
    city: "İstanbul",
    lat: 41.0512,
    lng: 28.9912,
    imageIds: HAIR,
    staff: [
      ["Selin Aydın", "Kurucu & Renk Uzmanı", 5],
      ["Derya Koç", "Saç Tasarımcısı", 16],
      ["Melis Ün", "Stilist", 25],
      ["Buse Tan", "Bakım Uzmanı", 9],
    ],
    menu: [
      {
        category: "Kesim & Şekillendirme",
        services: [
          ["Kadın Saç Kesimi", 45, 450, "Yüz şekline ve saç tipine göre kişiye özel kesim, yıkama ve şekillendirme dahil."],
          ["Fön & Şekillendirme", 30, 300, "Hacim, dalga ya da düz; istediğin görünüm için profesyonel fön."],
          ["Maşa / Dalga", 40, 380, "Uzun ömürlü, doğal duran bukleler ve plaj dalgaları."],
          ["Saç Düzleştirme (Geçici)", 35, 350, "Pürüzsüz, parlak ve elektriklenmeyen bir görünüm."],
        ],
      },
      {
        category: "Renklendirme",
        services: [
          ["Komple Boya", 120, 1200, "Dipten uca tek renk; amonyaksız, bakım katkılı boya seçeneğiyle."],
          ["Ombre / Balyaj", 180, 2200, "Doğal geçişli, yüz çevresi tonlamalı ışıltılı renklendirme."],
          ["Röfle / Highlights", 150, 1800, "İnce tellerle boyutlu, canlı bir renk efekti."],
          ["Dip Boya / Rötuş", 60, 700, "Uzayan dipler için hızlı ve doğal rötuş."],
          ["Fantazi Renk", 200, 2600, "Küllü, bakır, pastel ve daha fazlası — sana özel renk tasarımı."],
        ],
      },
      {
        category: "Bakım & Keratin",
        services: [
          ["Keratin Bakımı", 120, 1600, "Yıpranmış ve kabaran saçlar için ısı korumalı, parlaklık veren keratin."],
          ["Saç Botoksu", 90, 1300, "Kırık uçları onarır, saçı doldurarak canlandırır."],
          ["Profesyonel Bakım Maskesi", 30, 400, "Derinlemesine nem ve onarım; her boyama sonrası önerilir."],
        ],
      },
      {
        category: "Gelin & Özel Gün",
        services: [
          ["Gelin Saçı + Deneme", 180, 3500, "Konseptine uygun deneme seansı ve düğün günü uygulama."],
          ["Topuz & Abiye Saçı", 90, 1200, "Davet ve özel günler için zarif topuz ve şekillendirme."],
        ],
      },
    ],
  },
  {
    slug: "demo-berber",
    name: "Demo Berber",
    email: "demo-berber@salonor.com",
    categorySlug: "berber",
    description:
      "Klasik berberlik geleneğini modern erkek bakımıyla buluşturan bir mekan. Sıcak havlu ustura tıraşı, hassas makas işçiliği ve sakal tasarımında ustalık. Kahveni al, koltuğa kurul — gerisini bize bırak.",
    phone: "0212 200 20 20",
    address: "Caferağa Mah. Moda Cad. No:18",
    district: "Kadıköy",
    city: "İstanbul",
    lat: 40.9886,
    lng: 29.0265,
    imageIds: BARBER,
    staff: [
      ["Mert Demir", "Kurucu Berber", 12],
      ["Kaan Yıldız", "Usta Berber", 33],
      ["Emre Şahin", "Berber", 51],
    ],
    menu: [
      {
        category: "Saç",
        services: [
          ["Saç Kesimi", 30, 300, "Makas ve makine ile yüz hatlarına uygun kesim; yıkama ve şekillendirme dahil."],
          ["Saç Kesimi + Yıkama", 40, 350, "Rahatlatıcı saç yıkama ve masajla birlikte kesim."],
          ["Çocuk Saç Kesimi", 25, 200, "12 yaş altı için sabırlı ve keyifli kesim."],
          ["Fade / Skin Fade", 35, 350, "Keskin geçişli modern fade; enseden tepeye kusursuz degrade."],
        ],
      },
      {
        category: "Sakal & Tıraş",
        services: [
          ["Sakal Kesimi & Şekillendirme", 20, 200, "Yüz şekline göre hatları belirginleştiren sakal tasarımı."],
          ["Sıcak Havlu Ustura Tıraşı", 30, 280, "Klasik sıcak havlu, köpük ve ustura ile cilt dostu profesyonel tıraş."],
          ["Saç + Sakal Combo", 50, 450, "Komple bakım: kesim + sakal şekillendirme bir arada, avantajlı."],
        ],
      },
      {
        category: "Bakım",
        services: [
          ["Yüz Bakımı & Maske", 30, 350, "Siyah nokta ve yağ karşıtı arındırıcı maske ile ferahlatıcı bakım."],
          ["Ağda (Kaş/Burun/Kulak)", 15, 150, "Hızlı ve hijyenik detay temizliği."],
          ["Erkek Saç Boyası", 45, 500, "Beyazları kapatan ya da ton veren doğal görünümlü boya."],
        ],
      },
    ],
  },
];

const REVIEWS: [rating: number, comment: string][] = [
  [5, "İlk kez geldim, beklentimin çok üstündeydi. Kesinlikle tavsiye ederim!"],
  [5, "Çok ilgili ve profesyonel bir ekip. Sonuçtan çok memnun kaldım."],
  [5, "Tam istediğim gibi oldu, fotoğraf gösterdim birebir uyguladılar."],
  [4, "Genel olarak çok iyi, sadece biraz beklemek zorunda kaldım."],
  [5, "Mekan tertemiz, ekip güler yüzlü. Müdavim oldum."],
  [5, "Renk konusunda gerçekten uzmanlar, saçım hiç yıpranmadı."],
  [5, "Randevu sistemi çok pratik, tam saatinde başladılar."],
  [4, "Fiyat/performans gayet iyi, memnun ayrıldım."],
  [5, "Sıcak havlu tıraşı efsane, kendimi yenilenmiş hissettim."],
  [5, "Çocuğumun saçını sabırla kestiler, çok teşekkürler."],
];

const REPLIES = [
  "Güzel yorumun için teşekkürler, yine bekleriz! 💛",
  "Memnun kalmana çok sevindik, tekrar görüşmek dileğiyle!",
  "Teşekkür ederiz, sağlıkla kullan!",
];

async function main() {
  const passwordHash = await bcrypt.hash("salonor123", 10);
  const today = todayStr();

  for (const shop of SHOPS) {
    // Idempotent: sahip (ve cascade ile işletmenin tüm verisi) varsa sil
    await db.user.deleteMany({ where: { email: shop.email } });

    const category = await db.category.findUnique({ where: { slug: shop.categorySlug } });
    if (!category) {
      console.error(`! Kategori bulunamadı: ${shop.categorySlug} — önce seed çalıştır.`);
      continue;
    }

    const owner = await db.user.create({
      data: {
        name: shop.staff[0][0],
        email: shop.email,
        passwordHash,
        role: "OWNER",
        image: avatar(shop.staff[0][2]),
      },
    });

    const images = shop.imageIds.map((id) => img(id));

    const biz = await db.business.create({
      data: {
        slug: shop.slug,
        name: shop.name,
        description: shop.description,
        phone: shop.phone,
        address: shop.address,
        district: shop.district,
        city: shop.city,
        lat: shop.lat,
        lng: shop.lng,
        coverImage: images[0],
        featured: true,
        active: true,
        plan: "profesyonel",
        smsCredits: 500,
        ownerId: owner.id,
        categoryId: category.id,
        images: { create: images.map((url, i) => ({ url, sort: i })) },
        hours: {
          create: Array.from({ length: 7 }, (_, weekday) => ({
            weekday,
            openMin: 540, // 09:00
            closeMin: weekday === 6 ? 1080 : 1200, // Cmt 18:00, diğer 20:00
            closed: weekday === 0, // Pazar kapalı
          })),
        },
      },
    });

    // Personel
    const staffIds: string[] = [];
    for (const [name, title, av] of shop.staff) {
      const st = await db.staff.create({
        data: { businessId: biz.id, name, title, image: avatar(av) },
      });
      staffIds.push(st.id);
    }

    // Hizmet kategorileri + hizmetler
    const serviceList: { id: string; name: string; durationMin: number; priceTl: number }[] = [];
    for (let ci = 0; ci < shop.menu.length; ci++) {
      const sc = await db.serviceCategory.create({
        data: { businessId: biz.id, name: shop.menu[ci].category, sort: ci },
      });
      for (let si = 0; si < shop.menu[ci].services.length; si++) {
        const [name, durationMin, priceTl, description] = shop.menu[ci].services[si];
        const sv = await db.service.create({
          data: {
            businessId: biz.id,
            categoryId: sc.id,
            name,
            description: description ?? null,
            durationMin,
            priceTl,
            sort: si,
          },
        });
        serviceList.push({ id: sv.id, name, durationMin, priceTl });
      }
    }

    // Her personel her hizmeti verebilir (demo basitliği)
    await db.staffService.createMany({
      data: staffIds.flatMap((staffId) => serviceList.map((s) => ({ staffId, serviceId: s.id }))),
    });

    // Yorumlar + puan
    let sum = 0;
    for (let i = 0; i < REVIEWS.length; i++) {
      const [rating, comment] = REVIEWS[i];
      sum += rating;
      // Yorum yazması için anonim müşteri (her yoruma ayrı kullanıcı)
      const reviewer = await db.user.create({
        data: {
          name: ["Ayşe K.", "Mehmet T.", "Zeynep A.", "Can D.", "Elif S.", "Burak Y.", "Deniz O.", "Gizem U.", "Ozan B.", "Sıla M."][i],
          email: `demo-rev-${shop.slug}-${i}@salonor.com`,
          passwordHash,
          role: "CUSTOMER",
          image: avatar(60 + i),
        },
      });
      await db.review.create({
        data: {
          businessId: biz.id,
          customerId: reviewer.id,
          rating,
          comment,
          reply: i % 3 === 0 ? REPLIES[i % REPLIES.length] : null,
          createdAt: new Date(Date.now() - (5 + i * 11) * 86_400_000),
        },
      });
    }
    await db.business.update({
      where: { id: biz.id },
      data: {
        ratingAvg: Math.round((sum / REVIEWS.length) * 10) / 10,
        ratingCount: REVIEWS.length,
      },
    });

    // Bugün için birkaç randevu (panel takvimi canlı görünsün) — walk-in
    const todayAppts = [
      { staffIdx: 0, startMin: 600, svcIdx: [0] },
      { staffIdx: 1, startMin: 660, svcIdx: [serviceList.length > 4 ? 4 : 1] },
      { staffIdx: 2 % staffIds.length, startMin: 720, svcIdx: [2] },
      { staffIdx: 0, startMin: 840, svcIdx: [1] },
    ];
    const names = ["Selin Y.", "Burak A.", "Merve T.", "Ahmet C."];
    let ai = 0;
    for (const ap of todayAppts) {
      const svcs = ap.svcIdx.map((i) => serviceList[i] ?? serviceList[0]);
      const totalDur = svcs.reduce((s, x) => s + x.durationMin, 0);
      const totalTl = svcs.reduce((s, x) => s + x.priceTl, 0);
      await db.appointment.create({
        data: {
          code: `DM${shop.slug.slice(-3).toUpperCase()}${ai}${Math.floor(Math.random() * 90 + 10)}`,
          businessId: biz.id,
          customerName: names[ai % names.length],
          staffId: staffIds[ap.staffIdx % staffIds.length],
          date: today,
          startMin: ap.startMin,
          endMin: ap.startMin + totalDur,
          status: "CONFIRMED",
          totalTl,
          seenAt: new Date(),
          items: {
            create: svcs.map((s) => ({
              serviceId: s.id,
              name: s.name,
              durationMin: s.durationMin,
              priceTl: s.priceTl,
            })),
          },
        },
      });
      ai++;
    }

    console.log(`✓ ${shop.name} oluşturuldu — /salon/${shop.slug} (${serviceList.length} hizmet, ${staffIds.length} personel)`);
  }

  console.log("Tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
