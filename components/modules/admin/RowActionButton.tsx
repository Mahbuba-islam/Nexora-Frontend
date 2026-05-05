"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ActionResult = { success: boolean; message?: string };

interface RowActionButtonProps {
  action: () => Promise<ActionResult>;
  label: string;
  confirm?: string;
  className?: string;
  pendingLabel?: string;
  variant?: "default" | "danger" | "ghost" | "primary" | "subtle";
}

const STYLES: Record<NonNullable<RowActionButtonProps["variant"]>, string> = {
  default:
    "border border-border bg-background text-foreground hover:bg-secondary",
  primary:
    "border border-transparent bg-foreground text-background hover:bg-foreground/90",
  danger:
    "border border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/15",
  ghost:
    "text-foreground/70 hover:bg-secondary hover:text-foreground",
  subtle:
    "border border-border bg-secondary/40 text-foreground/80 hover:bg-secondary",
};

export default function RowActionButton({
  action,
  label,
  confirm,
  className,
  pendingLabel,
  variant = "default",
}: RowActionButtonProps) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const onClick = () => {
    if (confirm && !window.confirm(confirm)) return;
    start(async () => {
      const res = await action();
      if (res.success) {
        toast.success(res.message ?? "Done.");
        router.refresh();
      } else {
        toast.error(res.message ?? "Action failed.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={[
        "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        STYLES[variant],
        className ?? "",
      ].join(" ")}
    >
      {pending ? pendingLabel ?? "Working…" : label}
    </button>
  );
}
