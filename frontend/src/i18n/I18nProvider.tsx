import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultLocale,
  formatCount,
  formatResults,
  getDirection,
  isAppLocale,
  messages,
  type AppLocale,
} from "@/i18n/messages";

const STORAGE_KEY = "hsm.locale.v1";

type I18nContextValue = {
  locale: AppLocale;
  dir: "rtl" | "ltr";
  setLocale: (locale: AppLocale) => void;
  t: (path: string) => string;
  results: (count: number) => string;
  count: (count: number) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(locale: AppLocale, path: string): string {
  const parts = path.split(".");
  let node: unknown = messages[locale];
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof node === "string" ? node : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(defaultLocale);

  // Restore saved locale on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isAppLocale(stored)) {
      setLocaleState(stored);
    }
  }, []);

  // Keep <html lang/dir> in sync.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = getDirection(locale);
  }, [locale]);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: getDirection(locale),
      setLocale,
      t: (path: string) => lookup(locale, path),
      results: (count: number) => formatResults(locale, count),
      count: (count: number) => formatCount(locale, count),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
