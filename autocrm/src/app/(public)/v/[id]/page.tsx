import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Fuel as FuelIcon, Gauge, Hash, Palette, Settings2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/icons";
import { TenantMark } from "@/components/brand/tenant-logo";
import { Button } from "@/components/ui/button";
import { getPublicTenantOrNull } from "@/features/tenants/server";
import { getPublicVehicle } from "@/features/vehicles/public";
import { Gallery } from "@/features/vehicles/public-components/gallery";
import { InterestForm } from "@/features/vehicles/public-components/interest-form";
import { FUEL_LABEL, photoUrl, TRANSMISSION_LABEL, vehicleTitle, vehicleYears } from "@/features/vehicles/utils";
import { waLink } from "@/features/whatsapp/lib";
import { formatCurrency, formatKm } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const tenant = await getPublicTenantOrNull();
  if (!tenant) return null;
  const vehicle = await getPublicVehicle(tenant.slug, id);
  return vehicle ? { tenant, vehicle } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).id);
  if (!data) return { title: "Veículo não encontrado" };
  const { tenant, vehicle } = data;
  const title = `${vehicleTitle(vehicle)}${vehicle.price ? ` · ${formatCurrency(Number(vehicle.price))}` : ""}`;
  const cover = photoUrl(vehicle.photos[0] ?? vehicle.cover_url);
  return {
    title: { absolute: `${title} | ${tenant.name}` },
    description: `${vehicleTitle(vehicle)} ${vehicle.km !== null ? `com ${formatKm(vehicle.km)}` : ""} na ${tenant.name}. Fale com um consultor pelo WhatsApp.`,
    openGraph: { title, siteName: tenant.name, images: cover ? [cover] : undefined, type: "website", locale: "pt_BR" },
    icons: tenant.logoUrl ? { icon: tenant.logoUrl } : undefined,
  };
}

export default async function PublicVehiclePage({ params }: Props) {
  const data = await load((await params).id);
  if (!data) notFound();
  const { tenant, vehicle } = data;
  const sold = vehicle.status === "vendido";
  const name = vehicleTitle(vehicle);
  const specs = [
    { icon: CalendarDays, label: "Ano", value: vehicleYears(vehicle) },
    { icon: Gauge, label: "Quilometragem", value: vehicle.km !== null ? formatKm(vehicle.km) : null },
    { icon: Settings2, label: "Câmbio", value: vehicle.transmission ? TRANSMISSION_LABEL[vehicle.transmission] : null },
    { icon: FuelIcon, label: "Combustível", value: vehicle.fuel ? FUEL_LABEL[vehicle.fuel] : null },
    { icon: Palette, label: "Cor", value: vehicle.color },
    { icon: Hash, label: "Final da placa", value: vehicle.plate_end || null },
  ].filter((s) => s.value);
  const waHref = waLink(tenant.whatsapp, `Olá! Vi o ${name} no site da ${tenant.name} e tenho interesse.`);

  return (
    <div className="pb-24 md:pb-12">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <TenantMark className="size-8" />
          <span className="font-semibold tracking-tight">{tenant.name}</span>
          {tenant.whatsapp && (
            <Button asChild variant="whatsapp" size="sm" className="ml-auto">
              <a href={waHref} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> <span className="hidden sm:inline">Falar no WhatsApp</span>
              </a>
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 pt-6 md:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          {sold && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              Este veículo já foi vendido. <Link href="/catalogo" className="font-medium underline">Veja outras opções no estoque</Link>.
            </div>
          )}
          <Gallery photos={vehicle.photos} brand={vehicle.brand} model={vehicle.model} sold={sold} />

          <div className="md:hidden">
            <TitleBlock name={vehicle} price={vehicle.price} reserved={vehicle.status === "reservado"} />
          </div>

          <section aria-labelledby="ficha">
            <h2 id="ficha" className="mb-3 text-lg font-semibold tracking-tight">Ficha técnica</h2>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center gap-3 bg-surface p-4">
                  <s.icon className="size-5 shrink-0 text-brand" />
                  <div>
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="text-sm font-semibold">{s.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {vehicle.features.length > 0 && (
            <section aria-labelledby="opcionais">
              <h2 id="opcionais" className="mb-3 text-lg font-semibold tracking-tight">Opcionais</h2>
              <ul className="flex flex-wrap gap-2">
                {vehicle.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px]">
                    <BadgeCheck className="size-3.5 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {vehicle.description && (
            <section aria-labelledby="sobre">
              <h2 id="sobre" className="mb-3 text-lg font-semibold tracking-tight">Sobre o veículo</h2>
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">{vehicle.description}</p>
            </section>
          )}
        </div>

        <aside id="interesse" className="md:sticky md:top-20 md:self-start">
          <div className="surface flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 shadow-md">
            <div className="hidden md:block">
              <TitleBlock name={vehicle} price={vehicle.price} reserved={vehicle.status === "reservado"} />
            </div>
            {!sold && <InterestForm vehicleId={vehicle.id} vehicleName={name} />}
          </div>
        </aside>
      </main>

      <footer className="mx-auto mt-12 max-w-6xl px-4 text-center text-xs text-subtle-foreground">
        © {new Date().getFullYear()} {tenant.name} · Imagens meramente ilustrativas. Preço e disponibilidade sujeitos a alteração.
      </footer>

      {!sold && (
        <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-border bg-background/90 p-3 backdrop-blur md:hidden">
          {tenant.whatsapp && (
            <Button asChild variant="whatsapp" size="lg" className="flex-1">
              <a href={waHref} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            </Button>
          )}
          <Button asChild size="lg" className="flex-1">
            <a href="#interesse">Tenho interesse</a>
          </Button>
        </div>
      )}
    </div>
  );
}

function TitleBlock({
  name,
  price,
  reserved,
}: {
  name: Parameters<typeof vehicleTitle>[0];
  price: number | null;
  reserved: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{name.brand}</p>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-balance">
        {name.model} <span className="font-normal text-muted-foreground">{name.version}</span>
      </h1>
      <p className="mt-3 text-3xl font-bold tracking-tight text-brand tabular">{price ? formatCurrency(Number(price)) : "Consulte"}</p>
      {reserved && <p className="mt-1 text-sm font-medium text-warning">Reservado — entre na fila de interesse</p>}
    </div>
  );
}
