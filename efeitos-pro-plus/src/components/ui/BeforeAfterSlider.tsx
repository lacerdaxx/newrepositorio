import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-white/10 shadow-card"
      onMouseDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => updateFromClientX(e.touches[0].clientX)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      {/* DEPOIS (fundo completo) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-800 via-[#241d0f] to-ink-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(232,182,74,0.25),transparent_55%)]" />
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold-400/80 animate-pulse-glow"
            style={{
              width: 3,
              height: 3,
              left: `${(i * 41) % 100}%`,
              top: `${(i * 29) % 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <span className="relative rounded-full border border-gold-400/40 bg-ink-950/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-400 backdrop-blur">
          Depois
        </span>
        <span className="relative text-sm font-medium text-white/80">
          Com efeitos, transições e elementos visuais
        </span>
      </div>

      {/* ANTES (recortado pelo clip-path) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-800"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <span className="rounded-full border border-white/15 bg-ink-950/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ink-300 backdrop-blur">
          Antes
        </span>
        <span className="text-sm font-medium text-ink-400">Vídeo simples, sem edição</span>
      </div>

      {/* handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white/70"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink-950 text-white shadow-gold-sm">
          <MoveHorizontal size={16} />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Comparar antes e depois"
        className="absolute inset-x-0 bottom-2 z-20 mx-auto w-[90%] opacity-0 focus:opacity-100"
      />
    </div>
  );
}
