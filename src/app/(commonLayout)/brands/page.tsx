import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Brands · Nexora" };

export default function BrandsPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Brands"
        title="Discover the makers shaping modern tech."
        description="A directory of every brand on Nexora — verified sellers, indie labels, and limited collabs. Launching soon."
        bullets={[
          "Verified seller storefronts",
          "Founder stories & launch calendars",
          "Follow brands for restock alerts",
        ]}
        primaryHref="/shop"
        primaryLabel="Explore products"
      />
    </div>
  );
}
