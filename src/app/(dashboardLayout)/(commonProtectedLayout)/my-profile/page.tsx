import { redirect } from "next/navigation";

// Legacy route. The Nexora account hub now lives at `/account`.
// We keep a redirect so any inbound links (e.g. ProfileEditForm.tsx) still
// land in a useful place.
export default function MyProfileRedirect() {
  redirect("/account");
}
