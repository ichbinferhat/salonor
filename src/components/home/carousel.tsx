"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useDict } from "@/i18n/provider";

export function Carousel({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const dict = useDict();
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // İçerik taşıyor mu ve hangi yöne kaydırılabilir? — okları ona göre göster.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const overflow = el.scrollWidth - el.clientWidth;
      // RTL'de (ar/fa) scrollLeft negatif/ters çalışır; mantıksal 0..overflow
      // aralığına normalize et ki ok durumları her iki yönde de doğru olsun.
      const rtl = getComputedStyle(el).direction === "rtl";
      const sl = rtl ? -el.scrollLeft : el.scrollLeft;
      setCanLeft(sl > 4);
      setCanRight(overflow > 4 && sl < overflow - 4);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // RTL'de fiziksel kaydırma yönü terstir — işareti çevir.
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: (rtl ? -dir : dir) * el.clientWidth, behavior: "smooth" });
  };

  // Hiç kart yoksa nazik bir boş-durum göster (başlık + işlevsiz oklarla
  // bomboş şerit yerine).
  const hasChildren =
    Array.isArray(children) ? children.length > 0 : children != null && children !== false;

  return (
    <section className="container-x">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[28px]">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
        </div>

        {hasChildren && (
          <div className="flex shrink-0 items-center gap-2">
            {href && (
              <Link
                href={href}
                className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-accent-deep transition-colors hover:bg-accent-faint sm:inline-flex"
              >
                {dict.common.viewAll} <ArrowRight className="size-4" />
              </Link>
            )}
            {(canLeft || canRight) && (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  onClick={() => scroll(-1)}
                  disabled={!canLeft}
                  aria-label={dict.common.scrollBack}
                  className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-card transition-all hover:border-accent/40 hover:bg-cream active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-surface"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={() => scroll(1)}
                  disabled={!canRight}
                  aria-label={dict.common.scrollForward}
                  className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-card transition-all hover:border-accent/40 hover:bg-cream active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-surface"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!hasChildren ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center text-sm font-medium text-ink-mute">
          {dict.common.carouselEmpty}
        </div>
      ) : (
        /* Oklar — kartların YAN tarafında, dikey ortada; resmin üzerine binmez
            (track'e yatay boşluk verip okları o boşluğa yerleştiriyoruz).
            Yalnızca o yöne kaydırma mümkünse görünür. */
        <div
          ref={ref}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5"
        >
          {children}
        </div>
      )}
    </section>
  );
}
