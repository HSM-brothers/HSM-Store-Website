import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import CategorySidebar from "@/components/CategorySidebar";
import ShopShellLayout from "@/components/ShopShellLayout";
import ProductCard from "@/components/ProductCard";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { categoryLabel } from "@/lib/categories";
import { fetchCategories, fetchProducts, type Product } from "@/lib/products";
import { ChevronRight } from "lucide-react";

type Status = "loading" | "ready" | "error";

const ROW_PREVIEW = 12;

export default function App() {
  const { t, dir, locale, results, count } = useI18n();
  const { dispatch, openCart } = useCart();
  const closeCatalogButtonRef = useRef<HTMLButtonElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    Promise.all([
      fetchProducts({ limit: 500, signal: controller.signal }),
      fetchCategories(controller.signal),
    ])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!catalogOpen) return;
    closeCatalogButtonRef.current?.focus();
  }, [catalogOpen]);

  useEffect(() => {
    if (!catalogOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCatalogOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [catalogOpen]);

  const onAdd = (product: Product) => {
    dispatch({ type: "add", product });
    openCart();
  };

  const selectCategory = (category: string | null) => {
    setActiveCategory(category);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const q = query.trim().toLowerCase();
  const matchesQuery = (p: Product) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.sku_barcode.toLowerCase().includes(q) ||
    (p.category ?? "").toLowerCase().includes(q);

  const flat = useMemo(
    () =>
      products.filter(
        (p) =>
          (!activeCategory || p.category === activeCategory) && matchesQuery(p),
      ),
    [products, activeCategory, query],
  );

  const grouped = useMemo(
    () =>
      categories
        .map((cat) => ({
          category: cat,
          items: products.filter((p) => p.category === cat),
        }))
        .filter((g) => g.items.length > 0),
    [categories, products],
  );

  const showGrouped = !activeCategory && q === "";
  const arrow = dir === "rtl" ? "←" : "→";

  return (
    <div className="flex min-h-full flex-col">
      <Header onHome={() => selectCategory(null)} />

      <section>
        <div className="mx-auto w-full max-w-6xl px-5 pb-6 pt-12 sm:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-6xl sm:leading-[1.05]">
            {t("hero.titleLine1")}
            <br />
            {t("hero.titleLine2")}
          </h1>
          <p className="mt-5 max-w-xl text-sm text-fg-muted sm:text-base">
            {t("hero.subtitle")}
          </p>

          <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              aria-label={t("nav.searchPlaceholder")}
              className="h-11 w-full rounded-full border border-line bg-card px-5 text-sm text-fg shadow-sm outline-none transition-colors focus:border-fg sm:flex-1"
            />
          </div>
        </div>
      </section>

      <main className="w-full flex-1 pb-16">
        {status === "loading" && <RowSkeleton />}

        {status === "error" && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("home.error")}
            {error ? ` (${error})` : ""}
          </div>
        )}

        {status === "ready" && (
          <div dir="ltr">
            <ShopShellLayout
              sidebarEyebrow={t("nav.categories")}
              collapseLabel={t("common.collapse")}
              expandLabel={t("common.expand")}
              sidebar={
                <CategorySidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelect={selectCategory}
                />
              }
            >
              <aside
                className="mobile-catalog-sidebar__drawer"
                aria-label={t("nav.categories")}
                aria-hidden={!catalogOpen}
              >
                <div
                  className="mobile-catalog-sidebar__panel"
                  data-state={catalogOpen ? "open" : "closed"}
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("nav.categories")}
                  onClick={(event) => {
                    if (event.target === event.currentTarget) setCatalogOpen(false);
                  }}
                >
                  <div className="mobile-catalog-sidebar__sheet" dir={dir}>
                    <header className="mobile-catalog-sidebar__header">
                      <h2 className="mobile-catalog-sidebar__title">
                        {t("nav.categories")}
                      </h2>
                      <button
                        ref={closeCatalogButtonRef}
                        type="button"
                        className="icon-button"
                        aria-label={t("common.close")}
                        onClick={() => setCatalogOpen(false)}
                      >
                        ×
                      </button>
                    </header>
                    <div className="mobile-catalog-sidebar__content">
                      <CategorySidebar
                        categories={categories}
                        activeCategory={activeCategory}
                        onSelect={(category) => {
                          selectCategory(category);
                          setCatalogOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </aside>

              <button
                type="button"
                className="mobile-catalog-notch"
                aria-label={catalogOpen ? t("common.close") : t("nav.categories")}
                onClick={() => setCatalogOpen((value) => !value)}
              >
                <ChevronRight
                  size={18}
                  aria-hidden="true"
                  className={`mobile-catalog-notch__icon${dir === "rtl" ? " is-rtl" : ""}`}
                />
                <span className="mobile-catalog-notch__label" aria-hidden="true">
                  {catalogOpen ? t("common.close") : t("nav.categories")}
                </span>
              </button>

              <div dir={dir} className="min-w-0">
                {showGrouped &&
                  grouped.map(({ category, items }) => (
                    <section
                      key={category}
                      className="border-t border-line py-8 first:border-t-0"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex rounded-md bg-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pill-fg">
                            {categoryLabel(locale, category)}
                          </span>
                          <span className="text-sm text-fg-muted">
                            {count(items.length)}
                          </span>
                        </div>
                        {items.length > ROW_PREVIEW && (
                          <button
                            type="button"
                            onClick={() => selectCategory(category)}
                            className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                          >
                            {t("home.viewAll")} {arrow}
                          </button>
                        )}
                    </div>

                    <HorizontalScrollRow
                      dir={dir}
                      label={categoryLabel(locale, category)}
                      viewportClassName="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-1"
                    >
                      {items.map((p) => (
                        <div
                          key={p.id}
                          className="w-44 shrink-0 snap-start sm:w-52"
                        >
                          <ProductCard product={p} onAdd={onAdd} />
                        </div>
                      ))}
                    </HorizontalScrollRow>
                  </section>
                ))}

                {!showGrouped && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-6 pt-2">
                      <h2 className="flex items-center gap-3 text-lg font-semibold">
                        {activeCategory ? (
                          <span className="inline-flex rounded-md bg-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pill-fg">
                            {categoryLabel(locale, activeCategory)}
                          </span>
                        ) : (
                          <span>{t("home.allCategories")}</span>
                        )}
                        <span className="text-sm font-normal text-fg-muted">
                          {results(flat.length)}
                        </span>
                      </h2>
                    </div>

                    {flat.length === 0 ? (
                      <div className="rounded-2xl border border-line px-4 py-16 text-center text-sm text-fg-muted">
                        {t("home.noResults")}
                      </div>
                    ) : (
                      <section className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                        {flat.map((p) => (
                          <ProductCard key={p.id} product={p} onAdd={onAdd} />
                        ))}
                      </section>
                    )}
                  </>
                )}
              </div>
            </ShopShellLayout>
          </div>
        )}
      </main>

      <footer className="border-t border-line py-8 text-center text-xs text-fg-muted">
        © {new Date().getFullYear()} {t("nav.brand")} · {t("nav.brandTagline")}
      </footer>

      <CartDrawer />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="py-8">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-bg-subtle" />
      <div className="no-scrollbar -mx-5 flex gap-5 overflow-hidden px-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-44 shrink-0 sm:w-52">
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-bg-subtle" />
            <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-bg-subtle" />
          </div>
        ))}
      </div>
    </div>
  );
}
