import { notFound, redirect } from "next/navigation";
import { PageBody } from "@/components/layout/page-header";
import { getCurrentUser, isManager } from "@/features/auth/server";
import { getTenantById } from "@/features/admin/queries";
import { getTenantContext } from "@/features/tenants/server";
import { BrandingForm } from "@/features/tenants/components/branding-form";
import { formatPhone } from "@/lib/format";
import { SettingsHeader } from "../settings-header";

export const metadata = { title: "Marca" };

export default async function MarcaPage() {
  const [ctx, user] = await Promise.all([getTenantContext(), getCurrentUser()]);
  if (ctx.kind !== "tenant") notFound();
  if (!user || !isManager(user, ctx.tenant.id)) redirect("/meu-dia");
  const tenant = await getTenantById(ctx.tenant.id);
  if (!tenant) notFound();

  return (
    <>
      <SettingsHeader title="Marca" description="Como a loja aparece no CRM, no formulário público e nos relatórios." />
      <PageBody>
        <BrandingForm
          tenantId={tenant.id}
          defaults={{
            name: tenant.name,
            primaryColor: tenant.primary_color,
            secondaryColor: tenant.secondary_color,
            logoUrl: tenant.logo_url,
            whatsapp: tenant.whatsapp ? formatPhone(tenant.whatsapp) : "",
            timezone: tenant.timezone,
            offersGroupUrl: tenant.offers_group_url ?? "",
          }}
        />
      </PageBody>
    </>
  );
}
