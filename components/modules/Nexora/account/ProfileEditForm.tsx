"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { updateProfile } from "@/src/services/auth.services";

export interface ProfileEditFormProps {
  initial: {
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  /** Where to navigate after success. Defaults to current page refresh. */
  redirectTo?: string;
}

export default function ProfileEditForm({
  initial,
  redirectTo,
}: ProfileEditFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: initial.name ?? "",
    firstName: initial.firstName ?? "",
    lastName: initial.lastName ?? "",
    phone: initial.phone ?? "",
    avatar: initial.avatar ?? "",
  });

  const setField = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      const payload: Record<string, unknown> = {};
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === "string" && v.trim().length > 0) payload[k] = v.trim();
      });
      await updateProfile(payload);
      toast.success("Profile updated");
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not update profile";
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="nx-card space-y-5 p-6 md:p-8">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#281C59] text-lg font-semibold text-white">
          {(form.name || initial.email || "N").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold">{initial.email}</p>
          <p className="text-xs text-muted-foreground">
            Update the public profile other Nexora members see.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display name" value={form.name} onChange={setField("name")} />
        <Field
          label="Phone"
          value={form.phone}
          onChange={setField("phone")}
          type="tel"
        />
        <Field
          label="First name"
          value={form.firstName}
          onChange={setField("firstName")}
        />
        <Field
          label="Last name"
          value={form.lastName}
          onChange={setField("lastName")}
        />
        <div className="sm:col-span-2">
          <Field
            label="Avatar URL"
            value={form.avatar}
            onChange={setField("avatar")}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-xs font-semibold text-background hover:bg-foreground/90 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save changes
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-[#4E8D9C]"
      />
    </label>
  );
}
