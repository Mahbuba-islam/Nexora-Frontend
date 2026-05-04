"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lottie ships its own SSR-incompatible code. Load it client-only.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface WelcomeLottieProps {
  src?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Premium animated greeting for the dashboard hero.
 * Tries to load a JSON animation from /public; if missing, falls back to a
 * lightweight CSS bubble animation so the layout never collapses.
 */
export default function WelcomeLottie({
  src = "/lottie/welcome-wave.json",
  className,
  ariaLabel = "Animated welcome illustration",
}: WelcomeLottieProps) {
  const [data, setData] = useState<unknown | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => !cancelled && setData(json))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (failed || !data) {
    return (
      <div
        aria-label={ariaLabel}
        className={
          className ??
          "relative grid h-40 w-40 place-items-center md:h-52 md:w-52"
        }
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--nx-cyan)/30" />
        <span className="absolute inline-flex h-3/4 w-3/4 rounded-full bg-(--nx-blue)/40 blur-xl" />
        <span className="relative grid h-20 w-20 place-items-center rounded-full bg-linear-to-br from-(--nx-blue) to-(--nx-cyan) text-3xl shadow-xl">
          <span role="img" aria-hidden className="nx-float">
            👋
          </span>
        </span>
      </div>
    );
  }

  return (
    <div aria-label={ariaLabel} className={className ?? "w-full max-w-xs md:max-w-sm"}>
      {/* @ts-expect-error - dynamic import inferred as any */}
      <Lottie animationData={data} loop autoplay />
    </div>
  );
}
