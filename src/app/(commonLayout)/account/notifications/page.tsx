import Link from "next/link";
import { Bell } from "lucide-react";

import {
  getMyNotifications,
  type NxNotification,
  type NxNotificationType,
} from "@/src/services/notifications.service";
import NotificationListClient from "@/components/modules/Nexora/NotificationListClient";

export const metadata = {
  title: "Notifications · Nexora",
};

export default async function NotificationsPage() {
  const { notifications, unreadCount } = await getMyNotifications(50);

  if (notifications.length === 0) {
    return <Empty />;
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Notifications
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread of ${notifications.length}`
              : `${notifications.length} ${
                  notifications.length === 1 ? "item" : "items"
                }`}
          </p>
        </div>
      </header>

      <NotificationListClient
        initial={notifications as NxNotification[]}
        initialUnread={unreadCount}
      />
    </div>
  );
}

function Empty() {
  return (
    <div className="nx-card flex min-h-80 flex-col items-center justify-center p-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
        <Bell className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">
        Nothing here yet.
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We&rsquo;ll send you updates about orders, shipments, and offers from
        sellers you love.
      </p>
      <Link
        href="/shop"
        className="nx-btn-primary mt-7 inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
      >
        Discover products
      </Link>
    </div>
  );
}

export type { NxNotificationType };
