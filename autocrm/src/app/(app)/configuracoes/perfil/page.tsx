import { PageBody, PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/features/auth/server";
import { ProfileForm } from "@/features/users/components/profile-form";

export const metadata = { title: "Meu perfil" };

export default async function PerfilPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="Meu perfil" description={user.email} />
      <PageBody>
        <ProfileForm defaultName={user.name} />
      </PageBody>
    </>
  );
}
