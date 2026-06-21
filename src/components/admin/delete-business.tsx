"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBusinessByAdminAction } from "@/server/actions/admin";
import { useDict } from "@/i18n/provider";
import { interpolate } from "@/i18n/interpolate";

/**
 * İşletmeyi kalıcı silen ADMIN butonu. İki aşamalı onay (confirm) ister;
 * sunucu reddederse uyarı gösterir. İlişkili kayıtlar DB cascade ile silinir.
 */
export function DeleteBusiness({
  businessId,
  name,
}: {
  businessId: string;
  name: string;
}) {
  const dict = useDict();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(interpolate(dict.admin.deleteConfirm, { name })))
          return;
        start(async () => {
          const r = await deleteBusinessByAdminAction(businessId);
          if (!r?.ok) alert(dict.admin.deleteError);
        });
      }}
      title={dict.admin.deleteTitle}
      aria-label={dict.admin.deleteTitle}
      className="inline-flex items-center justify-center rounded-full border border-line-strong bg-surface p-1.5 text-ink-mute transition-colors hover:border-rose/40 hover:text-rose disabled:opacity-50"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
