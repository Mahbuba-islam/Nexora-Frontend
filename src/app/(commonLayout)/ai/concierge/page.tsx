import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "AI Concierge · Nexora" };

export default function AIConciergePage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora AI · Concierge"
        title="Your personal shopper, on demand."
        description="A real-time concierge that compares specs, finds deals, and even pre-fills checkout for you. Beta access opening soon."
        bullets={[
          "Spec comparison in seconds",
          "Drop & restock alerts",
          "Voice + chat support",
        ]}
        primaryHref="/account"
        primaryLabel="Go to account"
      />
    </div>
  );
}
