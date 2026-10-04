import { cn } from "@/lib/cn";

/** Rótulo em caixa alta com letter-spacing amplo, ladeado por linhas finas amarelas. */
export default function Tag({ children, className, align = "center" }: { children: React.ReactNode; className?: string; align?: "center" | "left" }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold sm:text-xs",
        align === "center" ? "justify-center text-center" : "justify-start",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 shrink-0 bg-gradient-to-r from-transparent to-gold sm:w-10" />
      <span>{children}</span>
      <span aria-hidden className={cn("h-px w-6 shrink-0 bg-gradient-to-l from-transparent to-gold sm:w-10", align === "left" && "hidden sm:block")} />
    </p>
  );
}
