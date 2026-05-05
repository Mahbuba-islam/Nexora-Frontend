
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/src/services/nexora.service";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  // Server-side fetch — runs at request time on Vercel/Render edge.
  const res = await getProducts({
    limit: 6,
    sortBy: "soldCount",
    sortOrder: "desc",
  });
  const products = res.data;

  if (products.length === 0) {
    return null; // Don't render an empty section on hard backend outage.
  }

  return (
    <section id="featured" className="relative bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Featured · Hand-picked by AI
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Today&rsquo;s edit.
              <span className="text-foreground/50"> Just for you.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground md:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Pro product card grid, 4 per row on xl, 2 on tablet, 1 on mobile */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {(products.length > 0 ? products : [
            {
              id: '1',
              name: 'Apple MacBook Pro 16"',
              slug: 'macbook-pro-16',
              shortDesc: 'The ultimate pro laptop with M3 Max chip, Liquid Retina XDR display, and all-day battery life. Perfect for creators and power users.',
              price: 3499,
              compareAtPrice: 3999,
              avgRating: 4.9,
              reviewCount: 128,
              soldCount: 2100,
              images: [{ url: '/imges/macbook-pro.jpg', alt: 'Apple MacBook Pro 16"' }],
              brand: { name: 'Apple' },
              category: { name: 'Laptops' },
              isFeatured: true,
            },
            {
              id: '2',
              name: 'Sony WH-1000XM5 Headphones',
              slug: 'sony-wh-1000xm5',
              shortDesc: 'Industry-leading noise cancellation, crystal-clear sound, and 30-hour battery. The best headphones for travel and work.',
              price: 399,
              compareAtPrice: 499,
              avgRating: 4.8,
              reviewCount: 89,
              soldCount: 1500,
              images: [{ url: '/imges/sony-headphones.jpg', alt: 'Sony WH-1000XM5' }],
              brand: { name: 'Sony' },
              category: { name: 'Audio' },
              isBestseller: true,
            },
            {
              id: '3',
              name: 'Samsung Galaxy S24 Ultra',
              slug: 'galaxy-s24-ultra',
              shortDesc: 'Flagship Android phone with 200MP camera, S Pen, and AI-powered features. Built for productivity and creativity.',
              price: 1299,
              compareAtPrice: 1399,
              avgRating: 4.7,
              reviewCount: 102,
              soldCount: 1800,
              images: [{ url: '/imges/galaxy-s24-ultra.jpg', alt: 'Samsung Galaxy S24 Ultra' }],
              brand: { name: 'Samsung' },
              category: { name: 'Smartphones' },
              isNewArrival: true,
            },
            {
              id: '4',
              name: 'Dyson V15 Detect Vacuum',
              slug: 'dyson-v15-detect',
              shortDesc: 'Laser dust detection, powerful suction, and smart LCD display. The most advanced cordless vacuum for modern homes.',
              price: 749,
              compareAtPrice: 799,
              avgRating: 4.6,
              reviewCount: 67,
              soldCount: 950,
              images: [{ url: '/imges/dyson-v15.jpg', alt: 'Dyson V15 Detect' }],
              brand: { name: 'Dyson' },
              category: { name: 'Home Appliances' },
              isOnSale: true,
            },
          ]).map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/shop"
            className="nx-btn-ghost inline-flex h-11 items-center gap-2 px-6 text-sm font-medium"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
