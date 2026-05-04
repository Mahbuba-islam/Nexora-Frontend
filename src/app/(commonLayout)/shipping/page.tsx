import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Shipping · Nexora" };

export default function ShippingPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Shipping"
        title="Fast, tracked, carbon-aware delivery."
        description="Standard 2–5 day shipping across the US, with express and same-day options in select metros. Full shipping policy detail is being finalized."
        bullets={[
          "Free standard shipping over $75",
          "Express & same-day in 12 metros",
          "Real-time tracking in your account",
        ]}
        primaryHref="/account/orders"
        primaryLabel="Track an order"
      />
    </div>
  );
}
