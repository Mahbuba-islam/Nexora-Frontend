import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Nexora AI" };

export default function AILandingPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora AI"
        title="An AI shopping concierge — built into every page."
        description="Conversational search, personalized bundles, and a real-time concierge that learns what you love. The full Nexora AI hub is coming soon."
        bullets={[
          "Natural-language product search",
          "AI-curated bundles tailored to you",
          "Live concierge across web & mobile",
        ]}
        primaryHref="/search"
        primaryLabel="Try AI search"
      />
    </div>
  );
}
