import NewArrivalsClient from "@/components/modules/Nexora/NewArrivalsClient";

export const metadata = {
  title: "New arrivals · Nexora",
  description:
    "Just landed on Nexora — handpicked new tech, curated daily by the AI editor.",
};

export const dynamic = "force-dynamic";

export default function NewArrivalsPage() {
  return <NewArrivalsClient />;
}
