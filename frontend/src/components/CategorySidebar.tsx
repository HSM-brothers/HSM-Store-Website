import { useI18n } from "@/i18n/I18nProvider";
import { categoryLabel } from "@/lib/categories";
import { useMemo, useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat,
        label: categoryLabel(locale, cat),
      })),
    [categories, locale],
  );

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="shop-sidebar">
        <div className="shop-sidebar__header">
          <p className="shop-sidebar__eyebrow">{t("nav.categories")}</p>
          <button
            type="button"
            className="icon-button shop-sidebar__collapse"
            aria-label={collapsed ? t("common.expand") : t("common.collapse")}
            title={collapsed ? t("common.expand") : t("common.collapse")}
            onClick={() => setCollapsed((v) => !v)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h4" />
              <path d="M7 5v14" />
              <path d="M21 5H11a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10" />
            </svg>
          </button>
        </div>

        {!collapsed && (
          <div className="shop-sidebar__inner">
            <nav className="shop-category-tree" aria-label={t("nav.categories")}>
              <button
                type="button"
                className={`shop-category-tree__all${activeCategory === null ? " is-active" : ""}`}
                onClick={() => onSelect(null)}
              >
                <span className="shop-category-tree__label">
                  {t("nav.allCategories")}
                </span>
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
                        <span className="shop-category-tree__label">
                          {cat.label}
                        </span>
                      </button>
                      <span className="shop-category-tree__toggle" aria-hidden="true">
                        <span className="shop-category-tree__chev">{"›"}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
