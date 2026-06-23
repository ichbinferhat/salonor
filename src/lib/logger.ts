/**
 * Yapılandırılmış, bağımlılıksız basit logger.
 *
 * Tüm uygulamada `console.*` yerine TEK giriş noktası olarak kullanılır.
 * - Production'da: tek satır JSON (timestamp, level, msg, meta) → log toplayıcılar
 *   (Vercel logs vb.) bunu kolayca ayrıştırır.
 * - Development'ta: insan okunur, renksiz, kısa format.
 *
 * Sentry: `process.env.SENTRY_DSN` ayarlıysa `error` seviyesinde `@sentry/nextjs`'in
 * `captureException` çağrısını DİNAMİK ve guard'lı yaparız. Paket KURULU OLMAYABİLİR;
 * bu yüzden import koşulludur ve hata olursa sessizce geçilir — @sentry/nextjs
 * asla zorunlu (hard) bağımlılık DEĞİLDİR.
 */

type LogLevel = "info" | "warn" | "error";

/** Serbest biçimli ek bağlam. Değerler JSON'a serileştirilebilir olmalıdır. */
type Meta = Record<string, unknown>;

const isProd = process.env.NODE_ENV === "production";

/**
 * Sentry modülünü yalnızca bir kez, tembel (lazy) ve guard'lı şekilde yükler.
 * Paket yoksa ya da DSN tanımlı değilse `null` döner ve bir daha denenmez.
 */
type SentryLike = {
  captureException?: (error: unknown, hint?: unknown) => void;
};

let sentryPromise: Promise<SentryLike | null> | null = null;

function loadSentry(): Promise<SentryLike | null> {
  if (!process.env.SENTRY_DSN) return Promise.resolve(null);
  if (sentryPromise) return sentryPromise;
  // Statik analiz/bundler'ın paketi zorunlu görmemesi için değişken üzerinden import.
  const moduleName = "@sentry/nextjs";
  sentryPromise = import(/* webpackIgnore: true */ moduleName)
    .then((mod) => (mod as SentryLike) ?? null)
    .catch(() => null);
  return sentryPromise;
}

/** Hatayı Sentry'ye (varsa) raporla; her durumda sessiz/güvenli. */
function reportToSentry(error: unknown, meta?: Meta) {
  void loadSentry()
    .then((sentry) => {
      sentry?.captureException?.(error, meta ? { extra: meta } : undefined);
    })
    .catch(() => {
      /* Sentry yüklenemezse veya hata verirse: yut. Logger asla çökmemeli. */
    });
}

/** Tek bir log kaydını uygun formatta konsola yazar. */
function write(level: LogLevel, msg: string, meta?: Meta) {
  const ts = new Date().toISOString();

  if (isProd) {
    // Tek satır JSON — log toplayıcıların ayrıştırması için.
    const line = JSON.stringify({ ts, level, msg, ...(meta ? { meta } : {}) });
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
    return;
  }

  // Development: kısa, okunur format.
  const prefix = `[${level.toUpperCase()}] ${msg}`;
  if (level === "error") console.error(prefix, meta ?? "");
  else if (level === "warn") console.warn(prefix, meta ?? "");
  else console.log(prefix, meta ?? "");
}

export const logger = {
  info(msg: string, meta?: Meta) {
    write("info", msg, meta);
  },

  warn(msg: string, meta?: Meta) {
    write("warn", msg, meta);
  },

  /**
   * Hata kaydı. İkinci argüman `Error` ise veya `meta.error` taşıyorsa,
   * `SENTRY_DSN` ayarlıyken Sentry'ye de raporlanır.
   */
  error(msg: string, meta?: Meta) {
    write("error", msg, meta);
    // Sentry'ye en anlamlı nesneyi gönder: varsa gerçek Error, yoksa mesaj.
    const err =
      meta && meta.error instanceof Error ? meta.error : new Error(msg);
    reportToSentry(err, meta);
  },
};

export type { LogLevel, Meta };
