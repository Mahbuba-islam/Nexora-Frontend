"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";

type ActionResult = { success: boolean; message?: string };

interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "checkbox" | "textarea";
  options?: { value: string; label: string }[];
  step?: string;
  defaultValue?: string | number | boolean | null;
}

interface InlineEditDialogProps {
  title: string;
  fields: Field[];
  onSave: (payload: Record<string, unknown>) => Promise<ActionResult>;
  triggerLabel?: string;
  triggerVariant?: "ghost" | "primary";
}

export default function InlineEditDialog({
  title,
  fields,
  onSave,
  triggerLabel = "Edit",
  triggerVariant = "ghost",
}: InlineEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "checkbox") {
        payload[f.name] = fd.get(f.name) === "on";
      } else if (f.type === "number") {
        const v = fd.get(f.name);
        if (v !== null && v !== "") payload[f.name] = Number(v);
      } else {
        const v = fd.get(f.name);
        if (typeof v === "string" && v.length > 0) payload[f.name] = v;
      }
    }
    start(async () => {
      const res = await onSave(payload);
      if (res.success) {
        toast.success(res.message ?? "Saved.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.message ?? "Save failed.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerVariant === "primary"
            ? "inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
            : "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
        }
      >
        <Pencil className="h-3 w-3" />
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-80 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !pending && setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Inline edit
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-foreground/60 hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <label
                    htmlFor={f.name}
                    className="text-xs font-medium text-foreground/80"
                  >
                    {f.label}
                  </label>
                  {f.type === "select" ? (
                    <select
                      id={f.name}
                      name={f.name}
                      defaultValue={(f.defaultValue as string) ?? ""}
                      className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E8D9C]/40"
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      id={f.name}
                      name={f.name}
                      defaultValue={(f.defaultValue as string) ?? ""}
                      rows={3}
                      className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E8D9C]/40"
                    />
                  ) : f.type === "checkbox" ? (
                    <input
                      id={f.name}
                      name={f.name}
                      type="checkbox"
                      defaultChecked={Boolean(f.defaultValue)}
                      className="h-4 w-4 rounded border-border accent-[#4E8D9C]"
                    />
                  ) : (
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type ?? "text"}
                      step={f.step}
                      defaultValue={
                        f.defaultValue == null
                          ? ""
                          : String(f.defaultValue)
                      }
                      className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E8D9C]/40"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !pending && setOpen(false)}
                  disabled={pending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-4 text-xs font-semibold text-foreground/80 hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90 disabled:opacity-60"
                >
                  {pending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
