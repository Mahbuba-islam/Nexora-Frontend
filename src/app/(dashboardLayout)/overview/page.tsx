import React from "react";

export default function DashboardOverviewPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-xl text-center">
        Here you can view your recent activity, stats, and quick links to manage your account, orders, and more. Use the navigation to explore all dashboard features.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Orders</span>
          <span className="text-4xl font-bold mt-2">12</span>
          <span className="text-xs text-muted-foreground mt-1">Total Orders</span>
        </div>
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Wishlist</span>
          <span className="text-4xl font-bold mt-2">5</span>
          <span className="text-xs text-muted-foreground mt-1">Saved Items</span>
        </div>
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Reviews</span>
          <span className="text-4xl font-bold mt-2">3</span>
          <span className="text-xs text-muted-foreground mt-1">Your Reviews</span>
        </div>
      </div>
    </main>
  );
}
