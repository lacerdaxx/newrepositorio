import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SIDEBAR_COOKIE } from "@/components/layout/shell-state";
import { NewLeadListener } from "@/components/layout/new-lead-listener";
import { BlockedScreen } from "@/components/layout/blocked-screen";
import { env } from "@/lib/env";
import { getCurrentUser } from "@/features/auth/server";
import { getSwitchableTenants } from "@/features/admin/queries";
import { UserProvider } from "@/features/auth/user-provider";
import { RepoProvider } from "@/features/data/repo-provider";
import { agencyBranding } from "@/features/tenants/demo-tenant";
import { tenantUrl } from "@/features/tenants/host";
import { getTenantContext } from "@/features/tenants/server";
import { TenantProvider } from "@/features/tenants/tenant-provider";
import { tenantStyleTag } from "@/features/tenants/theme";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getTenantContext();
  const tenant = ctx.kind === "tenant" ? ctx.tenant : agencyBranding;
  return {
    title: { default: tenant.name, template: `%s · ${tenant.name}` },
    icons: tenant.faviconUrl || tenant.logoUrl ? { icon: tenant.faviconUrl ?? tenant.logoUrl ?? undefined } : undefined,
  };
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [ctx, user, cookieStore] = await Promise.all([getTenantContext(), getCurrentUser(), cookies()]);
  if (!user) redirect("/login");

  if (ctx.kind === "not_found") {
    return <BlockedScreen title="Loja não encontrada" description={`Não existe loja com o endereço “${ctx.slug}”.`} />;
  }
  if (!user.active) {
    return <BlockedScreen title="Acesso desativado" description="Seu usuário foi desativado. Fale com o gerente da loja." signOut />;
  }

  const isSuper = user.role === "superadmin";
  let tenant = agencyBranding;

  if (ctx.kind === "agency") {
    // domínio raiz: só a agência; usuários de loja vão para o subdomínio deles
    if (!isSuper) {
      return (
        <BlockedScreen
          title="Use o endereço da sua loja"
          description="Este é o painel da agência. Acesse o CRM pelo endereço da sua loja."
          signOut
        />
      );
    }
  } else {
    tenant = ctx.tenant;
    if (!isSuper && user.tenantId !== tenant.id) {
      return (
        <BlockedScreen
          title="Sem acesso a esta loja"
          description="Seu usuário pertence a outra loja."
          signOut
        />
      );
    }
    if (!tenant.active && !isSuper) {
      return (
        <BlockedScreen
          title="Loja temporariamente indisponível"
          description="O acesso a esta loja está suspenso. Entre em contato com a agência."
          signOut
        />
      );
    }
  }

  const collapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === "1";
  const switchable = isSuper ? await getSwitchableTenants() : [];

  return (
    <TenantProvider tenant={tenant}>
      <UserProvider user={user}>
        <RepoProvider>
        {/* cor da loja já no primeiro paint */}
        <style precedence="tenant" href={`tenant-${tenant.id}`}>
          {tenantStyleTag(tenant)}
        </style>
        <AppShell defaultCollapsed={collapsed} rootDomain={env.rootDomain} tenants={switchable}>
          {!tenant.active && isSuper && (
            <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-[13px] text-warning md:px-8">
              Loja desativada — apenas a agência está vendo. <a className="underline" href={tenantUrl("agencia", env.rootDomain, "/admin")}>Ir ao painel</a>
            </div>
          )}
          {children}
        </AppShell>
        <NewLeadListener />
        </RepoProvider>
      </UserProvider>
    </TenantProvider>
  );
}
