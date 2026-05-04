import { BRANDS } from "./data";

export default function MarqueeBrands() {
  const list = [...BRANDS, ...BRANDS];
  return (
    <section
      aria-label="Trusted brands"
      className="relative overflow-hidden border-y border-border bg-background py-8"
    >
      <p className="mb-5 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        The world&rsquo;s most loved tech brands
      </p>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent"
        />
        <ul className="nx-marquee flex w-max items-center gap-12 px-6">
          {list.map((b, i) => (
            <li
              key={`${b}-${i}`}
              className="text-2xl font-semibold tracking-tight text-foreground/40 transition-colors hover:text-foreground md:text-3xl"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
