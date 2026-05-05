import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CreateBrandForm from "@/components/modules/admin/CreateBrandForm";

export const metadata = { title: "New brand · Nexora Admin" };

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/marketplace/brands"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to brands
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Create brand
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Brands group products on the catalog and surface in the public
            Brands directory.
          </p>
        </div>
      </header>

      <CreateBrandForm />
    </div>
  );
}
