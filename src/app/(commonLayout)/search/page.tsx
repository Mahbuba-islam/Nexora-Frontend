import { redirect } from "next/navigation";

type SP = Promise<{ q?: string; search?: string }>;

export const metadata = {
  title: "AI search · Nexora",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const term = (sp.q ?? sp.search ?? "").trim();
  // Forward to the canonical shop page where filters + grid live.
  if (term) redirect(`/shop?search=${encodeURIComponent(term)}`);
  redirect("/shop");
}
