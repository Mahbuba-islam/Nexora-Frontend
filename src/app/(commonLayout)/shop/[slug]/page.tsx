import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  Sparkles,
  Star,
  ArrowUpRight,
} from "lucide-react";

import {
  getProductBySlug,
  getProducts,
} from "@/src/services/nexora.service";
import {
  primaryImage,
  toNumberPrice,
  type NxProduct,
} from "@/src/types/nexora.types";
import { formatUSD } from "@/components/modules/Nexora/data";
import ProductCard from "@/components/modules/Nexora/ProductCard";
import AddToBag from "@/components/modules/Nexora/AddToBag";
import WishlistButton from "@/components/modules/Nexora/WishlistButton";
import ReviewsSection from "@/components/modules/Nexora/reviews/ReviewsSection";

type Params = Promise<{ slug: string }>;

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80";

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product not found · Nexora",
    };
  }
  const desc =
    product.shortDesc ??
    product.description?.slice(0, 160) ??
    "Premium tech, curated by Nexora AI.";
  return {
    title: `${product.name} · Nexora`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      images: primaryImage(product) ? [primaryImage(product) as string] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Related products (same category) — never block detail render on this.
  const relatedRes = product.category?.slug
    ? await getProducts({
        categorySlug: product.category.slug,
        limit: 8,
        sortBy: "soldCount",
        sortOrder: "desc",
      })
    : { data: [] as NxProduct[] };

  const related = relatedRes.data
    .filter((r) => r.id !== product.id)
    .slice(0, 4);

  const price = toNumberPrice(product.price);
  const compare = toNumberPrice(product.compareAtPrice);
  const onSale = compare > 0 && compare > price;
  const discount = onSale ? Math.round(((compare - price) / compare) * 100) : 0;
  const inStock = product.allowBackorder || product.stock > 0;
  const rating = product.avgRating ?? 0;

  // Image gallery: dedupe by url, keep primary first.
  const images = [...(product.images ?? [])].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });
  const heroImg = images[0]?.url ?? FALLBACK_IMG;

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-border bg-[#F9F8F6] dark:bg-[#1c1c20]"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-xs text-muted-foreground md:px-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="truncate text-foreground">{product.name}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-8 md:py-14 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <Gallery images={images} heroImg={heroImg} name={product.name} />

        {/* Buy box */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FF56] px-3 py-1 text-[11px] font-semibold text-[#242424]">
                <Sparkles className="h-3 w-3" />
                AI pick
              </span>
            )}
            {product.isNewArrival && (
              <span className="rounded-full bg-[#3B82F6] px-3 py-1 text-[11px] font-semibold text-white">
                New
              </span>
            )}
            {onSale && (
              <span className="rounded-full bg-[#242424] px-3 py-1 text-[11px] font-semibold text-[#F9F8F6]">
                Save {discount}%
              </span>
            )}
            {product.isBestseller && (
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-foreground">
                Bestseller
              </span>
            )}
            {product.brand && (
              <Link
                href={`/shop?brand=${product.brand.slug}`}
                className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {product.brand.name}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            {product.name}
          </h1>

          {product.shortDesc && (
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              {product.shortDesc}
            </p>
          )}

          {/* Rating */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={[
                    "h-4 w-4",
                    i < Math.round(rating)
                      ? "fill-[#F9FF56] text-[#F9FF56]"
                      : "text-foreground/20",
                  ].join(" ")}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {rating > 0 ? rating.toFixed(1) : "No ratings yet"}
              {product.reviewCount > 0 && (
                <> · {product.reviewCount.toLocaleString()} reviews</>
              )}
            </span>
            {product.soldCount > 0 && (
              <span className="text-xs text-muted-foreground">
                · {product.soldCount.toLocaleString()} sold
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-7 flex items-baseline gap-3">
            <span className="text-4xl font-semibold tracking-tight md:text-5xl">
              {formatUSD(price)}
            </span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                {formatUSD(compare)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Free shipping & 30-day returns. Tax calculated at checkout.
          </p>

          {/* Stock indicator */}
          <div className="mt-6 flex items-center gap-2 text-xs">
            <span
              className={[
                "h-2 w-2 rounded-full",
                inStock ? "bg-emerald-500" : "bg-red-500",
              ].join(" ")}
              aria-hidden
            />
            <span
              className={
                inStock ? "text-foreground/80" : "text-red-600 dark:text-red-400"
              }
            >
              {inStock
                ? product.stock <= 5 && product.trackInventory
                  ? `Only ${product.stock} left in stock`
                  : "In stock — ships within 24 hours"
                : "Currently sold out"}
            </span>
          </div>

          {/* CTA */}
          <AddToBag product={product} inStock={inStock} />

          <div className="mt-3">
            <WishlistButton product={product} variant="detail" />
          </div>

          {/* Trust strip */}
          <ul className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
            <TrustItem label="Free 2-day shipping" />
            <TrustItem label="30-day returns" />
            <TrustItem label="2-year warranty" />
          </ul>

          {/* SKU */}
          <p className="mt-6 text-[11px] uppercase tracking-wider text-muted-foreground">
            SKU: <span className="text-foreground/70">{product.sku}</span>
          </p>
        </div>
      </section>

      {/* Description + specs */}
      <section className="border-t border-border bg-[#F9F8F6] dark:bg-[#1c1c20]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Overview
            </h2>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Why you&rsquo;ll love it.
            </h3>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/80">
              {product.description ? (
                product.description
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>{product.shortDesc ?? "Details coming soon."}</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Specifications
            </h2>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              Tech specs.
            </h3>
            <dl className="mt-5 divide-y divide-border rounded-2xl border border-border bg-background">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <dt className="text-sm text-muted-foreground">{s.label}</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {s.value}
                    </dd>
                  </div>
                ))
              ) : (
                <>
                  <SpecRow label="Brand" value={product.brand?.name ?? "—"} />
                  <SpecRow
                    label="Category"
                    value={product.category?.name ?? "—"}
                  />
                  <SpecRow label="Condition" value={product.condition} />
                  <SpecRow label="Currency" value={product.currency} />
                  <SpecRow label="SKU" value={product.sku} />
                </>
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection
        productId={product.id}
        productSlug={product.slug}
        fallbackAverage={rating}
        fallbackCount={product.reviewCount}
      />

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  You may also like
                </h2>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
                  More from {product.category?.name ?? "the catalog"}.
                </h3>
              </div>
              <Link
                href={
                  product.category?.slug
                    ? `/shop?category=${product.category.slug}`
                    : "/shop"
                }
                className="hidden items-center gap-1 text-sm font-medium text-foreground hover:text-[#3B82F6] sm:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Gallery({
  images,
  heroImg,
  name,
}: {
  images: NxProduct["images"];
  heroImg: string;
  name: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-linear-to-br from-[#EFE9E3] via-[#F9F8F6] to-[#4BBFF9]/15 dark:from-[#242424] dark:via-[#1c1c20] dark:to-[#3B82F6]/15">
        <Image
          src={heroImg}
          alt={images?.[0]?.alt ?? name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary"
            >
              <Image
                src={img.url}
                alt={img.alt ?? name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function TrustItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-xs text-foreground/80">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary">
        <Check className="h-3.5 w-3.5" />
      </span>
      {label}
    </li>
  );
}
