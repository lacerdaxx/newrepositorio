import Link from "next/link";
import { Plus } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireSuperadmin } from "@/features/auth/server";
import { getTenantOverview } from "@/features/admin/queries";
import { AdminOverview } from "@/features/admin/components/admin-overview";
import { env } from "@/lib/env";

export const metadata = { title: "Agência" };

export default async function AdminPage() {
  await requireSuperadmin();
  const tenants = await getTenantOverview();
  return (
    <>
      <PageHeader
        title="Painel da agência"
        description="Todas as lojas que usam o CRM, com métricas do mês."
        actions={
          <Button asChild>
            <Link href="/admin/lojas/nova">
              <Plus /> Nova loja
            </Link>
          </Button>
        }
      />
      <PageBody>
        <AdminOverview tenants={tenants} rootDomain={env.rootDomain} />
      </PageBody>
    </>
  );
}
