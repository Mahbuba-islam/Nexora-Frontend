import AuthShell from "@/components/modules/Nexora/auth/AuthShell";
import NexoraLoginForm from "@/components/modules/Nexora/auth/NexoraLoginForm";

export const metadata = {
  title: "Sign in · Nexora",
  description: "Sign in to your Nexora account.",
};

interface Props {
  searchParams: Promise<{ redirect?: string; email?: string; verified?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <AuthShell
      headline="Welcome back to the marketplace built for the next generation."
      subline="Pick up where you left off — your wishlist, orders, and AI recommendations are waiting."
    >
      <NexoraLoginForm
        redirectPath={sp.redirect}
        initialEmail={sp.email}
        verifiedFlag={sp.verified === "1"}
      />
    </AuthShell>
  );
}
