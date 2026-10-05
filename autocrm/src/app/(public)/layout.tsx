import { notFound } from "next/navigation";
import { getPublicTenantOrNull } from "@/features/tenants/server";
import { TenantProvider } from "@/features/tenants/tenant-provider";
import { tenantStyleTag } from "@/features/tenants/theme";

/** Páginas públicas (clientes da loja): sempre no tema claro, com a marca da loja. */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getPublicTenantOrNull();
  if (!tenant) notFound();
  return (
    <TenantProvider tenant={tenant}>
      <style precedence="tenant" href={`tenant-${tenant.id}`}>
        {tenantStyleTag(tenant)}
      </style>
      <div className="theme-light min-h-dvh bg-background text-foreground">{children}</div>
    </TenantProvider>
  );
}
