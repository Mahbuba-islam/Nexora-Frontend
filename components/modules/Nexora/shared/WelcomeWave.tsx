/**
 * Big animated waving hand greeting — pure CSS, GPU-accelerated.
 * Designed for the dashboard hero. Slow + friendly with a calm halo behind it.
 */
export default function WelcomeWave({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={
        className ??
        "relative grid h-44 w-44 place-items-center md:h-52 md:w-52 lg:h-60 lg:w-60"
      }
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-(--nx-cyan)/25 blur-2xl" />
      <span className="absolute inline-flex h-3/4 w-3/4 rounded-full bg-(--nx-blue)/30 blur-xl" />
      <span className="relative grid h-full w-full place-items-center rounded-full bg-linear-to-br from-(--nx-blue)/20 to-(--nx-cyan)/30 backdrop-blur-sm">
        <span className="nx-hand-wave text-6xl md:text-7xl lg:text-8xl drop-shadow-md">
          👋
        </span>
      </span>
    </div>
  );
}
