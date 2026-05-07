import { useEffect, useState } from "react";
import { getAdminSellers } from "@/src/services/marketplace.service";
import { getUserInfo } from "@/src/services/auth.services";

export default function SellerDashboardOverview() {
  const [shopName, setShopName] = useState<string | null>(null);
  useEffect(() => {
    async function fetchShopName() {
      const user = await getUserInfo();
      if (!user?.email) return;
      const sellers = await getAdminSellers();
      const mine = sellers.find((s) => s.ownerEmail === user.email);
      setShopName(mine?.shopName || null);
    }
    fetchShopName();
  }, []);
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Seller Dashboard Overview</h1>
      {shopName && (
        <p className="text-lg font-semibold text-primary mb-2">Your Store: {shopName}</p>
      )}
      <p className="text-lg text-muted-foreground mb-6 max-w-xl text-center">
        Welcome, seller! Track your sales, manage your products, view payouts, and monitor your store performance here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Sales</span>
          <span className="text-4xl font-bold mt-2">$12,500</span>
          <span className="text-xs text-muted-foreground mt-1">Total Sales</span>
        </div>
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Products</span>
          <span className="text-4xl font-bold mt-2">24</span>
          <span className="text-xs text-muted-foreground mt-1">Your Products</span>
        </div>
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Orders</span>
          <span className="text-4xl font-bold mt-2">87</span>
          <span className="text-xs text-muted-foreground mt-1">Your Orders</span>
        </div>
      </div>
    </main>
  );
}
