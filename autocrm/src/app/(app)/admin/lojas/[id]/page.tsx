import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireSuperadmin } from "@/features/auth/server";
import { getTenantById, getTenantUsers } from "@/features/admin/queries";
import { TenantAdminTabs } from "@/features/admin/components/tenant-admin-tabs";
import { tenantUrl } from "@/features/tenants/host";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const tenant = await getTenantById((await params).id);
  return { title: tenant?.name ?? "Loja" };
}

export default async function LojaAdminPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperadmin();
  const { id } = await params;
  const [tenant, users] = await Promise.all([getTenantById(id), getTenantUsers(id)]);
  if (!tenant) notFound();

  return (
    <>
      <PageHeader
        title={tenant.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Link href="/admin" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> Painel da agência
            </Link>
            {tenant.active ? <Badge variant="success">Ativa</Badge> : <Badge variant="danger">Desativada</Badge>}
          </span>
        }
        actions={
          <Button asChild variant="secondary">
            <a href={tenantUrl(tenant.slug, env.rootDomain, "/meu-dia")}>
              Abrir CRM da loja <ArrowUpRight />
            </a>
          </Button>
        }
      />
      <PageBody>
        <TenantAdminTabs tenant={tenant} users={users} rootDomain={env.rootDomain} />
      </PageBody>
    </>
  );
}
