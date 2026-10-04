import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/config/site";

const exists = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));

/**
 * Logo do header (sem a frase de baixo) e do rodapé (completo).
 * Se os arquivos não existirem, usa o placeholder em SVG.
 */
export function getLogoSrc(kind: "header" | "footer" = "header") {
  const src = kind === "header" ? siteConfig.logoHeader : siteConfig.logoFooter;
  return exists(src) ? src : "/logo-placeholder.svg";
}
