"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type PhotoItem = { id: string; url: string };

const MAX_BYTES = 8 * 1024 * 1024;

/** Upload múltiplo + reordenação por arraste. A primeira foto é a capa. */
export function PhotoManager({
  items,
  onAdd,
  onRemove,
  onReorder,
  uploading,
  disabled,
}: {
  items: PhotoItem[];
  onAdd: (files: File[]) => void;
  onRemove: (item: PhotoItem) => void;
  onReorder: (items: PhotoItem[]) => void;
  uploading?: boolean;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const accept = (list: FileList | null) => {
    const files = Array.from(list ?? []).filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name}: limite de 8 MB por foto`);
        return false;
      }
      return true;
    });
    if (files.length) onAdd(files);
  };

  const onDragEnd = ({ active, over: target }: DragEndEvent) => {
    if (!target || active.id === target.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === target.id);
    onReorder(arrayMove(items, from, to));
  };

  return (
    <div className="flex flex-col gap-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {items.map((item, i) => (
              <SortablePhoto key={item.id} item={item} cover={i === 0} onRemove={() => onRemove(item)} disabled={disabled} />
            ))}
            {!disabled && (
              <li>
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
                    accept(e.dataTransfer.files);
                  }}
                  className={cn(
                    "flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong text-xs text-muted-foreground transition-colors hover:bg-accent/50",
                    over && "border-brand bg-[color-mix(in_oklch,var(--brand)_6%,transparent)] text-brand",
                  )}
                >
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
                  {uploading ? "Enviando…" : "Adicionar fotos"}
                </button>
              </li>
            )}
          </ul>
        </SortableContext>
      </DndContext>
      <p className="text-xs text-subtle-foreground">Arraste para reordenar. A primeira foto é a capa. JPG/PNG/WEBP até 8 MB.</p>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          accept(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function SortablePhoto({ item, cover, onRemove, disabled }: { item: PhotoItem; cover: boolean; onRemove: () => void; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("group relative aspect-[4/3] touch-none overflow-hidden rounded-lg border border-border bg-muted", isDragging && "z-10 scale-105 shadow-lg")}
      {...attributes}
      {...listeners}
    >
      <img src={item.url} alt="" className="size-full cursor-grab object-cover" draggable={false} />
      {cover && (
        <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur">
          <Star className="size-2.5 fill-current text-warning" /> Capa
        </span>
      )}
      {!disabled && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onRemove}
          aria-label="Remover foto"
          className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      )}
    </li>
  );
}
