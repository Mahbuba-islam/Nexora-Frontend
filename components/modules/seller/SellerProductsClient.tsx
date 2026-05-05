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

/* ---------------- TYPES ---------------- */

interface ProductDraft {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  status: "DRAFT" | "LIVE";
}

/* ---------------- CONFIG ---------------- */

const PAGE_SIZE = 5;

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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80";

/* ---------------- FILTER ---------------- */

function filterDrafts(drafts: ProductDraft[], filters: any) {
  return drafts.filter((d) => {
    if (filters.category && d.category !== filters.category) return false;
    if (filters.status && d.status !== filters.status) return false;
    if (
      filters.search &&
      !d.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });
}

/* ---------------- AI SUGGESTIONS ---------------- */

const AI_SUGGESTIONS: Record<
  string,
  { title: string; description: string; price: number }[]
> = {
  Phones: [
    {
      title: "Aurora X Pro 5G",
      description:
        "A flagship AI smartphone with adaptive camera and long-lasting battery.",
      price: 899,
    },
  ],
  Laptops: [
    {
      title: "Vector 14 Studio",
      description: "High-performance laptop built for creators and developers.",
      price: 1499,
    },
  ],
};

/* ---------------- SEED ---------------- */

const seedDrafts = (): ProductDraft[] => [
  {
    id: "demo-1",
    title: "Aurora X Pro 5G",
    description: "AI flagship smartphone with premium build.",
    category: "Phones",
    price: 899,
    image: FALLBACK_IMAGE,
    status: "LIVE",
  },
];

/* ---------------- STORAGE ---------------- */

const STORAGE_KEY = "nx:seller:products";

const loadFromStorage = (): ProductDraft[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data: ProductDraft[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

/* ---------------- COMPONENT ---------------- */

export default function SellerProductsClient() {
  const [drafts, setDrafts] = useState<ProductDraft[]>(seedDrafts);
  const [hydrated, setHydrated] = useState(false);

  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Phones",
    price: "",
    image: "",
  });

  /* -------- HYDRATION -------- */

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored?.length) setDrafts(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(drafts);
  }, [drafts, hydrated]);

  /* -------- FILTERING -------- */

  const filtered = useMemo(
    () => filterDrafts(drafts, filters),
    [drafts, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const liveCount = useMemo(
    () => drafts.filter((d) => d.status === "LIVE").length,
    [drafts]
  );

  useEffect(() => setPage(1), [filters]);

  /* -------- HELPERS -------- */

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  /* -------- AI FILL -------- */

  const aiAutoFill = async () => {
    setAiBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 800));

      const list =
        AI_SUGGESTIONS[form.category] ?? AI_SUGGESTIONS.Phones;

      const pick = list[Math.floor(Math.random() * list.length)];

      setForm((f) => ({
        ...f,
        title: pick.title,
        description: pick.description,
        price: String(pick.price),
      }));

      toast.success("AI generated product idea");
    } finally {
      setAiBusy(false);
    }
  };

  /* -------- SUBMIT -------- */

  const submit = async () => {
    if (!form.title || !form.price) {
      toast.error("Title & price required");
      return;
    }

    setSaving(true);

    try {
      const newItem: ProductDraft = {
        id: `local-${Date.now()}`,
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        image: form.image || FALLBACK_IMAGE,
        status: "LIVE",
      };

      setDrafts((prev) => [newItem, ...prev]);

      setForm({
        title: "",
        description: "",
        category: "Phones",
        price: "",
        image: "",
      });

      toast.success("Product published");
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) =>
    setDrafts((prev) => prev.filter((d) => d.id !== id));

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <header className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            My Products
          </p>
          <h2 className="text-2xl font-semibold">
            Manage Listings
          </h2>
          <p className="text-sm text-muted-foreground">
            {liveCount} live · {drafts.length - liveCount} drafts
          </p>
        </div>
      </header>

      {/* FORM */}
      <section className="rounded-xl border p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <PackagePlus className="h-4 w-4" />
            New Product
          </h3>

          <Button onClick={aiAutoFill} disabled={aiBusy}>
            {aiBusy ? <Loader2 className="animate-spin" /> : <Wand2 />}
            AI Fill
          </Button>
        </div>

        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <div className="flex gap-2">
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="border p-2 rounded"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <Input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>

        <Button onClick={submit} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Publish
        </Button>
      </section>

      {/* LIST */}
      <section className="rounded-xl border p-4 space-y-3">
        {paginated.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center border-b pb-3"
          >
            <div>
              <p className="font-medium">{d.title}</p>
              <p className="text-xs text-muted-foreground">
                {d.category} · {formatUSD(d.price)}
              </p>
            </div>

            <Button variant="ghost" onClick={() => remove(d.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </section>

    </div>
  );
}