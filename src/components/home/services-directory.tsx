import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Group = { title: string; links: [string, string][] };

// Her grup: başlık + [etiket, /arama sorgusu] çiftleri
const GROUPS: Group[] = [
  {
    title: "Salonlar",
    links: [
      ["Kuaförler", "?kategori=kuafor"],
      ["Berberler", "?kategori=berber"],
      ["Güzellik & estetik merkezleri", "?kategori=cilt-bakimi"],
      ["Makyaj stüdyoları", "?kategori=makyaj"],
      ["Masaj & spa salonları", "?kategori=spa-masaj"],
      ["Tırnak stüdyoları", "?kategori=tirnak"],
    ],
  },
  {
    title: "Saç",
    links: [
      ["Saç kesimi", "?q=Saç%20Kesimi"],
      ["Fön & şekillendirme", "?q=Fön"],
      ["Saç boyama", "?q=Boya"],
      ["Ombre & röfle", "?q=Ombre"],
      ["Saç bakımı", "?q=Bakım"],
      ["Gelin saçı", "?q=Gelin"],
    ],
  },
  {
    title: "Tırnak",
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
    title: "Makyaj & kaş-kirpik",
    links: [
      ["Gündüz makyajı", "?q=Makyaj"],
      ["Gelin makyajı", "?q=Gelin%20Makyajı"],
      ["Kirpik lifting", "?q=Kirpik"],
      ["İpek kirpik", "?q=İpek%20Kirpik"],
      ["Kaş laminasyonu", "?q=Kaş"],
      ["Kaş tasarımı", "?kategori=kas-kirpik"],
    ],
  },
  {
    title: "Cilt bakımı",
    links: [
      ["Klasik cilt bakımı", "?q=Cilt%20Bakımı"],
      ["Profesyonel cilt bakımı", "?kategori=cilt-bakimi"],
      ["Leke bakımı", "?q=Leke"],
      ["Hydrafacial", "?q=Hydrafacial"],
      ["Kaş alma", "?q=Kaş%20Alma"],
      ["Ağda (yüz)", "?q=Ağda"],
    ],
  },
  {
    title: "Spa & masaj",
    links: [
      ["İsveç masajı", "?q=Masaj"],
      ["Aroma terapi", "?q=Aroma"],
      ["Derin doku masajı", "?q=Masaj"],
      ["Sıcak taş masajı", "?q=Masaj"],
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
      ["Bölgesel epilasyon", "?kategori=epilasyon"],
    ],
  },
  {
    title: "Erkek",
    links: [
      ["Erkek saç kesimi", "?kategori=berber"],
      ["Sakal tıraşı", "?q=Sakal"],
      ["Erkek saç boyama", "?q=Boya"],
      ["Erkek cilt bakımı", "?q=Cilt%20Bakımı"],
      ["Erkek ağda", "?q=Ağda"],
      ["Saç & sakal tasarımı", "?kategori=berber"],
    ],
  },
];

export function ServicesDirectory() {
  return (
    <section className="border-t border-line bg-surface">
      <div className="container-x py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-accent-deep">
          Tüm hizmetler
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Aradığın her hizmet Salonor’da
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="font-display text-base font-bold text-ink">{g.title}</h3>
              <ul className="mt-3 space-y-1">
                {g.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={`/arama${href}`}
                      className="group flex items-center gap-1 py-1 text-sm text-ink-soft transition-colors hover:text-accent-deep"
                    >
                      <ChevronRight className="size-3.5 shrink-0 text-ink-mute transition-colors group-hover:text-accent" />
                      {label}
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
