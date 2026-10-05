import { notFound, redirect } from "next/navigation";
import { PageBody } from "@/components/layout/page-header";
import { getCurrentUser, isManager } from "@/features/auth/server";
import { getTenantUsers } from "@/features/admin/queries";
import { getTenantContext } from "@/features/tenants/server";
import { UsersManager } from "@/features/users/components/users-manager";
import { SettingsHeader } from "../settings-header";

export const metadata = { title: "Usuários" };

export default async function UsuariosPage() {
  const [ctx, user] = await Promise.all([getTenantContext(), getCurrentUser()]);
  if (ctx.kind !== "tenant") notFound();
  if (!user || !isManager(user, ctx.tenant.id)) redirect("/meu-dia");
  const users = await getTenantUsers(ctx.tenant.id);

  return (
    <>
      <SettingsHeader
        title="Usuários e permissões"
        description="Gerentes veem tudo da loja; vendedores veem apenas os próprios leads."
      />
      <PageBody>
        <UsersManager tenantId={ctx.tenant.id} users={users} />
      </PageBody>
    </>
  );
}
