"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/src/lib/utils";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-white/20 bg-linear-to-br from-(--nx-ink) to-(--nx-blue-deep) text-white shadow-[0_12px_30px_-10px_rgba(78,141,156,0.55)]",
        "backdrop-blur transition-all duration-300 hover:scale-110 hover:shadow-[0_16px_40px_-10px_rgba(168,220,184,0.7)]",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
