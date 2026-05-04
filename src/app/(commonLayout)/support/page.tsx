import ComingSoonSection from "@/components/modules/Nexora/shared/ComingSoonSection";

export const metadata = { title: "Support · Nexora" };

export default function SupportPage() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <ComingSoonSection
        eyebrow="Nexora · Support"
        title="We've got your back, around the clock."
        description="Live chat, AI help, and order assistance — all wired to a single inbox. The dedicated support hub is launching soon. In the meantime, the help center has answers to most questions, or send us a message directly."
        bullets={[
          "24 / 7 AI assistant",
          "Order tracking & returns",
          "Real humans for tricky cases",
        ]}
        primaryHref="/help"
        primaryLabel="Visit help center"
        secondaryHref="/contact"
        secondaryLabel="Contact us"
      />
    </div>
  );
}
