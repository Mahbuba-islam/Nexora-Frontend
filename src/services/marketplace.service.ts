// Nexora — admin marketplace stats + sellers.
import { httpClient } from "@/src/lib/axious/httpClient";

export interface NxMarketplaceStats {
  gmv: string;
  orders: number;
  sellerOrders: number;
  pendingPayouts: string;
  paidPayouts: string;
  customers: number;
  activeSellers: number;
  pendingApprovals?: number;
  currency?: string;
}

export interface NxTopSeller {
  id: string;
  shopName: string;
  shopSlug?: string;
  logo?: string;
  ordersCount: number;
  gmv: string;
}

export interface NxPayoutPipeline {
  pendingPayoutAmount: string;
  pendingSellerOrders: number;
  scheduledNext?: string | null;
  currency?: string;
}

export interface NxAdminSeller {
  id: string;
  shopName: string;
  shopSlug?: string;
  ownerName?: string;
  ownerEmail?: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  productCount?: number;
  ordersCount?: number;
  gmv?: string;
  joinedAt: string;
}

export async function getMarketplaceStats(): Promise<NxMarketplaceStats | null> {
  try {
    const res = await httpClient.get<NxMarketplaceStats>(
      "/stats/marketplace",
      { silent: true, withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function getTopSellers(limit = 10): Promise<NxTopSeller[]> {
  try {
    const res = await httpClient.get<NxTopSeller[] | { sellers: NxTopSeller[] }>(
      "/stats/top-sellers",
      { silent: true, withCredentials: true, params: { limit } },
    );
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { sellers?: NxTopSeller[] }).sellers))
      return (data as { sellers: NxTopSeller[] }).sellers;
    return [];
  } catch {
    return [];
  }
}

export async function getPayoutPipeline(): Promise<NxPayoutPipeline | null> {
  try {
    const res = await httpClient.get<NxPayoutPipeline>(
      "/stats/payout-pipeline",
      { silent: true, withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function getAdminSellers(): Promise<NxAdminSeller[]> {
  const candidates = ["/sellers", "/admin/sellers"];
  for (const path of candidates) {
    try {
      const res = await httpClient.get<
        NxAdminSeller[] | { sellers: NxAdminSeller[] }
      >(path, { silent: true, withCredentials: true });
      const data = res?.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray((data as { sellers?: NxAdminSeller[] }).sellers))
        return (data as { sellers: NxAdminSeller[] }).sellers;
    } catch {
      // try next
    }
  }
  return [];
}

export async function getAdminPayouts() {
  // Reuses /payouts endpoint without seller scoping.
  try {
    const res = await httpClient.get<unknown>("/payouts", {
      silent: true,
      withCredentials: true,
    });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (
      data &&
      Array.isArray((data as { payouts?: unknown }).payouts)
    )
      return (data as { payouts: unknown[] }).payouts;
    return [];
  } catch {
    return [];
  }
}
