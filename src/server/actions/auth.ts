"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession, getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { getDictionary } from "@/i18n";
import { signResetToken, readResetToken, hashFingerprint } from "@/lib/pw-reset-token";
import { sendEmail } from "@/lib/email";
import { emailLayout, esc } from "@/lib/email-templates";
import { siteUrl } from "@/lib/site-url";

export type FormState = { error?: string; ok?: boolean; notice?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel'in güvenilir gerçek-istemci IP başlığını önce kullan (spoof'a kapalı);
  // ham x-forwarded-for son çaredir (istemci tarafından sahtelenebilir).
  return (
    h.get("x-real-ip") ??
    h.get("x-vercel-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

function safeNext(raw: FormDataEntryValue | null, fallback: string) {
  const v = typeof raw === "string" ? raw : "";
  // Must start with "/" and the next char must not be "/" or "\" — browsers
  // normalize backslashes to "/", so "/\evil.com" would become the
  // protocol-relative "//evil.com" (open redirect). Reject those.
  return /^\/(?![/\\])/.test(v) ? v : fallback;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Kaba kuvvet (brute-force) şifre denemelerini sınırla: IP başına 10 dk'da 10 deneme.
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 10, 10 * 60 * 1000).ok) {
    const dict = await getDictionary();
    return { error: dict.auth.loginForm.tooManyAttempts };
  }

  if (!EMAIL_RE.test(email) || password.length < 6) {
    return { error: "E-posta veya şifre hatalı." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });

  const fallback =
    user.role === "OWNER" ? "/panel" : user.role === "ADMIN" ? "/admin" : "/";
  redirect(safeNext(formData.get("next"), fallback));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  // Kayıt suistimali koruması: IP başına saatte 8 kayıt (inline kayıtla aynı kova).
  const ip = await clientIp();
  if (!rateLimit(`register:${ip}`, 8, 60 * 60 * 1000).ok) {
    const dict = await getDictionary();
    return { error: dict.auth.loginForm.tooManyAttempts };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 3) return { error: "Lütfen adınızı ve soyadınızı girin." };
  if (!EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta adresi girin." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin." };

  const user = await db.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: await hashPassword(password),
      role: "CUSTOMER",
    },
  });

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect(safeNext(formData.get("next"), "/"));
}

/** İşletme sahibi kaydı: OWNER rolünde kullanıcı oluşturur, kurulum sihirbazına yönlendirir. */
export async function registerBusinessAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Kayıt suistimali koruması: IP başına saatte 8 kayıt (diğer kayıt yollarıyla aynı kova).
  const ip = await clientIp();
  if (!rateLimit(`register:${ip}`, 8, 60 * 60 * 1000).ok) {
    const dict = await getDictionary();
    return { error: dict.auth.loginForm.tooManyAttempts };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 3) return { error: "Lütfen adınızı ve soyadınızı girin." };
  if (!EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta adresi girin." };
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin." };

  const user = await db.user.create({
    data: { name, email, passwordHash: await hashPassword(password), role: "OWNER" },
  });

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect("/isletme/kurulum");
}

/**
 * "Şifremi unuttum" — e-posta alır, kayıtlıysa 1 saatlik sıfırlama bağlantısı yollar.
 * Enumerasyonu önlemek için hesabın var olup olmadığına bakılmaksızın AYNI yanıt döner.
 * E-posta yalnızca RESEND_API_KEY tanımlıysa gerçekten gönderilir (yoksa sessiz mock).
 */
export async function requestPasswordResetAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const ip = await clientIp();
  if (!rateLimit(`pwreset:${ip}`, 5, 60 * 60 * 1000).ok) {
    return { error: "Çok fazla deneme. Lütfen biraz sonra tekrar dene." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta adresi girin." };

  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    try {
      const token = await signResetToken(user.id, user.passwordHash);
      const link = `${siteUrl()}/sifre-sifirla/${token}`;
      await sendEmail({
        to: user.email,
        subject: "Salonor — şifre sıfırlama",
        html: emailLayout({
          heading: "Şifreni sıfırla",
          bodyHtml: `Merhaba ${esc(user.name)},<br/><br/>Hesabının şifresini sıfırlamak için aşağıdaki butona tıkla. Bu bağlantı <b>1 saat</b> geçerlidir. Bu isteği sen yapmadıysan bu e-postayı yok sayman yeterli — şifren değişmez.`,
          cta: { label: "Şifremi sıfırla", url: link },
        }),
        text: `Şifreni sıfırlamak için: ${link} (1 saat geçerli). İsteği sen yapmadıysan yok say.`,
      });
    } catch (e) {
      console.error("şifre sıfırlama e-postası hatası:", e);
    }
  }

  // Her durumda aynı yanıt (hesap enumerasyonunu önler).
  return {
    ok: true,
    notice: "Eğer bu e-posta bir hesaba kayıtlıysa, sıfırlama bağlantısı gönderildi. Gelen kutunu (ve spam'i) kontrol et.",
  };
}

/**
 * Sıfırlama bağlantısındaki token ile yeni şifre belirler. Token, kullanıcının
 * GÜNCEL passwordHash parmak iziyle eşleşmeli (tek-kullanımlık güvencesi).
 * Başarıda oturum açıp rol bazlı yönlendirir.
 */
export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const ip = await clientIp();
  if (!rateLimit(`pwreset:${ip}`, 10, 60 * 60 * 1000).ok) {
    return { error: "Çok fazla deneme. Lütfen biraz sonra tekrar dene." };
  }

  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const password2 = String(formData.get("password2") ?? "");
  if (password.length < 6) return { error: "Şifre en az 6 karakter olmalı." };
  if (password !== password2) return { error: "Şifreler eşleşmiyor." };

  const claims = await readResetToken(token);
  const user = claims ? await db.user.findUnique({ where: { id: claims.uid } }) : null;
  if (!claims || !user || claims.h !== hashFingerprint(user.passwordHash)) {
    return {
      error: "Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir sıfırlama isteği gönder.",
    };
  }

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password) },
  });

  // Başarılı sıfırlama → otomatik giriş + rol bazlı yönlendirme.
  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect(user.role === "OWNER" ? "/panel" : user.role === "ADMIN" ? "/admin" : "/");
}

export async function logoutAction() {
  // İşletme/yönetici çıkışını, DB sorgusu yapmayan hafif /giris sayfasına
  // yönlendir (ana sayfa 7 DB sorgusu çalıştırdığı için yavaştı). Müşteri
  // çıkışı ana sayfaya gider.
  const session = await getSession();
  const dest =
    session && (session.role === "OWNER" || session.role === "ADMIN") ? "/giris" : "/";
  await destroySession();
  redirect(dest);
}
