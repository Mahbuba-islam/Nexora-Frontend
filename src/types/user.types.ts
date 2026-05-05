// Re-created after legacy ConsultEdge cleanup. Minimal shape that satisfies
// every active import across the Nexora codebase.

export type UserRole =
  | "ADMIN"
  | "SELLER"
  | "EXPERT"
  | "CLIENT"
  | "CUSTOMER"
  | "USER"
  | (string & {});

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
  BANNED = "BANNED",
  BLOCKED = "BLOCKED",
}

export interface IUserProfile {
  id: string;
  userId?: string;
  email?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  phone?: string | null;
  avatar?: string | null;
  image?: string | null;
  role?: UserRole | null;
  status?: UserStatus | string | null;
  createdAt?: string;
  updatedAt?: string;
  // ConsultEdge legacy nested profiles tolerated by some providers/forms.
  expert?: {
    fullName?: string | null;
    title?: string | null;
    experience?: number | null;
    industry?: { id?: string | null; name?: string | null } | null;
    industryId?: string | null;
    [key: string]: unknown;
  } | null;
  client?: {
    fullName?: string | null;
    [key: string]: unknown;
  } | null;
  admin?: { name?: string | null; [key: string]: unknown } | null;
  // tolerated extras from backend
  [key: string]: unknown;
}

export interface IUserManagementItem extends IUserProfile {
  ordersCount?: number;
  lastSeenAt?: string | null;
}
