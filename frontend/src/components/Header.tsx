import { useI18n } from "@/i18n/I18nProvider";
import { useTheme, type ThemeMode } from "@/components/ThemeProvider";
import { useCart } from "@/components/CartProvider";

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2.1 12.4a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L21.5 7H5.3" />
    </svg>
  );
}

const THEME_ORDER: ThemeMode[] = ["light", "dark", "system"];

type Props = {
  onHome: () => void;
};

export default function Header({ onHome }: Props) {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const { count, openCart } = useCart();

  const cycleTheme = () => {
    const idx = THEME_ORDER.indexOf(theme);
    setTheme(THEME_ORDER[(idx + 1) % THEME_ORDER.length]);
  };

  const themeGlyph = theme === "light" ? "☀" : theme === "dark" ? "☾" : "◐";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-5 px-5 py-3.5">
        <button
          type="button"
          onClick={onHome}
          className="flex shrink-0 flex-col items-start leading-none"
        >
          <span className="font-serif text-2xl font-semibold tracking-tight">
            {t("nav.brand")}
            <span className="text-fg-muted">.store</span>
          </span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-fg-muted">
            {t("nav.brandTagline")}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="h-9 rounded-full px-3 text-sm font-medium text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
            aria-label={t("nav.language")}
          >
            {locale === "ar" ? "EN" : "ع"}
          </button>
          <button
            type="button"
            onClick={cycleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full text-base text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
            aria-label={t("nav.theme")}
            title={t(`nav.${theme}`)}
          >
            <span aria-hidden>{themeGlyph}</span>
          </button>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-bg-subtle"
            aria-label={t("cart.title")}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1 -end-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-fg">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

