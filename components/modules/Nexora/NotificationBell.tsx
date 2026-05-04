"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  Package,
  ShoppingBag,
  Wand2,
  Truck,
  Wallet,
  X,
} from "lucide-react";

import {
  getMyNotifications,
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
  /** Hide the bell entirely if user is not authenticated. */
  visible: boolean;
}

export default function NotificationBell({ visible }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NxNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Initial unread count fetch.
  useEffect(() => {
    if (!visible) return;
    let cancel = false;
    getMyNotifications(20).then((res) => {
      if (cancel) return;
      setItems(res.notifications);
      setUnread(res.unreadCount);
    });
    const t = setInterval(async () => {
      const res = await getMyNotifications(20);
      if (!cancel) {
        setItems(res.notifications);
        setUnread(res.unreadCount);
      }
    }, 60_000);
    return () => {
      cancel = true;
      clearInterval(t);
    };
  }, [visible]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const refresh = async () => {
    setLoading(true);
    const res = await getMyNotifications(20);
    setItems(res.notifications);
    setUnread(res.unreadCount);
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen((v) => {
      const next = !v;
      if (next) refresh();
      return next;
    });
  };

  const handleMarkOne = (id: string) => {
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

  const handleMarkAll = () => {
    startTransition(async () => {
      const ok = await markAllNotificationsRead();
      if (ok) {
        setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnread(0);
      }
    });
  };

  if (!visible) return null;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Notifications (${unread} unread)`}
        aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
      >
        <Bell className="h-4.5 w-4.5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#4E8D9C] px-1 text-[10px] font-semibold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* Popover */}
      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-96 max-w-[92vw] origin-top-right transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Notifications
              </p>
              <p className="text-[11px] text-muted-foreground">
                {unread > 0
                  ? `${unread} unread`
                  : "You're all caught up"}
              </p>
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground/70 hover:text-foreground"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </header>

          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="grid place-items-center py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Bell className="mx-auto h-7 w-7 text-foreground/30" />
                <p className="mt-3 text-sm font-semibold">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We&rsquo;ll ping you about orders, shipments, and offers.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((n) => {
                  const Icon = ICON_BY_TYPE[n.type] ?? Bell;
                  const body = (
                    <div className="flex items-start gap-3 px-5 py-3.5">
                      <div
                        className={cn(
                          "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                          n.isRead
                            ? "bg-secondary text-foreground/60"
                            : "bg-[#4E8D9C]/15 text-[#4E8D9C]",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "line-clamp-1 text-sm",
                            n.isRead
                              ? "text-foreground/80"
                              : "font-semibold text-foreground",
                          )}
                        >
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {n.body}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMarkOne(n.id);
                          }}
                          aria-label="Mark as read"
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-foreground/40 hover:bg-secondary hover:text-foreground"
                        >
                          <Check className="h-3.5 w-3.5" />
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
                            if (!n.isRead) handleMarkOne(n.id);
                            setOpen(false);
                          }}
                          className="block transition-colors hover:bg-secondary/40"
                        >
                          {body}
                        </Link>
                      ) : (
                        body
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <footer className="border-t border-border px-5 py-3">
            <Link
              href="/account/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold text-foreground hover:text-[#4E8D9C]"
            >
              View all notifications
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
