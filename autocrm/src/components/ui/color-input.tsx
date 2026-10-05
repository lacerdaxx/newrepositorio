"use client";
import { cn } from "@/lib/utils";

const PRESETS = ["#e30613", "#f97316", "#f59e0b", "#16a34a", "#0d9488", "#0ea5e9", "#2563eb", "#6366f1", "#9333ea", "#db2777", "#111827"];

/** Seletor de cor: amostra nativa + hex + paleta rápida. */
export function ColorInput({
  value,
  onChange,
  id,
  presets = PRESETS,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  presets?: string[];
  invalid?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border border-input bg-surface pl-1.5 pr-3 shadow-xs focus-within:border-[color-mix(in_oklch,var(--brand)_55%,var(--border-strong))] focus-within:ring-[3px] focus-within:ring-ring",
          invalid && "border-danger",
        )}
      >
        <label className="relative size-6 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1 ring-border" style={{ background: value }}>
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Escolher cor"
          />
        </label>
        <input
          id={id}
          value={value}
          onChange={(e) => {
            const v = e.target.value.trim();
            onChange(v.startsWith("#") ? v : `#${v}`);
          }}
          maxLength={7}
          spellCheck={false}
          className="w-full bg-transparent font-mono text-sm uppercase outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-label={`Usar ${c}`}
            className={cn(
              "size-5 rounded-full ring-1 ring-border transition-transform hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring",
              value.toLowerCase() === c && "ring-2 ring-foreground ring-offset-2 ring-offset-surface",
            )}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}
