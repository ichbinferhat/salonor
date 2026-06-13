import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { BusinessRegisterForm } from "@/components/auth/forms";

export const metadata: Metadata = { title: "İşletmenizi ekleyin" };

export default async function BusinessRegisterPage() {
  const session = await getSession();
  if (session?.role === "OWNER") {
    const business = await db.business.findUnique({
      where: { ownerId: session.userId },
      select: { id: true },
    });
    redirect(business ? "/panel" : "/isletme/kurulum");
  }
  if (session) redirect("/");

  return (
    <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent-deep">
          Salonor Business
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink">
          İşletmenizi ücretsiz ekleyin
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink-soft">
          Hesabınızı oluşturun; 5 dakikalık kurulum sihirbazıyla salonunuz
          yayına hazır olsun.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            "Sınırsız online randevu — komisyonsuz",
            "Personel kolonlu akıllı takvim",
            "Hizmet ve fiyat listesi yönetimi",
            "Doğrulanmış müşteri yorumları",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 text-ink">
              <span className="flex size-6 items-center justify-center rounded-full bg-mint-soft">
                <Check className="size-3.5 text-mint" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="anim-rise order-1 w-full max-w-md justify-self-center rounded-[28px] border border-line bg-surface p-8 shadow-card lg:order-2">
        <h2 className="mb-6 font-display text-2xl font-bold text-ink">
          İşletme hesabı oluştur
        </h2>
        <BusinessRegisterForm />
      </div>
    </div>
  );
}
