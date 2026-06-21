"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";
import { todayStr } from "@/lib/datetime";
import { EXPENSE_CATEGORIES } from "@/lib/expense";

export type ExpenseState = { error?: string; ok?: boolean } | undefined;

export async function addExpenseAction(
  _p: ExpenseState,
  formData: FormData
): Promise<ExpenseState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "Diğer").trim();
  const amountTl = Math.round(Number(formData.get("amountTl")));
  const date = String(formData.get("date") ?? "").trim() || todayStr();
  const note = String(formData.get("note") ?? "").trim();

  if (title.length < 2) return { error: "Gider açıklaması gir." };
  if (!Number.isFinite(amountTl) || amountTl <= 0 || amountTl > 100_000_000)
    return { error: "Geçerli bir tutar gir." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Geçerli bir tarih gir." };

  const cat = (EXPENSE_CATEGORIES as readonly string[]).includes(category) ? category : "Diğer";

  await db.expense.create({
    data: { businessId, title, category: cat, amountTl, date, note: note || null },
  });
  revalidatePath("/panel/giderler");
  return { ok: true };
}

export async function deleteExpenseAction(expenseId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const exp = await db.expense.findFirst({ where: { id: expenseId, businessId } });
  if (!exp) return;
  await db.expense.delete({ where: { id: expenseId } });
  revalidatePath("/panel/giderler");
}
