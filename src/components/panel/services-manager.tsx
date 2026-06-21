"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Clock, Scissors } from "lucide-react";
import {
  saveServiceAction,
  deleteServiceAction,
  addServiceCategoryAction,
  deleteServiceCategoryAction,
  type ActionState,
} from "@/server/actions/business";
import { formatTl, formatDuration } from "@/lib/format";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";
import { PanelPageHeader } from "@/components/panel/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

type Svc = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  priceTl: number;
};
type Cat = { id: string; name: string; services: Svc[] };

export function ServicesManager({ categories }: { categories: Cat[] }) {
  const t = useDict().panelCatalog.services;
  const [editing, setEditing] = useState<{ categoryId: string; service: Svc | null } | null>(null);
  const [addingCat, setAddingCat] = useState(false);
  const [isPending, startTransition] = useTransition();

  const total = categories.reduce((s, c) => s + c.services.length, 0);

  return (
    <div>
      <PanelPageHeader
        title={t.title}
        subtitle={interpolate(t.subtitle, { count: total, sections: categories.length })}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddingCat(true)}>
              <Plus className="size-4" /> {t.addSection}
            </Button>
            {categories.length > 0 && (
              <Button
                variant="accent"
                onClick={() => setEditing({ categoryId: categories[0].id, service: null })}
              >
                <Plus className="size-4" /> {t.addService}
              </Button>
            )}
          </div>
        }
      />

      {categories.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-cream">
            <Scissors className="size-7 text-ink-mute" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
          <p className="mt-2 max-w-sm text-ink-soft">{t.emptyDesc}</p>
          <Button variant="accent" className="mt-5" onClick={() => setAddingCat(true)}>
            <Plus className="size-4" /> {t.addFirstSection}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <section key={cat.id}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink">{cat.name}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing({ categoryId: cat.id, service: null })}
                    className="flex items-center gap-1 text-sm font-semibold text-accent-deep hover:underline"
                  >
                    <Plus className="size-3.5" /> {t.addServiceShort}
                  </button>
                  {cat.services.length === 0 && (
                    <button
                      onClick={() => {
                        if (confirm(interpolate(t.confirmDeleteSection, { name: cat.name })))
                          startTransition(() => deleteServiceCategoryAction(cat.id));
                      }}
                      disabled={isPending}
                      className="text-ink-mute transition-colors hover:text-rose"
                      aria-label={t.deleteSectionAria}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              {cat.services.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-center text-sm text-ink-soft">
                  {t.emptySection}
                </p>
              ) : (
                <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
                  {cat.services.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{s.name}</p>
                        {s.description && (
                          <p className="mt-0.5 line-clamp-2 text-sm text-ink-soft">{s.description}</p>
                        )}
                        <p className="mt-1 flex items-center gap-1 text-sm text-ink-mute">
                          <Clock className="size-3.5" /> {formatDuration(s.durationMin)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-bold text-ink">{formatTl(s.priceTl)}</span>
                        <button
                          onClick={() => setEditing({ categoryId: cat.id, service: s })}
                          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                          aria-label={t.editAria}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(interpolate(t.confirmDeleteService, { name: s.name })))
                              startTransition(() => deleteServiceAction(s.id));
                          }}
                          disabled={isPending}
                          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-rose-soft hover:text-rose"
                          aria-label={t.deleteAria}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {editing && (
        <ServiceModal
          categories={categories}
          categoryId={editing.categoryId}
          service={editing.service}
          onClose={() => setEditing(null)}
        />
      )}
      {addingCat && <CategoryModal onClose={() => setAddingCat(false)} />}
    </div>
  );
}

function ServiceModal({
  categories,
  categoryId,
  service,
  onClose,
}: {
  categories: Cat[];
  categoryId: string;
  service: Svc | null;
  onClose: () => void;
}) {
  const t = useDict().panelCatalog.services;
  const [state, action] = useActionState<ActionState, FormData>(saveServiceAction, undefined);
  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title={service ? t.modalEditTitle : t.modalNewTitle}>
      <form action={action} className="space-y-4">
        {service && <input type="hidden" name="id" value={service.id} />}
        <div>
          <Label htmlFor="sv-cat">{t.sectionLabel}</Label>
          <select
            id="sv-cat"
            name="categoryId"
            defaultValue={categoryId}
            className="h-12 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] focus:border-accent focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="sv-name">{t.nameLabel}</Label>
          <Input id="sv-name" name="name" defaultValue={service?.name} required placeholder={t.namePlaceholder} />
        </div>
        <div>
          <Label htmlFor="sv-desc">{t.descLabel}</Label>
          <Textarea
            id="sv-desc"
            name="description"
            rows={3}
            maxLength={500}
            defaultValue={service?.description ?? ""}
            placeholder={t.descPlaceholder}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sv-dur">{t.durationLabel}</Label>
            <Input id="sv-dur" name="durationMin" type="number" min={5} step={5} defaultValue={service?.durationMin ?? 30} required />
          </div>
          <div>
            <Label htmlFor="sv-price">{t.priceLabel}</Label>
            <Input id="sv-price" name="priceTl" type="number" min={0} step={10} defaultValue={service?.priceTl ?? 0} required />
          </div>
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onClose}>
            {t.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1">
            {service ? t.save : t.add}
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}

function CategoryModal({ onClose }: { onClose: () => void }) {
  const t = useDict().panelCatalog.services;
  const [state, action] = useActionState<ActionState, FormData>(addServiceCategoryAction, undefined);
  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title={t.categoryModalTitle} maxW="max-w-sm">
      <form action={action} className="space-y-4">
        <div>
          <Label htmlFor="cat-name">{t.categoryNameLabel}</Label>
          <Input id="cat-name" name="name" required placeholder={t.categoryNamePlaceholder} autoFocus />
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onClose}>
            {t.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1">{t.add}</SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
