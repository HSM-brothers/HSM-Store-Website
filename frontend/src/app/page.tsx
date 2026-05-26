"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
    window.location.replace(`${basePath}/ar/`);
  }, []);

  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">HSM Mini Market</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Redirecting…
      </p>
      <div className="flex gap-3">
        <a
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
          href={`${basePath}/ar/`}
        >
          العربية
        </a>
        <a
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold dark:border-white/10"
          href={`${basePath}/en/`}
        >
          English
        </a>
      </div>
    </main>
  );
}
