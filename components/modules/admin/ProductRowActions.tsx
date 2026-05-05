"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";

import {
  bulkProductsAction,
  deleteProductAction,
  restoreProductAction,
  updateProductAction,
} from "@/src/app/(nexoraAdminLayout)/admin/marketplace/_actions";

interface ProductRowProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  isFeatured?: boolean;
  isDeleted?: boolean;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "OUT_OF_STOCK", label: "Out of stock" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function ProductRowActions({
  product,
}: {
  product: ProductRowProduct;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  const run = (
    fn: () => Promise<{ success: boolean; message?: string }>,
    confirm?: string,
  ) => {
    if (confirm && !window.confirm(confirm)) return;
    start(async () => {
      const res = await fn();
      if (res.success) {
        toast.success(res.message ?? "Done.");
        router.refresh();
      } else {
        toast.error(res.message ?? "Action failed.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={pending}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>

      {product.isFeatured ? (
        <ActionBtn
          variant="subtle"
          onClick={() => run(() => bulkProductsAction([product.id], "unfeature"))}
          disabled={pending}
        >
          Unfeature
        </ActionBtn>
      ) : (
        <ActionBtn
          variant="subtle"
          onClick={() => run(() => bulkProductsAction([product.id], "feature"))}
          disabled={pending}
        >
          Feature
        </ActionBtn>
      )}

      {product.isDeleted ? (
        <ActionBtn
          variant="primary"
          onClick={() => run(() => restoreProductAction(product.id))}
          disabled={pending}
        >
          Restore
        </ActionBtn>
      ) : (
        <ActionBtn
          variant="danger"
          onClick={() =>
            run(
              () => deleteProductAction(product.id),
              `Archive "${product.name}"?`,
            )
          }
          disabled={pending}
        >
          Archive
        </ActionBtn>
      )}

      {editing && (
        <EditDialog
          product={product}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant: "subtle" | "danger" | "primary";
}) {
  const styles = {
    subtle:
      "border border-border bg-secondary/40 text-foreground/80 hover:bg-secondary",
    danger:
      "border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15",
    primary:
      "border border-transparent bg-foreground text-background hover:bg-foreground/90",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function EditDialog({
  product,
  onClose,
  onSaved,
}: {
  product: ProductRowProduct;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      price: Number(fd.get("price")),
      stock: Number(fd.get("stock")),
      status: String(fd.get("status")),
    };
    start(async () => {
      const res = await updateProductAction(product.id, payload);
      if (res.success) {
        toast.success(res.message ?? "Saved.");
        onSaved();
      } else {
        toast.error(res.message ?? "Save failed.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-80 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !pending && onClose()}
      />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Inline edit
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => !pending && onClose()}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-foreground/60 hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Price (USD)" name="price" type="number" step="0.01" defaultValue={product.price} />
          <Field label="Stock" name="stock" type="number" defaultValue={product.stock} />
          <SelectField label="Status" name="status" defaultValue={product.status} options={STATUS_OPTIONS} />
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => !pending && onClose()}
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
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground/80">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E8D9C]/40"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground/80">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E8D9C]/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
