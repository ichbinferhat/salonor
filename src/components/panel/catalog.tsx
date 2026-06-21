"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { Trash2, Plus, Minus, Power, Pencil } from "lucide-react";
import {
  addPackageAction,
  updatePackageAction,
  deletePackageAction,
  togglePackageAction,
  addCampaignAction,
  updateCampaignAction,
  deleteCampaignAction,
  toggleCampaignAction,
  addProductAction,
  updateProductAction,
  deleteProductAction,
  adjustStockAction,
  setCommissionAction,
  type CatalogState,
} from "@/server/actions/catalog";
import { Input, Label, Textarea, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { formatTl } from "@/lib/format";
import { useDict } from "@/i18n/provider";

/* Düzenlenebilir satırların form-değer tipleri (sayfadan geçirilir). */
export type PackageInitial = {
  id: string;
  name: string;
  description: string | null;
  priceTl: number;
  sessions: number;
  validityDays: number;
};
export type CampaignInitial = {
  id: string;
  code: string;
  description: string | null;
  discountPct: number;
  expiresAt: string | null;
};
export type ProductInitial = {
  id: string;
  name: string;
  priceTl: number;
  stock: number;
  lowStockAt: number;
};

function useResetOnOk(state: CatalogState) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return ref;
}

// Düzenleme modalında reset istemiyoruz; state'i undefined geçince no-op olur.

/* ── Paket formu (ekleme + düzenleme) ── */
export function PackageForm({ initial, onDone }: { initial?: PackageInitial; onDone?: () => void } = {}) {
  const t = useDict().panelCatalog.catalog;
  const editing = !!initial;
  const [state, action] = useActionState<CatalogState, FormData>(
    editing ? updatePackageAction : addPackageAction,
    undefined,
  );
  const ref = useResetOnOk(editing ? undefined : state);
  useEffect(() => {
    if (state?.ok && editing) onDone?.();
  }, [state, editing, onDone]);
  return (
    <form ref={ref} action={action} className="space-y-3.5">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div>
        <Label htmlFor="pkg-name">{t.packageNameLabel}</Label>
        <Input id="pkg-name" name="name" placeholder={t.packageNamePlaceholder} defaultValue={initial?.name} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="pkg-price">{t.priceLabel}</Label>
          <Input id="pkg-price" name="priceTl" type="number" min={1} step={1} inputMode="numeric" defaultValue={initial?.priceTl} required />
        </div>
        <div>
          <Label htmlFor="pkg-sessions">{t.sessionsLabel}</Label>
          <Input id="pkg-sessions" name="sessions" type="number" min={1} defaultValue={initial?.sessions ?? 1} />
        </div>
        <div>
          <Label htmlFor="pkg-validity">{t.daysLabel}</Label>
          <Input id="pkg-validity" name="validityDays" type="number" min={1} defaultValue={initial?.validityDays ?? 30} />
        </div>
      </div>
      <div>
        <Label htmlFor="pkg-desc">{t.descLabel}</Label>
        <Textarea id="pkg-desc" name="description" className="min-h-20" defaultValue={initial?.description ?? ""} />
      </div>
      <FormError message={state?.error} />
      {editing ? (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onDone}>
            {t.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1" pendingText={t.saving}>
            {t.saveChanges}
          </SubmitButton>
        </div>
      ) : (
        <SubmitButton variant="accent" className="w-full" pendingText={t.adding}>
          {t.addPackage}
        </SubmitButton>
      )}
    </form>
  );
}

/* ── Kampanya formu ── */
function todayIso() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function CampaignForm({ initial, onDone }: { initial?: CampaignInitial; onDone?: () => void } = {}) {
  const t = useDict().panelCatalog.catalog;
  const editing = !!initial;
  const [state, action] = useActionState<CatalogState, FormData>(
    editing ? updateCampaignAction : addCampaignAction,
    undefined,
  );
  const ref = useResetOnOk(editing ? undefined : state);
  useEffect(() => {
    if (state?.ok && editing) onDone?.();
  }, [state, editing, onDone]);
  // Düzenlemede geçmiş bir bitiş tarihi varsa min'i ona indir; aksi halde gizlenmez.
  const minExpiry = initial?.expiresAt && initial.expiresAt < todayIso() ? initial.expiresAt : todayIso();
  return (
    <form ref={ref} action={action} className="space-y-3.5">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="cmp-code">{t.codeLabel}</Label>
          <Input id="cmp-code" name="code" placeholder={t.codePlaceholder} defaultValue={initial?.code} required className="uppercase" />
        </div>
        <div>
          <Label htmlFor="cmp-pct">{t.discountLabel}</Label>
          <Input id="cmp-pct" name="discountPct" type="number" min={1} max={90} defaultValue={initial?.discountPct} required />
        </div>
      </div>
      <div>
        <Label htmlFor="cmp-exp">{t.expiresLabel}</Label>
        <Input id="cmp-exp" name="expiresAt" type="date" min={minExpiry} defaultValue={initial?.expiresAt ?? undefined} />
      </div>
      <div>
        <Label htmlFor="cmp-desc">{t.descLabel}</Label>
        <Textarea id="cmp-desc" name="description" className="min-h-20" defaultValue={initial?.description ?? ""} />
      </div>
      <FormError message={state?.error} />
      {editing ? (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onDone}>
            {t.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1" pendingText={t.saving}>
            {t.saveChanges}
          </SubmitButton>
        </div>
      ) : (
        <SubmitButton variant="accent" className="w-full" pendingText={t.adding}>
          {t.createCampaign}
        </SubmitButton>
      )}
    </form>
  );
}

/* ── Ürün formu (ekleme + düzenleme) ── */
export function ProductForm({ initial, onDone }: { initial?: ProductInitial; onDone?: () => void } = {}) {
  const t = useDict().panelCatalog.catalog;
  const editing = !!initial;
  const [state, action] = useActionState<CatalogState, FormData>(
    editing ? updateProductAction : addProductAction,
    undefined,
  );
  const ref = useResetOnOk(editing ? undefined : state);
  useEffect(() => {
    if (state?.ok && editing) onDone?.();
  }, [state, editing, onDone]);
  return (
    <form ref={ref} action={action} className="space-y-3.5">
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div>
        <Label htmlFor="prd-name">{t.productNameLabel}</Label>
        <Input id="prd-name" name="name" placeholder={t.productNamePlaceholder} defaultValue={initial?.name} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="prd-price">{t.priceLabel}</Label>
          <Input id="prd-price" name="priceTl" type="number" min={0} step={1} inputMode="numeric" defaultValue={initial?.priceTl} required />
        </div>
        <div>
          <Label htmlFor="prd-stock">{t.stockLabel}</Label>
          <Input id="prd-stock" name="stock" type="number" min={0} defaultValue={initial?.stock ?? 0} />
        </div>
        <div>
          <Label htmlFor="prd-low">{t.lowStockLabel}</Label>
          <Input id="prd-low" name="lowStockAt" type="number" min={0} defaultValue={initial?.lowStockAt ?? 5} />
        </div>
      </div>
      <FormError message={state?.error} />
      {editing ? (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" type="button" onClick={onDone}>
            {t.cancel}
          </Button>
          <SubmitButton variant="accent" className="flex-1" pendingText={t.saving}>
            {t.saveChanges}
          </SubmitButton>
        </div>
      ) : (
        <SubmitButton variant="accent" className="w-full" pendingText={t.adding}>
          {t.addProduct}
        </SubmitButton>
      )}
    </form>
  );
}

/* ── Sil / Aktiflik / Stok kontrolleri ── */
const DELETE_FN = {
  package: deletePackageAction,
  campaign: deleteCampaignAction,
  product: deleteProductAction,
} as const;

export function ItemDeleteButton({ kind, id }: { kind: keyof typeof DELETE_FN; id: string }) {
  const t = useDict().panelCatalog.catalog;
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => DELETE_FN[kind](id))}
      className="rounded-lg p-2 text-ink-mute transition-colors hover:bg-rose-soft hover:text-rose disabled:opacity-50"
      aria-label={t.deleteAria}
    >
      <Trash2 className="size-4" />
    </button>
  );
}

/* ── Düzenle (kalem) — aynı formu modalda önceden doldurulmuş açar ── */
type EditTarget =
  | { kind: "product"; initial: ProductInitial }
  | { kind: "package"; initial: PackageInitial }
  | { kind: "campaign"; initial: CampaignInitial };

export function ItemEditButton(props: EditTarget) {
  const t = useDict().panelCatalog.catalog;
  const [open, setOpen] = useState(false);
  const title =
    props.kind === "product" ? t.editProduct : props.kind === "package" ? t.editPackage : t.editCampaign;
  const close = () => setOpen(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-ink-mute transition-colors hover:bg-cream hover:text-ink"
        aria-label={t.editAria}
      >
        <Pencil className="size-4" />
      </button>
      {open && (
        <Modal open onClose={close} title={title}>
          {props.kind === "product" && <ProductForm initial={props.initial} onDone={close} />}
          {props.kind === "package" && <PackageForm initial={props.initial} onDone={close} />}
          {props.kind === "campaign" && <CampaignForm initial={props.initial} onDone={close} />}
        </Modal>
      )}
    </>
  );
}

const TOGGLE_FN = {
  package: togglePackageAction,
  campaign: toggleCampaignAction,
} as const;

export function ToggleActiveButton({
  kind,
  id,
  active,
}: {
  kind: keyof typeof TOGGLE_FN;
  id: string;
  active: boolean;
}) {
  const t = useDict().panelCatalog.catalog;
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => TOGGLE_FN[kind](id))}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors disabled:opacity-50 ${
        active ? "bg-mint-soft text-mint" : "bg-cream text-ink-mute"
      }`}
    >
      <Power className="size-3" /> {active ? t.active : t.inactive}
    </button>
  );
}

export function StockStepper({ id, stock, low }: { id: string; stock: number; low: number }) {
  const t = useDict().panelCatalog.catalog;
  const [pending, start] = useTransition();
  const [optimisticStock, addOptimisticDelta] = useOptimistic(stock, (s, delta: number) => Math.max(0, s + delta));
  const danger = optimisticStock <= low;
  const adjust = (delta: number) =>
    start(async () => {
      addOptimisticDelta(delta);
      await adjustStockAction(id, delta);
    });
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending || optimisticStock <= 0}
        onClick={() => adjust(-1)}
        className="flex size-7 items-center justify-center rounded-lg border border-line-strong text-ink transition-colors hover:bg-cream disabled:opacity-40"
        aria-label={t.decreaseAria}
      >
        <Minus className="size-3.5" />
      </button>
      <span className={`w-10 text-center font-display font-extrabold ${danger ? "text-rose" : "text-ink"}`}>
        {optimisticStock}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => adjust(+1)}
        className="flex size-7 items-center justify-center rounded-lg border border-line-strong text-ink transition-colors hover:bg-cream disabled:opacity-40"
        aria-label={t.increaseAria}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

/* ── Prim satırı (canlı hesap) ── */
export function CommissionRow({
  id,
  name,
  image,
  count,
  revenue,
  pct: initialPct,
}: {
  id: string;
  name: string;
  image: string | null;
  count: number;
  revenue: number;
  pct: number;
}) {
  const t = useDict().panelCatalog.catalog;
  const [pct, setPct] = useState(initialPct);
  const [pending, start] = useTransition();
  const commission = Math.round((revenue * pct) / 100);
  const dirty = pct !== initialPct;

  return (
    <tr className="hover:bg-cream/40">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar src={image} name={name} size="sm" />
          <span className="font-semibold text-ink">{name}</span>
        </div>
      </td>
      <td className="px-5 py-3 text-center text-ink-soft">{count}</td>
      <td className="px-5 py-3 text-right font-semibold text-ink">{formatTl(revenue)}</td>
      <td className="px-5 py-3 text-center">
        <div className="inline-flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={100}
            value={pct}
            aria-label={t.commissionLabel}
            onChange={(e) => setPct(Math.max(0, Math.min(100, Math.round(Number(e.target.value)))))}
            className="h-9 w-16 rounded-lg border border-line-strong bg-surface text-center text-sm font-semibold text-ink focus:border-accent focus:outline-none"
          />
          <span className="text-ink-soft">%</span>
        </div>
      </td>
      <td className="px-5 py-3 text-right font-bold text-accent-deep">{formatTl(commission)}</td>
      <td className="px-5 py-3 text-right">
        <button
          type="button"
          disabled={!dirty || pending}
          onClick={() => start(() => setCommissionAction(id, pct))}
          className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-ink-strong disabled:opacity-40"
        >
          {pending ? t.saving : t.saveCommission}
        </button>
      </td>
    </tr>
  );
}
