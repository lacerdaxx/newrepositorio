import { getTenantContext } from "@/features/tenants/server";
import { agencyBranding } from "@/features/tenants/demo-tenant";
import { TenantProvider } from "@/features/tenants/tenant-provider";
import { tenantStyleTag } from "@/features/tenants/theme";
import { AuthShell } from "./auth-shell";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getTenantContext();
  const tenant = ctx.kind === "tenant" ? ctx.tenant : agencyBranding;
  return (
    <TenantProvider tenant={tenant}>
      <style precedence="tenant" href={`tenant-${tenant.id}`}>
        {tenantStyleTag(tenant)}
      </style>
      <AuthShell>{children}</AuthShell>
    </TenantProvider>
  );
}
