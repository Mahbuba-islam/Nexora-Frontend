// Re-created after legacy ConsultEdge cleanup. Minimal shape that satisfies
// every active import across the Nexora codebase. Backend endpoints may be
// missing on some environments — these stubs fail soft.

import { httpClient } from "@/src/lib/axious/httpClient";
import type { IUserManagementItem } from "@/src/types/user.types";

export interface GetUsersOptions {
  role?: string;
  limit?: number;
  page?: number;
  search?: string;
  status?: string;
}

export async function getUsers(
  options: GetUsersOptions = {},
): Promise<IUserManagementItem[]> {
  try {
    const res = await httpClient.get<
      IUserManagementItem[] | { users: IUserManagementItem[] }
    >("/users", {
      silent: true,
      withCredentials: true,
      params: options as Record<string, unknown>,
    });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { users?: IUserManagementItem[] }).users)) {
      return (data as { users: IUserManagementItem[] }).users;
    }
    return [];
  } catch {
    return [];
  }
}
