export default function AdminDashboardOverview() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard Overview</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-xl text-center">
        Welcome, admin! Here you can monitor platform stats, manage users, products, orders, and view analytics at a glance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Users</span>
          <span className="text-4xl font-bold mt-2">1,234</span>
          <span className="text-xs text-muted-foreground mt-1">Total Users</span>
        </div>
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Products</span>
          <span className="text-4xl font-bold mt-2">320</span>
          <span className="text-xs text-muted-foreground mt-1">Active Products</span>
        </div>
        <div className="rounded-xl bg-card p-6 shadow flex flex-col items-center">
          <span className="text-2xl font-semibold">Orders</span>
          <span className="text-4xl font-bold mt-2">2,100</span>
          <span className="text-xs text-muted-foreground mt-1">Total Orders</span>
        </div>
      </div>
    </main>
  );
}
