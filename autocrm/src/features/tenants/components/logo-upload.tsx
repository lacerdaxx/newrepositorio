"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";

const MAX_BYTES = 1024 * 1024; // 1 MB

export function LogoUpload({
  tenantId,
  value,
  onChange,
}: {
  tenantId: string | null;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return toast.error("Use PNG, JPG, WEBP ou SVG.");
    if (file.size > MAX_BYTES) return toast.error("A imagem deve ter até 1 MB.");

    if (!isSupabaseConfigured || !tenantId) {
      onChange(URL.createObjectURL(file));
      if (!isSupabaseConfigured) toast("Prévia local", { description: "No modo demonstração a logo não é salva." });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${tenantId}/logo-${Date.now()}.${ext}`;
    // carregado sob demanda: mantém o supabase-js fora do bundle inicial da página
    const { getSupabaseBrowser } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.storage.from("tenant-assets").upload(path, file, { upsert: true, cacheControl: "31536000" });
    setUploading(false);
    if (error) return toast.error("Falha no upload da logo.");
    onChange(supabase.storage.from("tenant-assets").getPublicUrl(path).data.publicUrl);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border-strong bg-surface-2">
        {value ? <img src={value} alt="Logo" className="size-full object-contain p-1.5" /> : <ImagePlus className="size-5 text-subtle-foreground" />}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading && <Loader2 className="animate-spin" />}
            {value ? "Trocar logo" : "Enviar logo"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              <X /> Remover
            </Button>
          )}
        </div>
        <p className="text-xs text-subtle-foreground">PNG ou SVG quadrado, até 1 MB. Também vira o favicon.</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
