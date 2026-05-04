import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Deals · Nexora" };

export default function DealsPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Deals"
        title="Today's best drops, all in one place."
        description="We're curating flash sales, member-only pricing, and AI-bundled discounts. While we polish the deals hub, browse trending products in the shop."
        bullets={[
          "Flash drops every Friday",
          "Member-only price unlocks",
          "AI-bundled multi-product savings",
        ]}
        primaryHref="/shop?sort=newest"
        primaryLabel="Shop new arrivals"
      />
    </div>
  );
}
