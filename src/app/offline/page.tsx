// Çevrimdışı yedek sayfası. Service worker, ağ koptuğunda bunu gösterir.
// Dış CSS yüklenemeyebileceği için stiller satır içi (inline) verildi.
// Bu sayfa SW önbelleğinden statik servis edilir (sunucu YOK → getDictionary
// çalışmaz); bu yüzden iki dilli (Türkçe + İngilizce) sabit metin kullanılır.
export const metadata = { title: "Çevrimdışı / Offline" };

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f4f2fb",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "360px",
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          border: "1px solid #e9e7f1",
          borderRadius: "24px",
          padding: "32px 24px",
          boxShadow: "0 12px 40px rgba(19,27,46,0.10)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 16px",
            borderRadius: "50%",
            background: "#f7f5ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6c4df6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 1l22 22" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800, color: "#131b2e" }}>
          Bağlantı yok / No connection
        </h1>
        <p style={{ margin: "0 0 24px", color: "#4a5470", fontSize: "15px", lineHeight: 1.5 }}>
          İnternet bağlantın kesildi. Bağlanınca Salonor kaldığın yerden devam edecek.
          <br />
          <span style={{ opacity: 0.75 }}>
            You&apos;re offline. Salonor will continue where you left off once you reconnect.
          </span>
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- offline kurtarma: tam yeniden yükleme (Link soft-nav offline state'i temizlemez) */}
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#6c4df6",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "15px",
            textDecoration: "none",
            padding: "12px 28px",
            borderRadius: "999px",
          }}
        >
          Tekrar dene / Retry
        </a>
      </div>
    </div>
  );
}
