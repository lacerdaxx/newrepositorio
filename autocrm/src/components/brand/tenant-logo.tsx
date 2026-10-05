"use client";
/* eslint-disable @next/next/no-img-element */
import { cn, initials } from "@/lib/utils";
import { useTenant } from "@/features/tenants/tenant-provider";

export function TenantMark({ className }: { className?: string }) {
  const tenant = useTenant();
  if (tenant.logoUrl) {
    return (
      <img
        src={tenant.logoUrl}
        alt={tenant.name}
        className={cn("size-7 shrink-0 rounded-lg object-contain", className)}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand text-[11px] font-bold text-brand-foreground shadow-sm inset-ring inset-ring-white/15",
        className,
      )}
    >
      {initials(tenant.name)}
    </div>
  );
}
