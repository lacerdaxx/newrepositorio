/** Traço técnico de carro em estúdio — usado só enquanto a fotografia real não foi adicionada. */
export function CarLineArt({ className = '' }: { className?: string }) {
  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={cx} cy={250} r={62} fill="#0c0c0c" stroke="#8c8c8c" strokeWidth="1.5" />
      <circle cx={cx} cy={250} r={40} fill="none" stroke="#8c8c8c" strokeWidth="1" />
      <circle cx={cx} cy={250} r={8} fill="none" stroke="#8c8c8c" strokeWidth="1" />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * 72 - 90) * (Math.PI / 180)
        return <line key={i} x1={cx + Math.cos(a) * 10} y1={250 + Math.sin(a) * 10} x2={cx + Math.cos(a) * 40} y2={250 + Math.sin(a) * 40} stroke="#8c8c8c" strokeWidth="1" />
      })}
    </g>
  )
  return (
    <svg viewBox="0 0 1000 330" className={className} role="img" aria-label="Silhueta técnica de veículo" preserveAspectRatio="xMidYMax meet">
      <defs>
        <radialGradient id="floor" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity=".75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="500" cy="308" rx="470" ry="16" fill="url(#floor)" />
      <path
        d="M70 250V205Q70 185 95 180L175 170C190 165 230 118 300 104L560 96C640 98 700 140 780 162L905 178Q940 184 945 205V250H842A72 72 0 0 0 698 250H302A72 72 0 0 0 158 250Z"
        fill="#121212" stroke="#8c8c8c" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M318 118L548 108C610 110 655 138 700 163H318Z M470 110V163" fill="#0a0a0a" stroke="#8c8c8c" strokeWidth="1" />
      <path d="M110 178L930 190" stroke="#F36B21" strokeWidth="2" />
      <path d="M95 232H150M850 232H935" stroke="#8c8c8c" strokeWidth="1" />
      {wheel(230)}
      {wheel(770)}
    </svg>
  )
}
