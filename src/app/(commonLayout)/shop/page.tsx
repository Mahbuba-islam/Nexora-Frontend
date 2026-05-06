import ShopClient from "@/components/modules/Nexora/ShopClient";



export const metadata = {
  title: "Shop · Nexora",
  description:
    "Browse premium tech curated by Nexora AI — phones, laptops, audio, wearables, and more.",
};



export default function ShopPage({ searchParams }: { searchParams: any }) {
  return <ShopClient searchParams={searchParams} />;
}
