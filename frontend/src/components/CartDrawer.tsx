import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useCart } from "@/components/CartProvider";
import { buildWhatsAppUrl, formatLineTotal, formatSubtotal } from "@/lib/cart";

// Replace via VITE_WHATSAPP_NUMBER at build time.
const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "+96100000000";

export default function CartDrawer() {
  const { t, dir } = useI18n();
  const { state, dispatch, isOpen, closeCart } = useCart();
  const [customerName, setCustomerName] = useState("");

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const sideClass = dir === "rtl" ? "left-0 border-r" : "right-0 border-l";

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    const url = buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      state,
      customerName.trim() || undefined,
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label={t("cart.close")}
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <aside
        className={`absolute top-0 ${sideClass} flex h-full w-full max-w-md flex-col border-line bg-bg shadow-2xl`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold">{t("cart.title")}</h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full px-3 py-1 text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            {t("cart.close")}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {state.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="text-4xl">🛒</div>
              <p className="mt-3 text-sm text-fg-muted">{t("cart.empty")}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {state.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-2xl border border-line p-3"
                >
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-bg-subtle">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-fg-muted">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="line-clamp-2 text-sm font-medium">
                          {item.name}
                        </div>
                        {item.unit && (
                          <div className="text-xs text-fg-muted">
                            {item.unit}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "remove", id: item.id })}
                        className="rounded-full px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-bg-subtle hover:text-red-600"
                        aria-label={t("cart.remove")}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "decrement", id: item.id })
                          }
                          className="px-3 py-1 text-sm transition-colors hover:bg-bg-subtle"
                          aria-label={t("cart.decrement")}
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "increment", id: item.id })
                          }
                          className="px-3 py-1 text-sm transition-colors hover:bg-bg-subtle"
                          aria-label={t("cart.increment")}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatLineTotal(item)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {state.items.length > 0 && (
          <footer className="flex flex-col gap-3 border-t border-line px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-muted">{t("cart.subtotal")}</span>
              <span className="font-semibold">{formatSubtotal(state)}</span>
            </div>
            <label className="flex flex-col gap-1 text-xs text-fg-muted">
              {t("cart.yourName")}
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t("cart.yourNamePlaceholder")}
                className="h-10 rounded-xl border border-line bg-bg px-3 text-sm text-fg outline-none focus:border-fg"
              />
            </label>
            <button
              type="button"
              onClick={handleCheckout}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <span aria-hidden>📲</span>
              {t("cart.checkoutWhatsApp")}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "clear" })}
              className="h-9 rounded-full text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
            >
              {t("cart.clear")}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
