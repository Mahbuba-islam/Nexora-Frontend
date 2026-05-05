"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Loader2,
  PackagePlus,
  Save,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { httpClient } from "@/src/lib/axious/httpClient";
import { formatUSD } from "@/components/modules/Nexora/data";

interface ProductDraft {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  status: "DRAFT" | "LIVE";
}

const CATEGORIES = [
  "Phones",
  "Laptops",
  "Audio",
  "Wearables",
  "Smart home",
  "Accessories",
  "Beauty",
  "Fashion",
];

// Curated AI-style suggestions per category. Mirrors the pattern from
// the seller onboarding wizard so the demo always works without a live
// LLM backend.
const AI_SUGGESTIONS: Record<
  string,
  { title: string; description: string; price: number }[]
> = {
  Phones: [
    {
      title: "Aurora X Pro 5G",
      description:
        "A 6.7-inch OLED flagship with AI-tuned dual cameras, 120 Hz adaptive refresh and a battery that learns your day. Crafted from recycled aluminium with a feather-soft matte finish.",
      price: 899,
    },
    {
      title: "Pulse Mini",
      description:
        "Compact 5.8-inch performer for one-handed living. AI cameras, MagSafe-class wireless charging and titanium-grade durability — without the flagship price.",
      price: 499,
    },
  ],
  Laptops: [
    {
      title: "Vector 14 Studio",
      description:
        "14-inch 3K mini-LED display, Nexora Neural chip and 22-hour battery in a 1.2 kg chassis. Built for editors, makers, and the people who ship.",
      price: 1499,
    },
    {
      title: "Vector Air 13",
      description:
        "The lightest Vector ever. Silent, fanless and ready for ten flights between charges. Ideal for writers, students and remote founders.",
      price: 1099,
    },
  ],
  Audio: [
    {
      title: "Aurora Buds 3",
      description:
        "Adaptive ANC, spatial audio, and an AI EQ that adjusts to the room you're in. 38 hours total playback in a palm-sized case.",
      price: 199,
    },
    {
      title: "Pulse Studio Over-Ear",
      description:
        "Reference-tuned 40 mm drivers, plush memory foam, and 60-hour battery. The headphones audio engineers actually wear off the clock.",
      price: 349,
    },
  ],
  Wearables: [
    {
      title: "Orbit Watch Series 5",
      description:
        "Always-on AMOLED, ECG, body-temp tracking and an AI coach that adapts your week. Swim-proof to 50 m, in stainless or titanium.",
      price: 429,
    },
    {
      title: "Helix Ring",
      description:
        "Sleep, recovery and HRV — without a screen on your wrist. Eight-day battery, ceramic finish, and no subscriptions.",
      price: 299,
    },
  ],
  "Smart home": [
    {
      title: "Nexora Hub Mini",
      description:
        "A calm little square that ties your lights, locks and routines together. Local-first, Matter-ready, and quietly out of the way.",
      price: 129,
    },
  ],
  Accessories: [
    {
      title: "Aurora MagCharge Stand",
      description:
        "Three devices, one elegant slab of recycled aluminium. Magnetic, fast and travel-friendly.",
      price: 89,
    },
  ],
  Beauty: [
    {
      title: "Glow Lab Vitamin C Serum",
      description:
        "10% L-ascorbic acid + ferulic acid in an airless pump. Brighter, calmer skin in 14 days — backed by a third-party trial.",
      price: 48,
    },
  ],
  Fashion: [
    {
      title: "Maison North Linen Overshirt",
      description:
        "European linen, mother-of-pearl buttons, garment-washed for that lived-in handle. Made in Portugal, in limited runs.",
      price: 165,
    },
  ],
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";

const seedDrafts = (): ProductDraft[] => [
  {
    id: "demo-1",
    title: "Aurora X Pro 5G",
    description:
      "A 6.7-inch OLED flagship with AI-tuned dual cameras and a battery that learns your day.",
    category: "Phones",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80",
    status: "LIVE",
  },
];

const STORAGE_KEY = "nx:seller:products";

const loadFromStorage = (): ProductDraft[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProductDraft[]) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (drafts: ProductDraft[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    /* quota / privacy mode — ignore */
  }
};

export default function SellerProductsClient() {
  const [drafts, setDrafts] = useState<ProductDraft[]>(seedDrafts);
  const [hydrated, setHydrated] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Phones",
    price: "",
    image: "",
  });

  // Hydrate from localStorage so listings survive reload.
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) setDrafts(stored);
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (hydrated) saveToStorage(drafts);
  }, [drafts, hydrated]);

  const liveCount = useMemo(
    () => drafts.filter((d) => d.status === "LIVE").length,
    [drafts],
  );

  const update = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  /**
   * Demo AI: pretend latency, then auto-fill title/description/price
   * from the curated dictionary. Mirrors the expert apply form pattern.
   */
  const aiAutoFill = async () => {
    setAiBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const list = AI_SUGGESTIONS[form.category] ?? AI_SUGGESTIONS.Phones;
      const pick = list[Math.floor(Math.random() * list.length)];
      setForm((f) => ({
        ...f,
        title: pick.title,
        description: pick.description,
        price: String(pick.price),
      }));
      toast.success("Nexora AI filled in your listing.");
    } finally {
      setAiBusy(false);
    }
  };

  const submit = async () => {
    if (!form.title || !form.price) {
      toast.error("Title and price are required.");
      return;
    }
    setSaving(true);
    try {
      // Best-effort backend create. Always optimistic-add locally so the
      // recruiter demo never blocks on a missing endpoint.
      try {
        await httpClient.post(
          "/seller/products",
          {
            name: form.title,
            description: form.description,
            category: form.category,
            price: Number(form.price) || 0,
            image: form.image || FALLBACK_IMAGE,
          },
          {
            silent: true,
            expectedStatuses: [400, 401, 403, 404, 409, 422],
          },
        );
      } catch {
        /* optional */
      }
      const next: ProductDraft = {
        id: `local-${Date.now()}`,
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price) || 0,
        image: form.image || FALLBACK_IMAGE,
        status: "LIVE",
      };
      setDrafts((prev) => [next, ...prev]);
      setForm({
        title: "",
        description: "",
        category: form.category,
        price: "",
        image: "",
      });
      toast.success(`"${next.title}" is now live in your shop.`);
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) =>
    setDrafts((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            My products
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            List & manage your shop
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {liveCount} live · {drafts.length - liveCount} drafts
          </p>
        </div>
        <div className="rounded-full border border-(--nx-cyan)/40 bg-(--nx-cyan)/10 px-3 py-1.5 text-[11px] font-semibold text-(--nx-blue-deep) dark:text-(--nx-cyan)">
          Admin approval optional · listings go live instantly
        </div>
      </header>

      {/* Create form */}
      <section className="nx-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PackagePlus className="h-4 w-4 text-(--nx-blue-deep)" />
            <h3 className="text-base font-semibold tracking-tight">
              New listing
            </h3>
          </div>
          <Button
            type="button"
            onClick={aiAutoFill}
            disabled={aiBusy}
            className="h-9 gap-2 rounded-full bg-(--nx-blue-deep) text-xs font-semibold text-white hover:bg-(--nx-ink)"
          >
            {aiBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wand2 className="h-3.5 w-3.5" />
            )}
            {aiBusy ? "Thinking…" : "AI auto-fill"}
          </Button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-xs">
              Product title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Aurora X Pro 5G"
              className="mt-1.5 "
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-xs">
              Category
            </Label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="mt-1.5 h-9 w-full rounded-md border border-input bg-[#10203f7c]  px-3 text-sm shadow-sm focus:border-ring focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="price" className="text-xs">
              Price (USD)
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0"
              className="mt-1.5"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="image" className="text-xs">
              Cover image URL{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <div className="mt-1.5 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              <Input
                id="image"
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What makes this product special?"
              className="mt-1.5"
            />
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-(--nx-blue-deep)" />
              Tip: pick a category, then tap “AI auto-fill” to let Nexora
              draft the title, copy and price.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            onClick={submit}
            disabled={saving}
            className="h-10 gap-2 rounded-full bg-(--nx-ink) px-5 text-xs font-semibold text-white hover:bg-(--nx-blue-deep)"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Publish listing
          </Button>
        </div>
      </section>

      {/* Listings table */}
      <section className="nx-card overflow-hidden">
        <header className="flex items-end justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Your listings
            </h3>
            <p className="text-xs text-muted-foreground">
              All published items in your shop
            </p>
          </div>
        </header>

        {drafts.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No products yet. Use the form above to publish your first listing.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {drafts.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.image}
                    alt={d.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{d.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {d.category} · {d.description || "No description"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatUSD(d.price)}
                  </p>
                  <span
                    className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      d.status === "LIVE"
                        ? "bg-(--nx-cyan)/20 text-(--nx-blue-deep) dark:text-(--nx-cyan)"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => remove(d.id)}
                  aria-label={`Remove ${d.title}`}
                  className="ml-2 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
