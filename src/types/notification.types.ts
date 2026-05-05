// Re-created after legacy ConsultEdge cleanup. Minimal shape that satisfies
// every active import across the Nexora codebase.

export type NotificationType = "USER" | "SYSTEM" | "ORDER" | "REVIEW" | (string & {});

export interface INotification {
  id: string;
  type: NotificationType;
  message: string;
  userId?: string | null;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
  data?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface IUnreadNotificationCount {
  count: number;
}

export interface ICreateNotificationPayload {
  type: NotificationType;
  message: string;
  userId?: string;
  data?: Record<string, unknown>;
}
