"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";

export type FormState = { error?: string; ok?: boolean } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(raw: FormDataEntryValue | null, fallback: string) {
  const v = typeof raw === "string" ? raw : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : fallback;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email) || password.length < 6) {
    return { error: "E-posta veya şifre hatalı." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });

  const fallback = user.role === "OWNER" ? "/panel" : "/";
  redirect(safeNext(formData.get("next"), fallback));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
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
  await destroySession();
  redirect("/");
}
