import SellerProductsClient from "@/components/modules/seller/SellerProductsClient";

export const metadata = { title: "Products · Seller · Nexora" };

// Server component: only renders client component
export default function SellerProductsPage() {
  return <SellerProductsClient />;
}
