/** Büyük gradyan tipografili istatistik bandı (gerçek verilerle). */
export function StatsBand({
  bizCount,
  serviceCount,
  reviewCount,
}: {
  bizCount: number;
  serviceCount: number;
  reviewCount: number;
}) {
  const stats: [string, string][] = [
    [String(bizCount), "seçkin salon"],
    ["81 il", "Türkiye genelinde"],
    [`${reviewCount}+`, "doğrulanmış yorum"],
  ];
  return (
    <section className="container-x py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Güzellik ve bakımda doğru adres
        </h2>
        <p className="mt-4 text-lg text-ink-soft">
          Tek platform, tek uygulama — 81 ilden seçkin salonların ve uzmanların
          buluştuğu yer.
        </p>
      </div>

      <p className="mt-12 text-center font-display text-[3.25rem] font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
        <span className="bg-gradient-to-r from-accent via-[#8b5cf6] to-[#ff5fa2] bg-clip-text text-transparent">
          Saniyeler içinde
        </span>
      </p>
      <p className="mt-3 text-center text-lg font-medium text-ink-soft">
        randevu — ücretsiz ve 7/24
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
        {serviceCount}+ rezerve edilebilir hizmet · anında onay · güvenli ödeme
      </p>
    </section>
  );
}
