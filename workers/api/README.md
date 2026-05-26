# hsm-store-api

Cloudflare Worker that proxies read-only product data from Turso for the public storefront. Images are served directly from R2 — the Worker only builds the URLs.

## Endpoints

- `GET /health` — `{ ok: true }`. No caching.
- `GET /products` — list active products. Query params: `category`, `q` (name/barcode search), `limit` (≤500), `offset`.
- `GET /products/:id` — single product, 404 if inactive or missing.
- `GET /categories` — distinct active-product categories.

All successful responses are cached at the Cloudflare edge for `CACHE_TTL_SECONDS` (default 60s).

## Local dev

```sh
npm install
cp .dev.vars.example .dev.vars   # fill in real values
npm run dev
```

## Secrets to set before first deploy

```sh
wrangler secret put TURSO_URL
wrangler secret put TURSO_AUTH_TOKEN
wrangler secret put R2_PUBLIC_BASE
```

`TURSO_AUTH_TOKEN` must be a **read-only** token. Create one with:

```sh
turso db tokens create <db-name> --read-only
```

## Deploy

```sh
npm run deploy
```

The deployed URL is `https://hsm-store-api.<your-subdomain>.workers.dev`. Wire it into the website as `NEXT_PUBLIC_API_BASE`.

## What this Worker will NOT expose

Even though the Turso token can read every column, the Worker only returns fields appropriate for a public storefront. Internal fields (`reorder_level`, `notes`, `created_by`, `updated_by`, `selling_price_currency` internal flags, supplier-junction `cost_price`, etc.) are never returned. If you need new public fields, add them explicitly in `src/index.ts`.
