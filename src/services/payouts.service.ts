// Nexora — seller payouts service.
import { httpClient } from "@/src/lib/axious/httpClient";

export type NxPayoutStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

export interface NxPayout {
  id: string;
  sellerId: string;
  sellerName?: string;
  amount: string; // decimal as string
  currency: string;
  status: NxPayoutStatus;
  periodStart: string;
  periodEnd: string;
  initiatedAt?: string | null;
  paidAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  reference?: string | null;
  /** Number of seller-orders aggregated. */
  orderCount?: number;
  createdAt: string;
}

export interface NxSellerEarningsSummary {
  pendingPayout: string;
  lifetimeEarnings: string;
  paidOut: string;
  currency: string;
  /** Seller-orders awaiting payout aggregation. */
  pendingOrders?: number;
}

const LIST_PATHS = [
  "/payouts/me",
  "/payouts/my",
  "/seller/payouts",
  "/payouts",
] as const;

function parseList(payload: unknown): NxPayout[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as NxPayout[];
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as { payouts?: unknown; items?: unknown; data?: unknown };
    if (Array.isArray(obj.payouts)) return obj.payouts as NxPayout[];
    if (Array.isArray(obj.items)) return obj.items as NxPayout[];
    if (Array.isArray(obj.data)) return obj.data as NxPayout[];
  }
  return [];
}

export async function getMyPayouts(): Promise<NxPayout[]> {
  for (const path of LIST_PATHS) {
    try {
      const res = await httpClient.get<unknown>(path, {
        silent: true,
        withCredentials: true,
      });
      const items = parseList(res?.data);
      if (items.length > 0 || res?.success) return items;
    } catch {
      // try next
    }
  }
  return [];
}

export async function getMySellerEarnings(): Promise<NxSellerEarningsSummary | null> {
  const candidates = [
    "/payouts/summary/me",
    "/payouts/me/summary",
    "/seller/earnings",
  ];
  for (const path of candidates) {
    try {
      const res = await httpClient.get<NxSellerEarningsSummary>(path, {
        silent: true,
        withCredentials: true,
      });
      if (res?.data) return res.data;
    } catch {
      // try next
    }
  }
  return null;
}

// Admin-only payout actions ------------------------------------------------

export async function adminGeneratePayouts(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await httpClient.post<{ message?: string }>(
      "/payouts/generate",
      undefined,
      { withCredentials: true },
    );
    return { success: !!res?.success, message: res?.message };
  } catch {
    return { success: false, message: "Failed to generate payouts." };
  }
}

export async function adminMarkPayoutPaid(
  id: string,
  reference?: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await httpClient.patch<{ message?: string }>(
      `/payouts/${id}/mark-paid`,
      { reference },
      { withCredentials: true },
    );
    return { success: !!res?.success, message: res?.message };
  } catch {
    return { success: false, message: "Failed to mark payout paid." };
  }
}

export async function adminMarkPayoutFailed(
  id: string,
  reason?: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await httpClient.patch<{ message?: string }>(
      `/payouts/${id}/mark-failed`,
      { failureReason: reason },
      { withCredentials: true },
    );
    return { success: !!res?.success, message: res?.message };
  } catch {
    return { success: false, message: "Failed to mark payout failed." };
  }
}
