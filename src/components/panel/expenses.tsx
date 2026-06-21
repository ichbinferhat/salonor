"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  addExpenseAction,
  deleteExpenseAction,
  type ExpenseState,
} from "@/server/actions/expense";
import { EXPENSE_CATEGORIES } from "@/lib/expense";
import { Input, Label, Select, Textarea, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { useDict } from "@/i18n/provider";

export function ExpenseForm({ defaultDate }: { defaultDate: string }) {
  const t = useDict().panelFinance.expenses;
  const [state, action] = useActionState<ExpenseState, FormData>(addExpenseAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3.5">
      <div>
        <Label htmlFor="exp-title">{t.description}</Label>
        <Input id="exp-title" name="title" placeholder={t.descriptionPlaceholder} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="exp-cat">{t.category}</Label>
          <Select id="exp-cat" name="category" defaultValue="Diğer">
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="exp-amount">{t.amountWithSymbol}</Label>
          <Input
            id="exp-amount"
            name="amountTl"
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="0"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="exp-date">{t.date}</Label>
        <Input id="exp-date" name="date" type="date" defaultValue={defaultDate} required />
      </div>
      <div>
        <Label htmlFor="exp-note">{t.note}</Label>
        <Textarea id="exp-note" name="note" placeholder={t.notePlaceholder} className="min-h-20" />
      </div>
      <FormError message={state?.error} />
      <SubmitButton variant="accent" className="w-full" pendingText={t.adding}>
        {t.submit}
      </SubmitButton>
    </form>
  );
}

export function DeleteExpenseButton({ id }: { id: string }) {
  const t = useDict().panelFinance.expenses;
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(t.deleteConfirm)) return;
        start(() => deleteExpenseAction(id));
      }}
      className="rounded-lg p-2 text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
      aria-label={t.deleteAria}
    >
      <Trash2 className="size-4" />
    </button>
  );
}
