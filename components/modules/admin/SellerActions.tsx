"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";

import {
  approveSellerAction,
  deleteSellerAction,
  reinstateSellerAction,
  rejectSellerAction,
  suspendSellerAction,
  updateSellerAction,
} from "@/src/app/(nexoraAdminLayout)/admin/marketplace/_actions";

interface SellerInput {
  id: string;
  shopName: string;
  tagline?: string | null;
  contactEmail?: string | null;
  commissionRate?: number | null;
  kycStatus?: string | null;
  status: string;
}

const KYC_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function SellerActions({ seller }: { seller: SellerInput }) {
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
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={pending}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
      >
        <Pencil className="h-3 w-3" />
        Edit profile
      </button>

      {seller.status === "PENDING" && (
        <>
          <Btn
            variant="primary"
            disabled={pending}
            onClick={() => run(() => approveSellerAction(seller.id))}
          >
            Approve
          </Btn>
          <Btn
            variant="danger"
            disabled={pending}
            onClick={() =>
              run(
                () => rejectSellerAction(seller.id, "Rejected via admin UI"),
                "Reject this seller's application?",
              )
            }
          >
            Reject
          </Btn>
        </>
      )}
      {seller.status === "APPROVED" && (
        <Btn
          variant="subtle"
          disabled={pending}
          onClick={() =>
            run(
              () => suspendSellerAction(seller.id, "Suspended via admin UI"),
              "Suspend this seller? Their listings will be hidden.",
            )
          }
        >
          Suspend
        </Btn>
      )}
      {seller.status === "SUSPENDED" && (
        <Btn
          variant="primary"
          disabled={pending}
          onClick={() => run(() => reinstateSellerAction(seller.id))}
        >
          Reinstate
        </Btn>
      )}
      <Btn
        variant="ghost"
        disabled={pending}
        onClick={() =>
          run(
            () => deleteSellerAction(seller.id),
            "Soft-close this shop? Listings go offline.",
          )
        }
      >
        Close shop
      </Btn>

      {editing && (
        <EditDialog
          seller={seller}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant: "subtle" | "danger" | "primary" | "ghost";
}) {
  const styles = {
    subtle:
      "border border-border bg-secondary/40 text-foreground/80 hover:bg-secondary",
    danger:
      "border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15",
    primary:
      "border border-transparent bg-foreground text-background hover:bg-foreground/90",
    ghost: "text-foreground/70 hover:bg-secondary hover:text-foreground",
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
  seller,
  onClose,
  onSaved,
}: {
  seller: SellerInput;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      shopName: String(fd.get("shopName") ?? ""),
      tagline: String(fd.get("tagline") ?? ""),
      contactEmail: String(fd.get("contactEmail") ?? ""),
      commissionRate: Number(fd.get("commissionRate")),
      kycStatus: String(fd.get("kycStatus") ?? ""),
    };
    start(async () => {
      const res = await updateSellerAction(seller.id, payload);
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
              Edit seller profile
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              {seller.shopName}
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
          <Field label="Shop name" name="shopName" defaultValue={seller.shopName} />
          <Field label="Tagline" name="tagline" defaultValue={seller.tagline ?? ""} />
          <Field
            label="Contact email"
            name="contactEmail"
            defaultValue={seller.contactEmail ?? ""}
          />
          <Field
            label="Commission rate (0–1)"
            name="commissionRate"
            type="number"
            step="0.001"
            defaultValue={String(seller.commissionRate ?? 0.1)}
          />
          <Select
            label="KYC status"
            name="kycStatus"
            defaultValue={seller.kycStatus ?? "PENDING"}
            options={KYC_OPTIONS}
          />
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
  defaultValue?: string;
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

function Select({
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
