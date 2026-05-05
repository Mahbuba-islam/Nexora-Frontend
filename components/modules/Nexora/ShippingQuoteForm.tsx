"use client";

import { useState } from "react";
import { Loader2, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";

import {
  getShippingQuotes,
  type NxShippingRate,
} from "@/src/services/marketplaceExtras.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/components/modules/Nexora/data";
import { useCart } from "@/src/providers/CartProvider";

interface Props {
  onSelect?: (rate: NxShippingRate) => void;
}

export default function ShippingQuoteForm({ onSelect }: Props) {
  const { items } = useCart();
  const [country, setCountry] = useState("US");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [rates, setRates] = useState<NxShippingRate[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function quote() {
    if (!postal.trim()) {
      toast.error("Enter a postal code first.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }
    setBusy(true);
    const result = await getShippingQuotes({
      items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
      destination: { country, postalCode: postal, state, city },
    });
    setBusy(false);
    if (result.length === 0) {
      toast.error(
        "We couldn't find rates for this address. Double-check and try again.",
      );
      setRates([]);
      return;
    }
    setRates(result);
    if (result[0]) {
      setSelected(result[0].id);
      onSelect?.(result[0]);
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Estimate shipping
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))}
          maxLength={2}
        />
        <Input
          placeholder="Postal code"
          value={postal}
          onChange={(e) => setPostal(e.target.value)}
        />
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          placeholder="State / Region"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>

      <Button
        type="button"
        onClick={quote}
        disabled={busy}
        className="mt-3 w-full"
        variant="outline"
      >
        {busy ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Truck className="mr-1.5 h-3.5 w-3.5" />
        )}
        Get rates
      </Button>

      {rates && rates.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rates.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(r.id);
                  onSelect?.(r);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                  selected === r.id
                    ? "border-(--nx-blue-deep) bg-(--nx-blue-deep)/10"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {r.carrier} · {r.service}
                  </p>
                  {r.estimatedDays != null && (
                    <p className="text-[11px] text-muted-foreground">
                      {r.estimatedDays} business day
                      {r.estimatedDays === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {formatUSD(r.amount)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
