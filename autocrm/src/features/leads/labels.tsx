import { Globe, Handshake, Store, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { InstagramIcon, MetaIcon, WhatsAppIcon } from "@/components/brand/icons";
import type { LeadSource, LostReason, PaymentMethod, TaskType } from "@/types/database";

type IconComp = LucideIcon | ((p: React.SVGProps<SVGSVGElement>) => React.ReactElement);

export const SOURCE_META: Record<LeadSource, { label: string; icon: IconComp; color: string }> = {
  meta_ads: { label: "Meta Ads", icon: MetaIcon, color: "#0866ff" },
  instagram: { label: "Instagram", icon: InstagramIcon, color: "#e1306c" },
  whatsapp: { label: "WhatsApp", icon: WhatsAppIcon, color: "#25d366" },
  portal: { label: "Portais", icon: Globe, color: "#f59e0b" },
  site: { label: "Site", icon: Globe, color: "#0ea5e9" },
  indicacao: { label: "Indicação", icon: Handshake, color: "#a855f7" },
  loja_fisica: { label: "Loja física", icon: Store, color: "#14b8a6" },
  outro: { label: "Outro", icon: UserPlus, color: "#64748b" },
};

export const SOURCES = Object.keys(SOURCE_META) as LeadSource[];

export function SourceIcon({ source, className }: { source: LeadSource; className?: string }) {
  const Icon = SOURCE_META[source].icon;
  return <Icon className={className} style={{ color: SOURCE_META[source].color }} aria-label={SOURCE_META[source].label} />;
}

export const LOST_REASON_LABEL: Record<LostReason, string> = {
  comprou_outra_loja: "Comprou em outra loja",
  sem_credito: "Sem crédito aprovado",
  preco: "Preço",
  desistiu: "Desistiu da compra",
  sem_estoque: "Sem estoque do modelo",
  nao_respondeu: "Não respondeu",
  outro: "Outro motivo",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  a_vista: "À vista",
  financiado: "Financiado",
  consorcio: "Consórcio",
};

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  tarefa: "Tarefa",
  ligacao: "Ligação",
  visita: "Visita",
  test_drive: "Test drive",
  follow_up: "Follow-up",
};
