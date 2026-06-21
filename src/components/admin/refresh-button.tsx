"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RotateCw } from "lucide-react";
import { useDict } from "@/i18n/provider";

export function RefreshButton() {
  const dict = useDict();
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => start(() => router.refresh())}
      disabled={pending}
      aria-label={dict.admin.refreshAria}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
    >
      <RotateCw className={`size-4 ${pending ? "animate-spin" : ""}`} />
      <span className="hidden sm:inline">{dict.admin.refresh}</span>
    </button>
  );
}
