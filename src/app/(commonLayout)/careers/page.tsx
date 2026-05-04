import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Careers · Nexora" };

export default function CareersPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Careers"
        title="Build the future of commerce with us."
        description="We're hiring across engineering, design, AI, and operations. Open roles will be posted here as our team grows."
        bullets={[
          "Remote-friendly across the US",
          "Equity in every role",
          "Real impact from day one",
        ]}
        primaryHref="/about"
        primaryLabel="About the company"
        secondaryHref="mailto:careers@nexora.shop"
        secondaryLabel="Email careers team"
      />
    </div>
  );
}
