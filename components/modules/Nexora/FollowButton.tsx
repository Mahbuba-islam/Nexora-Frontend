"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";

const STORAGE_KEY = "nexora.follows.v1";

function readFollows(): Record<string, true> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeFollows(next: Record<string, true>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("nexora:follows-changed"));
  } catch {
    // ignore
  }
}

export default function FollowButton({
  slug,
  label = "Follow",
  size = "sm",
}: {
  slug: string;
  label?: string;
  size?: "sm" | "md";
}) {
  const [following, setFollowing] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setFollowing(Boolean(readFollows()[slug]));
    const onChange = () => setFollowing(Boolean(readFollows()[slug]));
    window.addEventListener("nexora:follows-changed", onChange);
    return () => window.removeEventListener("nexora:follows-changed", onChange);
  }, [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const map = readFollows();
    if (following) {
      delete map[slug];
    } else {
      map[slug] = true;
      setBurst((b) => b + 1);
    }
    writeFollows(map);
    setFollowing(!following);
  }

  const small = size === "sm";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={following}
      className={`group relative inline-flex items-center gap-1 overflow-visible rounded-full border font-semibold transition-colors ${
        small ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      } ${
        following
          ? "border-(--nx-blue-deep) bg-(--nx-blue-deep) text-white"
          : "border-border bg-background hover:bg-secondary"
      }`}
    >
      {following ? (
        <Check className={small ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : (
        <Bell className={small ? "h-3 w-3" : "h-3.5 w-3.5"} />
      )}
      {following ? "Following" : label}

      {/* burst */}
      {burst > 0 && (
        <span
          key={burst}
          aria-hidden
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="nx-burst-particle absolute h-1.5 w-1.5 rounded-full bg-(--nx-cyan)"
              style={{
                // @ts-expect-error CSS custom prop
                "--angle": `${(i * 360) / 8}deg`,
              }}
            />
          ))}
          <span className="nx-burst-ring absolute h-6 w-6 rounded-full border-2 border-(--nx-cyan)" />
        </span>
      )}
    </button>
  );
}
