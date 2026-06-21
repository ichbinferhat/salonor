import { ImageResponse } from "next/og";

// iPhone "Ana Ekrana Ekle" ikonu (iOS apple-touch-icon — PNG olarak üretilir).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='#ffffff' d='M256 96 C272 200 312 240 416 256 C312 272 272 312 256 416 C240 312 200 272 96 256 C200 240 240 200 256 96 Z'/></svg>`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6c4df6",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={120} height={120} src={`data:image/svg+xml,${encodeURIComponent(svg)}`} alt="" />
      </div>
    ),
    { ...size }
  );
}
