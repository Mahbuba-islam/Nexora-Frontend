// Nexora — order domain types + service.
// Multi-vendor model: parent `Order` rolls up N `SellerOrder` rows (one per
// seller). Pricing (subtotal/shipping/tax/discount) is allocated per seller;
// the parent stores rolled totals.

import type { ApiResponse } from "@/src/types/api.types";
import { httpClient } from "@/src/lib/axious/httpClient";

export type NxOrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "PARTIAL"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type NxFulfillmentStatus =
  | "UNFULFILLED"
  | "PARTIAL"
  | "FULFILLED"
  | "CANCELLED";

export type NxSellerOrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface NxOrderItem {
  id: string;
  productId: string;
  productSlug?: string;
  variantId?: string | null;
  name: string;
  image?: string | null;
  qty: number;
  /** Backend Prisma Decimal as string. */
  price: string;
  variant?: string | null;
}

export interface NxSellerSummary {
  id: string;
  shopName: string;
  shopSlug?: string;
  logo?: string | null;
}

export interface NxSellerOrder {
  id: string;
  orderId: string;
  sellerId: string;
  seller?: NxSellerSummary;
  status: NxSellerOrderStatus;

  subtotal: string;
  shippingCost: string;
  tax: string;
  discount: string;
  total: string;
  commissionRate: string;
  commissionAmount: string;
  sellerNetAmount: string;

  trackingNumber?: string | null;
  carrier?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  estimatedDeliveryAt?: string | null;

  items: NxOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NxOrderAddress {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  postal: string;
  country: string;
  phone?: string | null;
}

export interface NxOrder {
  id: string;
  orderNumber: string;
  status: NxOrderStatus;
  fulfillmentStatus?: NxFulfillmentStatus;
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  subtotal: string;
  shippingCost: string;
  tax: string;
  discount: string;
  total: string;
  currency: string;

  itemsCount: number;
  sellerOrders: NxSellerOrder[];

  shippingAddress?: NxOrderAddress | null;
  billingAddress?: NxOrderAddress | null;

  couponCode?: string | null;
  paymentMethod?: string | null;

  placedAt: string;
  updatedAt: string;
}

const LIST_ENDPOINTS = ["/orders/me", "/orders/my", "/orders"] as const;

export async function getMyOrders(): Promise<NxOrder[]> {
  for (const path of LIST_ENDPOINTS) {
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

export const orderStatusLabel = (s: NxOrderStatus | NxSellerOrderStatus) =>
  s.charAt(0) + s.slice(1).toLowerCase();
