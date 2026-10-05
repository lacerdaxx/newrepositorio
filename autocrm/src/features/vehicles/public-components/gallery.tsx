"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { photoUrl } from "../utils";
import { VehicleImage } from "../vehicle-image";

export function Gallery({ photos, brand, model, sold }: { photos: string[]; brand: string; model: string; sold?: boolean }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const urls = photos.map((p) => photoUrl(p)!).filter(Boolean);

  if (urls.length === 0) {
    return <VehicleImage src={null} brand={brand} model={model} className="aspect-[16/10] w-full" rounded="rounded-2xl" />;
  }
  const go = (d: number) => {
    setDir(d);
    setI((x) => (x + d + urls.length) % urls.length);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted"
        onTouchStart={(e) => ((e.currentTarget.dataset.x = String(e.touches[0]?.clientX ?? 0)))}
        onTouchEnd={(e) => {
          const start = Number(e.currentTarget.dataset.x);
          const dx = (e.changedTouches[0]?.clientX ?? start) - start;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={i}
            src={urls[i]}
            alt={`${brand} ${model} — foto ${i + 1}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn("absolute inset-0 size-full object-cover", sold && "grayscale")}
          />
        </AnimatePresence>
        {urls.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white tabular">
              {i + 1}/{urls.length}
            </span>
          </>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {urls.map((u, k) => (
            <button
              key={u}
              onClick={() => {
                setDir(k > i ? 1 : -1);
                setI(k);
              }}
              aria-label={`Ver foto ${k + 1}`}
              className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-transparent transition", k === i ? "ring-brand" : "opacity-70 hover:opacity-100")}
            >
              <img src={u} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
