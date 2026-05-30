import { useI18n } from "@/i18n/I18nProvider";
import { categoryLabel } from "@/lib/categories";

type Props = {
  categories: string[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
};

export default function CategorySidebar({
  categories,
  activeCategory,
  onSelect,
}: Props) {
  const { t, locale, dir } = useI18n();

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-3xl border border-line bg-card p-4">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <div dir={dir} className="text-sm font-semibold">
            {t("nav.categories")}
          </div>
          {activeCategory && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="text-xs font-medium text-accent transition-colors hover:opacity-85"
            >
              {t("common.clear")}
            </button>
          )}
        </div>

        <nav dir={dir} className="flex flex-col gap-1" aria-label={t("nav.filter")}>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={`flex h-10 items-center justify-between rounded-2xl px-3 text-sm transition-colors ${
              activeCategory === null
                ? "bg-accent text-accent-fg"
                : "hover:bg-bg-subtle"
            }`}
          >
            <span className="truncate">{t("nav.allCategories")}</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelect(cat === activeCategory ? null : cat)}
              className={`flex h-10 items-center justify-between rounded-2xl px-3 text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-accent text-accent-fg"
                  : "hover:bg-bg-subtle"
              }`}
            >
              <span className="truncate">{categoryLabel(locale, cat)}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
