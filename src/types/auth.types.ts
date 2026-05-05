// Re-created after legacy ConsultEdge cleanup. Re-exports user types so
// existing `@/src/types/auth.types` imports keep working.

export type { IUserProfile, UserRole } from "./user.types";
import type { IUserProfile } from "./user.types";

export interface IUpdateProfilePayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  email?: string;
  title?: string;
  experience?: number;
  industryId?: string;
  fullName?: string;
  [key: string]: unknown;
}

export interface IUpdateProfileResponse {
  success: boolean;
  message?: string;
  data?: IUserProfile | null;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILOginResponse {
  success?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    user?: IUserProfile;
  } | null;
  user: IUserProfile & {
    role?: string;
    emailVerified?: boolean;
    needPasswordChange?: boolean;
    email?: string;
  };
}

export interface IRegisterPayload {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface IRegisterResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: IUserProfile;
    accessToken?: string;
    refreshToken?: string;
  } | null;
}
