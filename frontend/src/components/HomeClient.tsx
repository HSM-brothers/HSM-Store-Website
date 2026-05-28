"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import { formatPrice, type Product } from "@/lib/products";

type Props = {
  initialProducts: Product[];
  initialCategories: string[];
  initialError?: string | null;
};

export default function HomeClient({
  initialProducts,
  initialCategories,
  initialError,
}: Props) {
  const t = useTranslations();
  const { dispatch, openCart } = useCart();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const products = initialProducts;
  const categories = initialCategories;
  const status: "ready" | "error" = initialError ? "error" : "ready";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku_barcode.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, products, activeCategory]);

  const onAdd = (product: Product) => {
    dispatch({ type: "add", product });
    openCart();
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("home.subtitle")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-xl">
              <label className="sr-only" htmlFor="search">
                {t("nav.searchPlaceholder")}
              </label>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none ring-orange-400/30 focus:ring-4 dark:border-white/10 dark:bg-zinc-950"
              />
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              {t("home.results", { count: results.length })}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`h-8 rounded-full px-3 text-xs font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-orange-500 text-white"
                    : "border border-black/10 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                }`}
              >
                {t("home.allCategories")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setActiveCategory(cat === activeCategory ? null : cat)
                  }
                  className={`h-8 rounded-full px-3 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-orange-500 text-white"
                      : "border border-black/10 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {t("home.error")}
              {initialError ? ` (${initialError})` : ""}
            </div>
          )}

          {status === "ready" && results.length === 0 && (
            <div className="rounded-2xl border border-black/10 bg-white/40 px-4 py-8 text-center text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300">
              {t("home.noResults")}
            </div>
          )}

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {status === "ready" &&
              results.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950"
                >
                  <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                        {t("home.noImage")}
                      </div>
                    )}
                    {!p.in_stock && (
                      <div className="absolute right-2 top-2 rounded-full bg-zinc-900/80 px-2 py-1 text-xs font-medium text-white">
                        {t("home.outOfStock")}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-base font-semibold">
                          {p.name}
                        </h2>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                          {p.category ?? "—"}
                          {p.unit ? ` · ${p.unit}` : ""}
                        </div>
                      </div>

                      <div className="shrink-0 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-700 dark:text-orange-200">
                        {formatPrice(p.selling_price, p.selling_price_currency)}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!p.in_stock}
                      onClick={() => onAdd(p)}
                      className="mt-auto h-10 rounded-full bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
                    >
                      {t("home.addToCart")}
                    </button>
                  </div>
                </article>
              ))}
          </section>
        </div>
      </main>

      <footer className="border-t border-black/10 py-6 text-center text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        © {new Date().getFullYear()} HSM
      </footer>
    </div>
  );
}

