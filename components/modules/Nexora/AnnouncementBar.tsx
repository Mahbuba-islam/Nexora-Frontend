import { Truck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="relative w-full overflow-hidden bg-[#281C59] text-[#F9F8F6] dark:bg-[#0b0b0c]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 80% at 30% 50%, rgba(133,199,154,0.25), transparent 60%), radial-gradient(40% 80% at 80% 50%, rgba(78,141,156,0.25), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-[12px] font-medium tracking-wide">
        <Truck className="h-3.5 w-3.5 text-[#85C79A]" />
        <span className="opacity-90">
          Free shipping on every order · curated by Nexora.
        </span>
      </div>
    </div>
  );
}
