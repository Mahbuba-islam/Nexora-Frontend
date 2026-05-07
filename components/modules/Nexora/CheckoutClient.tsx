"use client";

import { useMemo, useState } from "react";
import { CountrySelect } from "@/components/ui/CountrySelect";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/src/providers/CartProvider";
import { formatUSD } from "@/components/modules/Nexora/data";
import { httpClient } from "@/src/lib/axious/httpClient";
import { createNotification } from "@/src/services/notification.service";
import { getProductBySlug } from "@/src/services/nexora.service";
import { getUsers } from "@/src/services/user.services";

interface Props {
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
}

interface ShippingForm {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
}

// Removed old COUNTRIES array, now using CountrySelect

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / debit card", desc: "Visa · Mastercard · Amex" },
  { id: "cod", label: "Cash on delivery", desc: "Pay when your order arrives" },
] as const;

export default function CheckoutClient({
  defaultName,
  defaultEmail,
  defaultPhone,
}: Props) {
  const router = useRouter();
  const { items, subtotal, count, hydrated, clear } = useCart();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ orderNumber: string } | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("card");
  const [form, setForm] = useState<ShippingForm>({
    name: defaultName,
    email: defaultEmail,
    phone: defaultPhone,
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    country: "US", // Default to US code
  });

  const setField =
    (k: keyof ShippingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  // Special setter for country to ensure only ISO code is set
  const setCountry = (code: string) => setForm(f => ({ ...f, country: code }));

  const shipping = subtotal > 0 && subtotal < 200 ? 9.99 : 0;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = subtotal + shipping + tax;

  const fillSample = () =>
    setForm((f) => ({
      ...f,
      line1: f.line1 || "1 Madison Avenue",
      city: f.city || "New York",
      region: f.region || "NY",
      postal: f.postal || "10010",
      country: f.country || "US", // Always use ISO code
    }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter the recipient's name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email.";
    if (!form.line1.trim()) return "Street address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.postal.trim()) return "Postal code is required.";
    if (!form.country.trim()) return "Country is required.";
    return null;
  };

  const placeOrder = async () => {
    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setPending(true);

    try {
      // 1) Create a fresh shipping address for this order.
      const addrRes = await httpClient.post<{ id: string }>(
        "/addresses",
        {
          type: "BOTH",
          fullName: form.name.trim(),
          phone: form.phone.trim() || "0000000000",
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          state: form.region.trim() || undefined,
          country: form.country.trim(),
          postalCode: form.postal.trim(),
        },
        { withCredentials: true },
      );
      const addressId = addrRes?.data?.id;
      if (!addressId) throw new Error("Address could not be saved.");

      // 2) Sync local cart -> backend cart so checkout sees the same items.
      try {
        await httpClient.post("/cart/clear", {}, { withCredentials: true, silent: true });
      } catch {
        /* ignore — empty cart is fine */
      }
      for (const it of items) {
        await httpClient.post(
          "/cart/items",
          { productId: it.id, quantity: it.qty },
          { withCredentials: true },
        );
      }

      // 3) Place the order via the marketplace checkout endpoint.
      const checkoutRes = await httpClient.post<{
        orderNumber?: string;
        id?: string;
      }>(
        "/orders/checkout",
        {
          shippingAddressId: addressId,
          shippingMethod: "standard",
        },
        { withCredentials: true },
      );
      const ordernum =
        checkoutRes?.data?.orderNumber ??
        checkoutRes?.data?.id ??
        `NX-${Date.now().toString(36).toUpperCase()}`;

      // Notify sellers for each product in the order
      try {
        // Get all sellers
        const users = await getUsers({ role: "SELLER" });
        for (const it of items) {
          // Try to get product info to find seller
          const prod = await getProductBySlug(it.slug || it.id);
          if (prod && prod.sellerId) {
            const seller = users.find((u) => u.id === prod.sellerId);
            if (seller) {
              await createNotification({
                type: "ORDER_PLACED",
                message: `You have a new order for your product: ${prod.name}`,
                userId: seller.id,
                data: { productId: prod.id, orderNumber: ordernum },
              });
            }
          }
        }
      } catch (e) {
        // Notification failure should not block checkout
      }
      clear();
      setDone({ orderNumber: String(ordernum) });
      toast.success("Order placed — thank you!");
      // Invalidate the cached orders Server Component so the new order
      // shows up the moment the user clicks "View my orders".
      router.refresh();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err as Error)?.message ??
        "Could not place the order. Please try again.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  // Success view
  if (done) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center md:px-8 md:py-28">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          Order placed.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground md:text-base">
          We sent a confirmation to{" "}
          <span className="font-medium text-foreground">{form.email}</span>.
          Your reference is{" "}
          <span className="font-mono font-semibold text-foreground">
            {done.orderNumber}
          </span>
          .
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/account/orders"
            className="nx-btn-primary inline-flex h-12 items-center gap-2 px-7 text-sm font-medium"
          >
            View my orders
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="nx-btn-ghost inline-flex h-12 items-center gap-2 px-7 text-sm font-medium"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart fallback
  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center md:px-8 md:py-28">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary">
          <ShoppingBag className="h-7 w-7 text-foreground/70" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          Nothing to checkout.
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Add an item to your bag before heading to checkout.
        </p>
        <Link
          href="/shop"
          className="nx-btn-primary mt-8 inline-flex h-12 items-center gap-2 px-7 text-sm font-medium"
        >
          Start shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to bag
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Checkout.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {count} {count === 1 ? "item" : "items"} · {formatUSD(total)} total
          </p>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:inline-flex">
          <Lock className="h-3 w-3" />
          Secure checkout
        </span>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Forms */}
        <div className="space-y-6 lg:col-span-7">
          <section className="nx-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Shipping address
              </h2>
              <button
                type="button"
                onClick={fillSample}
                className="text-[11px] font-semibold text-(--nx-blue-deep) hover:underline dark:text-(--nx-cyan)"
              >
                Use sample address
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={setField("name")}
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={setField("email")}
                autoComplete="email"
              />
              <Field
                label="Phone (optional)"
                value={form.phone}
                onChange={setField("phone")}
                autoComplete="tel"
              />
              <CountrySelect value={form.country} onChange={setCountry} />
              <Field
                className="sm:col-span-2"
                label="Street address"
                value={form.line1}
                onChange={setField("line1")}
                autoComplete="address-line1"
              />
              <Field
                className="sm:col-span-2"
                label="Apartment, suite, etc. (optional)"
                value={form.line2}
                onChange={setField("line2")}
                autoComplete="address-line2"
              />
              <Field
                label="City"
                value={form.city}
                onChange={setField("city")}
                autoComplete="address-level2"
              />
              <Field
                label="State / region"
                value={form.region}
                onChange={setField("region")}
                autoComplete="address-level1"
              />
              <Field
                label="Postal code"
                value={form.postal}
                onChange={setField("postal")}
                autoComplete="postal-code"
              />
            </div>
          </section>

          <section className="nx-card p-6 md:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Payment
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => {
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    aria-pressed={active}
                    className={[
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                      active
                        ? "border-(--nx-blue-deep) bg-(--nx-blue-deep)/5 dark:border-(--nx-cyan) dark:bg-(--nx-cyan)/5"
                        : "border-border bg-background hover:bg-secondary",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "grid h-9 w-9 place-items-center rounded-xl",
                        active
                          ? "bg-(--nx-blue-deep) text-white dark:bg-(--nx-cyan) dark:text-[#0B0B12]"
                          : "bg-secondary text-foreground/70",
                      ].join(" ")}
                    >
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold tracking-tight">
                        {m.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {m.desc}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={[
                        "mt-1 h-4 w-4 shrink-0 rounded-full border-2",
                        active
                          ? "border-(--nx-blue-deep) bg-(--nx-blue-deep) dark:border-(--nx-cyan) dark:bg-(--nx-cyan)"
                          : "border-border",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Demo checkout — no real charge is made. Order will appear in your
              account history.
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="nx-card sticky top-24 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Order summary
            </h2>

            <ul className="mt-5 space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-2.5"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    {it.image && (
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                      {it.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.name}</p>
                    {it.brand && (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {it.brand}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatUSD(it.price * it.qty)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Subtotal" value={formatUSD(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatUSD(shipping)}
              />
              <Row label="Estimated tax" value={formatUSD(tax)} />
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-2xl font-semibold tabular-nums">
                {formatUSD(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={placeOrder}
              disabled={pending}
              className="nx-btn-primary mt-6 inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-sm font-semibold disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Place order · {formatUSD(total)}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              SSL-secured · 30-day returns
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  as = "input",
  options,
  className,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  as?: "input" | "select";
  options?: readonly string[];
  className?: string;
  autoComplete?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold tracking-wide text-foreground/80">
        {label}
      </label>
      {as === "select" ? (
        <select
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-[#4E8D9C]"
        >
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#4E8D9C]"
        />
      )}
    </div>
  );
}
