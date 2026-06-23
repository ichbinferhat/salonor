"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession, getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { getDictionary } from "@/i18n";

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
