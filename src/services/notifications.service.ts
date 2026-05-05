// Nexora — notifications service.
// Backend exposes notification routes per the existing notification module.
// We try the most common shapes silently so the UI degrades gracefully.

import { httpClient } from "@/src/lib/axious/httpClient";

export type NxNotificationType =
  | "ORDER_PLACED"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "SELLER_ORDER_CANCELLED"
  | "NEW_SELLER_ORDER"
  | "LOW_STOCK"
  | "PAYOUT_INITIATED"
  | "PAYOUT_PAID"
  | "PAYOUT_FAILED"
  | "REVIEW_RECEIVED"
  | "PROMO"
  | "PRICE_DROP"
  | "NEW_SELLER_APPLICATION"
  | "SYSTEM"
  | "GENERAL";

export interface NxNotification {
  id: string;
  userId: string;
  type: NxNotificationType;
  title: string;
  body?: string | null;
  /** Deep link for the bell to navigate to. */
  href?: string | null;
  isRead: boolean;
  createdAt: string;
  /** Free-form payload from backend (orderId, sellerOrderId, etc). */
  data?: Record<string, unknown> | null;
}

export interface NxNotificationListResult {
  notifications: NxNotification[];
  unreadCount: number;
}

const LIST_PATHS = [
  "/notifications/me",
  "/notifications/my",
  "/notifications",
] as const;

function emptyResult(): NxNotificationListResult {
  return { notifications: [], unreadCount: 0 };
}

export async function getMyNotifications(
  limit = 20,
): Promise<NxNotificationListResult> {
  for (const path of LIST_PATHS) {
    try {
      const res = await httpClient.get<
        NxNotification[] | NxNotificationListResult
      >(path, {
        silent: true,
        withCredentials: true,
        params: { limit },
      });
      const data = res?.data;
      if (!data) continue;
      if (Array.isArray(data)) {
        return {
          notifications: data,
          unreadCount: data.filter((n) => !n.isRead).length,
        };
      }
      if (Array.isArray((data as NxNotificationListResult).notifications)) {
        const obj = data as NxNotificationListResult;
        return {
          notifications: obj.notifications,
          unreadCount:
            typeof obj.unreadCount === "number"
              ? obj.unreadCount
              : obj.notifications.filter((n) => !n.isRead).length,
        };
      }
    } catch {
      // try next
    }
  }
  return emptyResult();
}

export async function getUnreadCount(): Promise<number> {
  try {
    const res = await httpClient.get<{ count: number } | number>(
      "/notifications/unread-count",
      { silent: true, withCredentials: true },
    );
    const data = res?.data;
    if (typeof data === "number") return data;
    if (data && typeof data.count === "number") return data.count;
  } catch {
    // fall through
  }
  // Fallback: pull list and count.
  const list = await getMyNotifications(50);
  return list.unreadCount;
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const candidates: { method: "patch" | "post" | "put"; path: string }[] = [
    { method: "patch", path: `/notifications/${id}/read` },
    { method: "post", path: `/notifications/${id}/read` },
    { method: "put", path: `/notifications/${id}/read` },
    { method: "patch", path: `/notifications/${id}/mark-read` },
    { method: "post", path: `/notifications/${id}/mark-read` },
    { method: "patch", path: `/notifications/${id}` },
  ];
  for (const c of candidates) {
    try {
      await httpClient[c.method]<unknown>(c.path, undefined, {
        silent: true,
        withCredentials: true,
      });
      return true;
    } catch {
      // try next
    }
  }
  return false;
}

export async function markAllNotificationsRead(): Promise<boolean> {
  const candidates: { method: "patch" | "post" | "put"; path: string }[] = [
    { method: "patch", path: "/notifications/read-all" },
    { method: "post", path: "/notifications/read-all" },
    { method: "patch", path: "/notifications/mark-all-read" },
    { method: "post", path: "/notifications/mark-all-read" },
    { method: "patch", path: "/notifications/mark-all" },
    { method: "post", path: "/notifications/mark-all" },
    { method: "patch", path: "/notifications/read" },
    { method: "post", path: "/notifications/read" },
  ];
  for (const c of candidates) {
    try {
      await httpClient[c.method]<unknown>(c.path, undefined, {
        silent: true,
        withCredentials: true,
      });
      return true;
    } catch {
      // try next
    }
  }
  return false;
}

export async function deleteNotification(id: string): Promise<boolean> {
  try {
    await httpClient.delete<unknown>(`/notifications/${id}`, {
      silent: true,
      withCredentials: true,
    });
    return true;
  } catch {
    return false;
  }
}
