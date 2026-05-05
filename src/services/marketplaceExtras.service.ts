// Nexora — services for the new marketplace backend features.
// Endpoints: stripe-connect, refunds, inventory, shipping, search, product Q&A,
// recommendations.
import { httpClient } from "@/src/lib/axious/httpClient";

// ---------- Stripe Connect ----------
export interface NxStripeOnboardingLink {
  url: string;
  accountId?: string;
}

export interface NxStripeAccountStatus {
  connected: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
  accountId?: string;
}

export async function createStripeOnboardingLink(): Promise<NxStripeOnboardingLink | null> {
  try {
    const res = await httpClient.post<NxStripeOnboardingLink>(
      "/stripe-connect/onboarding-link",
      {},
      { withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function getStripeAccountStatus(): Promise<NxStripeAccountStatus | null> {
  try {
    const res = await httpClient.get<NxStripeAccountStatus>(
      "/stripe-connect/status",
      { silent: true, withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

// ---------- Refunds ----------
export type NxRefundStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "REFUNDED"
  | "CANCELLED";

export interface NxRefund {
  id: string;
  orderId: string;
  amount: number | string;
  reason: string;
  status: NxRefundStatus;
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface NxRefundCreateInput {
  orderId: string;
  amount?: number;
  reason: string;
  itemIds?: string[];
}

export async function createRefundRequest(
  input: NxRefundCreateInput,
): Promise<NxRefund | null> {
  try {
    const res = await httpClient.post<NxRefund>("/refunds", input, {
      withCredentials: true,
    });
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function getMyRefunds(): Promise<NxRefund[]> {
  try {
    const res = await httpClient.get<NxRefund[] | { refunds: NxRefund[] }>(
      "/refunds/me",
      { silent: true, withCredentials: true },
    );
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { refunds?: NxRefund[] }).refunds)) {
      return (data as { refunds: NxRefund[] }).refunds;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getAdminRefunds(
  status?: NxRefundStatus,
): Promise<NxRefund[]> {
  try {
    const res = await httpClient.get<NxRefund[] | { refunds: NxRefund[] }>(
      "/refunds",
      {
        silent: true,
        withCredentials: true,
        params: status ? { status } : undefined,
      },
    );
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { refunds?: NxRefund[] }).refunds)) {
      return (data as { refunds: NxRefund[] }).refunds;
    }
    return [];
  } catch {
    return [];
  }
}

export async function updateRefundStatus(
  id: string,
  status: NxRefundStatus,
  notes?: string,
): Promise<NxRefund | null> {
  try {
    const res = await httpClient.patch<NxRefund>(
      `/refunds/${id}`,
      { status, notes },
      { withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

// ---------- Inventory ----------
export interface NxLowStockProduct {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  stock: number;
  threshold: number;
  image?: string;
  shopName?: string;
}

export async function getLowStockProducts(
  scope: "seller" | "admin" = "seller",
): Promise<NxLowStockProduct[]> {
  try {
    const path =
      scope === "admin" ? "/inventory/low-stock" : "/inventory/low-stock/me";
    const res = await httpClient.get<
      NxLowStockProduct[] | { products: NxLowStockProduct[] }
    >(path, { silent: true, withCredentials: true });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (
      data &&
      Array.isArray((data as { products?: NxLowStockProduct[] }).products)
    ) {
      return (data as { products: NxLowStockProduct[] }).products;
    }
    return [];
  } catch {
    return [];
  }
}

// ---------- Shipping ----------
export interface NxShippingQuoteInput {
  items: Array<{ productId: string; quantity: number }>;
  destination: {
    country: string;
    postalCode: string;
    state?: string;
    city?: string;
  };
}

export interface NxShippingRate {
  id: string;
  carrier: string;
  service: string;
  amount: number;
  currency?: string;
  estimatedDays?: number;
}

export async function getShippingQuotes(
  input: NxShippingQuoteInput,
): Promise<NxShippingRate[]> {
  try {
    const res = await httpClient.post<
      NxShippingRate[] | { rates: NxShippingRate[] }
    >("/shipping/quote", input, { withCredentials: true });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { rates?: NxShippingRate[] }).rates)) {
      return (data as { rates: NxShippingRate[] }).rates;
    }
    return [];
  } catch {
    return [];
  }
}

// ---------- Search-as-you-type ----------
export interface NxSearchSuggestion {
  id: string;
  type: "product" | "brand" | "category" | "query";
  label: string;
  href?: string;
  thumbnail?: string;
  price?: number;
}

export async function getSearchSuggestions(
  q: string,
  limit = 8,
): Promise<NxSearchSuggestion[]> {
  if (!q || q.trim().length < 2) return [];
  try {
    const res = await httpClient.get<
      NxSearchSuggestion[] | { suggestions: NxSearchSuggestion[] }
    >("/search/suggest", {
      silent: true,
      params: { q, limit },
    });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (
      data &&
      Array.isArray(
        (data as { suggestions?: NxSearchSuggestion[] }).suggestions,
      )
    ) {
      return (data as { suggestions: NxSearchSuggestion[] }).suggestions;
    }
    return [];
  } catch {
    return [];
  }
}

// ---------- Product Q&A ----------
export interface NxProductQuestion {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  askedByName?: string;
  createdAt: string;
  answer?: string;
  answeredBy?: string;
  answeredByName?: string;
  answeredAt?: string;
  isVerifiedSeller?: boolean;
  upvotes?: number;
}

export async function getProductQuestions(
  productId: string,
): Promise<NxProductQuestion[]> {
  try {
    const res = await httpClient.get<
      NxProductQuestion[] | { questions: NxProductQuestion[] }
    >(`/products/${productId}/qa`, { silent: true });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (
      data &&
      Array.isArray(
        (data as { questions?: NxProductQuestion[] }).questions,
      )
    ) {
      return (data as { questions: NxProductQuestion[] }).questions;
    }
    return [];
  } catch {
    return [];
  }
}

export async function askProductQuestion(
  productId: string,
  question: string,
): Promise<NxProductQuestion | null> {
  try {
    const res = await httpClient.post<NxProductQuestion>(
      `/products/${productId}/qa`,
      { question },
      { withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function answerProductQuestion(
  productId: string,
  questionId: string,
  answer: string,
): Promise<NxProductQuestion | null> {
  try {
    const res = await httpClient.patch<NxProductQuestion>(
      `/products/${productId}/qa/${questionId}`,
      { answer },
      { withCredentials: true },
    );
    return res?.data || null;
  } catch {
    return null;
  }
}

// ---------- Recommendations v2 ----------
export interface NxRecommendedProduct {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  badge?: string;
}

export async function getFrequentlyBoughtTogether(
  productId: string,
  limit = 6,
): Promise<NxRecommendedProduct[]> {
  try {
    const res = await httpClient.get<
      NxRecommendedProduct[] | { products: NxRecommendedProduct[] }
    >(`/recommendations/fbt/${productId}`, {
      silent: true,
      params: { limit },
    });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (
      data &&
      Array.isArray(
        (data as { products?: NxRecommendedProduct[] }).products,
      )
    ) {
      return (data as { products: NxRecommendedProduct[] }).products;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getPersonalizedRecommendations(
  limit = 12,
): Promise<NxRecommendedProduct[]> {
  try {
    const res = await httpClient.get<
      NxRecommendedProduct[] | { products: NxRecommendedProduct[] }
    >("/recommendations/for-you", {
      silent: true,
      withCredentials: true,
      params: { limit },
    });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (
      data &&
      Array.isArray(
        (data as { products?: NxRecommendedProduct[] }).products,
      )
    ) {
      return (data as { products: NxRecommendedProduct[] }).products;
    }
    return [];
  } catch {
    return [];
  }
}
