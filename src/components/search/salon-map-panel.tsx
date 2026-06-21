"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import maplibregl, { type Map as MlMap } from "maplibre-gl";
import { Map as MapIcon, X } from "lucide-react";
import { useDict } from "@/i18n/provider";

export type MapSalon = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  ratingAvg: number;
  district: string;
};

function buildMapStyle(attribution: string): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      carto: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
          "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        ],
        tileSize: 256,
        attribution,
      },
    },
    layers: [{ id: "carto", type: "raster", source: "carto" }],
  };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function SalonMapPanel({ salons }: { salons: MapSalon[] }) {
  const dict = useDict();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Haritayı bir kez kur
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(dict.common.mapAttribution),
      center: [29.0, 41.0],
      zoom: 10,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Harita yalnızca bir kez kurulur; atıf metni dil değişiminde yeniden
    // kurulmaya gerek olmayacak kadar nötr olduğundan bağımlılık eklenmez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marker'ları sonuçlara göre güncelle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (salons.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();

    for (const s of salons) {
      const el = document.createElement("button");
      el.className =
        "rounded-full bg-ink text-white text-xs font-bold px-2.5 py-1.5 shadow-pop border-2 border-white cursor-pointer transition-transform hover:scale-110";
      el.textContent = `★ ${s.ratingAvg.toFixed(1)}`;
      el.setAttribute("aria-label", s.name);

      const href = `/salon/${s.slug}`;
      const popup = new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(
        `<a href="${href}" style="display:block;padding:4px 2px;text-decoration:none;color:#131b2e;font-family:inherit">
           <strong style="font-size:14px">${escapeHtml(s.name)}</strong>
           <span style="display:block;font-size:12px;color:#4a5470;margin-top:2px">★ ${s.ratingAvg.toFixed(1)} · ${escapeHtml(s.district)}</span>
           <span style="display:block;font-size:12px;color:#5435e6;font-weight:700;margin-top:4px">${escapeHtml(dict.search.viewSalon)}</span>
         </a>`
      );

      // Pop-up linkini App Router ile gez (tam sayfa yenilemesini önle)
      popup.on("open", () => {
        const link = popup.getElement()?.querySelector("a");
        link?.addEventListener("click", (ev) => {
          // Yeni sekme / orta tık / modifier tuşları tarayıcıya bırak
          if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          router.push(href);
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([s.lng, s.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([s.lng, s.lat]);
    }

    if (salons.length === 1) {
      map.easeTo({ center: [salons[0].lng, salons[0].lat], zoom: 13 });
    } else {
      map.fitBounds(bounds, { padding: 64, maxZoom: 13, duration: 600 });
    }
  }, [salons, dict.search.viewSalon, router]);

  // Mobil tam ekran açılınca boyutu tazele
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => mapRef.current?.resize());
    } else {
      document.body.style.overflow = "";
      requestAnimationFrame(() => mapRef.current?.resize());
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div
        className={
          mobileOpen
            ? "fixed inset-0 z-50 bg-cream"
            : "relative hidden h-[calc(100dvh-7rem)] overflow-hidden rounded-[24px] border border-line shadow-card lg:block lg:sticky lg:top-24"
        }
      >
        <div ref={containerRef} className="size-full" />
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-pop"
          >
            <X className="size-4" /> {dict.search.backToList}
          </button>
        )}
      </div>

      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-pop lg:hidden"
        >
          <MapIcon className="size-4" /> {dict.search.mapButton}
        </button>
      )}
    </>
  );
}
