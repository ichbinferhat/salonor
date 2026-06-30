import { ImageResponse } from "next/og";

// iPhone "Ana Ekrana Ekle" ikonu (iOS apple-touch-icon — PNG olarak üretilir).
// Header logosu "salonor•"nin küçük marka hali: lacivert zemin + beyaz "s" + gradyan nokta.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10162B",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
          <span style={{ fontSize: 136, fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>s</span>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "linear-gradient(135deg, #6c4df6, #ff5fa2)",
              marginBottom: 20,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
