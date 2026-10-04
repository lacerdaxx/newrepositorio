import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#121212",
        surface2: "#1A1A1A",
        line: "rgba(255,255,255,0.08)",
        gold: { DEFAULT: "#F7B52C", deep: "#F29A1E" },
        silver: { DEFAULT: "#E5E5E5", deep: "#8A8A8A" },
        ink: "#FAFAFA",
        muted: "#A1A1AA",
      },
      fontFamily: {
        display: ["var(--font-display)", "Montserrat", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "1200px" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "18%, 100%": { transform: "translateX(320%) skewX(-20deg)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        shine: "shine 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
