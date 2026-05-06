
import StoresClient from "@/components/modules/marketplace/StoresClient";

export const metadata = {
  title: "Stores · Nexora",
  description:
    "Browse independent stores on the Nexora marketplace. Discover what makers, brands and creators are launching.",
};
export const dynamic = "force-dynamic";

export default function StoresPage() {
  return <StoresClient />;
}
