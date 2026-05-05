import AuthShell from "@/components/modules/Nexora/auth/AuthShell";
import NexoraRegisterForm from "@/components/modules/Nexora/auth/NexoraRegisterForm";

export const metadata = {
  title: "Create account · Nexora",
  description: "Join Nexora — premium tech, curated by AI.",
};

interface Props {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <AuthShell
      headline="Join Nexora — premium tech, curated by AI."
      subline="Track every order, build smart wishlists, and get personalised drops the moment they go live."
    >
      <NexoraRegisterForm redirectPath={sp.redirect} />
    </AuthShell>
  );
}
