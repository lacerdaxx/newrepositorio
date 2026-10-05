"use client";
import { toast } from "sonner";
import { Clock, Inbox, Plus, Trash2 } from "lucide-react";
import { MetaIcon, WhatsAppIcon, InstagramIcon } from "@/components/brand/icons";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, formatKm, formatPhone, maskPlate } from "@/lib/format";

export function DesignShowcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Botões</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success("Lead salvo", { description: "Carlos Henrique foi adicionado ao funil." })}>
            <Plus /> Primário
          </Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="whatsapp" onClick={() => toast("Abrindo WhatsApp…")}>
            <WhatsAppIcon /> WhatsApp
          </Button>
          <Button variant="destructive" size="icon" aria-label="Excluir"><Trash2 /></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Badges e origens</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Badge variant="brand"><MetaIcon /> Meta Ads</Badge>
          <Badge><InstagramIcon /> Instagram</Badge>
          <Badge variant="success"><WhatsAppIcon /> WhatsApp</Badge>
          <Badge variant="danger"><Clock /> 32 min sem contato</Badge>
          <Badge variant="warning">Financiado</Badge>
          <Badge variant="info">Visita agendada</Badge>
          <Badge variant="outline">SUV</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Formatação BR</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-muted-foreground">Preço</span><span className="tabular">{formatCurrency(129900)}</span>
          <span className="text-muted-foreground">Telefone</span><span className="tabular">{formatPhone("61999998888")}</span>
          <span className="text-muted-foreground">Data</span><span className="tabular">{formatDate(new Date())}</span>
          <span className="text-muted-foreground">Km</span><span className="tabular">{formatKm(38000)}</span>
          <span className="text-muted-foreground">Placa</span><span className="font-mono">{maskPlate("ABC1D23")}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Entradas, atalhos e avatares</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input placeholder="(61) 99999-9999" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Busca <Kbd>Ctrl</Kbd><Kbd>K</Kbd> · Novo lead <Kbd>N</Kbd> · Ir ao funil <Kbd>G</Kbd><Kbd>F</Kbd>
          </div>
          <div className="flex -space-x-2">
            {["Mariana Costa", "Pedro Lima", "Ana Ribeiro", "Lucas Martins"].map((n) => (
              <Avatar key={n} name={n} className="ring-2 ring-surface" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Skeleton</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </CardContent>
      </Card>

      <EmptyState
        icon={<Inbox />}
        title="Estado vazio"
        description="Ilustrado, com chamada para ação."
        action={<Button size="sm"><Plus /> Criar</Button>}
      />
    </div>
  );
}
