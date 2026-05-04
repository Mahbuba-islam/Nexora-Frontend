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
    <NexoraLoginForm
      redirectPath={sp.redirect}
      initialEmail={sp.email}
      verifiedFlag={sp.verified === "1"}
    />
  );
}
