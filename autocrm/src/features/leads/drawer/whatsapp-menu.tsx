"use client";
import { ChevronDown, FileText, MessageSquareText } from "lucide-react";
import { WhatsAppIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTemplates } from "@/features/data/queries";
import type { BoardLead } from "@/features/data/types";
import { greetingTemplate } from "@/features/whatsapp/lib";
import { useWhatsAppSender } from "@/features/whatsapp/use-whatsapp";

/** Botão WhatsApp (saudação) + menu com todos os templates da loja. */
export function WhatsAppMenu({ lead }: { lead: BoardLead }) {
  const templates = useTemplates();
  const wa = useWhatsAppSender();
  const list = templates.data ?? [];
  const sheet = list.find((t) => t.category === "ficha_veiculo");

  return (
    <div className="flex">
      <Button
        variant="whatsapp"
        size="sm"
        className="rounded-r-none"
        onClick={() => wa.send(lead, { name: "Saudação", body: greetingTemplate(list) })}
      >
        <WhatsAppIcon /> WhatsApp
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="whatsapp" size="sm" className="rounded-l-none border-l border-black/15 px-2" aria-label="Escolher mensagem">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {lead.vehicle && sheet && (
            <>
              <DropdownMenuItem onSelect={() => wa.send(lead, sheet)}>
                <FileText /> Enviar ficha do veículo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuLabel>Templates</DropdownMenuLabel>
          {list
            .filter((t) => t.category !== "ficha_veiculo")
            .map((t) => (
              <DropdownMenuItem key={t.id} onSelect={() => wa.send(lead, t)} className="flex-col items-start gap-0.5">
                <span className="flex items-center gap-2 font-medium">
                  <MessageSquareText /> {t.name}
                </span>
                <span className="line-clamp-2 pl-6 text-xs text-muted-foreground">{wa.buildText(lead, t.body)}</span>
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => wa.send(lead, { name: "Mensagem livre", body: "Olá, {nome}!" })}>
            <WhatsAppIcon /> Abrir conversa sem template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
