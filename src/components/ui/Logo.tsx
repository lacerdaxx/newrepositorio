import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export default function Logo({ src, className, priority }: { src: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={siteConfig.nome}
      width={232}
      height={48}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={cn("h-9 w-auto", className)}
    />
  );
}
