import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Cookie Policy · Nexora" };

export default function CookiesPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Cookies"
        title="How we use cookies."
        description="We use a minimal set of cookies for sign-in, cart persistence, and anonymous analytics. The full cookie policy is being finalized — meanwhile see our privacy policy."
        bullets={[
          "Essential cookies only by default",
          "No third-party ad tracking",
          "Full opt-out controls coming soon",
        ]}
        primaryHref="/privacy"
        primaryLabel="Read privacy policy"
        secondaryHref="/terms"
        secondaryLabel="Terms of service"
      />
    </div>
  );
}
