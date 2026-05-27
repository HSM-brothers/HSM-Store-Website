// Product data fetched from the Cloudflare Worker proxy in front of Turso.
// The worker URL is build-time-configured via NEXT_PUBLIC_API_BASE; the
// fallback is the production deployment so dev builds still work without
// extra env setup.

const DEFAULT_API_BASE = "https://hsm-store-api.housam-kak20.workers.dev";

export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") || DEFAULT_API_BASE);

export type Currency = "USD" | "LBP";

export type Product = {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  selling_price: number | null;
  selling_price_currency: Currency | null;
  sku_barcode: string;
  in_stock: boolean;
  image_url: string | null;
};

type ProductsResponse = { products: Product[]; count: number };
type CategoriesResponse = { categories: string[] };

export async function fetchProducts(opts?: {
  category?: string;
  q?: string;
  limit?: number;
  signal?: AbortSignal;
}): Promise<Product[]> {
  const url = new URL(`${API_BASE}/products`);
  if (opts?.category) url.searchParams.set("category", opts.category);
  if (opts?.q) url.searchParams.set("q", opts.q);
  if (opts?.limit) url.searchParams.set("limit", String(opts.limit));

  const res = await fetch(url.toString(), {
    signal: opts?.signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`products fetch failed: ${res.status}`);
  const body = (await res.json()) as ProductsResponse;
  return body.products;
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`categories fetch failed: ${res.status}`);
  const body = (await res.json()) as CategoriesResponse;
  return body.categories;
}

export function formatPrice(price: number | null, currency: Currency | null): string {
  if (price == null) return "—";
  if (currency === "LBP") {
    return `${Math.round(price).toLocaleString()} LBP`;
  }
  return `$${price.toFixed(2)}`;
}
