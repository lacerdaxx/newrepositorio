import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import Providers from "@/components/Providers";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  applicationName: siteConfig.nome,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.nome,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <MetaPixel />
      </body>
    </html>
  );
}
