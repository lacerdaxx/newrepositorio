import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { requireSuperadmin } from "@/features/auth/server";
import { NewTenantForm } from "@/features/admin/components/new-tenant-form";
import { env } from "@/lib/env";

export const metadata = { title: "Nova loja" };

export default async function NovaLojaPage() {
  await requireSuperadmin();
  return (
    <>
      <PageHeader
        title="Nova loja"
        description={
          <Link href="/admin" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Painel da agência
          </Link>
        }
      />
      <PageBody>
        <NewTenantForm rootDomain={env.rootDomain} />
      </PageBody>
    </>
  );
}
