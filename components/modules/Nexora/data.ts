// Nexora — landing page mock data.
// Once products live in the backend, replace these with service calls.

export type NxProduct = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  oldPrice?: number;
  category: string;
  badge?: "new" | "ai-pick" | "limited";
  image: string;
  accent: string; // tailwind gradient classes for tile background
};

export const FEATURED_PRODUCTS: NxProduct[] = [
  {
    id: "nx-vision-pro",
    name: "Nexora Vision Pro",
    tagline: "Spatial computing, redefined.",
    price: 3499,
    category: "Wearables",
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=1200&q=80",
    accent: "from-[#4E8D9C]/15 via-[#85C79A]/10 to-transparent",
  },
  {
    id: "nx-aurora-laptop",
    name: "Aurora 14 — M-Series",
    tagline: "AI silicon. All-day brilliance.",
    price: 1899,
    oldPrice: 2099,
    category: "Laptops",
    badge: "ai-pick",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    accent: "from-[#281C59]/10 via-[#4E8D9C]/10 to-transparent",
  },
  {
    id: "nx-pulse-buds",
    name: "Pulse Buds Ultra",
    tagline: "Adaptive audio, tuned by AI.",
    price: 249,
    category: "Audio",
    badge: "ai-pick",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=80",
    accent: "from-[#85C79A]/20 via-[#4E8D9C]/10 to-transparent",
  },
  {
    id: "nx-orbit-watch",
    name: "Orbit Watch Series 9",
    tagline: "Health intelligence on your wrist.",
    price: 449,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
    accent: "from-[#EFE9E3] via-[#F9F8F6] to-transparent",
  },
  {
    id: "nx-lumen-phone",
    name: "Lumen Phone 15",
    tagline: "A camera that thinks.",
    price: 1099,
    category: "Phones",
    badge: "new",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    accent: "from-[#4E8D9C]/10 via-[#85C79A]/10 to-transparent",
  },
  {
    id: "nx-studio-cam",
    name: "Studio Cam X",
    tagline: "Cinema-grade. Pocket-light.",
    price: 1299,
    category: "Cameras",
    badge: "limited",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    accent: "from-[#281C59]/15 via-[#4E8D9C]/10 to-transparent",
  },
];

export const CATEGORIES = [
  {
    id: "phones",
    title: "Phones",
    desc: "AI-tuned cameras. All-day intelligence.",
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "laptops",
    title: "Laptops",
    desc: "Studio power. Featherweight design.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "audio",
    title: "Audio",
    desc: "Adaptive sound, sculpted for you.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "wearables",
    title: "Wearables",
    desc: "Health, presence and focus — on you.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

export const BRANDS = [
  "Nexora",
  "Aurora",
  "Lumen",
  "Pulse",
  "Orbit",
  "Helix",
  "Quanta",
  "Vertex",
  "Stratos",
  "Nimbus",
];

export const NX_TESTIMONIALS = [
  {
    quote:
      "Nexora’s AI recommended a laptop that felt designed for me. Checkout was three taps. I’ve never bought tech this fast — or this confidently.",
    name: "Imani Carter",
    role: "Product Designer · Brooklyn",
  },
  {
    quote:
      "The on-site assistant compared three flagship phones and matched my budget. It actually understood my use case.",
    name: "Daichi Saito",
    role: "iOS Engineer · Tokyo",
  },
  {
    quote:
      "Sleek, calm, and the smartest store I’ve used. Returns are friction-free and the support chat reads my orders instantly.",
    name: "Sofia Almeida",
    role: "Photographer · Lisbon",
  },
];

export const NX_NAV = [
  { label: "Deals", href: "/deals" },
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Brands", href: "/brands" },
  { label: "Support", href: "/support" },
];

export const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
