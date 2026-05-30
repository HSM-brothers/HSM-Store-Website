import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { fetchCategories, fetchProducts, type Product } from "@/lib/products";

type Status = "loading" | "ready" | "error";

// How many products to preview in each category row before "View all".
const ROW_PREVIEW = 12;

export default function App() {
  const { t, dir, results, count } = useI18n();
  const { dispatch, openCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  // Flat list: used when searching or when a single category is selected.
  const flat = useMemo(
    () =>
      products.filter(
        (p) =>
          (!activeCategory || p.category === activeCategory) && matchesQuery(p),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, activeCategory, q],
  );

  // Grouped rows: used on the landing view (no category, no search).
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

      {/* Hero */}
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

          {/* Search + category filter */}
          <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              aria-label={t("nav.searchPlaceholder")}
              className="h-11 w-full rounded-full border border-line bg-card px-5 text-sm text-fg shadow-sm outline-none transition-colors focus:border-fg sm:flex-1"
            />
            <select
              value={activeCategory ?? ""}
              onChange={(e) => setActiveCategory(e.target.value || null)}
              aria-label={t("nav.filter")}
              className="h-11 w-full rounded-full border border-line bg-card px-5 text-sm text-fg shadow-sm outline-none transition-colors focus:border-fg sm:w-56"
            >
              <option value="">{t("nav.allCategories")}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16">
        {status === "loading" && <RowSkeleton />}

        {status === "error" && (
          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
            {t("home.error")}
            {error ? ` (${error})` : ""}
          </div>
        )}

        {/* Grouped landing view */}
        {status === "ready" &&
          showGrouped &&
          grouped.map(({ category, items }) => (
            <section key={category} className="border-t border-line py-8 first:border-t-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-md bg-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pill-fg">
                    {category}
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

              <div className="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-1">
                {items.slice(0, ROW_PREVIEW).map((p) => (
                  <div key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
                    <ProductCard product={p} onAdd={onAdd} />
                  </div>
                ))}
              </div>
            </section>
          ))}

        {/* Flat grid view (category selected or searching) */}
        {status === "ready" && !showGrouped && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 pt-2">
              <h2 className="flex items-center gap-3 text-lg font-semibold">
                {activeCategory ? (
                  <span className="inline-flex rounded-md bg-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-pill-fg">
                    {activeCategory}
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
