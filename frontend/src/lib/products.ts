// Product data fetched from the Cloudflare Worker proxy in front of Turso + R2.
//
// - In dev we hit "/api", which Vite proxies to the Worker server-side so the
//   browser never triggers a CORS check (see vite.config.ts).
// - In the production build we hit the Worker directly via VITE_API_BASE; the
//   GitHub Pages origin is on the Worker's CORS allowlist.

const RAW_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "");
export const API_BASE = RAW_BASE || "/api";

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
  const url = new URL(`${API_BASE}/products`, window.location.origin);
  if (opts?.category) url.searchParams.set("category", opts.category);
  if (opts?.q) url.searchParams.set("q", opts.q);
  if (opts?.limit) url.searchParams.set("limit", String(opts.limit));

  const res = await fetch(url.toString(), { signal: opts?.signal });
  if (!res.ok) throw new Error(`products fetch failed: ${res.status}`);
  const body = (await res.json()) as ProductsResponse;
  return body.products;
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const url = new URL(`${API_BASE}/categories`, window.location.origin);
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`categories fetch failed: ${res.status}`);
  const body = (await res.json()) as CategoriesResponse;
  return body.categories;
}

export function formatPrice(
  price: number | null,
  currency: Currency | null,
): string {
  if (price == null) return "—";
  if (currency === "LBP") {
    return `${Math.round(price).toLocaleString()} LBP`;
  }
  return `$${price.toFixed(2)}`;
}
