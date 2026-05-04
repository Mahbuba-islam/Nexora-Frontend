"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";

const STORAGE_KEY = "nexora.wishlist.v1";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  brand?: string | null;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  count: number;
  hydrated: boolean;
  has: (id: string) => boolean;
  toggle: (product: NxProduct) => boolean;
  add: (product: NxProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistState | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota */
    }
  }, [items, hydrated]);

  const has = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items],
  );

  const add = useCallback((product: NxProduct) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      return [
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: toNumberPrice(product.price),
          image: primaryImage(product),
          brand: product.brand?.name ?? null,
          addedAt: Date.now(),
        },
        ...prev,
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  /** Returns the new state — true if added, false if removed. */
  const toggle = useCallback(
    (product: NxProduct): boolean => {
      let added = false;
      setItems((prev) => {
        const exists = prev.some((i) => i.id === product.id);
        if (exists) {
          added = false;
          return prev.filter((i) => i.id !== product.id);
        }
        added = true;
        return [
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: toNumberPrice(product.price),
            image: primaryImage(product),
            brand: product.brand?.name ?? null,
            addedAt: Date.now(),
          },
          ...prev,
        ];
      });
      return added;
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistState>(
    () => ({
      items,
      count: items.length,
      hydrated,
      has,
      toggle,
      add,
      remove,
      clear,
    }),
    [items, hydrated, has, toggle, add, remove, clear],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistState {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within <WishlistProvider>");
  }
  return ctx;
}
