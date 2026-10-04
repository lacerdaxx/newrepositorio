import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

const SIZES: Record<string, [number, number]> = {
  "/logo-placeholder.svg": [232, 48],
  [siteConfig.logoHeader]: [447, 242],
  [siteConfig.logoFooter]: [450, 271],
};

export default function Logo({ src, className, priority }: { src: string; className?: string; priority?: boolean }) {
  const [width, height] = SIZES[src] ?? [450, 270];
  return (
    <Image
      src={src}
      alt={siteConfig.nome}
      width={width}
      height={height}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={cn("w-auto", className ?? "h-9")}
    />
  );
}
