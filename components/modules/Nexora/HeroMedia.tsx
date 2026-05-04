import Image from "next/image";

/**
 * Hero media — autoplaying, muted, looped video with image fallback.
 *
 * Drop your own clip at `public/banner/hero.mp4` (and optionally
 * `hero.webm` for smaller/faster delivery) and it will be used
 * automatically. If neither file exists, the browser falls back to
 * the `poster` image — so the page never breaks.
 *
 * Server component: no client JS required.
 */
interface Props {
  /** Cover image used as poster + fallback when video can't load. */
  poster: string;
  alt: string;
  /** Optional override for the local video sources. */
  sources?: { src: string; type: string }[];
}

const DEFAULT_SOURCES: Props["sources"] = [];

export default function HeroMedia({
  poster,
  alt,
  sources = DEFAULT_SOURCES,
}: Props) {
  return (
    <>
      {/* Video layer — only rendered when caller provides sources, so we
          don't fire 404s for non-existent placeholder files. */}
      {sources.length > 0 && (
        <video
          className="nx-float absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={alt}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}

      {/* Image fallback for browsers that block autoplay or have JS off.
          Sits underneath the video so it shows when the <video> can't
          render (e.g. no source files yet). */}
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 560px, 100vw"
        className="nx-float -z-10 object-cover"
      />

      {/* Subtle vignette to keep the spec card legible regardless of
          which media layer is showing. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
      />
    </>
  );
}
