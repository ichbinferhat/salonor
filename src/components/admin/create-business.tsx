"use client";

import { useActionState, useEffect, useState } from "react";
import { X, Plus, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  createBusinessByAdminAction,
  type CreateBizState,
} from "@/server/actions/admin";
import { Input, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

function genPassword() {
  return (
    Math.random().toString(36).slice(2, 8) + Math.floor(Math.random() * 90 + 10)
  );
}

export function CreateBusiness() {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [state, action] = useActionState<CreateBizState, FormData>(
    createBusinessByAdminAction,
    undefined
  );

  useEffect(() => {
    if (open) setPw((p) => p || genPassword());
  }, [open]);

  function close() {
    setOpen(false);
    setPw("");
  }

  const done = state && "ok" in state && state.ok;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-accent-deep active:scale-[0.98]"
      >
        <Plus className="size-4" /> Yeni işletme oluştur
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-strong/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="anim-rise max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-surface p-6 shadow-pop sm:rounded-[28px]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">
                {done ? "İşletme oluşturuldu" : "Yeni işletme oluştur"}
              </h2>
              <button
                onClick={close}
                className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream"
                aria-label="Kapat"
              >
                <X className="size-5" />
              </button>
            </div>

            {done ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 rounded-2xl bg-mint-soft p-4 text-mint">
                  <CheckCircle2 className="size-5 shrink-0" />
                  <span className="text-sm font-semibold">
                    İşletme vitrinde yayında. Sahibi aşağıdaki bilgilerle girip
                    özelleştirebilir.
                  </span>
                </div>
                <div className="space-y-2 rounded-2xl border border-line bg-cream p-4 text-sm">
                  <Row label="Giriş e-postası" value={state.email} />
                  <Row label="Geçici şifre" value={state.password} />
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/salon/${state.slug}`}
                    target="_blank"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-surface py-2.5 text-sm font-semibold text-ink hover:bg-cream"
                  >
                    <ExternalLink className="size-4" /> Vitrini gör
                  </Link>
                  <button
                    onClick={close}
                    className="flex-1 rounded-full bg-ink py-2.5 text-sm font-bold text-white hover:bg-ink-strong"
                  >
                    Tamam
                  </button>
                </div>
              </div>
            ) : (
              <form action={action} className="space-y-3.5">
                <div>
                  <Label htmlFor="cb-name">İşletme adı</Label>
                  <Input id="cb-name" name="name" required placeholder="Glow Studio" />
                </div>
                <div>
                  <Label htmlFor="cb-owner">Sahip adı (opsiyonel)</Label>
                  <Input id="cb-owner" name="ownerName" placeholder="Ad Soyad" />
                </div>
                <div>
                  <Label htmlFor="cb-email">Giriş e-postası</Label>
                  <Input id="cb-email" name="email" type="email" required placeholder="isletme@ornek.com" />
                </div>
                <div>
                  <Label htmlFor="cb-pw">Geçici şifre</Label>
                  <Input
                    id="cb-pw"
                    name="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                  />
                </div>
                <FormError message={state && "error" in state ? state.error : undefined} />
                <SubmitButton className="w-full">İşletmeyi oluştur</SubmitButton>
                <p className="text-center text-xs text-ink-mute">
                  İşletme, vitrinde (işletmeler) otomatik görünür.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-soft">{label}</span>
      <span className="font-mono font-bold text-ink">{value}</span>
    </div>
  );
}
