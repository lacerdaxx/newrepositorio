"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Palette, Power, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateTenantAdminAction } from "@/features/tenants/actions";
import { BrandingForm } from "@/features/tenants/components/branding-form";
import { UsersManager } from "@/features/users/components/users-manager";
import { formatPhone } from "@/lib/format";
import type { ProfileRow, TenantRow } from "@/types/database";

export function TenantAdminTabs({
  tenant,
  users,
  rootDomain,
}: {
  tenant: TenantRow;
  users: ProfileRow[];
  rootDomain: string;
}) {
  return (
    <Tabs defaultValue="marca">
      <TabsList>
        <TabsTrigger value="marca">
          <Palette /> Marca
        </TabsTrigger>
        <TabsTrigger value="usuarios">
          <Users /> Usuários
        </TabsTrigger>
        <TabsTrigger value="acesso">
          <Globe /> Endereço e status
        </TabsTrigger>
      </TabsList>
      <TabsContent value="marca">
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
      </TabsContent>
      <TabsContent value="usuarios">
        <UsersManager tenantId={tenant.id} users={users} />
      </TabsContent>
      <TabsContent value="acesso">
        <AccessCard tenant={tenant} rootDomain={rootDomain} />
      </TabsContent>
    </Tabs>
  );
}

function AccessCard({ tenant, rootDomain }: { tenant: TenantRow; rootDomain: string }) {
  const router = useRouter();
  const [slug, setSlug] = useState(tenant.slug);
  const [domain, setDomain] = useState(tenant.custom_domain ?? "");
  const [active, setActive] = useState(tenant.active);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const dirty = slug !== tenant.slug || domain !== (tenant.custom_domain ?? "") || active !== tenant.active;

  const save = () =>
    startTransition(async () => {
      const res = await updateTenantAdminAction(tenant.id, { slug, customDomain: domain, active });
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error);
        return;
      }
      setErrors({});
      toast.success(res.message ?? "Salvo");
      router.refresh();
    });

  return (
    <Card className="flex max-w-2xl flex-col gap-5 p-5">
      <Field
        label="Subdomínio"
        htmlFor="slug"
        error={errors.slug}
        hint={rootDomain !== "localhost" ? `https://${slug}.${rootDomain}` : "Em desenvolvimento: acesse com ?loja=" + slug}
      >
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} className="font-mono" />
      </Field>
      <Field
        label="Domínio próprio"
        htmlFor="domain"
        error={errors.customDomain}
        optional
        hint="Ex.: crm.lojax.com.br — crie um CNAME para cname.vercel-dns.com e adicione o domínio no projeto da Vercel."
      >
        <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="crm.lojax.com.br" className="font-mono" />
      </Field>
      <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <Power className="size-4 text-subtle-foreground" /> Loja ativa
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Desativada, os usuários da loja perdem o acesso e o formulário público para de receber leads. Nada é apagado.
          </p>
        </div>
        <Switch checked={active} onCheckedChange={setActive} aria-label="Loja ativa" />
      </div>
      <div className="flex justify-end">
        <Button onClick={save} disabled={!dirty || pending} variant={!active && tenant.active ? "destructive" : "default"}>
          {pending && <Loader2 className="animate-spin" />}
          {!active && tenant.active ? "Desativar loja" : "Salvar"}
        </Button>
      </div>
    </Card>
  );
}
