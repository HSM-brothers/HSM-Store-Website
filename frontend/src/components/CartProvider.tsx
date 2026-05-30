import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  cartReducer,
  EMPTY_CART,
  STORAGE_KEY,
  totalCount,
  type CartAction,
  type CartState,
} from "@/lib/cart";

type CartContextValue = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: "hydrate", state: parsed });
        }
      }
    } catch {
      // Ignore corrupt storage; start with an empty cart.
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration so we don't clobber with EMPTY).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable / quota; not fatal for browsing.
    }
  }, [state, hydrated]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);
  const toggleCart = useCallback(() => setOpen((v) => !v), []);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      dispatch,
      count: totalCount(state),
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [state, isOpen, openCart, closeCart, toggleCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
