import { Quote, Star } from "lucide-react";
import { NX_TESTIMONIALS } from "./data";

export default function Testimonials() {
  return (
    <section className="relative bg-background py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Loved by 2.4M+
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Quietly, the highest-rated tech store on the internet.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {NX_TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className="nx-card relative flex h-full flex-col p-7 md:p-8"
            >
              <Quote
                aria-hidden
                className="absolute right-6 top-6 h-8 w-8 text-[#4E8D9C]/15"
              />
              <div
                aria-hidden
                className="flex items-center gap-0.5 text-[#4E8D9C]"
              >
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/85 md:text-base">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-[#4E8D9C] to-[#85C79A] text-sm font-semibold text-white"
                >
                  {t.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
                  · 0{i + 1}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
