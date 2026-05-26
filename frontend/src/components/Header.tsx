"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { defaultLocale, locales, type AppLocale } from "@/i18n/routing";

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

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold tracking-tight">
            {t("nav.title")}
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            value={theme ?? "system"}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">{t("nav.light")}</option>
            <option value="dark">{t("nav.dark")}</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
    </header>
  );
}
