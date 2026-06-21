"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Images, X } from "lucide-react";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const dict = useDict();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cover = images[0];
  const thumbs = images.slice(1, 5);
  // Rounding follows the actual thumb count so partial collages (2-3 images)
  // still get clean top-right / bottom-right corners. Top row holds up to 2
  // thumbs (slots 0-1), bottom row the next 2 (slots 2-3).
  const topRightIdx = Math.min(thumbs.length, 2) - 1;
  const bottomRightIdx = thumbs.length - 1 >= 2 ? thumbs.length - 1 : -1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="relative">
        <div className="grid gap-2 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
          <button
            onClick={() => setOpen(true)}
            className={`relative aspect-[4/3] overflow-hidden rounded-l-[24px] rounded-r-[24px] md:row-span-2 md:aspect-auto ${
              thumbs.length > 0 ? "md:rounded-r-none" : ""
            }`}
            aria-label={dict.salon.openGallery}
          >
            <Image
              src={cover}
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </button>
          {thumbs.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setOpen(true)}
              className={`relative hidden aspect-[4/3] overflow-hidden md:block ${
                i === topRightIdx ? "rounded-tr-[24px]" : ""
              } ${i === bottomRightIdx ? "rounded-br-[24px]" : ""}`}
              aria-label={dict.salon.openGallery}
            >
              <Image
                src={src}
                alt={interpolate(dict.salon.photoAlt, { name, n: i + 2 })}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-surface/80 px-4 py-2 text-sm font-bold text-ink shadow-pop ring-1 ring-line backdrop-blur-md transition-all hover:scale-105 hover:bg-surface"
        >
          <Images className="size-4" /> {interpolate(dict.salon.allPhotos, { n: images.length })}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-strong/95 p-4 sm:p-8" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-3xl">
            <div className="sticky top-0 z-10 mb-4 flex justify-end pt-2">
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-pop"
              >
                <X className="size-4" /> {dict.salon.close}
              </button>
            </div>
            <div className="space-y-4 pb-10">
              {images.map((src, i) => (
                <div key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={interpolate(dict.salon.photoAlt, { name, n: i + 1 })}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
