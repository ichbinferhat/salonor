import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDictionary } from "@/i18n";

type Group = { title: string; links: [string, string][] };

// Her grup: başlık + [etiket, /arama sorgusu] çiftleri.
// Salonor'un kendi kategori yapısına göre düzenlenmiş özgün hizmet dizini.
const GROUPS: Group[] = [
  {
    title: "Salon türleri",
    links: [
      ["Kadın kuaförü", "?kategori=kuafor"],
      ["Erkek berberi", "?kategori=berber"],
      ["Güzellik & estetik merkezi", "?kategori=cilt-bakimi"],
      ["Tırnak stüdyosu", "?kategori=tirnak"],
      ["Spa & masaj merkezi", "?kategori=spa-masaj"],
      ["Makyaj stüdyosu", "?kategori=makyaj"],
    ],
  },
  {
    title: "Saç hizmetleri",
    links: [
      ["Saç kesimi", "?q=Saç%20Kesimi"],
      ["Fön & şekillendirme", "?q=Fön"],
      ["Saç boyası", "?q=Boya"],
      ["Ombre & balyaj", "?q=Ombre"],
      ["Keratin & saç bakımı", "?q=Bakım"],
      ["Gelin saçı", "?q=Gelin"],
    ],
  },
  {
    title: "Tırnak hizmetleri",
    links: [
      ["Manikür", "?q=Manikür"],
      ["Pedikür", "?q=Pedikür"],
      ["Kalıcı oje", "?q=Kalıcı%20Oje"],
      ["Protez tırnak", "?q=Protez"],
      ["Jel tırnak", "?q=Jel"],
      ["Nail art", "?kategori=tirnak"],
    ],
  },
  {
    title: "Makyaj, kaş & kirpik",
    links: [
      ["Gündüz & abiye makyajı", "?q=Makyaj"],
      ["Gelin makyajı", "?q=Gelin%20Makyajı"],
      ["İpek kirpik", "?q=İpek%20Kirpik"],
      ["Kirpik lifting", "?q=Kirpik"],
      ["Kaş laminasyonu", "?q=Kaş"],
      ["Kaş tasarımı", "?kategori=kas-kirpik"],
    ],
  },
  {
    title: "Cilt bakımı",
    links: [
      ["Klasik cilt bakımı", "?q=Cilt%20Bakımı"],
      ["Profesyonel cilt bakımı", "?kategori=cilt-bakimi"],
      ["Leke & akne bakımı", "?q=Leke"],
      ["Hydrafacial", "?q=Hydrafacial"],
      ["Kaş alma", "?q=Kaş%20Alma"],
      ["Yüz ağdası", "?q=Ağda"],
    ],
  },
  {
    title: "Spa & masaj",
    links: [
      ["İsveç masajı", "?q=Masaj"],
      ["Aroma terapi", "?q=Aroma"],
      ["Derin doku masajı", "?q=Derin"],
      ["Sıcak taş masajı", "?q=Sıcak"],
      ["Refleksoloji", "?kategori=spa-masaj"],
      ["Hamam ritüeli", "?q=Hamam"],
    ],
  },
  {
    title: "Lazer epilasyon",
    links: [
      ["Tüm vücut", "?kategori=epilasyon"],
      ["Koltuk altı", "?q=Koltuk"],
      ["Bacak", "?q=Bacak"],
      ["Kol", "?q=Kol"],
      ["Sırt", "?q=Sırt"],
      ["Yüz & bölgesel", "?kategori=epilasyon"],
    ],
  },
  {
    title: "Erkek bakımı",
    links: [
      ["Erkek saç kesimi", "?kategori=berber"],
      ["Sakal tıraşı & şekillendirme", "?q=Sakal"],
      ["Erkek saç boyası", "?q=Boya"],
      ["Erkek cilt bakımı", "?q=Cilt%20Bakımı"],
      ["Erkek ağda", "?q=Ağda"],
      ["Saç & sakal combo", "?kategori=berber"],
    ],
  },
];

export async function ServicesDirectory() {
  const dict = await getDictionary();
  const d = dict.home.directory;
  return (
    <section className="relative overflow-hidden border-t border-line bg-surface">
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent-faint blur-3xl"
        aria-hidden
      />
      <div className="container-x relative py-16">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-deep ring-1 ring-accent/15">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          {d.kicker}
        </p>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-4xl">
          {d.heading}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {GROUPS.map((g, gi) => (
            <div key={g.title}>
              <h3 className="font-display text-base font-bold text-ink">
                {d.groups[gi].title}
              </h3>
              <ul className="mt-3 space-y-1">
                {g.links.map(([, href], li) => (
                  <li key={`${gi}-${li}`}>
                    <Link
                      href={`/arama${href}`}
                      className="group flex items-center gap-1 py-1 text-sm text-ink-soft transition-colors hover:text-accent-deep"
                    >
                      <ChevronRight className="size-3.5 shrink-0 text-ink-mute transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                      {d.groups[gi].items[li]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
