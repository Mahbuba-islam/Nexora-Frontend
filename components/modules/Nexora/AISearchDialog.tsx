"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Wand2, X } from "lucide-react";

import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";
import { formatUSD } from "./data";

const SUGGESTIONS = [
  "Best laptop for video editing under $2000",
  "Quietest noise-cancelling headphones",
  "Phone with the best low-light camera",
  "Lightweight ultrabook for travel",
];

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AISearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NxProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset state on close.
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setError(false);
      setLoading(false);
    }
  }, [open]);

  // Debounced search.
  useEffect(() => {
    if (!open) return;
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setError(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    const ac = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const url = `${API_BASE}/products?search=${encodeURIComponent(
          term,
        )}&limit=6`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { data: NxProduct[] };
        setResults(Array.isArray(json?.data) ? json.data : []);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError(true);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      ac.abort();
      window.clearTimeout(t);
    };
  }, [query, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nexora AI search"
      className="fixed inset-0"
      style={{ zIndex: 70 }}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative mx-auto mt-[10vh] w-[min(94vw,720px)] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Wand2 className="h-5 w-5 text-[#4E8D9C]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Nexora AI… try “laptop for editing under $2000”"
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#4E8D9C] border-t-transparent" />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-foreground/60 hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Try asking
              </p>
              <ul className="mt-3 grid gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => setQuery(s)}
                      className="group flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground/80 transition-colors hover:border-[#4E8D9C]/40 hover:bg-secondary"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-foreground/40" />
                        {s}
                      </span>
                      <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : error ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Couldn&rsquo;t reach Nexora AI right now. Please try again.
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No products matched <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => {
                const img = primaryImage(p);
                return (
                  <li key={p.id}>
                    <Link
                      href={`/shop/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        {img && (
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {p.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {p.brand?.name ?? p.category?.name ?? "Nexora"}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatUSD(toNumberPrice(p.price))}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-5 py-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Wand2 className="h-3 w-3 text-[#4E8D9C]" />
            Powered by Nexora AI
          </span>
          <kbd className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
            esc
          </kbd>
        </div>
      </div>
    </div>
  );
}
