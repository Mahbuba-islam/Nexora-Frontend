import SellerOrdersClient from "@/components/modules/Nexora/seller/SellerOrdersClient";

export const metadata = {
  title: "Orders · Seller · Nexora",
};

// Server component: only renders client component
export default function SellerOrdersPage() {
  return <SellerOrdersClient />;
}