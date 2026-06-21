import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";

/** Tire öncesi lead cümleyi koyu/yarı-kalın gösterip alt başlığa premium kontrast katar. */
function emphasizeLead(text: string) {
  const i = text.indexOf("—");
  if (i < 0) return text;
  return (
    <>
      <span className="font-semibold text-ink">{text.slice(0, i).trimEnd()}</span>{" "}
      {text.slice(i + 1).trim()}
    </>
  );
}

/** Büyük gradyan tipografili istatistik bandı (gerçek verilerle). */
export async function StatsBand({
  bizCount,
  serviceCount,
  reviewCount,
}: {
  bizCount: number;
  serviceCount: number;
  reviewCount: number;
}) {
  const dict = await getDictionary();
  const s = dict.home.stats;
  const stats: [string, string][] = [
    [String(bizCount), s.selectSalons],
    [s.provincesNum, s.provincesLabel],
    [`${reviewCount}+`, s.verifiedReviews],
  ];
  return (
    <section className="container-x py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {s.heading}
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">
          {emphasizeLead(s.sub)}
        </p>
      </div>

      <p className="mt-12 text-center font-display text-[3.25rem] font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
        <span className="bg-gradient-to-r from-accent via-[#8b5cf6] to-[#ff5fa2] bg-clip-text text-transparent">
          {s.bigGradient}
        </span>
      </p>
      <p className="mt-3 text-center text-lg font-medium text-ink-soft">
        {s.bigSub}
      </p>

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3">
        {stats.map(([num, label]) => (
          <div key={label} className="text-center">
            <p className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {num}
            </p>
            <p className="mt-2 text-ink-soft">{label}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-ink-mute">
        {interpolate(s.footnote, { n: serviceCount })}
      </p>
    </section>
  );
}
