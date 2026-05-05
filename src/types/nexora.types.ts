// Nexora — product / category / brand domain types.
// Mirrors the Prisma models exposed by the backend at /api/v1.

export type NxProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type NxProductCondition = "NEW" | "REFURBISHED" | "USED";

export interface NxImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface NxBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  website?: string | null;
  description?: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

export interface NxCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

/** Node returned by /categories/tree — root with nested children + counts. */
export interface NxCategoryNode extends NxCategory {
  children: NxCategoryNode[];
  productCount?: number;
}

export interface NxSpec {
  id: string;
  productId: string;
  label: string;
  value: string;
  sortOrder?: number;
}

export interface NxProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDesc?: string | null;
  description?: string | null;
  /** Backend returns Prisma Decimal as string. */
  price: string;
  compareAtPrice?: string | null;
  currency: string;
  stock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  status: NxProductStatus;
  condition: NxProductCondition;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  brandId: string;
  categoryId: string;
  avgRating?: number | null;
  reviewCount: number;
  soldCount: number;
  viewCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images: NxImage[];
  brand?: NxBrand;
  category?: NxCategory;
  specifications?: NxSpec[];
}

export interface NxPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NxProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  /** Inclusive lower price bound (USD). Forwarded to backend as `minPrice`. */
  minPrice?: number;
  /** Inclusive upper price bound (USD). Forwarded to backend as `maxPrice`. */
  maxPrice?: number;
  /** Minimum average rating (1–5). Forwarded as `minRating`. */
  minRating?: number;
  sortBy?: "createdAt" | "price" | "soldCount" | "avgRating";
  sortOrder?: "asc" | "desc";
}

/** Helpers — DTO -> view model. */
export const toNumberPrice = (v: string | number | null | undefined): number =>
  v == null ? 0 : typeof v === "number" ? v : Number(v);

export const primaryImage = (p: Pick<NxProduct, "images">): string | null =>
  p.images?.find((i) => i.isPrimary)?.url ??
  p.images?.[0]?.url ??
  null;
