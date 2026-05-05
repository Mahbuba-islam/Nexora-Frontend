// Re-created after legacy ConsultEdge cleanup. Minimal shape that satisfies
// every active import across the Nexora codebase.

export interface paginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<TData = unknown> {
  success: boolean;
  message?: string;
  data: TData;
  meta?: paginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[] | string> | unknown;
}
