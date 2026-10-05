/** Utilitários de cor para o tema dinâmico do tenant. */
export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]) {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/** Texto legível (branco ou quase-preto) sobre a cor de marca. */
export function readableForeground(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  const L = luminance(rgb);
  const contrastWhite = 1.05 / (L + 0.05);
  const contrastDark = (L + 0.05) / 0.05;
  // leve preferência por branco, que costuma ficar melhor em botões de marca
  return contrastWhite * 1.2 >= contrastDark ? "#ffffff" : "#0b0d12";
}

export function isValidHex(hex: string) {
  return hexToRgb(hex) !== null;
}
