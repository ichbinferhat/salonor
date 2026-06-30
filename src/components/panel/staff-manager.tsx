"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Users, Power, Scissors } from "lucide-react";
import {
  saveStaffAction,
  toggleStaffActiveAction,
  deleteStaffAction,
  setStaffServicesAction,
  type ActionState,
} from "@/server/actions/business";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";
import { PanelPageHeader } from "@/components/panel/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

type Member = {
  id: string;
  name: string;
  title: string;
  image: string;
  active: boolean;
  appointmentCount: number;
  serviceCount: number;
  serviceIds: string[];
};

type ServiceGroup = {
  id: string;
  name: string;
  services: { id: string; name: string }[];
};

export function StaffManager({
  staff,
  serviceGroups,
}: {
  staff: Member[];
  serviceGroups: ServiceGroup[];
}) {
  const t = useDict().panelCatalog.staff;
  const [editing, setEditing] = useState<Member | null | "new">(null);
  const [managingServices, setManagingServices] = useState<Member | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <PanelPageHeader
        title={t.title}
        subtitle={interpolate(t.subtitle, { count: staff.filter((s) => s.active).length })}
        action={
          <Button variant="accent" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> {t.addStaff}
          </Button>
        }
      />

      {staff.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-cream">
            <Users className="size-7 text-ink-mute" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{t.emptyTitle}</h2>
          <p className="mt-2 max-w-sm text-ink-soft">{t.emptyDesc}</p>
          <Button variant="accent" className="mt-5" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> {t.addFirstStaff}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {staff.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border bg-surface p-5 shadow-card ${
                m.active ? "border-line" : "border-line opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar src={m.image} name={m.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display font-bold text-ink">{m.name}</p>
                    {!m.active && <Badge tone="rose">{t.inactiveBadge}</Badge>}
                  </div>
                  <p className="truncate text-sm text-ink-soft">{m.title}</p>
                  <p className="mt-1 text-xs text-ink-mute">
                    {interpolate(t.summary, { services: m.serviceCount, appointments: m.appointmentCount })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <Button variant="outline" size="sm" onClick={() => setEditing(m)}>
                  <Pencil className="size-3.5" /> {t.edit}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setManagingServices(m)}>
                  <Scissors className="size-3.5" /> {t.manageServices}
                </Button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      const res = await toggleStaffActiveAction(m.id);
                      if (res?.error) alert(res.error);
                    })
                  }
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/40"
                >
                  <Power className="size-3.5" /> {m.active ? t.deactivate : t.activate}
                </button>
                <button
                  onClick={() => {
                    // Randevusu olan personel geçmiş kayıtları korumak için pasifleştirilir;
                    // hiç randevusu yoksa kalıcı silinir. Mesajı buna göre netleştir.
                    const msg =
                      m.appointmentCount > 0
                        ? interpolate(t.confirmDeactivate, { name: m.name })
                        : interpolate(t.confirmDelete, { name: m.name });
                    if (confirm(msg)) startTransition(() => deleteStaffAction(m.id));
                  }}
                  disabled={isPending}
                  className="ml-auto rounded-lg p-2 text-ink-soft transition-colors hover:bg-rose-soft hover:text-rose"
                  aria-label={t.deleteAria}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <StaffModal
          member={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {managingServices && (
        <StaffServicesModal
          member={managingServices}
          serviceGroups={serviceGroups}
          onClose={() => setManagingServices(null)}
        />
      )}
    </div>
  );
}

function StaffModal({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const t = useDict().panelCatalog.staff;
  const [state, action] = useActionState<ActionState, FormData>(saveStaffAction, undefined);
  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title={member ? t.modalEditTitle : t.modalNewTitle} maxW="max-w-sm">
      <form action={action} className="space-y-4">
        {member && <input type="hidden" name="id" value={member.id} />}
        <div>
          <Label htmlFor="st-name">{t.nameLabel}</Label>
          <Input id="st-name" name="name" defaultValue={member?.name} required placeholder={t.namePlaceholder} autoFocus />
        </div>
        <div>
          <Label htmlFor="st-title">{t.titleLabel}</Label>
          <Input id="st-title" name="title" defaultValue={member?.title} placeholder={t.titlePlaceholder} />
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onClose}>
            {t.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1">
            {member ? t.save : t.add}
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}

function StaffServicesModal({
  member,
  serviceGroups,
  onClose,
}: {
  member: Member;
  serviceGroups: ServiceGroup[];
  onClose: () => void;
}) {
  const t = useDict().panelCatalog.staff;
  const [selected, setSelected] = useState<Set<string>>(new Set(member.serviceIds));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const hasServices = serviceGroups.length > 0;

  const onSave = () => {
    setError(null);
    startTransition(async () => {
      const res = await setStaffServicesAction(member.id, [...selected]);
      if (res.ok) onClose();
      else setError(res.error ?? null);
    });
  };

  return (
    <Modal open onClose={onClose} title={interpolate(t.servicesModalTitle, { name: member.name })}>
      <div className="space-y-4">
        {hasServices ? (
          <div className="space-y-4">
            {serviceGroups.map((g) => (
              <div key={g.id}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-mute">{g.name}</p>
                <div className="space-y-1.5">
                  {g.services.map((s) => (
                    <label
                      key={s.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink transition-colors hover:border-ink/20"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggle(s.id)}
                        className="size-4 accent-accent"
                      />
                      <span className="truncate">{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line-strong bg-cream px-4 py-8 text-center text-sm text-ink-soft">
            {t.noServices}
          </p>
        )}

        <FormError message={error} />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            type="button"
            onClick={onSave}
            disabled={isPending || !hasServices}
          >
            {isPending ? t.saving : t.saveServices}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
