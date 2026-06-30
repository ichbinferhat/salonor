"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map as MlMap, type Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useDict } from "@/i18n/provider";

export const CITY_CENTERS: Record<string, [lng: number, lat: number]> = {
  İstanbul: [28.9784, 41.0082],
  Ankara: [32.8597, 39.9334],
  İzmir: [27.1428, 38.4237],
};

export function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const t = useDict().onboarding;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  // En güncel onChange'i ref'te tut — AMA render sırasında değil effect'te yaz
  // (render'da ref.current'a yazmak React derleyici kuralını ihlal eder). Harita
  // olay callback'leri her zaman effect sonrası tetiklendiğinden değer günceldir.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
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
      zoom: 12,
      // Native uygulama (in-app WebView): tek parmak sayfayı kaydırır, harita iki
      // parmakla gezilir → dikey scroll tuzağı olmaz. Masaüstü web etkilenmez.
      cooperativeGestures:
        typeof document !== "undefined" && document.body.classList.contains("in-app"),
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const el = document.createElement("div");
    el.className = "size-6 rounded-full bg-accent border-[3px] border-white shadow-pop";
    const marker = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat([lng, lat])
      .addTo(map);
    marker.on("dragend", () => {
      const p = marker.getLngLat();
      onChangeRef.current(p.lat, p.lng);
    });

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      onChangeRef.current(e.lngLat.lat, e.lngLat.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Şehir/koordinat dışarıdan değişince marker ve merkezi güncelle
  useEffect(() => {
    markerRef.current?.setLngLat([lng, lat]);
    mapRef.current?.easeTo({ center: [lng, lat], duration: 500 });
  }, [lat, lng]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div ref={containerRef} className="h-64 w-full" />
      <p className="bg-cream px-4 py-2 text-xs text-ink-soft">
        {t.mapHint}
      </p>
    </div>
  );
}
