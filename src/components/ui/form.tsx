import type { ComponentProps, ReactNode } from "react";

const FIELD_BASE =
  "w-full rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-ink placeholder:text-ink-mute transition-colors hover:border-ink/30 focus:border-accent focus:outline-none disabled:opacity-50";

export function Input({
  className = "",
  ...props
}: ComponentProps<"input"> & { className?: string }) {
  return <input className={`${FIELD_BASE} h-12 ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ...props
}: ComponentProps<"textarea"> & { className?: string }) {
  return (
    <textarea
      className={`${FIELD_BASE} min-h-28 py-3 leading-relaxed ${className}`}
      {...props}
    />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: ComponentProps<"select"> & { className?: string; children: ReactNode }) {
  return (
    <select
      className={`${FIELD_BASE} h-12 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%3E%3Cpath%20stroke%3D%22%234a5470%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.6%22%20d%3D%22m4%206%204%204%204-4%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[position:right_14px_center] bg-no-repeat pr-10 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({
  className = "",
  children,
  ...props
}: ComponentProps<"label"> & { className?: string; children: ReactNode }) {
  return (
    <label
      className={`mb-1.5 block text-sm font-semibold text-ink ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-xs text-ink-mute">{children}</p>;
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  // role="alert" (assertive canlı bölge): gönderim sonrası beliren hata ekran
  // okuyucuya otomatik seslendirilir (aksi halde görme engelli kullanıcı hatayı fark etmez).
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose/20 bg-rose-soft px-4 py-3 text-sm font-medium text-rose"
    >
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="rounded-xl border border-mint/20 bg-mint-soft px-4 py-3 text-sm font-medium text-mint"
    >
      {message}
    </div>
  );
}
