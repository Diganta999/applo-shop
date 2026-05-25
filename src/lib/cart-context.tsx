import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalCents: number;
  count: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "vitreous_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const totalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return {
      items,
      totalCents,
      count,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const ex = prev.find((p) => p.id === item.id);
          if (ex)
            return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + qty } : p));
          return [...prev, { ...item, quantity: qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQuantity: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => p.id !== id)
            : prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
