import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Press · Nexora" };

export default function PressPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Press"
        title="In the news."
        description="Press kits, brand assets, and media inquiries — all in one place. Reach out to press@nexora.shop for embargoed launches."
        bullets={["Brand kit & logos", "Founder bios", "Embargoed launch access"]}
        primaryHref="/about"
        primaryLabel="About Nexora"
      />
    </div>
  );
}
