import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Returns · Nexora" };

export default function ReturnsPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Returns"
        title="Easy 30-day returns, on us."
        description="Change your mind? No problem. Start a return from your orders page and we'll email you a prepaid label."
        bullets={[
          "30 days from delivery",
          "Free prepaid return labels",
          "Refund within 5–7 business days",
        ]}
        primaryHref="/account/orders"
        primaryLabel="Start a return"
      />
    </div>
  );
}
