"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Final numeric value to count to. */
  value: number;
  /** Decimals to render. */
  decimals?: number;
  /** Optional prefix (e.g. "$") rendered before the number. */
  prefix?: string;
  /** Optional suffix (e.g. "M+", "%"). */
  suffix?: string;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
}

/**
 * Counts up to `value` once the element scrolls into view. Uses
 * `requestAnimationFrame` + an ease-out cubic curve. SSR-safe — renders
 * the final value as fallback if IntersectionObserver isn't available.
 */
export default function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (reduce) {
        setN(value);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setN(value * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setN(value);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const formatted = n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
