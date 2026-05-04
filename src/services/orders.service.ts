// Nexora — order domain types + service.
// The backend orders module is not yet wired (see backend roadmap), so this
// service degrades gracefully: it tries the most common REST shapes and
// returns an empty array if none respond. Once the backend ships, the
// underlying types match the expected Prisma response.

import type { ApiResponse } from "@/src/types/api.types";
import { httpClient } from "@/src/lib/axious/httpClient";

export type NxOrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface NxOrderItem {
  id: string;
  productId: string;
  productSlug?: string;
  name: string;
  image?: string | null;
  qty: number;
  /** Backend Prisma Decimal as string. */
  price: string;
  /** Optional variant label (e.g. "256 GB · Space Black"). */
  variant?: string | null;
}

export interface NxOrder {
  id: string;
  orderNumber: string;
  status: NxOrderStatus;
  /** Total in cents OR decimal string — backend dependent. */
  total: string;
  currency: string;
  itemsCount: number;
  items: NxOrderItem[];
  trackingNumber?: string | null;
  carrier?: string | null;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    region?: string | null;
    postal: string;
    country: string;
  } | null;
  placedAt: string;
  updatedAt: string;
  estimatedDeliveryAt?: string | null;
}

const ENDPOINTS = ["/orders/me", "/orders/my", "/orders"] as const;

export async function getMyOrders(): Promise<NxOrder[]> {
  for (const path of ENDPOINTS) {
    try {
      const res = await httpClient.get<NxOrder[]>(path, {
        silent: true,
        withCredentials: true,
      });
      if (Array.isArray(res?.data)) return res.data;
    } catch {
      // try next shape
    }
  }
  return [];
}

export async function getOrderById(id: string): Promise<NxOrder | null> {
  try {
    const res = await httpClient.get<NxOrder>(`/orders/${id}`, {
      silent: true,
      withCredentials: true,
    });
    return res?.data ?? null;
  } catch {
    return null;
  }
}

export type OrdersResponse = ApiResponse<NxOrder[]>;
