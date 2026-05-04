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
 * Storage key is scoped per authenticated user so two people sharing a
 * browser cannot read each other's wishlist. Guests get their own bucket.
 */
const storageKey = (userId: string | null) =>
  `nexora.wishlist.v2.${userId ?? "guest"}`;

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

  // Identify the active user so wishlists can't leak across accounts.
  const { data: profile } = useQuery<IUserProfile>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const userId = profile?.id ?? null;
  const activeKeyRef = useRef<string>(storageKey(userId));

  // Re-load (and migrate) from the per-user bucket whenever the
  // identity changes. Also drop legacy global key so old shared data
  // doesn't follow a new login.
  useEffect(() => {
    const key = storageKey(userId);
    activeKeyRef.current = key;
    try {
      // One-time cleanup of the old shared bucket.
      if (typeof window !== "undefined") {
        localStorage.removeItem("nexora.wishlist.v1");
      }
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as WishlistItem[];
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

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(activeKeyRef.current, JSON.stringify(items));
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
