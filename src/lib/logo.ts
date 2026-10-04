import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/config/site";

/** Usa public/logo.png quando existir; senão, o placeholder em SVG. */
export function getLogoSrc() {
  const file = path.join(process.cwd(), "public", siteConfig.logo.replace(/^\//, ""));
  return fs.existsSync(file) ? siteConfig.logo : "/logo-placeholder.svg";
}
