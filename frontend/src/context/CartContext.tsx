import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Beer } from "../types";

interface CartLine {
  beer: Beer;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (beer: Beer, quantity?: number) => void;
  removeItem: (beerId: string) => void;
  setQuantity: (beerId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "maca-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // localStorage no disponible (modo privado, etc.) — el carrito no persiste
    }
  }, [lines]);

  function addItem(beer: Beer, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((line) => line.beer.id === beer.id);
      const maxQty = beer.stock;
      if (existing) {
        return prev.map((line) =>
          line.beer.id === beer.id
            ? { ...line, quantity: Math.min(line.quantity + quantity, maxQty) }
            : line,
        );
      }
      return [...prev, { beer, quantity: Math.min(quantity, maxQty) }];
    });
  }

  function removeItem(beerId: string) {
    setLines((prev) => prev.filter((line) => line.beer.id !== beerId));
  }

  function setQuantity(beerId: string, quantity: number) {
    setLines((prev) =>
      prev
        .map((line) =>
          line.beer.id === beerId
            ? { ...line, quantity: Math.max(1, Math.min(quantity, line.beer.stock)) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function clear() {
    setLines([]);
  }

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + Number(line.beer.price) * line.quantity, 0),
    [lines],
  );

  return (
    <CartContext.Provider value={{ lines, count, subtotal, addItem, removeItem, setQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
