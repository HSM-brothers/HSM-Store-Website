"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Header from "@/components/Header";
import { mockProducts } from "@/lib/products";
import type { AppLocale } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations();
  const tCategories = useTranslations("categories");
  const locale = useLocale() as AppLocale;
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockProducts;

    return mockProducts.filter((p) => {
      const name = p.name[locale] ?? p.name.en;
      return name.toLowerCase().includes(q);
    });
  }, [query, locale]);

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

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">
                      {p.name[locale] ?? p.name.en}
                    </h2>
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                      {t("home.category")}:{" "}
                      {tCategories(p.category)}
                    </div>
                  </div>

                  <div className="shrink-0 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-700 dark:text-orange-200">
                    ${p.priceUsd.toFixed(2)}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="h-10 flex-1 rounded-full bg-orange-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                    onClick={() => {
                      // Mock for now.
                    }}
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
