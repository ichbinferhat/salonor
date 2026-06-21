"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { Trash2, Check } from "lucide-react";
import {
  addTodoAction,
  toggleTodoAction,
  deleteTodoAction,
  clearDoneTodosAction,
  type TodoState,
} from "@/server/actions/todo";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";
import { Input, Label, Select, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function TodoForm({ defaultDate }: { defaultDate: string }) {
  const t = useDict().panelOther.todos;
  const [state, action] = useActionState<TodoState, FormData>(addTodoAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      <div>
        <Label htmlFor="todo-title">{t.taskLabel}</Label>
        <Input id="todo-title" name="title" placeholder={t.taskPlaceholder} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="todo-priority">{t.priorityLabel}</Label>
          <Select id="todo-priority" name="priority" defaultValue="normal">
            <option value="dusuk">{t.priorityLow}</option>
            <option value="normal">{t.priorityNormal}</option>
            <option value="yuksek">{t.priorityHigh}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="todo-due">{t.dueDateLabel}</Label>
          <Input id="todo-due" name="dueDate" type="date" defaultValue={defaultDate} />
        </div>
      </div>
      <FormError message={state?.error} />
      <SubmitButton variant="accent" className="w-full" pendingText={t.adding}>
        {t.addButton}
      </SubmitButton>
    </form>
  );
}

export function TodoToggle({ id, done }: { id: string; done: boolean }) {
  const t = useDict().panelOther.todos;
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => toggleTodoAction(id))}
      aria-label={done ? t.undo : t.markDone}
      className={`flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors disabled:opacity-50 ${
        done
          ? "border-mint bg-mint text-white"
          : "border-line-strong bg-surface text-transparent hover:border-mint"
      }`}
    >
      <Check className="size-4" strokeWidth={3} />
    </button>
  );
}

export function DeleteTodoButton({ id }: { id: string }) {
  const t = useDict().panelOther.todos;
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => deleteTodoAction(id))}
      className="rounded-lg p-2 text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
      aria-label={t.deleteAria}
    >
      <Trash2 className="size-4" />
    </button>
  );
}

export function ClearDoneButton({ count }: { count: number }) {
  const t = useDict().panelOther.todos;
  const [pending, start] = useTransition();
  if (count === 0) return null;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => clearDoneTodosAction())}
      className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
    >
      {interpolate(t.clearDone, { n: count })}
    </button>
  );
}
