"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteAccountAction } from "@/server/actions/account";
import type { FormState } from "@/server/actions/auth";
import { useLocale } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";
import { Input, Label, FormError } from "@/components/ui/form";

/**
 * Hesabı kalıcı silme bölümü ("tehlikeli bölge").
 *
 * i18n: global tipli sözlüğe dokunmamak için metinler bileşen-içinde, 8 dilde
 * tutulur (useLocale ile seçilir). Onay için kullanıcı hem şifresini girmeli hem de
 * dile özgü onay kelimesini ("SİL"/"DELETE" ...) yazmalıdır — kazara silmeyi önler.
 */

type Copy = {
  title: string;
  desc: string;
  warning: string;
  passwordLabel: string;
  confirmLabel: string;
  confirmWord: string;
  confirmPlaceholder: string;
  open: string;
  cancel: string;
  submit: string;
  pending: string;
};

const T: Record<Locale, Copy> = {
  tr: {
    title: "Hesabı sil",
    desc: "Hesabınızı ve kişisel verilerinizi kalıcı olarak siler.",
    warning:
      "Bu işlem geri alınamaz. Hesabınız, favorileriniz ve kişisel bilgileriniz kalıcı olarak silinir; geçmiş randevu kayıtlarınız işletmeden anonimleştirilir.",
    passwordLabel: "Şifreniz",
    confirmLabel: 'Onaylamak için "SİL" yazın',
    confirmWord: "SİL",
    confirmPlaceholder: "SİL",
    open: "Hesabı sil",
    cancel: "Vazgeç",
    submit: "Hesabımı kalıcı olarak sil",
    pending: "Siliniyor...",
  },
  en: {
    title: "Delete account",
    desc: "Permanently deletes your account and personal data.",
    warning:
      "This action cannot be undone. Your account, favorites and personal information will be permanently deleted; your past appointment records will be anonymized on the business side.",
    passwordLabel: "Your password",
    confirmLabel: 'Type "DELETE" to confirm',
    confirmWord: "DELETE",
    confirmPlaceholder: "DELETE",
    open: "Delete account",
    cancel: "Cancel",
    submit: "Permanently delete my account",
    pending: "Deleting...",
  },
  ru: {
    title: "Удалить аккаунт",
    desc: "Безвозвратно удаляет ваш аккаунт и личные данные.",
    warning:
      "Это действие необратимо. Ваш аккаунт, избранное и личные данные будут безвозвратно удалены; история записей будет анонимизирована на стороне салона.",
    passwordLabel: "Ваш пароль",
    confirmLabel: 'Введите «УДАЛИТЬ» для подтверждения',
    confirmWord: "УДАЛИТЬ",
    confirmPlaceholder: "УДАЛИТЬ",
    open: "Удалить аккаунт",
    cancel: "Отмена",
    submit: "Удалить мой аккаунт навсегда",
    pending: "Удаление...",
  },
  ar: {
    title: "حذف الحساب",
    desc: "يحذف حسابك وبياناتك الشخصية نهائيًا.",
    warning:
      "لا يمكن التراجع عن هذا الإجراء. سيتم حذف حسابك ومفضلاتك ومعلوماتك الشخصية نهائيًا؛ وسيتم إخفاء هوية سجلات مواعيدك السابقة لدى النشاط التجاري.",
    passwordLabel: "كلمة المرور",
    confirmLabel: 'اكتب "حذف" للتأكيد',
    confirmWord: "حذف",
    confirmPlaceholder: "حذف",
    open: "حذف الحساب",
    cancel: "إلغاء",
    submit: "حذف حسابي نهائيًا",
    pending: "جارٍ الحذف...",
  },
  de: {
    title: "Konto löschen",
    desc: "Löscht Ihr Konto und Ihre persönlichen Daten dauerhaft.",
    warning:
      "Diese Aktion kann nicht rückgängig gemacht werden. Ihr Konto, Ihre Favoriten und persönlichen Daten werden dauerhaft gelöscht; Ihre vergangenen Termindaten werden auf der Geschäftsseite anonymisiert.",
    passwordLabel: "Ihr Passwort",
    confirmLabel: 'Geben Sie zur Bestätigung „LÖSCHEN“ ein',
    confirmWord: "LÖSCHEN",
    confirmPlaceholder: "LÖSCHEN",
    open: "Konto löschen",
    cancel: "Abbrechen",
    submit: "Mein Konto dauerhaft löschen",
    pending: "Wird gelöscht...",
  },
  fr: {
    title: "Supprimer le compte",
    desc: "Supprime définitivement votre compte et vos données personnelles.",
    warning:
      "Cette action est irréversible. Votre compte, vos favoris et vos informations personnelles seront définitivement supprimés ; vos anciens rendez-vous seront anonymisés côté établissement.",
    passwordLabel: "Votre mot de passe",
    confirmLabel: 'Saisissez « SUPPRIMER » pour confirmer',
    confirmWord: "SUPPRIMER",
    confirmPlaceholder: "SUPPRIMER",
    open: "Supprimer le compte",
    cancel: "Annuler",
    submit: "Supprimer définitivement mon compte",
    pending: "Suppression...",
  },
  fa: {
    title: "حذف حساب",
    desc: "حساب و داده‌های شخصی شما را برای همیشه حذف می‌کند.",
    warning:
      "این عملیات قابل بازگشت نیست. حساب، علاقه‌مندی‌ها و اطلاعات شخصی شما برای همیشه حذف می‌شود؛ سوابق نوبت‌های گذشته‌ی شما در سمت کسب‌وکار ناشناس می‌شود.",
    passwordLabel: "رمز عبور شما",
    confirmLabel: 'برای تأیید «حذف» را تایپ کنید',
    confirmWord: "حذف",
    confirmPlaceholder: "حذف",
    open: "حذف حساب",
    cancel: "انصراف",
    submit: "حساب من برای همیشه حذف شود",
    pending: "در حال حذف...",
  },
  es: {
    title: "Eliminar cuenta",
    desc: "Elimina permanentemente tu cuenta y tus datos personales.",
    warning:
      "Esta acción no se puede deshacer. Tu cuenta, favoritos e información personal se eliminarán permanentemente; tus citas anteriores se anonimizarán del lado del negocio.",
    passwordLabel: "Tu contraseña",
    confirmLabel: 'Escribe "ELIMINAR" para confirmar',
    confirmWord: "ELIMINAR",
    confirmPlaceholder: "ELIMINAR",
    open: "Eliminar cuenta",
    cancel: "Cancelar",
    submit: "Eliminar mi cuenta permanentemente",
    pending: "Eliminando...",
  },
};

function DangerSubmit({ label, pending }: { label: string; pending: string }) {
  const { pending: busy } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {pending}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function DeleteAccountSection() {
  const locale = useLocale();
  const t = T[locale] ?? T.tr;
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [state, action] = useActionState<FormState, FormData>(
    deleteAccountAction,
    undefined
  );

  const confirmed =
    confirmText.trim().toLocaleUpperCase(locale) ===
    t.confirmWord.toLocaleUpperCase(locale);

  return (
    <section className="mt-12 max-w-lg rounded-[20px] border border-rose/30 bg-rose-soft/40 p-5">
      <h2 className="font-display text-lg font-bold text-rose">{t.title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t.desc}</p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-rose/40 bg-surface px-5 py-2.5 text-sm font-semibold text-rose transition-colors hover:bg-rose/5"
        >
          {t.open}
        </button>
      ) : (
        <form action={action} className="mt-4 space-y-4">
          <p className="rounded-xl bg-surface/70 p-3 text-sm leading-relaxed text-ink-soft ring-1 ring-rose/20">
            {t.warning}
          </p>
          <div>
            <Label htmlFor="del-password">{t.passwordLabel}</Label>
            <Input
              id="del-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <Label htmlFor="del-confirm">{t.confirmLabel}</Label>
            <Input
              id="del-confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={t.confirmPlaceholder}
              autoComplete="off"
            />
          </div>

          <FormError message={state?.error} />

          <div className="flex items-center gap-3">
            {confirmed ? (
              <DangerSubmit label={t.submit} pending={t.pending} />
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-rose/40 px-5 py-2.5 text-sm font-semibold text-white opacity-60"
              >
                {t.submit}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmText("");
              }}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
