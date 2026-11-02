/** Silhueta genérica usada como fallback (sem WebGL) e placeholder de card. */
export function CarSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 150" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="cs-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>
      <path d="M12 106 L18 82 Q24 70 70 64 L150 58 Q180 16 240 14 Q300 14 332 50 L400 62 Q444 70 448 94 L446 106 Z" fill="url(#cs-body)" stroke="#FF6A00" strokeOpacity=".7" strokeWidth="1.5" />
      <path d="M172 58 Q192 28 238 27 Q284 27 308 54 Z" fill="#050505" stroke="#FF6A00" strokeOpacity=".35" />
      <circle cx="110" cy="108" r="26" fill="#050505" stroke="#FF6A00" strokeWidth="3" />
      <circle cx="352" cy="108" r="26" fill="#050505" stroke="#FF6A00" strokeWidth="3" />
      <circle cx="110" cy="108" r="9" fill="#FF6A00" opacity=".6" />
      <circle cx="352" cy="108" r="9" fill="#FF6A00" opacity=".6" />
    </svg>
  )
}
