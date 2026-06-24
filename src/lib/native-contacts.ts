/**
 * Telefon rehberinden kişi seçimi — panel randevu formu için.
 *
 * İki yol, otomatik seçilir:
 *  1) Native uygulama (Salonor iOS/Android WebView): `pickContact` köprü mesajı atılır,
 *     native taraf rehberi açar ve seçilen kişiyi `window.__SALONOR_ON_CONTACT__` ile
 *     geri verir. iOS + Android'de çalışır.
 *  2) Tarayıcı (Android Chrome / TWA): tarayıcının Contact Picker API'si kullanılır.
 *
 * Hiçbiri yoksa (ör. iOS Safari web) seçici gizlenir → kullanıcı elle yazar.
 * Rehber sunucuya GİTMEZ; yalnızca seçilen tek kişi forma dolar.
 */

export type PickedContact = { name: string; phone: string };

type RNWebView = { postMessage: (msg: string) => void };
type NavContacts = {
  select: (props: string[], opts?: { multiple?: boolean }) => Promise<unknown[]>;
};

function nativeBridge(): RNWebView | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { ReactNativeWebView?: RNWebView };
  return w.ReactNativeWebView ?? null;
}

function webContactPicker(): NavContacts | null {
  if (typeof navigator === "undefined") return null;
  const n = navigator as unknown as { contacts?: NavContacts };
  return n.contacts && typeof n.contacts.select === "function" ? n.contacts : null;
}

/** Bu cihazda rehberden seçim mümkün mü (buton sadece o zaman gösterilir). */
export function isContactPickerAvailable(): boolean {
  return !!nativeBridge() || !!webContactPicker();
}

/** Rehberi açar, seçilen kişiyi döndürür (iptal/erişim yoksa null). */
export function pickContact(): Promise<PickedContact | null> {
  const bridge = nativeBridge();
  if (bridge) {
    // Native yol: köprü mesajı at, native'in çözmesini bekle.
    return new Promise((resolve) => {
      const w = window as unknown as {
        __SALONOR_ON_CONTACT__?: (data: unknown) => void;
      };
      // Önceki bir istek hâlâ bekliyorsa (çift dokunma) onu temizle ki askıda kalmasın.
      if (typeof w.__SALONOR_ON_CONTACT__ === "function") {
        try {
          w.__SALONOR_ON_CONTACT__(null);
        } catch {
          /* yoksay */
        }
      }
      let settled = false;
      const t: { id?: ReturnType<typeof setTimeout> } = {};
      const finish = (c: PickedContact | null) => {
        if (settled) return;
        settled = true;
        if (t.id) clearTimeout(t.id);
        w.__SALONOR_ON_CONTACT__ = undefined;
        resolve(c);
      };
      w.__SALONOR_ON_CONTACT__ = (data: unknown) => {
        if (!data || typeof data !== "object") return finish(null);
        const d = data as { name?: unknown; phone?: unknown };
        finish({
          name: typeof d.name === "string" ? d.name : "",
          phone: typeof d.phone === "string" ? d.phone : "",
        });
      };
      // Güvenlik ağı: native (eski sürüm/çökme/WebView yenilenmesi) hiç yanıt vermezse
      // söz sonsuza dek askıda kalmasın — 60 sn sonra iptal say ve global'i temizle.
      t.id = setTimeout(() => finish(null), 60_000);
      try {
        bridge.postMessage(JSON.stringify({ type: "pickContact" }));
      } catch {
        finish(null);
      }
    });
  }

  const picker = webContactPicker();
  if (picker) {
    return (async () => {
      try {
        const result = await picker.select(["name", "tel"], { multiple: false });
        const c = Array.isArray(result) ? result[0] : null;
        if (!c || typeof c !== "object") return null;
        const rec = c as { name?: unknown; tel?: unknown };
        const name = Array.isArray(rec.name)
          ? String(rec.name[0] ?? "")
          : typeof rec.name === "string"
            ? rec.name
            : "";
        const phone = Array.isArray(rec.tel)
          ? String(rec.tel[0] ?? "")
          : typeof rec.tel === "string"
            ? rec.tel
            : "";
        if (!name && !phone) return null;
        return { name, phone };
      } catch {
        return null; // kullanıcı iptal etti veya izin vermedi
      }
    })();
  }

  return Promise.resolve(null);
}
