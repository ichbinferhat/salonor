"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Web ↔ Native köprüsü (yalnızca mobil uygulama WebView'i içinde render edilir).
 *
 * - Oturum + rol bilgisini native'e bildirir → native, doğru sekme çubuğunu (müşteri
 *   vs. işletme) kurar ve aktif sekmeyi vurgular.
 * - Native'den gelen Expo push jetonunu alır ve `/api/push/register`'a (oturum çerezi
 *   ile) gönderir.
 * - Rota değişimlerini native'e iletir (SPA gezinmelerinde aktif sekme + bazı tam-ekran
 *   rotalarda çubuğu gizleme).
 *
 * İletişim React Native WebView postMessage protokolü üzerinden yürür.
 */

type BridgeSession = { userId: string; role: string; name: string } | null;

type NativeMessage =
  | { type: "pushToken"; token: string; platform?: string }
  | { type: string; [k: string]: unknown };

function postToNative(payload: Record<string, unknown>): void {
  try {
    const w = window as unknown as {
      ReactNativeWebView?: { postMessage: (msg: string) => void };
    };
    w.ReactNativeWebView?.postMessage(JSON.stringify(payload));
  } catch {
    /* native köprü yoksa (normal tarayıcı) sessizce yok say */
  }
}

async function registerPushToken(token: string, platform?: string): Promise<void> {
  try {
    await fetch("/api/push/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, platform: platform ?? "unknown" }),
    });
  } catch {
    /* best-effort; başarısızlık kullanıcı akışını etkilemez */
  }
}

export function AppBridge({ session }: { session: BridgeSession }) {
  const pathname = usePathname();

  // 1) Oturum/rol bilgisini native'e gönder (rol değiştikçe yeniden).
  useEffect(() => {
    postToNative({ type: "session", session, pathname });
    // pathname kasıtlı dışarıda — yalnızca oturum değişiminde gönderilir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.userId, session?.role]);

  // 2) Rota değişimlerini native'e bildir.
  useEffect(() => {
    postToNative({ type: "navigation", pathname });
  }, [pathname]);

  // 3) Native mesajlarını dinle (push jetonu) + köprü-hazır sinyali gönder.
  useEffect(() => {
    function handleRaw(raw: unknown): void {
      if (typeof raw !== "string") return;
      let data: NativeMessage;
      try {
        data = JSON.parse(raw) as NativeMessage;
      } catch {
        return;
      }
      if (!data || typeof data !== "object") return;
      if (
        data.type === "pushToken" &&
        typeof (data as { token?: unknown }).token === "string"
      ) {
        const msg = data as { token: string; platform?: string };
        void registerPushToken(msg.token, msg.platform);
      }
    }

    const onWindowMessage = (e: MessageEvent) => handleRaw(e.data);
    const onDocumentMessage = (e: Event) =>
      handleRaw((e as MessageEvent).data);

    // iOS WKWebView → window; Android → document
    window.addEventListener("message", onWindowMessage);
    document.addEventListener("message", onDocumentMessage);

    // Native, jetonu sayfa yüklenirken global olarak enjekte etmiş olabilir.
    const injected = (window as unknown as { __SALONOR_PUSH_TOKEN__?: string })
      .__SALONOR_PUSH_TOKEN__;
    if (injected) {
      void registerPushToken(injected);
    }

    // Native'e "köprü hazır" + giriş durumu bildir → jetonu şimdi gönderebilir.
    postToNative({ type: "bridgeReady", loggedIn: !!session });

    return () => {
      window.removeEventListener("message", onWindowMessage);
      document.removeEventListener("message", onDocumentMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
