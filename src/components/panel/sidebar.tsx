"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  Scissors,
  Users,
  UserRound,
  Star,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  BarChart3,
  Wallet,
  Coins,
  Package,
  Boxes,
  Ticket,
  ShoppingCart,
  Bell,
  UserX,
  Receipt,
  Gift,
  Gem,
  MessageSquare,
  Sparkles,
  ListChecks,
} from "lucide-react";
import { useFormStatus } from "react-dom";
import { Logo } from "@/components/logo";
import { logoutAction } from "@/server/actions/auth";
import { getUnseenAppointmentCountAction } from "@/server/actions/business";
import { useDict } from "@/i18n/provider";

/** Kısa, hoş bir "ding" sesi çalar (dosya gerektirmez, Web Audio ile üretilir). */
function playDing() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = [880, 1320]; // A5 -> E6, kısa iki notalı bildirim
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    });
    setTimeout(() => ctx.close().catch(() => {}), 800);
  } catch {
    /* ses çalınamazsa sessizce yok say */
  }
}

function LogoutButton({ className }: { className: string }) {
  const { pending } = useFormStatus();
  const t = useDict().panelCore;
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-70`}>
      {pending ? (
        <>
          <span className="size-4.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {t.loggingOut}
        </>
      ) : (
        <>
          <LogOut className="size-4.5" /> {t.logout}
        </>
      )}
    </button>
  );
}

// Menü mantıklı bölümlere ayrıldı: en sık kullanılan günlük işler üstte,
// daha nadir kullanılan araçlar ve ayarlar altta gruplanır.
// Etiketler çeviri sözlüğünden (panelCore) anahtarla çözülür; yapı/sıra aynı.
const NAV_SECTIONS = [
  {
    titleKey: "navDailyTitle",
    items: [
      ["/panel", "navOverview", LayoutDashboard],
      ["/panel/takvim", "navCalendar", CalendarRange],
      ["/panel/bildirimler", "navNotifications", Bell],
    ],
  },
  {
    titleKey: "navSalesTitle",
    items: [
      ["/panel/kasa", "navCashbox", ShoppingCart],
      ["/panel/borclar", "navDebts", Receipt],
      ["/panel/raporlar", "navReports", BarChart3],
      ["/panel/giderler", "navExpenses", Wallet],
    ],
  },
  {
    titleKey: "navCatalogTitle",
    items: [
      ["/panel/hizmetler", "navServices", Scissors],
      ["/panel/personel", "navStaff", Users],
      ["/panel/prim", "navCommission", Coins],
      ["/panel/paketler", "navPackages", Package],
      ["/panel/urunler", "navProducts", Boxes],
    ],
  },
  {
    titleKey: "navMarketingTitle",
    items: [
      ["/panel/kampanyalar", "navCampaigns", Ticket],
      ["/panel/hediye-ceki", "navGiftCard", Gift],
      ["/panel/para-puan", "navLoyalty", Gem],
      ["/panel/mesajlasma", "navMessaging", MessageSquare],
    ],
  },
  {
    titleKey: "navCustomerTitle",
    items: [
      ["/panel/musteriler", "navCustomers", UserRound],
      ["/panel/kayip-musteri", "navLostCustomers", UserX],
      ["/panel/yorumlar", "navReviews", Star],
    ],
  },
  {
    titleKey: "navToolsTitle",
    items: [
      ["/panel/ai-analiz", "navAiAnalysis", Sparkles],
      ["/panel/yapilacaklar", "navTodos", ListChecks],
      ["/panel/ayarlar", "navSettings", Settings],
    ],
  },
] as const;

/**
 * Kenar çubuğu navigasyon linkleri — MODÜL SEVİYESİNDE tanımlı (PanelSidebar içinde
 * DEĞİL): bir bileşeni render içinde tanımlayıp <NavLinks/> ile kullanmak her render'da
 * yeni tip kimliği üretir; React tüm <nav> alt ağacını söküp yeniden kurar (state/odak
 * kaybı + gereksiz remount). Prop olarak alıp kararlı kimlik korunur.
 */
function NavLinks({
  pathname,
  unseen,
  t,
  onNav,
}: {
  pathname: string;
  unseen: number;
  t: ReturnType<typeof useDict>["panelCore"];
  onNav?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.titleKey} className="flex flex-col gap-1">
          <p className="px-3.5 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-white/35">
            {t[section.titleKey]}
          </p>
          {section.items.map(([href, labelKey, Icon]) => {
            const active = href === "/panel" ? pathname === href : pathname.startsWith(href);
            const badge = href === "/panel/bildirimler" && unseen > 0 ? unseen : 0;
            return (
              <Link
                key={href}
                href={href}
                onClick={onNav}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-accent to-[#7c5cff] text-white shadow-[0_4px_14px_-4px_rgba(108,77,246,0.7)]"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className="flex-1">{t[labelKey]}</span>
                {badge > 0 && (
                  <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-rose px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function PanelSidebar({
  businessName,
  businessSlug,
  initialUnseen = 0,
}: {
  businessName: string;
  businessSlug: string;
  initialUnseen?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useDict().panelCore;
  const [open, setOpen] = useState(false);
  const [unseen, setUnseen] = useState(initialUnseen);
  const prevUnseen = useRef(initialUnseen);

  // Yeni randevuları periyodik kontrol et; sayı artarsa ses çal + listeyi tazele.
  // Native uygulamada (in-app WebView) ATLA — native push + kendi rozeti var; ayrıca
  // gizli/arka plan WebView'de 30sn poll + "ding" sesi rahatsız edici olur.
  useEffect(() => {
    if (typeof document !== "undefined" && document.body.classList.contains("in-app")) return;
    let alive = true;
    const check = async () => {
      if (document.hidden) return;
      try {
        const n = await getUnseenAppointmentCountAction();
        if (!alive) return;
        if (n > prevUnseen.current) {
          playDing();
          router.refresh();
        }
        prevUnseen.current = n;
        setUnseen(n);
      } catch {
        /* sessizce yok say */
      }
    };
    const id = setInterval(check, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [router]);

  // Sunucu (layout) yeni bir sayı gönderdiğinde rozeti anında güncelle — RENDER
  // sırasında prop değişimini izleyerek (setState-in-effect cascade'i yerine).
  // prevUnseen.current'ı burada YAZMAYIZ: artış zaten poll yolundan geçtiğinden
  // (orada prevUnseen.current = n yapılır) güncel kalır; render'da ref yazmak ayrıca
  // "render sırasında ref" kuralını ihlal ederdi.
  const [prevInitial, setPrevInitial] = useState(initialUnseen);
  if (initialUnseen !== prevInitial) {
    setPrevInitial(initialUnseen);
    setUnseen(initialUnseen);
  }

  return (
    <>
      {/* Masaüstü kenar çubuğu */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-ink-strong p-4 lg:flex">
        <div className="px-2 py-3">
          <Logo tone="white" size="sm" href="/panel" />
        </div>
        <div className="mt-2 rounded-xl bg-white/5 px-3.5 py-3 ring-1 ring-white/10">
          <p className="text-xs font-semibold text-white/45">{t.businessLabel}</p>
          <p className="truncate text-sm font-bold text-white">{businessName}</p>
        </div>
        <div className="no-scrollbar mt-4 flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} unseen={unseen} t={t} />
        </div>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link
            href={`/salon/${businessSlug}`}
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4.5" /> {t.viewMyPage}
          </Link>
          <form action={logoutAction}>
            <LogoutButton className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white" />
          </form>
        </div>
      </aside>

      {/* Mobil üst bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink-strong px-4 lg:hidden">
        <Logo tone="white" size="sm" href="/panel" />
        <button
          onClick={() => setOpen(true)}
          className="rounded-full p-2 text-white"
          aria-label={t.menu}
        >
          <Menu className="size-6" />
        </button>
      </header>

      {open && (
        <div
          className="anim-fade fixed inset-0 z-50 bg-ink-strong/60 [animation-duration:150ms] lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex h-dvh w-72 max-w-[85vw] flex-col bg-ink-strong p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex shrink-0 items-center justify-between px-2">
              <Logo tone="white" size="sm" href="/panel" />
              <button onClick={() => setOpen(false)} className="p-2 text-white" aria-label={t.close}>
                <X className="size-5" />
              </button>
            </div>
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
              <NavLinks pathname={pathname} unseen={unseen} t={t} onNav={() => setOpen(false)} />
            </div>
            <div className="shrink-0 space-y-1 border-t border-white/10 pt-3">
              <Link
                href={`/salon/${businessSlug}`}
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65"
              >
                <ExternalLink className="size-4.5" /> {t.viewMyPage}
              </Link>
              <form action={logoutAction}>
                <LogoutButton className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65" />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
