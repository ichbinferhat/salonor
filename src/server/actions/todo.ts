"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireOwnerBusinessId } from "@/lib/owner";

export type TodoState = { error?: string; ok?: boolean } | undefined;

const PRIORITIES = ["dusuk", "normal", "yuksek"] as const;

export async function addTodoAction(
  _p: TodoState,
  formData: FormData
): Promise<TodoState> {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return { error: "Yetkisiz." };

  const title = String(formData.get("title") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "normal").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();

  if (title.length < 2) return { error: "Görev başlığı gir." };
  if (title.length > 200) return { error: "Görev başlığı çok uzun." };
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate))
    return { error: "Geçerli bir tarih gir." };

  const priority = (PRIORITIES as readonly string[]).includes(priorityRaw)
    ? priorityRaw
    : "normal";

  await db.todoTask.create({
    data: { businessId, title, priority, dueDate: dueDate || null },
  });
  revalidatePath("/panel/yapilacaklar");
  return { ok: true };
}

export async function toggleTodoAction(todoId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const todo = await db.todoTask.findFirst({ where: { id: todoId, businessId } });
  if (!todo) return;
  await db.todoTask.update({
    where: { id: todoId },
    data: { done: !todo.done, completedAt: todo.done ? null : new Date() },
  });
  revalidatePath("/panel/yapilacaklar");
}

export async function deleteTodoAction(todoId: string) {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  const todo = await db.todoTask.findFirst({ where: { id: todoId, businessId } });
  if (!todo) return;
  await db.todoTask.delete({ where: { id: todoId } });
  revalidatePath("/panel/yapilacaklar");
}

/** Tamamlanan tüm görevleri temizler. */
export async function clearDoneTodosAction() {
  const businessId = await requireOwnerBusinessId();
  if (!businessId) return;
  await db.todoTask.deleteMany({ where: { businessId, done: true } });
  revalidatePath("/panel/yapilacaklar");
}
