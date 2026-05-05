// Nexora — admin-only product/user/seller/analytics services.
// Backend exposes: /admin/products, /admin/users, /sellers/admin/*, /stats/*.
import { httpClient } from "@/src/lib/axious/httpClient";
import type { ApiResponse, paginationMeta } from "@/src/types/api.types";

// -----------------------------------------------------------------
// Shared shapes (backend-aligned, kept loose for forward-compat)
// -----------------------------------------------------------------

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  currency: string;
  stock: number;
  lowStockAlert?: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK" | string;
  condition?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  isDeleted?: boolean;
  soldCount?: number;
  viewCount?: number;
  avgRating?: number;
  reviewCount?: number;
  seller?: { id: string; shopName?: string; shopSlug?: string } | null;
  brand?: { id: string; name?: string; slug?: string } | null;
  category?: { id: string; name?: string; slug?: string } | null;
  images?: Array<{ url: string; isPrimary?: boolean; alt?: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProductDetail extends AdminProduct {
  unitsSold?: number;
  revenue?: string | number;
  refundCount?: number;
  refundRate?: number;
}

export type AdminProductListFilters = Partial<{
  search: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK" | "ALL";
  sellerId: string;
  categoryId: string;
  brandId: string;
  isDeleted: "true" | "false" | "all";
  lowStock: boolean;
  outOfStock: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  minPrice: number;
  maxPrice: number;
  sortBy:
    | "price"
    | "stock"
    | "soldCount"
    | "viewCount"
    | "avgRating"
    | "createdAt";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}>;

export type AdminProductBulkAction =
  | "archive"
  | "activate"
  | "draft"
  | "feature"
  | "unfeature"
  | "bestseller"
  | "unbestseller"
  | "delete"
  | "restore";

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  status: "ACTIVE" | "BLOCKED" | "SUSPENDED" | "DELETED" | string;
  emailVerified?: boolean;
  isDeleted?: boolean;
  image?: string | null;
  createdAt?: string;
  lastSeenAt?: string | null;
  seller?: { id: string; shopName?: string } | null;
  _count?: {
    orders?: number;
    reviews?: number;
    addresses?: number;
  };
}

export interface AdminUserDetail extends AdminUser {
  lifetimeSpend?: string | number;
  paidOrderCount?: number;
  lastOrder?: { id: string; orderNumber?: string; createdAt?: string } | null;
  lastSession?: { ip?: string; userAgent?: string; createdAt?: string } | null;
  addresses?: Array<{ id: string; line1: string; city?: string; country?: string }>;
}

export type AdminUserListFilters = Partial<{
  role: string;
  status: "ACTIVE" | "BLOCKED" | "SUSPENDED" | "DELETED";
  search: string;
  isDeleted: "true" | "false" | "all";
  emailVerified: boolean;
  sortBy: "createdAt" | "lastSeenAt" | "name" | "email";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}>;

export interface AdminSellerDetail {
  id: string;
  shopName: string;
  shopSlug?: string;
  status: string;
  kycStatus?: string;
  commissionRate?: number;
  contactEmail?: string;
  contactPhone?: string;
  tagline?: string;
  description?: string;
  productCount?: number;
  ordersCount?: number;
  totalSales?: string | number;
  user?: { id: string; email?: string; name?: string };
  paidOrders?: number;
  gmv?: string | number;
  commission?: string | number;
  sellerEarnings?: string | number;
  monthGmv?: string | number;
  monthEarnings?: string | number;
  ordersLast30Days?: number;
  pendingPayoutTotal?: string | number;
  paidPayoutTotal?: string | number;
  lowStockCount?: number;
  refundCount?: number;
  createdAt?: string;
}

// -----------------------------------------------------------------
// Helper
// -----------------------------------------------------------------

const okEmpty = <T,>(empty: T): ApiResponse<T> => ({
  success: false,
  message: "Backend unreachable",
  data: empty,
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 } as paginationMeta,
});

// -----------------------------------------------------------------
// Products
// -----------------------------------------------------------------

export async function getAdminProducts(
  filters: AdminProductListFilters = {},
): Promise<ApiResponse<AdminProduct[]>> {
  try {
    const res = await httpClient.get<AdminProduct[] | { products: AdminProduct[] }>(
      "/admin/products",
      {
        silent: true,
        withCredentials: true,
        params: filters as Record<string, unknown>,
      },
    );
    const data = Array.isArray(res?.data)
      ? (res.data as AdminProduct[])
      : Array.isArray((res?.data as { products?: AdminProduct[] })?.products)
        ? ((res.data as { products: AdminProduct[] }).products)
        : [];
    return { ...res, data };
  } catch {
    return okEmpty<AdminProduct[]>([]);
  }
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  try {
    const res = await httpClient.get<AdminProductDetail>(
      `/admin/products/${id}`,
      { silent: true, withCredentials: true },
    );
    return res?.data ?? null;
  } catch {
    return null;
  }
}

export async function updateAdminProduct(
  id: string,
  payload: Partial<AdminProduct>,
): Promise<AdminProduct | null> {
  const res = await httpClient.patch<AdminProduct>(
    `/admin/products/${id}`,
    payload,
    { withCredentials: true },
  );
  return res?.data ?? null;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  try {
    await httpClient.delete(`/admin/products/${id}`, { withCredentials: true });
    return true;
  } catch {
    return false;
  }
}

export async function restoreAdminProduct(id: string): Promise<boolean> {
  try {
    await httpClient.post(
      `/admin/products/${id}/restore`,
      {},
      { withCredentials: true },
    );
    return true;
  } catch {
    return false;
  }
}

export async function bulkAdminProducts(
  ids: string[],
  action: AdminProductBulkAction,
): Promise<boolean> {
  try {
    await httpClient.post(
      "/admin/products/bulk",
      { ids, action },
      { withCredentials: true },
    );
    return true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------
// Users
// -----------------------------------------------------------------

export async function getAdminUsers(
  filters: AdminUserListFilters = {},
): Promise<ApiResponse<AdminUser[]>> {
  try {
    const res = await httpClient.get<AdminUser[] | { users: AdminUser[] }>(
      "/admin/users",
      {
        silent: true,
        withCredentials: true,
        params: filters as Record<string, unknown>,
      },
    );
    const data = Array.isArray(res?.data)
      ? (res.data as AdminUser[])
      : Array.isArray((res?.data as { users?: AdminUser[] })?.users)
        ? (res.data as { users: AdminUser[] }).users
        : [];
    return { ...res, data };
  } catch {
    return okEmpty<AdminUser[]>([]);
  }
}

export async function getAdminUser(id: string): Promise<AdminUserDetail | null> {
  try {
    const res = await httpClient.get<AdminUserDetail>(`/admin/users/${id}`, {
      silent: true,
      withCredentials: true,
    });
    return res?.data ?? null;
  } catch {
    return null;
  }
}

export async function updateAdminUser(
  id: string,
  payload: Partial<AdminUser>,
): Promise<AdminUser | null> {
  const res = await httpClient.patch<AdminUser>(`/admin/users/${id}`, payload, {
    withCredentials: true,
  });
  return res?.data ?? null;
}

export async function suspendAdminUser(id: string, reason: string) {
  return httpClient.post(
    `/admin/users/${id}/suspend`,
    { reason },
    { withCredentials: true },
  );
}

export async function blockAdminUser(id: string, reason: string) {
  return httpClient.post(
    `/admin/users/${id}/block`,
    { reason },
    { withCredentials: true },
  );
}

export async function reactivateAdminUser(id: string) {
  return httpClient.post(
    `/admin/users/${id}/reactivate`,
    {},
    { withCredentials: true },
  );
}

export async function deleteAdminUser(id: string) {
  return httpClient.delete(`/admin/users/${id}`, { withCredentials: true });
}

export async function restoreAdminUser(id: string) {
  return httpClient.post(
    `/admin/users/${id}/restore`,
    {},
    { withCredentials: true },
  );
}

// -----------------------------------------------------------------
// Sellers (admin)
// -----------------------------------------------------------------

export async function getAdminSellerDetail(
  id: string,
): Promise<AdminSellerDetail | null> {
  try {
    const res = await httpClient.get<AdminSellerDetail>(
      `/sellers/admin/${id}/detail`,
      { silent: true, withCredentials: true },
    );
    return res?.data ?? null;
  } catch {
    return null;
  }
}

export async function updateAdminSeller(
  id: string,
  payload: Partial<AdminSellerDetail>,
) {
  return httpClient.patch<AdminSellerDetail>(`/sellers/admin/${id}`, payload, {
    withCredentials: true,
  });
}

export async function approveAdminSeller(id: string) {
  return httpClient.patch(
    `/sellers/admin/${id}/approve`,
    {},
    { withCredentials: true },
  );
}
export async function rejectAdminSeller(id: string, reason?: string) {
  return httpClient.patch(
    `/sellers/admin/${id}/reject`,
    { reason },
    { withCredentials: true },
  );
}
export async function suspendAdminSeller(id: string, reason?: string) {
  return httpClient.patch(
    `/sellers/admin/${id}/suspend`,
    { reason },
    { withCredentials: true },
  );
}
export async function reinstateAdminSeller(id: string) {
  return httpClient.patch(
    `/sellers/admin/${id}/reinstate`,
    {},
    { withCredentials: true },
  );
}
export async function softDeleteAdminSeller(id: string) {
  return httpClient.delete(`/sellers/admin/${id}`, { withCredentials: true });
}

// -----------------------------------------------------------------
// Analytics
// -----------------------------------------------------------------

export interface OrdersTimeseriesPoint {
  date: string;
  orders: number;
  paidOrders: number;
  revenue: string | number;
}

export interface SalesByCategory {
  categoryId: string;
  categoryName: string;
  units: number;
  revenue: string | number;
}

export interface CustomerAcquisitionPoint {
  date: string;
  customers: number;
}

export interface RefundMetrics {
  byStatus: Array<{ status: string; count: number; amount: string | number }>;
  totalRefunded: string | number;
  refundRatePct: number;
}

export interface TopCustomer {
  id: string;
  name?: string | null;
  email: string;
  orders: number;
  spend: string | number;
}

export interface ConversionFunnel {
  carts: number;
  abandonedCarts: number;
  convertedCarts: number;
  paidOrders: number;
  conversionRatePct: number;
  abandonmentRatePct: number;
}

export interface InventoryHealth {
  active: number;
  lowStock: number;
  outOfStock: number;
  archived: number;
  drafts: number;
}

const fetchAnalytics = async <T,>(path: string, params?: Record<string, unknown>): Promise<T | null> => {
  try {
    const res = await httpClient.get<T>(path, {
      silent: true,
      withCredentials: true,
      params,
    });
    return res?.data ?? null;
  } catch {
    return null;
  }
};

export const getOrdersTimeseries = (days = 30) =>
  fetchAnalytics<OrdersTimeseriesPoint[]>("/stats/orders-timeseries", { days });
export const getSalesByCategory = (limit = 10) =>
  fetchAnalytics<SalesByCategory[]>("/stats/sales-by-category", { limit });
export const getCustomerAcquisition = (days = 30) =>
  fetchAnalytics<CustomerAcquisitionPoint[]>("/stats/customer-acquisition", {
    days,
  });
export const getRefundMetrics = () =>
  fetchAnalytics<RefundMetrics>("/stats/refund-metrics");
export const getTopCustomers = (limit = 10) =>
  fetchAnalytics<TopCustomer[]>("/stats/top-customers", { limit });
export const getConversionFunnel = (days = 30) =>
  fetchAnalytics<ConversionFunnel>("/stats/conversion-funnel", { days });
export const getInventoryHealth = () =>
  fetchAnalytics<InventoryHealth>("/stats/inventory-health");
