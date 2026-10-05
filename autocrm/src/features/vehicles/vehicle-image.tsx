/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { bodyTypeOf, photoUrl, type BodyType } from "./utils";

const SILHOUETTES: Record<BodyType, string> = {
  hatch:
    "M14 58c0-6 3-9 8-10l14-3 13-12c3-3 7-4 11-4h30c5 0 8 2 11 6l9 11 16 3c6 1 9 5 9 10v8c0 2-2 4-4 4h-8a11 11 0 0 0-22 0H50a11 11 0 0 0-22 0h-10c-2 0-4-2-4-4z",
  sedan:
    "M8 60c0-5 3-8 8-9l20-4 16-13c3-3 7-4 11-4h26c5 0 9 2 12 5l12 12 22 4c5 1 8 5 8 9v7c0 2-2 4-4 4h-9a11 11 0 0 0-22 0H54a11 11 0 0 0-22 0H12c-2 0-4-2-4-4z",
  suv:
    "M10 56c0-5 3-8 7-9l17-3 12-14c3-4 7-5 11-5h40c5 0 8 2 11 6l9 13 13 2c6 1 9 5 9 10v11c0 2-2 4-4 4h-8a12 12 0 0 0-24 0H52a12 12 0 0 0-24 0H14c-2 0-4-2-4-4z",
  pickup:
    "M6 56c0-4 3-7 7-7h12l10-17c2-3 5-5 9-5h22c4 0 7 2 8 6l4 16h58c4 0 7 3 7 7v13c0 2-2 4-4 4h-9a12 12 0 0 0-24 0H50a12 12 0 0 0-24 0H10c-2 0-4-2-4-4z",
};

/** Foto do veículo ou, sem foto, uma ilustração com a silhueta do tipo de carroceria. */
export function VehicleImage({
  src,
  brand,
  model,
  className,
  rounded = "rounded-lg",
  sizes,
  priority,
}: {
  src: string | null | undefined;
  brand?: string;
  model?: string;
  className?: string;
  rounded?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const url = photoUrl(src);
  if (url) {
    return (
      <img
        src={url}
        alt={[brand, model].filter(Boolean).join(" ") || "Veículo"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        className={cn("object-cover", rounded, className)}
      />
    );
  }
  const body = bodyTypeOf(model ?? "");
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-end justify-center overflow-hidden bg-[linear-gradient(160deg,color-mix(in_oklch,var(--brand)_16%,var(--surface-2))_0%,var(--surface-2)_55%,var(--muted)_100%)]",
        rounded,
        className,
      )}
    >
      <div className="absolute inset-x-[12%] bottom-[16%] h-[6%] rounded-full bg-black/25 blur-md dark:bg-black/50" />
      <svg viewBox="0 0 160 90" className="relative mb-[8%] w-[78%] text-foreground/20">
        <path d={SILHOUETTES[body]} fill="currentColor" />
        <circle cx="39" cy="74" r="7" className="fill-foreground/35" />
        <circle cx="121" cy="74" r="7" className="fill-foreground/35" />
      </svg>
      {brand && (
        <span className="absolute left-2 top-1.5 text-[9px] font-semibold uppercase tracking-wider text-foreground/35">{brand}</span>
      )}
    </div>
  );
}
