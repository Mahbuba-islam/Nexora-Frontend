"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Bell,
  CheckCheck,
  Package,
  ShoppingBag,
  Wand2,
  Truck,
  Wallet,
  X,
} from "lucide-react";

import {
  markAllNotificationsRead,
  markNotificationRead,
  type NxNotification,
  type NxNotificationType,
} from "@/src/services/notifications.service";
import { cn } from "@/src/lib/utils";

const ICON_BY_TYPE: Record<
  NxNotificationType,
  React.ComponentType<{ className?: string }>
> = {
  ORDER_PLACED: ShoppingBag,
  ORDER_SHIPPED: Truck,
  ORDER_DELIVERED: Package,
  SELLER_ORDER_CANCELLED: X,
  NEW_SELLER_ORDER: ShoppingBag,
  LOW_STOCK: Package,
  PAYOUT_INITIATED: Wallet,
  PAYOUT_PAID: Wallet,
  PAYOUT_FAILED: Wallet,
  REVIEW_RECEIVED: Wand2,
  GENERAL: Bell,
};

interface Props {
  initial: NxNotification[];
  initialUnread: number;
}

export default function NotificationListClient({
  initial,
  initialUnread,
}: Props) {
  const [items, setItems] = useState<NxNotification[]>(initial);
  const [unread, setUnread] = useState(initialUnread);
  const [, startTransition] = useTransition();

  const onMark = (id: string) => {
    startTransition(async () => {
      const ok = await markNotificationRead(id);
      if (ok) {
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        setUnread((u) => Math.max(0, u - 1));
      }
    });
  };

  const onMarkAll = () => {
    startTransition(async () => {
      const ok = await markAllNotificationsRead();
      if (ok) {
        setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnread(0);
      }
    });
  };

  return (
    <div>
      {unread > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onMarkAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-foreground"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {items.map((n) => {
          const Icon = ICON_BY_TYPE[n.type] ?? Bell;
          const inner = (
            <div
              className={cn(
                "nx-card flex items-start gap-4 p-4 transition-colors",
                !n.isRead && "border-[#4E8D9C]/30 bg-[#4E8D9C]/5",
              )}
            >
              <div
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
                  n.isRead
                    ? "bg-secondary text-foreground/60"
                    : "bg-[#4E8D9C]/15 text-[#4E8D9C]",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm",
                    n.isRead
                      ? "text-foreground/85"
                      : "font-semibold text-foreground",
                  )}
                >
                  {n.title}
                </p>
                {n.body && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {n.body}
                  </p>
                )}
                <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!n.isRead && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onMark(n.id);
                  }}
                  className="text-[11px] font-semibold text-foreground/60 hover:text-foreground"
                >
                  Mark read
                </button>
              )}
            </div>
          );
          return (
            <li key={n.id}>
              {n.href ? (
                <Link
                  href={n.href}
                  onClick={() => {
                    if (!n.isRead) onMark(n.id);
                  }}
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
