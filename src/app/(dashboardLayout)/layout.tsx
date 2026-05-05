import React from "react";

import Header from "@/components/modules/Nexora/Header";
import QueryProviders from "@/src/providers/QueryProvider";
import { getUserInfo } from "@/src/services/auth.services";

// Legacy dashboard route group — kept for /change-password and the
// /my-profile redirect. Wrapped in the Nexora marketing chrome so signed-in
// users see a consistent shell.
export const dynamic = "force-dynamic";

export default async function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();
  return (
    <QueryProviders>
      <div className="min-h-screen bg-background">
        <Header
          isAuthenticated={Boolean(user)}
          role={(user?.role as string | undefined) ?? null}
        />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </QueryProviders>
  );
}