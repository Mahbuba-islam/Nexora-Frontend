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

type RawAdminSeller = NxAdminSeller & {
  user?: { id?: string; name?: string | null; email?: string | null; status?: string };
  totalSales?: string | number | null;
  orderCount?: number | null;
  createdAt?: string | null;
};

function normalizeAdminSeller(raw: RawAdminSeller): NxAdminSeller {
  const ownerName = raw.ownerName ?? raw.user?.name ?? undefined;
  const ownerEmail = raw.ownerEmail ?? raw.user?.email ?? undefined;
  return {
    ...raw,
    ownerName: ownerName ?? undefined,
    ownerEmail: ownerEmail ?? undefined,
    gmv: raw.gmv ?? (raw.totalSales != null ? String(raw.totalSales) : undefined),
    ordersCount: raw.ordersCount ?? raw.orderCount ?? undefined,
    joinedAt: raw.joinedAt ?? raw.createdAt ?? new Date().toISOString(),
  };
}

export async function getAdminSellers(): Promise<NxAdminSeller[]> {
  const candidates = [
    "/sellers/admin",
    "/sellers/admin/list",
    "/admin/sellers",
    "/sellers",
  ];
  for (const path of candidates) {
    try {
      const res = await httpClient.get<
        | RawAdminSeller[]
        | { sellers?: RawAdminSeller[]; data?: RawAdminSeller[] }
      >(path, { silent: true, withCredentials: true });
      const data = res?.data;
      if (Array.isArray(data)) {
        return data.map(normalizeAdminSeller);
      }
      if (data && typeof data === "object") {
        const obj = data as { sellers?: RawAdminSeller[]; data?: RawAdminSeller[] };
        if (Array.isArray(obj.sellers)) return obj.sellers.map(normalizeAdminSeller);
        if (Array.isArray(obj.data)) return obj.data.map(normalizeAdminSeller);
      }
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
