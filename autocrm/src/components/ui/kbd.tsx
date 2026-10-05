import { cn } from "@/lib/utils";

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-border bg-muted px-1 font-sans text-[10.5px] font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
