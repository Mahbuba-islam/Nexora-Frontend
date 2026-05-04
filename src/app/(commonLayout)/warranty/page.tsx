import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Warranty · Nexora" };

export default function WarrantyPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Warranty"
        title="Every order, protected."
        description="Most products come with a 1-year manufacturer warranty, with extended coverage available at checkout. Submit a claim from your order page."
        bullets={[
          "1-year manufacturer coverage",
          "Optional extended protection",
          "Hassle-free claim process",
        ]}
        primaryHref="/account/orders"
        primaryLabel="File a claim"
      />
    </div>
  );
}
