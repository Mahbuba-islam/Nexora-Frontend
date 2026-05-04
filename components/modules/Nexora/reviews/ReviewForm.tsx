"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { submitReview } from "@/src/services/reviews.service";

interface Props {
  productId: string;
  productSlug: string;
  isAuthenticated: boolean;
}

export default function ReviewForm({
  productId,
  productSlug,
  isAuthenticated,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="nx-card p-6">
        <h4 className="text-base font-semibold tracking-tight">
          Share your thoughts.
        </h4>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to write a review for this product.
        </p>
        <Link
          href={`/login?redirect=/shop/${productSlug}`}
          className="nx-btn-primary mt-4 inline-flex h-10 items-center gap-2 px-5 text-sm font-medium"
        >
          Sign in to review
        </Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please choose a rating from 1 to 5 stars.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Tell us a little more — at least 10 characters.");
      return;
    }

    startTransition(async () => {
      const res = await submitReview({
        productId,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
      });
      if (!res.success) {
        setError(res.message ?? "We couldn't post your review.");
        toast.error(res.message ?? "Couldn't post your review.");
        return;
      }
      toast.success("Thanks! Your review was submitted.");
      setRating(0);
      setTitle("");
      setBody("");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="nx-card space-y-4 p-6">
      <div>
        <h4 className="text-base font-semibold tracking-tight">
          Write a review
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Help other shoppers with an honest review.
        </p>
      </div>

      <div>
        <span className="text-xs font-medium text-foreground/80">
          Your rating
        </span>
        <div
          className="mt-1.5 flex items-center gap-1"
          role="radiogroup"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-secondary"
              >
                <Star
                  className={[
                    "h-5 w-5 transition-colors",
                    active ? "fill-[#F9FF56] text-[#F9FF56]" : "text-foreground/30",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-title"
          className="text-xs font-medium text-foreground/80"
        >
          Headline (optional)
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Sums up your experience in a line"
          className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-[#3B82F6]"
        />
      </div>

      <div>
        <label
          htmlFor="review-body"
          className="text-xs font-medium text-foreground/80"
        >
          Your review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="What did you like or dislike? How did it perform for you?"
          className="mt-1.5 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-[#3B82F6]"
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="nx-btn-primary inline-flex h-11 items-center gap-2 px-6 text-sm font-medium disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
