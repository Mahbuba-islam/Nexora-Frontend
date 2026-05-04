"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";
import { getMe } from "@/src/services/auth.services";
import type { IUserProfile } from "@/src/types/user.types";

/**
 * Cart storage is scoped per authenticated user so two people sharing a
 * browser (or "logout → other user logs in") never see each other's cart.
 * Guests get their own bucket that's wiped after sign-in to avoid bleed.
 */
const storageKey = (userId: string | null) =>
  `nexora.cart.v2.${userId ?? "guest"}`;

const LEGACY_KEY = "nexora.cart.v1";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
  stock: number;
  brand?: string | null;
}

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (product: NxProduct, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Identify the active user so carts can't leak across accounts.
  const { data: profile } = useQuery<IUserProfile>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const userId = profile?.id ?? null;
  const activeKeyRef = useRef<string>(storageKey(userId));

  // Re-load from the per-user bucket whenever identity changes.
  // Also drop the legacy global key so old shared data doesn't follow
  // a fresh login.
  useEffect(() => {
    const key = storageKey(userId);
    activeKeyRef.current = key;
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(LEGACY_KEY);
      }
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, [userId]);

  // Persist on change (skip first render until hydrated).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(activeKeyRef.current, JSON.stringify(items));
    } catch {
      /* quota exceeded — silently ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((product: NxProduct, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const cap =
        product.allowBackorder || !product.trackInventory
          ? Number.POSITIVE_INFINITY
          : product.stock;
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(cap, i.qty + qty) }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: toNumberPrice(product.price),
          image: primaryImage(product),
          qty: Math.min(cap, Math.max(1, qty)),
          stock: product.stock,
          brand: product.brand?.name ?? null,
        },
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(0, Math.floor(qty)) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { items, count, subtotal, hydrated, add, remove, setQty, clear };
  }, [items, hydrated, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
}
