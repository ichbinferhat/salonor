import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/i18n";
import type { Locale } from "@/i18n/config";

/**
 * Genel erişime açık "Hesap silme talebi" sayfası.
 * Google Play hesap-silme politikası, uygulamadan bağımsız erişilebilen bir web
 * adresi ister; bu sayfa uygulama-içi silme adımlarını ve veri etkisini açıklar.
 * URL: https://salonor.com/hesap-sil
 */

type Copy = {
  title: string;
  lead: string;
  inAppTitle: string;
  steps: string[];
  webTitle: string;
  webText: string;
  dataTitle: string;
  dataItems: string[];
  anonText: string;
  contactText: string;
  loginCta: string;
};

const T: Record<Locale, Copy> = {
  tr: {
    title: "Hesabınızı silme",
    lead: "Salonor hesabınızı ve kişisel verilerinizi istediğiniz zaman kalıcı olarak silebilirsiniz.",
    inAppTitle: "Uygulamadan / web sitesinden silme",
    steps: [
      "Salonor’a giriş yapın.",
      "Hesabım → Profil bölümüne gidin.",
      "“Hesabı sil”e dokunun, şifrenizle onaylayın.",
    ],
    webTitle: "Hesabınıza erişemiyor musunuz?",
    webText:
      "Giriş yapamıyorsanız, kayıtlı e-posta adresinizden destek@salonor.com adresine “Hesap silme talebi” konulu bir e-posta gönderin; hesabınızı 30 gün içinde sileriz.",
    dataTitle: "Silinen veriler",
    dataItems: [
      "Hesabınız ve giriş bilgileriniz",
      "Ad, e-posta ve telefon bilgileriniz",
      "Favorileriniz ve cihaz bildirim kayıtlarınız",
    ],
    anonText:
      "Geçmiş randevu kayıtlarınız, işletmelerin yasal kayıtları için anonimleştirilerek (kişisel bağ koparılarak) saklanır.",
    contactText: "Sorularınız için: destek@salonor.com",
    loginCta: "Giriş yap ve hesabı sil",
  },
  en: {
    title: "Delete your account",
    lead: "You can permanently delete your Salonor account and personal data at any time.",
    inAppTitle: "Delete from the app / website",
    steps: [
      "Sign in to Salonor.",
      "Go to My Account → Profile.",
      "Tap “Delete account” and confirm with your password.",
    ],
    webTitle: "Can’t access your account?",
    webText:
      "If you can’t sign in, email support@salonor.com from your registered email address with the subject “Account deletion request”; we will delete your account within 30 days.",
    dataTitle: "Data that is deleted",
    dataItems: [
      "Your account and login credentials",
      "Your name, email and phone number",
      "Your favorites and device notification records",
    ],
    anonText:
      "Your past appointment records are kept in anonymized form (with personal links removed) for businesses’ legal records.",
    contactText: "Questions: support@salonor.com",
    loginCta: "Sign in and delete account",
  },
  ru: {
    title: "Удаление аккаунта",
    lead: "Вы можете в любой момент безвозвратно удалить свой аккаунт Salonor и личные данные.",
    inAppTitle: "Удаление из приложения / на сайте",
    steps: [
      "Войдите в Salonor.",
      "Перейдите в «Мой аккаунт» → «Профиль».",
      "Нажмите «Удалить аккаунт» и подтвердите паролем.",
    ],
    webTitle: "Нет доступа к аккаунту?",
    webText:
      "Если вы не можете войти, напишите на support@salonor.com с вашего зарегистрированного адреса с темой «Запрос на удаление аккаунта»; мы удалим аккаунт в течение 30 дней.",
    dataTitle: "Какие данные удаляются",
    dataItems: [
      "Ваш аккаунт и учётные данные",
      "Имя, эл. почта и номер телефона",
      "Избранное и записи уведомлений устройства",
    ],
    anonText:
      "История ваших записей хранится в анонимизированном виде (личные связи удаляются) для юридических записей салонов.",
    contactText: "Вопросы: support@salonor.com",
    loginCta: "Войти и удалить аккаунт",
  },
  ar: {
    title: "حذف حسابك",
    lead: "يمكنك حذف حساب Salonor وبياناتك الشخصية نهائيًا في أي وقت.",
    inAppTitle: "الحذف من التطبيق / الموقع",
    steps: [
      "سجّل الدخول إلى Salonor.",
      "انتقل إلى حسابي ← الملف الشخصي.",
      "اضغط على «حذف الحساب» وأكّد بكلمة المرور.",
    ],
    webTitle: "لا يمكنك الوصول إلى حسابك؟",
    webText:
      "إذا تعذّر عليك تسجيل الدخول، أرسل بريدًا إلى support@salonor.com من عنوان بريدك المسجّل بعنوان «طلب حذف الحساب»؛ وسنحذف حسابك خلال 30 يومًا.",
    dataTitle: "البيانات التي يتم حذفها",
    dataItems: [
      "حسابك وبيانات تسجيل الدخول",
      "اسمك وبريدك الإلكتروني ورقم هاتفك",
      "مفضّلاتك وسجلات إشعارات جهازك",
    ],
    anonText:
      "تُحفظ سجلات مواعيدك السابقة بشكل مجهول الهوية (بعد إزالة الروابط الشخصية) للسجلات القانونية للأنشطة التجارية.",
    contactText: "للاستفسارات: support@salonor.com",
    loginCta: "تسجيل الدخول وحذف الحساب",
  },
  de: {
    title: "Konto löschen",
    lead: "Sie können Ihr Salonor-Konto und Ihre persönlichen Daten jederzeit dauerhaft löschen.",
    inAppTitle: "Löschen über App / Website",
    steps: [
      "Melden Sie sich bei Salonor an.",
      "Gehen Sie zu Mein Konto → Profil.",
      "Tippen Sie auf „Konto löschen“ und bestätigen Sie mit Ihrem Passwort.",
    ],
    webTitle: "Kein Zugriff auf Ihr Konto?",
    webText:
      "Wenn Sie sich nicht anmelden können, senden Sie eine E-Mail von Ihrer registrierten Adresse an support@salonor.com mit dem Betreff „Antrag auf Kontolöschung“; wir löschen Ihr Konto innerhalb von 30 Tagen.",
    dataTitle: "Gelöschte Daten",
    dataItems: [
      "Ihr Konto und Ihre Anmeldedaten",
      "Name, E-Mail und Telefonnummer",
      "Favoriten und Geräte-Benachrichtigungsdaten",
    ],
    anonText:
      "Ihre vergangenen Termindaten werden für die gesetzlichen Aufzeichnungen der Unternehmen anonymisiert (ohne persönlichen Bezug) aufbewahrt.",
    contactText: "Fragen: support@salonor.com",
    loginCta: "Anmelden und Konto löschen",
  },
  fr: {
    title: "Supprimer votre compte",
    lead: "Vous pouvez supprimer définitivement votre compte Salonor et vos données personnelles à tout moment.",
    inAppTitle: "Suppression depuis l’app / le site",
    steps: [
      "Connectez-vous à Salonor.",
      "Allez dans Mon compte → Profil.",
      "Touchez « Supprimer le compte » et confirmez avec votre mot de passe.",
    ],
    webTitle: "Vous n’accédez pas à votre compte ?",
    webText:
      "Si vous ne pouvez pas vous connecter, écrivez à support@salonor.com depuis votre adresse e-mail enregistrée avec l’objet « Demande de suppression de compte » ; nous supprimerons votre compte sous 30 jours.",
    dataTitle: "Données supprimées",
    dataItems: [
      "Votre compte et vos identifiants",
      "Nom, e-mail et numéro de téléphone",
      "Favoris et enregistrements de notifications de l’appareil",
    ],
    anonText:
      "Vos anciens rendez-vous sont conservés sous forme anonymisée (sans lien personnel) pour les registres légaux des établissements.",
    contactText: "Questions : support@salonor.com",
    loginCta: "Se connecter et supprimer le compte",
  },
  fa: {
    title: "حذف حساب شما",
    lead: "می‌توانید هر زمان حساب Salonor و داده‌های شخصی خود را برای همیشه حذف کنید.",
    inAppTitle: "حذف از اپلیکیشن / وب‌سایت",
    steps: [
      "وارد Salonor شوید.",
      "به حساب من ← پروفایل بروید.",
      "روی «حذف حساب» بزنید و با رمز عبور تأیید کنید.",
    ],
    webTitle: "به حساب خود دسترسی ندارید؟",
    webText:
      "اگر نمی‌توانید وارد شوید، از آدرس ایمیل ثبت‌شده‌ی خود به support@salonor.com با موضوع «درخواست حذف حساب» ایمیل بزنید؛ حساب شما را ظرف ۳۰ روز حذف می‌کنیم.",
    dataTitle: "داده‌هایی که حذف می‌شود",
    dataItems: [
      "حساب و اطلاعات ورود شما",
      "نام، ایمیل و شماره تلفن شما",
      "علاقه‌مندی‌ها و سوابق اعلان دستگاه",
    ],
    anonText:
      "سوابق نوبت‌های گذشته‌ی شما برای سوابق قانونی کسب‌وکارها به‌صورت ناشناس (بدون پیوند شخصی) نگهداری می‌شود.",
    contactText: "پرسش‌ها: support@salonor.com",
    loginCta: "ورود و حذف حساب",
  },
  es: {
    title: "Eliminar tu cuenta",
    lead: "Puedes eliminar permanentemente tu cuenta de Salonor y tus datos personales en cualquier momento.",
    inAppTitle: "Eliminar desde la app / el sitio web",
    steps: [
      "Inicia sesión en Salonor.",
      "Ve a Mi cuenta → Perfil.",
      "Toca “Eliminar cuenta” y confirma con tu contraseña.",
    ],
    webTitle: "¿No puedes acceder a tu cuenta?",
    webText:
      "Si no puedes iniciar sesión, escribe a support@salonor.com desde tu correo registrado con el asunto “Solicitud de eliminación de cuenta”; eliminaremos tu cuenta en un plazo de 30 días.",
    dataTitle: "Datos que se eliminan",
    dataItems: [
      "Tu cuenta y tus credenciales de acceso",
      "Tu nombre, correo y número de teléfono",
      "Tus favoritos y registros de notificaciones del dispositivo",
    ],
    anonText:
      "Tus citas anteriores se conservan de forma anonimizada (sin vínculo personal) para los registros legales de los negocios.",
    contactText: "Preguntas: support@salonor.com",
    loginCta: "Iniciar sesión y eliminar cuenta",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: (T[locale] ?? T.tr).title };
}

export default async function DeleteAccountInfoPage() {
  const locale = await getLocale();
  const t = T[locale] ?? T.tr;

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 text-pretty text-ink-soft">{t.lead}</p>

        <section className="mt-8 rounded-[20px] border border-line bg-surface p-6 shadow-card">
          <h2 className="font-display text-xl font-bold text-ink">{t.inAppTitle}</h2>
          <ol className="mt-4 space-y-3">
            {t.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-ink-soft">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-deep">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/hesap/profil"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-strong"
          >
            {t.loginCta}
          </Link>
        </section>

        <section className="mt-6 rounded-[20px] border border-line bg-cream/50 p-6">
          <h2 className="font-display text-lg font-bold text-ink">{t.webTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.webText}</p>
        </section>

        <section className="mt-6 rounded-[20px] border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-bold text-ink">{t.dataTitle}</h2>
          <ul className="mt-3 space-y-2">
            {t.dataItems.map((d, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-ink-mute">{t.anonText}</p>
          <p className="mt-4 text-sm font-medium text-ink">{t.contactText}</p>
        </section>
      </div>
    </div>
  );
}
