import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const COLS = [
  {
    title: "Shop",
    links: [
      { label: "New arrivals", href: "/shop?sort=new" },
      { label: "Phones", href: "/shop/phones" },
      { label: "Laptops", href: "/shop/laptops" },
      { label: "Audio", href: "/shop/audio" },
      { label: "Wearables", href: "/shop/wearables" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Nexora AI",
    links: [
      { label: "How it works", href: "/ai" },
      { label: "AI search", href: "/ai/search" },
      { label: "Smart bundles", href: "/ai/bundles" },
      { label: "Concierge", href: "/ai/concierge" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Order status", href: "/orders" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Warranty", href: "/warranty" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Press", href: "/press" },
      { label: "Careers", href: "/careers" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#18181B] text-[#F9F8F6]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-90 w-180 -translate-x-1/2 rounded-full opacity-30"
        style={{ background: "radial-gradient(closest-side, #4E8D9C, transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 md:px-8 md:pb-12">
        {/* Wordmark */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F9F8F6] text-[#281C59]">
                <span className="text-sm font-black">N</span>
              </span>
              Nexora
            </Link>
            <p className="mt-5 max-w-sm text-sm text-white/60">
              The AI-native marketplace for premium tech. Designed for the next
              generation of buyers — calm, curated, and intelligent.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: FaXTwitter, href: "#", label: "Twitter" },
                { Icon: FaInstagram, href: "#", label: "Instagram" },
                { Icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
                { Icon: FaGithub, href: "#", label: "GitHub" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLS.map((c) => (
              <div key={c.title}>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {c.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-white/80 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Big wordmark */}
<div className="mt-10 select-none border-t border-white/10 pt-6">
        <p
          aria-hidden
          className="text-center text-[8vw] font-semibold leading-none tracking-tighter text-white/5 md:text-[96px]"
          >
            NEXORA
          </p>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row">
          <p>© {new Date().getFullYear()} Nexora, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <span className="hidden md:inline">English (US) · USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
