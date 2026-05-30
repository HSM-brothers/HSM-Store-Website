import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The Cloudflare Worker proxy in front of Turso + R2.
const WORKER_ORIGIN = "https://hsm-store-api.housam-kak20.workers.dev";

// On GitHub Pages the app is served from /HSM-Store-Website/.
// Locally (dev) the base is "/". Override with VITE_BASE_PATH at build time.
export default defineConfig(({ command }) => ({
  base: command === "build" ? process.env.VITE_BASE_PATH || "/HSM-Store-Website/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // The Worker's CORS allowlist only contains the production origin, so in
    // dev we proxy /api -> Worker server-side (no browser CORS check).
    proxy: {
      "/api": {
        target: WORKER_ORIGIN,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
}));
