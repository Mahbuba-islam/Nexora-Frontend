import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Sustainability · Nexora" };

export default function SustainabilityPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Sustainability"
        title="Commerce that respects the planet."
        description="Carbon-aware shipping, recyclable packaging, and a refurbished marketplace. Our full sustainability report is in the works."
        bullets={[
          "Carbon-offset shipping",
          "100% recyclable packaging",
          "Refurbished & trade-in program",
        ]}
        primaryHref="/about"
        primaryLabel="About Nexora"
      />
    </div>
  );
}
