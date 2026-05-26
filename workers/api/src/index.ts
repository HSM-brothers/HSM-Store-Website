import { createClient, type Client, type ResultSet } from "@libsql/client/web";

interface Env {
  TURSO_URL: string;
  TURSO_AUTH_TOKEN: string;
  R2_PUBLIC_BASE: string;
  ALLOWED_ORIGINS: string;
  CACHE_TTL_SECONDS: string;
}

interface ProductRow {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  selling_price: number | null;
  selling_price_currency: string | null;
  sku_barcode: string;
  stock_qty: number | null;
  status: string | null;
  primary_image_filename: string | null;
}

interface PublicProduct {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  selling_price: number | null;
  selling_price_currency: string | null;
  sku_barcode: string;
  in_stock: boolean;
  image_url: string | null;
}

let _client: Client | null = null;
function db(env: Env): Client {
  if (!_client) {
    _client = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH_TOKEN });
  }
  return _client;
}

function imageUrl(env: Env, productId: string, filename: string | null): string | null {
  if (!filename) return null;
  const base = env.R2_PUBLIC_BASE.replace(/\/+$/, "");
  return `${base}/products/${encodeURIComponent(productId)}/${encodeURIComponent(filename)}`;
}

function toPublic(env: Env, r: ProductRow): PublicProduct {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    unit: r.unit,
    selling_price: r.selling_price,
    selling_price_currency: r.selling_price_currency,
    sku_barcode: r.sku_barcode,
    in_stock: (r.stock_qty ?? 0) > 0,
    image_url: imageUrl(env, r.id, r.primary_image_filename),
  };
}

function corsHeaders(env: Env, request: Request): Headers {
  const headers = new Headers();
  const origin = request.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  if (allowed.includes("*")) {
    headers.set("Access-Control-Allow-Origin", "*");
  } else if (allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

function json(body: unknown, init: { status?: number; cacheTtl?: number; cors: Headers }): Response {
  const headers = new Headers(init.cors);
  headers.set("Content-Type", "application/json; charset=utf-8");
  if (init.cacheTtl !== undefined) {
    headers.set("Cache-Control", `public, max-age=${init.cacheTtl}, s-maxage=${init.cacheTtl}`);
  }
  return new Response(JSON.stringify(body), { status: init.status ?? 200, headers });
}

const PRODUCT_SELECT = `
  SELECT
    p.id,
    p.name,
    p.category,
    p.unit,
    p.selling_price,
    p.selling_price_currency,
    p.sku_barcode,
    p.stock_qty,
    p.status,
    (
      SELECT pi.filename
      FROM product_images pi
      WHERE pi.product_id = p.id AND pi.is_primary = 1
      LIMIT 1
    ) AS primary_image_filename
  FROM products p
  WHERE p.status = 'Active'
`;

async function listProducts(env: Env, url: URL): Promise<PublicProduct[]> {
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 500);
  const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0", 10) || 0, 0);

  const where: string[] = [];
  const args: (string | number)[] = [];
  if (category) {
    where.push("p.category = ?");
    args.push(category);
  }
  if (search) {
    where.push("(p.name LIKE ? OR p.sku_barcode LIKE ?)");
    const like = `%${search}%`;
    args.push(like, like);
  }
  const extraWhere = where.length ? " AND " + where.join(" AND ") : "";
  const sql = `${PRODUCT_SELECT}${extraWhere} ORDER BY p.name ASC LIMIT ? OFFSET ?`;
  args.push(limit, offset);

  const result = (await db(env).execute({ sql, args })) as ResultSet;
  return result.rows.map((row) => toPublic(env, row as unknown as ProductRow));
}

async function getProduct(env: Env, id: string): Promise<PublicProduct | null> {
  const sql = `${PRODUCT_SELECT} AND p.id = ? LIMIT 1`;
  const result = (await db(env).execute({ sql, args: [id] })) as ResultSet;
  const first = result.rows[0];
  return first ? toPublic(env, first as unknown as ProductRow) : null;
}

async function listCategories(env: Env): Promise<string[]> {
  const result = await db(env).execute({
    sql: `SELECT DISTINCT category FROM products WHERE status = 'Active' AND category IS NOT NULL ORDER BY category ASC`,
    args: [],
  });
  return result.rows.map((r) => String((r as { category: string }).category));
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cors = corsHeaders(env, request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "GET") {
      return json({ error: "method_not_allowed" }, { status: 405, cors });
    }

    const url = new URL(request.url);
    const ttl = parseInt(env.CACHE_TTL_SECONDS ?? "60", 10) || 60;

    // Edge cache key — strip Origin so cached body is shared across allowed origins.
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) {
      const headers = new Headers(cached.headers);
      cors.forEach((v, k) => headers.set(k, v));
      headers.set("X-Cache", "HIT");
      return new Response(cached.body, { status: cached.status, headers });
    }

    try {
      let response: Response;

      if (url.pathname === "/health") {
        response = json({ ok: true }, { cors, cacheTtl: 0 });
      } else if (url.pathname === "/products") {
        const data = await listProducts(env, url);
        response = json({ products: data, count: data.length }, { cors, cacheTtl: ttl });
      } else if (url.pathname === "/categories") {
        const data = await listCategories(env);
        response = json({ categories: data }, { cors, cacheTtl: ttl });
      } else if (url.pathname.startsWith("/products/")) {
        const id = decodeURIComponent(url.pathname.slice("/products/".length));
        if (!id || id.includes("/")) {
          response = json({ error: "bad_id" }, { status: 400, cors });
        } else {
          const product = await getProduct(env, id);
          response = product
            ? json({ product }, { cors, cacheTtl: ttl })
            : json({ error: "not_found" }, { status: 404, cors });
        }
      } else {
        response = json({ error: "not_found", path: url.pathname }, { status: 404, cors });
      }

      // Stash a copy in the edge cache (only successful GETs with a TTL).
      if (response.status === 200 && response.headers.get("Cache-Control")) {
        const toCache = new Response(response.clone().body, response);
        toCache.headers.set("X-Cache", "MISS");
        ctx.waitUntil(cache.put(cacheKey, toCache));
      }

      response.headers.set("X-Cache", "MISS");
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("worker error", message);
      return json({ error: "internal_error" }, { status: 500, cors });
    }
  },
} satisfies ExportedHandler<Env>;
