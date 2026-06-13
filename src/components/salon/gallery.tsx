"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, X } from "lucide-react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false);
  const cover = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <>
      <div className="relative">
        <div className="grid gap-2 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
          <button
            onClick={() => setOpen(true)}
            className="relative aspect-[4/3] overflow-hidden rounded-l-[24px] rounded-r-[24px] md:row-span-2 md:aspect-auto md:rounded-r-none"
            aria-label="Galeriyi aç"
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
                i === 1 ? "rounded-tr-[24px]" : i === 3 ? "rounded-br-[24px]" : ""
              }`}
              aria-label="Galeriyi aç"
            >
              <Image
                src={src}
                alt={`${name} fotoğraf ${i + 2}`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.05]"
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-ink shadow-pop transition-transform hover:scale-105"
        >
          <Images className="size-4" /> Tüm fotoğraflar ({images.length})
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-strong/95 p-4 sm:p-8" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-3xl">
            <div className="sticky top-0 z-10 mb-4 flex justify-end pt-2">
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-pop"
              >
                <X className="size-4" /> Kapat
              </button>
            </div>
            <div className="space-y-4 pb-10">
              {images.map((src, i) => (
                <div key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={`${name} fotoğraf ${i + 1}`}
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
