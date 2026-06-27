"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

export function MiniMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const dict = useDict();
  const ref = useRef<HTMLDivElement>(null);
  const label = interpolate(dict.salon.mapAriaLabel, { name });

  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap · © CARTO",
          },
        },
        layers: [{ id: "carto", type: "raster", source: "carto" }],
      },
      center: [lng, lat],
      zoom: 14,
      interactive: false,
      attributionControl: { compact: true },
    });

    const el = document.createElement("div");
    el.className =
      "rounded-full bg-ink text-white text-xs font-bold px-3 py-1.5 shadow-pop border-2 border-white";
    el.textContent = name;
    new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);

    return () => map.remove();
  }, [lat, lng, name]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      title={label}
      className="h-64 w-full overflow-hidden rounded-2xl border border-line"
    />
  );
}
