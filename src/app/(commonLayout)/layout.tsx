import AnnouncementBar from "@/components/modules/Nexora/AnnouncementBar";
import Footer from "@/components/modules/Nexora/Footer";
import Header from "@/components/modules/Nexora/Header";
import { getUserInfo } from "@/src/services/auth.services";

// Pages may read cookies / call the live API — opt out of static prerender.
export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  const role: string | null = user?.role ?? null;
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Header isAuthenticated={!!user} role={role} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}