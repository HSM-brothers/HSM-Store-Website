import type { Currency, Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export type CartItem = {
  id: string;
  name: string;
  unit: string | null;
  selling_price: number | null;
  selling_price_currency: Currency | null;
  image_url: string | null;
  qty: number;
};

export type CartState = {
  items: CartItem[];
};

export const EMPTY_CART: CartState = { items: [] };

export type CartAction =
  | { type: "add"; product: Product }
  | { type: "increment"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }
      const p = action.product;
      const newItem: CartItem = {
        id: p.id,
        name: p.name,
        unit: p.unit,
        selling_price: p.selling_price,
        selling_price_currency: p.selling_price_currency,
        image_url: p.image_url,
        qty: 1,
      };
      return { items: [...state.items, newItem] };
    }
    case "increment":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i,
        ),
      };
    case "decrement":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "clear":
      return EMPTY_CART;
    default:
      return state;
  }
}

export function totalCount(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.qty, 0);
}

export function subtotalByCurrency(state: CartState): {
  usd: number;
  lbp: number;
} {
  let usd = 0;
  let lbp = 0;
  for (const item of state.items) {
    if (item.selling_price == null) continue;
    if (item.selling_price_currency === "LBP") {
      lbp += item.selling_price * item.qty;
    } else {
      usd += item.selling_price * item.qty;
    }
  }
  return { usd, lbp };
}

export function formatSubtotal(state: CartState): string {
  const { usd, lbp } = subtotalByCurrency(state);
  const parts: string[] = [];
  if (usd > 0) parts.push(`$${usd.toFixed(2)}`);
  if (lbp > 0) parts.push(`${Math.round(lbp).toLocaleString()} LBP`);
  return parts.length ? parts.join(" + ") : formatPrice(0, "USD");
}

export function formatLineTotal(item: CartItem): string {
  if (item.selling_price == null) return "—";
  return formatPrice(item.selling_price * item.qty, item.selling_price_currency);
}

// Build a human-readable WhatsApp message from the cart state.
// Returns the URL-encoded text ready to drop into wa.me.
export function buildOrderText(state: CartState, customerName?: string): string {
  const lines: string[] = [];
  lines.push("HSM Mini Market — New order");
  if (customerName) lines.push(`Customer: ${customerName}`);
  lines.push("");
  for (const item of state.items) {
    const lineTotal = formatLineTotal(item);
    const unit = item.unit ? ` ${item.unit}` : "";
    lines.push(`• ${item.name}${unit} × ${item.qty} — ${lineTotal}`);
  }
  lines.push("");
  lines.push(`Subtotal: ${formatSubtotal(state)}`);
  return lines.join("\n");
}

export function buildWhatsAppUrl(
  phone: string,
  state: CartState,
  customerName?: string,
): string {
  const cleaned = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(buildOrderText(state, customerName));
  return `https://wa.me/${cleaned}?text=${text}`;
}

export const STORAGE_KEY = "hsm.cart.v1";
