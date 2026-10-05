import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/app-shell";
import { SIDEBAR_COOKIE } from "@/components/layout/shell-state";
import { NewLeadListener } from "@/components/layout/new-lead-listener";
import { demoTenant } from "@/features/tenants/demo-tenant";
import { TenantProvider } from "@/features/tenants/tenant-provider";
import { tenantStyleTag } from "@/features/tenants/theme";
import { demoUser } from "@/features/auth/demo-user";
import { UserProvider } from "@/features/auth/user-provider";

export async function generateMetadata(): Promise<Metadata> {
  // Fase 2: resolvido a partir do subdomínio (middleware) + tabela tenants
  const tenant = demoTenant;
  return { title: { default: tenant.name, template: `%s · ${tenant.name}` } };
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const collapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === "1";
  const tenant = demoTenant;
  const user = demoUser;

  return (
    <TenantProvider tenant={tenant}>
      <UserProvider user={user}>
        {/* cor da loja já no primeiro paint */}
        <style precedence="tenant" href={`tenant-${tenant.id}`}>
          {tenantStyleTag(tenant)}
        </style>
        <AppShell defaultCollapsed={collapsed}>{children}</AppShell>
        <NewLeadListener />
      </UserProvider>
    </TenantProvider>
  );
}
