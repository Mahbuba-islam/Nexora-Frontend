"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function DealsCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // End-of-current-hour countdown so it always feels live
  const endOfHour = (() => {
    if (now == null) return null;
    const d = new Date(now);
    d.setMinutes(59, 59, 999);
    return d.getTime();
  })();

  const remaining = now != null && endOfHour != null ? Math.max(0, endOfHour - now) : 0;
  const totalSeconds = Math.floor(remaining / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {[
        { label: "Hours", value: h },
        { label: "Minutes", value: m },
        { label: "Seconds", value: s },
      ].map((u) => (
        <div
          key={u.label}
          className="rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-center backdrop-blur"
        >
          <p className="font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">
            {now == null ? "--" : pad(u.value)}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {u.label}
          </p>
        </div>
      ))}
    </div>
  );
}
