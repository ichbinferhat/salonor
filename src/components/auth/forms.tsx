"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  loginAction,
  registerAction,
  registerBusinessAction,
  type FormState,
} from "@/server/actions/auth";
import { Input, Label, FormError } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" placeholder="ornek@eposta.com" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Giriş yapılıyor...">
        Giriş yap
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="font-semibold text-accent-deep hover:underline">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(registerAction, undefined);
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" placeholder="Adınız Soyadınız" required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" placeholder="ornek@eposta.com" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="phone">Telefon (isteğe bağlı)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="05xx xxx xx xx" autoComplete="tel" />
      </div>
      <div>
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" name="password" type="password" placeholder="En az 6 karakter" required autoComplete="new-password" minLength={6} />
      </div>
      <FormError message={state?.error} />
      <SubmitButton size="lg" className="w-full" pendingText="Hesap oluşturuluyor...">
        Hesap oluştur
      </SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="font-semibold text-accent-deep hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}

export function BusinessRegisterForm() {
  const [state, action] = useActionState<FormState, FormData>(
    registerBusinessAction,
    undefined
  );
  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" placeholder="Adınız Soyadınız" required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">İş e-postanız</Label>
        <Input id="email" name="email" type="email" placeholder="salon@eposta.com" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" name="password" type="password" placeholder="En az 6 karakter" required autoComplete="new-password" minLength={6} />
      </div>
      <FormError message={state?.error} />
      <SubmitButton variant="accent" size="lg" className="w-full" pendingText="Hesap oluşturuluyor...">
        Devam et — işletmeni kur
      </SubmitButton>
      <p className="text-center text-xs text-ink-mute">
        Devam ederek Kullanım Şartları'nı kabul etmiş olursunuz.
      </p>
    </form>
  );
}
