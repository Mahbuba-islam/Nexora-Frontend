/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from "../lib/axious/httpClient";
import { ApiResponse } from "../types/api.types";

export async function getDashboardData<TDashboardStats = unknown>(): Promise<
  ApiResponse<TDashboardStats>
> {
  try {
    const response = await httpClient.get<TDashboardStats>("/stats");
    return response;
  } catch (error: any) {
    // Backend stats endpoint may not exist on every environment.
    // Fail soft so the dashboard renders with empty/zero state.
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Stats unavailable.",
      data: null as TDashboardStats,
      meta: undefined,
    } as ApiResponse<TDashboardStats>;
  }
}