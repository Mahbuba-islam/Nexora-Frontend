import { redirect } from "next/navigation";

import { getUserInfo } from "@/src/services/auth.services";
import CheckoutClient from "@/components/modules/Nexora/CheckoutClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout · Nexora" };

export default async function CheckoutPage() {
  const user = await getUserInfo();
  if (!user) redirect("/login?redirect=/checkout");

  return (
    <CheckoutClient
      defaultName={
        user.name ||
        [
          (user as { firstName?: string }).firstName,
          (user as { lastName?: string }).lastName,
        ]
          .filter(Boolean)
          .join(" ") ||
        ""
      }
      defaultEmail={user.email ?? ""}
      defaultPhone={(user as { phone?: string }).phone ?? ""}
    />
  );
}
