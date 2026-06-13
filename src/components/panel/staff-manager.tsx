"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Users, Power } from "lucide-react";
import {
  saveStaffAction,
  toggleStaffActiveAction,
  deleteStaffAction,
  type ActionState,
} from "@/server/actions/business";
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
};

export function StaffManager({ staff }: { staff: Member[] }) {
  const [editing, setEditing] = useState<Member | null | "new">(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <PanelPageHeader
        title="Personel"
        subtitle={`${staff.filter((s) => s.active).length} aktif personel`}
        action={
          <Button variant="accent" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> Personel ekle
          </Button>
        }
      />

      {staff.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-cream">
            <Users className="size-7 text-ink-mute" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">Henüz personel yok</h2>
          <p className="mt-2 max-w-sm text-ink-soft">
            Ekibini ekle; randevular bu kişilere atanabilsin.
          </p>
          <Button variant="accent" className="mt-5" onClick={() => setEditing("new")}>
            <Plus className="size-4" /> İlk personeli ekle
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
                    {!m.active && <Badge tone="rose">Pasif</Badge>}
                  </div>
                  <p className="truncate text-sm text-ink-soft">{m.title}</p>
                  <p className="mt-1 text-xs text-ink-mute">
                    {m.serviceCount} hizmet · {m.appointmentCount} randevu
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <Button variant="outline" size="sm" onClick={() => setEditing(m)}>
                  <Pencil className="size-3.5" /> Düzenle
                </Button>
                <button
                  onClick={() => startTransition(() => toggleStaffActiveAction(m.id))}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/40"
                >
                  <Power className="size-3.5" /> {m.active ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button
                  onClick={() => startTransition(() => deleteStaffAction(m.id))}
                  disabled={isPending}
                  className="ml-auto rounded-lg p-2 text-ink-soft transition-colors hover:bg-rose-soft hover:text-rose"
                  aria-label="Sil"
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
    </div>
  );
}

function StaffModal({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const [state, action] = useActionState<ActionState, FormData>(saveStaffAction, undefined);
  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Modal open onClose={onClose} title={member ? "Personeli düzenle" : "Yeni personel"} maxW="max-w-sm">
      <form action={action} className="space-y-4">
        {member && <input type="hidden" name="id" value={member.id} />}
        <div>
          <Label htmlFor="st-name">Ad Soyad</Label>
          <Input id="st-name" name="name" defaultValue={member?.name} required placeholder="Örn. Elif Aydın" autoFocus />
        </div>
        <div>
          <Label htmlFor="st-title">Ünvan</Label>
          <Input id="st-title" name="title" defaultValue={member?.title} placeholder="Örn. Renk Uzmanı" />
        </div>
        <FormError message={state?.error} />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <SubmitButton variant="accent" className="flex-1">
            {member ? "Kaydet" : "Ekle"}
          </SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
