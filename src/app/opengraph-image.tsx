import { ImageResponse } from "next/og";

export const alt = "Salonor — Güzellik ve bakım randevusu, saniyeler içinde";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6d4aff 0%, #ff5fa2 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 120, fontWeight: 800, letterSpacing: -4 }}>salonor</span>
          <span style={{ width: 26, height: 26, borderRadius: 999, background: "white", marginTop: 60 }} />
        </div>
        <div style={{ display: "flex", fontSize: 46, marginTop: 8, opacity: 0.97, fontWeight: 600 }}>
          Randevun saniyeler içinde, cebinde.
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 34, opacity: 0.85 }}>
          Kuaför · Berber · Spa · Güzellik · Tırnak
        </div>
      </div>
    ),
    { ...size }
  );
}
