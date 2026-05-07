// Payload for creating a product
export interface NxProductCreatePayload {
  name: string;
  description?: string;
  price: number | string;
  categoryId?: string;
  brandId?: string;
  images?: { url: string; alt?: string }[];
  stock?: number;
  status?: "ACTIVE" | "DRAFT";
  isNewArrival?: boolean;
}

// Create product API call
export const createProduct = async (
  payload: NxProductCreatePayload | FormData,
): Promise<NxProduct | null> => {
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await httpClient.post<NxProduct>("/products", payload, {
      withCredentials: true,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });
    return res?.data ?? null;
  } catch (err) {
    console.warn("[nexora] createProduct failed:", (err as Error)?.message);
    return null;
  }
};
import type { ApiResponse } from "@/src/types/api.types";
import type {
  NxBrand,
  NxCategory,
  NxCategoryNode,
  NxProduct,
  NxProductQuery,
} from "@/src/types/nexora.types";
import { httpClient } from "@/src/lib/axious/httpClient";

/**
 * Nexora catalog services.
 *
 * All read endpoints are public and safe to call from React Server
 * Components. We pass `silent: true` so SSR errors (e.g. backend down on
 * the deploy preview) don't spam the build log — the UI handles empty
 * arrays gracefully.
 */

export type ProductsResponse = ApiResponse<NxProduct[]>;

export const getProducts = async (
  query: NxProductQuery = {},
): Promise<ProductsResponse> => {
  try {
    const res = await httpClient.get<NxProduct[]>("/products", {
      params: query as Record<string, unknown>,
      silent: true,
    });
    return {
      ...res,
      data: Array.isArray(res.data) ? res.data : [],
    };
  } catch (err) {
    console.warn("[nexora] getProducts failed:", (err as Error)?.message);
    return {
      success: false,
      message: "Failed to fetch products",
      data: [],
      meta: { page: 1, limit: query.limit ?? 12, total: 0, totalPages: 0 },
    } as ProductsResponse;
  }
};

export const getProductBySlug = async (
  slug: string,
): Promise<NxProduct | null> => {
  try {
    const res = await httpClient.get<NxProduct>(`/products/slug/${slug}`, {
      silent: true,
    });
    return res?.data ?? null;
  } catch {
    try {
      // Fallback: some backends expose lookup at /products/:slug directly.
      const res = await httpClient.get<NxProduct>(`/products/${slug}`, {
        silent: true,
      });
      return res?.data ?? null;
    } catch (err) {
      console.warn(
        "[nexora] getProductBySlug failed:",
        (err as Error)?.message,
      );
      return null;
    }
  }
};

export const getCategories = async (): Promise<NxCategory[]> => {
  try {
    const res = await httpClient.get<NxCategory[]>("/categories", {
      silent: true,
    });
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.warn("[nexora] getCategories failed:", (err as Error)?.message);
    return [];
  }
};

export const getCategoryTree = async (): Promise<NxCategoryNode[]> => {
  try {
    const res = await httpClient.get<NxCategoryNode[]>("/categories/tree", {
      silent: true,
    });
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.warn("[nexora] getCategoryTree failed:", (err as Error)?.message);
    return [];
  }
};

export const getBrands = async (): Promise<NxBrand[]> => {
  try {
    const res = await httpClient.get<NxBrand[]>("/brands", { silent: true });
    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.warn("[nexora] getBrands failed:", (err as Error)?.message);
    return [];
  }
};

export interface NxBrandCreatePayload {
  name: string;
  slug?: string;
  logo?: string;
  website?: string;
  description?: string;
  isFeatured?: boolean;
}

export const createBrand = async (
  payload: NxBrandCreatePayload,
): Promise<NxBrand | null> => {
  const res = await httpClient.post<NxBrand>("/brands", payload, {
    withCredentials: true,
  });
  return res?.data ?? null;
};
