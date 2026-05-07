
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = {
  title: "Orders · Nexora",
};

import OrdersClient from "./OrdersClient";

// Server component: only renders client component
export default function OrdersPage() {
  return <OrdersClient />;
}
