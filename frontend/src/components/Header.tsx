"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, locales, type AppLocale } from "@/i18n/routing";
import { type ThemeMode, useTheme } from "@/components/theme/ThemeProvider";
import { useCart } from "@/components/CartProvider";

function replaceLocaleInPath(pathname: string, nextLocale: AppLocale) {
  const parts = pathname.split("/");
  const current = parts[1];
  if (locales.includes(current as AppLocale)) {
    parts[1] = nextLocale;
    return parts.join("/") || `/${nextLocale}`;
  }
  return nextLocale === defaultLocale ? pathname : `/${nextLocale}${pathname}`;
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { theme, setTheme } = useTheme();
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold tracking-tight">
            {t("nav.title")}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={t("cart.title")}
            className="relative inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            <span aria-hidden>🛒</span>
            <span>{t("cart.title")}</span>
            {count > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </button>

          <label className="sr-only" htmlFor="lang">
            {t("nav.language")}
          </label>
          <select
            id="lang"
            className="h-9 rounded-full border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
            value={locale}
            onChange={(e) => {
              const nextLocale = e.target.value as AppLocale;
              router.push(replaceLocaleInPath(pathname, nextLocale));
            }}
          >
            <option value="ar">{t("nav.arabic")}</option>
            <option value="en">{t("nav.english")}</option>
          </select>

          <label className="sr-only" htmlFor="theme">
            {t("nav.theme")}
          </label>
          <select
            id="theme"
            className="h-9 rounded-full border border-black/10 bg-white px-3 text-sm dark:border-white/10 dark:bg-zinc-950"
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
          >
            <option value="light">{t("nav.light")}</option>
            <option value="dark">{t("nav.dark")}</option>
            <option value="system">{t("nav.system")}</option>
          </select>
        </div>
      </div>
    </header>
  );
}
