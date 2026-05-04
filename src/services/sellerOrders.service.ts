// Nexora — seller order operations.
// Backend exposes seller-scoped sub-order endpoints. We probe a couple of
// shapes silently so the seller dashboard degrades gracefully when the live
// backend isn't running locally.

import { httpClient } from "@/src/lib/axious/httpClient";
import type {
  NxSellerOrder,
  NxSellerOrderStatus,
} from "./orders.service";

export interface NxSellerOrderListItem extends NxSellerOrder {
  /** Parent order context — useful for showing order number on a list row. */
  orderNumber?: string;
  /** Optional buyer summary (only what's needed for a list row). */
  buyer?: { id: string; name?: string; email?: string };
}

export interface NxSellerOrderFilters {
  status?: NxSellerOrderStatus;
  page?: number;
  limit?: number;
}

const LIST_PATHS = [
  "/seller-orders/me",
  "/seller-orders/my",
  "/seller/orders",
  "/seller-orders",
] as const;

function parseList(payload: unknown): NxSellerOrderListItem[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as NxSellerOrderListItem[];
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as { sellerOrders?: unknown; data?: unknown; items?: unknown };
    if (Array.isArray(obj.sellerOrders))
      return obj.sellerOrders as NxSellerOrderListItem[];
    if (Array.isArray(obj.items)) return obj.items as NxSellerOrderListItem[];
    if (Array.isArray(obj.data)) return obj.data as NxSellerOrderListItem[];
  }
  return [];
}

export async function getMySellerOrders(
  filters: NxSellerOrderFilters = {},
): Promise<NxSellerOrderListItem[]> {
  for (const path of LIST_PATHS) {
    try {
      const res = await httpClient.get<unknown>(path, {
        silent: true,
        withCredentials: true,
        params: filters,
      });
      const items = parseList(res?.data);
      if (items.length > 0 || res?.success) return items;
    } catch {
      // try next
    }
  }
  return [];
}

export async function getSellerOrderById(
  id: string,
): Promise<NxSellerOrderListItem | null> {
  const candidates = [
    `/seller-orders/${id}`,
    `/seller/orders/${id}`,
  ];
  for (const path of candidates) {
    try {
      const res = await httpClient.get<NxSellerOrderListItem | { data: NxSellerOrderListItem }>(
        path,
        { silent: true, withCredentials: true },
      );
      const data = res?.data as NxSellerOrderListItem | { data: NxSellerOrderListItem } | undefined;
      if (!data) continue;
      if ((data as { id?: string }).id) return data as NxSellerOrderListItem;
      if ((data as { data?: NxSellerOrderListItem }).data?.id)
        return (data as { data: NxSellerOrderListItem }).data;
    } catch {
      // try next
    }
  }
  return null;
}

export interface UpdateSellerOrderStatusPayload {
  status: NxSellerOrderStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryAt?: string;
  cancellationReason?: string;
}

export async function updateSellerOrderStatus(
  id: string,
  payload: UpdateSellerOrderStatusPayload,
): Promise<{ success: boolean; message?: string }> {
  const candidates: { method: "patch" | "put" | "post"; path: string }[] = [
    { method: "patch", path: `/seller-orders/${id}/status` },
    { method: "patch", path: `/seller-orders/${id}` },
    { method: "put", path: `/seller-orders/${id}` },
    { method: "post", path: `/seller-orders/${id}/status` },
  ];
  for (const c of candidates) {
    try {
      const res = await httpClient[c.method]<{ success?: boolean; message?: string }>(
        c.path,
        payload,
        { silent: true, withCredentials: true },
      );
      if (res?.success !== false) {
        return { success: true, message: res?.message };
      }
    } catch {
      // try next
    }
  }
  return { success: false, message: "Unable to update order status." };
}
