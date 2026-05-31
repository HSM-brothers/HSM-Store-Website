import { useI18n } from "@/i18n/I18nProvider";
import { categoryLabel } from "@/lib/categories";
import { useMemo } from "react";

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
  const { t, locale } = useI18n();

  const items = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat,
        label: categoryLabel(locale, cat),
      })),
    [categories, locale],
  );

  return (
    <nav className="shop-category-tree" aria-label={t("nav.categories")}>
      <button
        type="button"
        className={`shop-category-tree__all${activeCategory === null ? " is-active" : ""}`}
        onClick={() => onSelect(null)}
      >
        <span className="shop-category-tree__label">{t("nav.allCategories")}</span>
      </button>

      {items.map((cat) => {
        const active = activeCategory === cat.value;
        return (
          <div key={cat.value} className="shop-category-tree__group">
            <div className="shop-category-tree__row">
              <button
                type="button"
                className={`shop-category-tree__parent${active ? " is-active" : ""}`}
                onClick={() => onSelect(active ? null : cat.value)}
              >
                <span className="shop-category-tree__label">{cat.label}</span>
              </button>
              <span className="shop-category-tree__toggle" aria-hidden="true">
                <span className="shop-category-tree__chev">{"›"}</span>
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

