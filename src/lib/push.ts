import { db } from "@/lib/db";

/**
 * Expo push bildirimi gönderimi.
 *
 * Mobil uygulama (salonor-expo) açılışta cihazın Expo push jetonunu
 * `/api/push/register` üzerinden kaydeder. Burada o jetonlara, Expo'nun barındırdığı
 * push servisine ( https://exp.host/--/api/v2/push/send ) tek bir HTTPS isteğiyle
 * bildirim gönderiyoruz — APNs/FCM anahtarı gerekmez, kimlik bilgilerini EAS yönetir.
 *
 * Tüm fonksiyonlar "best-effort"tür: bir gönderim hatası asıl işlemi (randevu
 * oluşturma vb.) ASLA bozmamalı. Bu yüzden hatalar yutulur ve loglanır.
 */

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export type PushMessage = {
  title: string;
  body: string;
  /** Bildirime dokununca uygulamanın açacağı uygulama-içi rota, ör. "/hesap". */
  url?: string;
  /** Rozet sayısı (iOS uygulama ikonu). */
  badge?: number;
  /** Ek serbest veri. */
  data?: Record<string, unknown>;
};

type ExpoPushTicket = {
  to: string;
  sound: "default";
  title: string;
  body: string;
  priority: "high";
  channelId: "default";
  badge?: number;
  data: Record<string, unknown>;
};

function isExpoToken(token: string): boolean {
  return (
    token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken[")
  );
}

/** Diziyi en çok `size` uzunlukta parçalara böler (Expo tek istekte en fazla 100 mesaj alır). */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Verilen Expo jetonlarına aynı mesajı gönderir. Hatalar yutulur (best-effort). */
export async function sendExpoPush(
  tokens: string[],
  message: PushMessage
): Promise<void> {
  const valid = Array.from(new Set(tokens.filter(isExpoToken)));
  if (valid.length === 0) return;

  const data = { url: message.url ?? "/", ...(message.data ?? {}) };
  const messages: ExpoPushTicket[] = valid.map((to) => ({
    to,
    sound: "default",
    title: message.title,
    body: message.body,
    priority: "high",
    channelId: "default",
    ...(typeof message.badge === "number" ? { badge: message.badge } : {}),
    data,
  }));

  const invalidTokens: string[] = [];

  for (const batch of chunk(messages, 100)) {
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
      });
      if (!res.ok) {
        console.error("Expo push HTTP hatası:", res.status, await res.text());
        continue;
      }
      const json = (await res.json()) as {
        data?: Array<{ status: "ok" | "error"; details?: { error?: string } }>;
      };
      // "DeviceNotRegistered" → jeton artık geçersiz; veritabanından temizle.
      json.data?.forEach((ticket, i) => {
        if (
          ticket.status === "error" &&
          ticket.details?.error === "DeviceNotRegistered"
        ) {
          invalidTokens.push(batch[i].to);
        }
      });
    } catch (e) {
      console.error("Expo push gönderim hatası:", e);
    }
  }

  if (invalidTokens.length) {
    try {
      await db.deviceToken.deleteMany({ where: { token: { in: invalidTokens } } });
    } catch {
      /* temizlik hatası önemsiz */
    }
  }
}

/** Bir kullanıcının kayıtlı tüm cihazlarına bildirim gönderir (best-effort). */
export async function notifyUser(
  userId: string | null | undefined,
  message: PushMessage
): Promise<void> {
  if (!userId) return;
  try {
    const devices = await db.deviceToken.findMany({
      where: { userId },
      select: { token: true },
    });
    if (!devices.length) return;
    await sendExpoPush(
      devices.map((d) => d.token),
      message
    );
  } catch (e) {
    console.error("notifyUser hatası:", e);
  }
}
