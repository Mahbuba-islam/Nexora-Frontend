import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "AI Bundles · Nexora" };

export default function AIBundlesPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora AI · Bundles"
        title="Smart bundles, hand-picked by AI."
        description="Tell us what you're working on and we'll assemble a discounted multi-product bundle from across Nexora's catalog."
        bullets={[
          "Setup-based bundle suggestions",
          "Auto-applied bundle discount",
          "Save & share with one link",
        ]}
        primaryHref="/shop"
        primaryLabel="Browse products"
      />
    </div>
  );
}
