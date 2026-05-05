import { redirect } from "next/navigation";

import ProfileEditForm from "@/components/modules/Nexora/account/ProfileEditForm";
import { getUserInfo } from "@/src/services/auth.services";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit profile · Nexora" };

export default async function AccountProfilePage() {
  const user = await getUserInfo();
  if (!user) redirect("/login?redirect=/account/profile");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Account · Profile
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Edit your profile
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep your name, contact details and avatar up to date.
        </p>
      </header>

      <ProfileEditForm
        redirectTo="/account"
        initial={{
          name: user.name,
          firstName: (user as { firstName?: string }).firstName,
          lastName: (user as { lastName?: string }).lastName,
          phone: (user as { phone?: string }).phone,
          email: user.email,
          avatar: (user as { avatar?: string }).avatar,
        }}
      />
    </div>
  );
}
