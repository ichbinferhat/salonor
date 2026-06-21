import { ListChecks, CircleDot, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { getOwnerBusiness } from "@/lib/owner";
import { getDictionary } from "@/i18n";
import { interpolate } from "@/i18n/interpolate";
import { todayStr, formatDateTr } from "@/lib/datetime";
import { PanelPageHeader } from "@/components/panel/page-header";
import {
  TodoForm,
  TodoToggle,
  DeleteTodoButton,
  ClearDoneButton,
} from "@/components/panel/todos";

export const metadata = { title: "Yapılacaklar Listesi" };

const PRIORITY_META: Record<string, { tone: string; rank: number }> = {
  yuksek: { tone: "bg-rose-soft text-rose", rank: 0 },
  normal: { tone: "bg-sea-soft text-sea", rank: 1 },
  dusuk: { tone: "bg-cream text-ink-soft", rank: 2 },
};

export default async function TodoPage() {
  const business = (await getOwnerBusiness())!;
  const dict = await getDictionary();
  const td = dict.panelOther.todos;
  const priorityLabel: Record<string, string> = {
    yuksek: td.priorityHigh,
    normal: td.priorityNormal,
    dusuk: td.priorityLow,
  };
  const today = todayStr();

  const todos = await db.todoTask.findMany({
    where: { businessId: business.id },
    orderBy: [{ done: "asc" }, { createdAt: "desc" }],
  });

  const open = todos
    .filter((t) => !t.done)
    .sort((a, b) => {
      const pr =
        (PRIORITY_META[a.priority]?.rank ?? 1) - (PRIORITY_META[b.priority]?.rank ?? 1);
      if (pr !== 0) return pr;
      // son tarihi olanlar önce, yakın tarih üstte
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  const done = todos.filter((t) => t.done);

  const stats = [
    { label: td.statOpen, value: open.length, icon: CircleDot, tone: "bg-accent-soft text-accent-deep" },
    { label: td.statDone, value: done.length, icon: CheckCircle2, tone: "bg-mint-soft text-mint" },
  ];

  return (
    <div className="p-5 sm:p-8">
      <PanelPageHeader
        title={td.title}
        subtitle={td.subtitle}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className={`inline-flex size-10 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">{td.addTitle}</h2>
          <TodoForm defaultDate={today} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-bold text-ink">
              {interpolate(td.listTitle, { n: open.length })}
            </h2>
            <ClearDoneButton count={done.length} />
          </div>

          {todos.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream">
                <ListChecks className="size-7 text-ink-mute" />
              </span>
              <p className="mt-4 font-semibold text-ink">{td.emptyTitle}</p>
              <p className="mt-1 text-sm text-ink-soft">{td.emptyDesc}</p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {[...open, ...done].map((t) => {
                const meta = PRIORITY_META[t.priority] ?? PRIORITY_META.normal;
                const overdue = !t.done && t.dueDate != null && t.dueDate < today;
                return (
                  <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                    <TodoToggle id={t.id} done={t.done} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate font-semibold ${
                          t.done ? "text-ink-mute line-through" : "text-ink"
                        }`}
                      >
                        {t.title}
                      </p>
                      {t.dueDate && (
                        <p
                          className={`truncate text-xs ${
                            overdue ? "font-semibold text-rose" : "text-ink-mute"
                          }`}
                        >
                          {overdue ? td.overduePrefix : ""}
                          {formatDateTr(t.dueDate, { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    {!t.done && (
                      <span
                        className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline ${meta.tone}`}
                      >
                        {priorityLabel[t.priority] ?? td.priorityNormal}
                      </span>
                    )}
                    <DeleteTodoButton id={t.id} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
