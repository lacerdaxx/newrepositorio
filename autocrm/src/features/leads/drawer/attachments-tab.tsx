"use client";
import { useRef, useState } from "react";
import { Download, File, FileImage, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAttachments, useDeleteAttachment, useUploadAttachment } from "@/features/data/queries";
import { useRepo } from "@/features/data/repo-provider";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX = 10 * 1024 * 1024;

function size(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

export function AttachmentsTab({ leadId }: { leadId: string }) {
  const repo = useRepo();
  const list = useAttachments(leadId);
  const upload = useUploadAttachment(leadId);
  const remove = useDeleteAttachment(leadId);
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handle = (files: FileList | null) => {
    for (const f of Array.from(files ?? [])) {
      if (f.size > MAX) {
        toast.error(`${f.name}: limite de 10 MB`);
        continue;
      }
      upload.mutate(f);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong px-4 py-8 text-center transition-colors",
          over ? "border-brand bg-[color-mix(in_oklch,var(--brand)_6%,transparent)]" : "hover:bg-accent/40",
        )}
      >
        {upload.isPending ? <Loader2 className="size-5 animate-spin text-brand" /> : <UploadCloud className="size-5 text-subtle-foreground" />}
        <span className="text-[13px] font-medium">Arraste arquivos ou clique para enviar</span>
        <span className="text-xs text-subtle-foreground">CNH, comprovantes, simulações, fotos da troca · até 10 MB</span>
      </button>
      <input ref={input} type="file" multiple className="hidden" onChange={(e) => (handle(e.target.files), (e.target.value = ""))} />

      <ul className="flex flex-col gap-1.5">
        {(list.data ?? []).map((a) => {
          const Icon = a.mime_type?.startsWith("image/") ? FileImage : a.mime_type?.includes("pdf") ? FileText : File;
          return (
            <li key={a.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
              <Icon className="size-4 shrink-0 text-subtle-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{a.file_name}</p>
                <p className="text-xs text-subtle-foreground">
                  {size(a.size_bytes)} · {formatDateTime(a.created_at)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Baixar"
                onClick={async () => {
                  try {
                    window.open(await repo!.attachmentUrl(a), "_blank", "noopener");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Erro ao abrir");
                  }
                }}
              >
                <Download />
              </Button>
              <Button variant="ghost" size="icon-xs" aria-label="Excluir" onClick={() => remove.mutate(a)}>
                <Trash2 />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
