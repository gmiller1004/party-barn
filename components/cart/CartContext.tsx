"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { CartData } from "@/lib/shopify/cart";

type CartContextValue = {
  cart: CartData | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateNote: (note: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      const data = await res.json();
      setCart(data.cart ?? null);
    } catch {
      setCart(null);
    }
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity: number) => {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ variantId, quantity }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to add to cart");
    setCart(data.cart ?? null);
    setDrawerOpen(true);
  }, []);

  const updateNote = useCallback(async (note: string) => {
    const res = await fetch("/api/cart/note", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to update note");
    setCart(data.cart ?? null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
        addToCart,
        updateNote,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
