"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { createBrand } from "@/src/services/nexora.service";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function CreateBrandForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
    website: "",
    description: "",
    isFeatured: false,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    setPending(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        logo: form.logo.trim() || undefined,
        website: form.website.trim() || undefined,
        description: form.description.trim() || undefined,
        isFeatured: form.isFeatured,
      };
      await createBrand(payload);
      toast.success("Brand created");
      router.push("/admin/marketplace/brands");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not create brand";
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="nx-card space-y-5 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          required
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              name: e.target.value,
              slug: f.slug || slugify(e.target.value),
            }))
          }
        />
        <Field
          label="Slug"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
        <Field
          label="Logo URL"
          value={form.logo}
          onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
        />
        <Field
          label="Website"
          type="url"
          value={form.website}
          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
        />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Description
        </span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-[#4E8D9C]"
        />
      </label>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) =>
            setForm((f) => ({ ...f, isFeatured: e.target.checked }))
          }
        />
        Feature on marketplace home
      </label>

      <div className="flex items-center justify-end pt-2">
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
          Create brand
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        {...props}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-[#4E8D9C]"
      />
    </label>
  );
}
