"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

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

export type ContactState = { ok: true } | { error: string } | undefined;

/**
 * Herkese açık iş birliği talebi: /iletisim formundan gelir, admin panelinde
 * "İşletme talepleri" olarak listelenir. IP başına saatte 5 talep ile sınırlı.
 */
export async function submitContactRequestAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) return { error: "Lütfen ad soyad gir." };
  if (!EMAIL_RE.test(email)) return { error: "Geçerli bir e-posta gir." };
  if (phone && phone.replace(/\D/g, "").length < 10)
    return { error: "Telefon numarası geçersiz görünüyor." };

  const ip = await clientIp();
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000).ok)
    return { error: "Çok fazla talep gönderdin. Lütfen biraz sonra tekrar dene." };

  try {
    await db.contactRequest.create({
      data: {
        name: name.slice(0, 120),
        email: email.slice(0, 160),
        phone: phone ? phone.slice(0, 40) : null,
        message: message ? message.slice(0, 1000) : null,
      },
    });
  } catch (e) {
    console.error("submitContactRequestAction:", e);
    return { error: "Talep gönderilemedi, lütfen tekrar dene." };
  }

  revalidatePath("/admin");
  return { ok: true };
}

async function isAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN";
}

/** Talebi işlendi/işlenmedi olarak işaretler (yalnızca ADMIN). */
export async function setContactHandledAction(id: string, handled: boolean) {
  if (!(await isAdmin())) return { ok: false };
  await db.contactRequest.update({ where: { id }, data: { handled } });
  revalidatePath("/admin");
  return { ok: true };
}

/** Talebi siler (yalnızca ADMIN). */
export async function deleteContactRequestAction(id: string) {
  if (!(await isAdmin())) return { ok: false };
  await db.contactRequest.delete({ where: { id } });
  revalidatePath("/admin");
  return { ok: true };
}
