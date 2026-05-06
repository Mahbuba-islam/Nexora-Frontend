"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Store } from "lucide-react";
import { getAdminSellers } from "@/src/services/marketplace.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function StoresClient() {
  const queryClient = useQueryClient();
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ["adminSellers"],
    queryFn: () => getAdminSellers(),
    staleTime: 1000 * 30,
  });
  const approved = sellers.filter((s) => s.status === "APPROVED");

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["adminSellers"] });
  }, [queryClient]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4E8D9C]">
          <Sparkles className="h-3.5 w-3.5" />
          Marketplace · Stores
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Browse stores on Nexora
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {approved.length > 0
            ? `${approved.length} verified stores currently live across the marketplace.`
            : "Stores will appear here once sellers complete onboarding."}
        </p>
      </header>
      {isLoading ? (
        <div>Loading...</div>
      ) : approved.length === 0 ? (
        <div className="nx-card flex flex-col items-center justify-center p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground/70">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">No live stores yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Want to be one of the first?
          </p>
          <Link href="/seller/apply" className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#4E8D9C] px-6 text-sm font-semibold text-white shadow hover:bg-[#357a7c]">
            Apply as a seller <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {approved.map((s) => (
            <div key={s.id} className="nx-card flex flex-col items-center p-6">
              <h3 className="text-lg font-semibold">{s.shopName}</h3>
              <p className="text-xs text-muted-foreground">{s.ownerName}</p>
              <Link href={`/shop/${s.shopSlug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#4E8D9C] hover:underline">
                Visit store <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
