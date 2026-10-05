import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 px-4 pt-6 pb-4 sm:flex-row sm:items-end sm:justify-between md:px-8", className)}>
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-balance md:text-[22px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PageBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 px-4 pb-10 md:px-8", className)} {...props} />;
}
