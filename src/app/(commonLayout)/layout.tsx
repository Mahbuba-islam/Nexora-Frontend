import AnnouncementBar from "@/components/modules/Nexora/AnnouncementBar";
import Footer from "@/components/modules/Nexora/Footer";
import Header from "@/components/modules/Nexora/Header";

// Pages may read cookies / call the live API — opt out of static prerender.
export const dynamic = "force-dynamic";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}