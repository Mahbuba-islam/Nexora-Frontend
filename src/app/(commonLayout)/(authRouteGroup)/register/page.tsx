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
  return <NexoraRegisterForm redirectPath={sp.redirect} />;
}
