/**
 * Configuração central da landing page.
 * Troque aqui WhatsApp, Pixel, textos de contato e depoimentos.
 */

export type Testimonial = {
  quote: string;
  name: string;
  company: string;
  location: string;
  result: string;
  /** Opcional: caminho da foto em /public (ex.: "/depoimentos/joao.jpg") */
  photo?: string;
};

export const siteConfig = {
  nome: "BuildScale Company",
  slogan: "Growth Marketing for Construction Companies",
  url: "https://buildscale.company",

  /** TROQUE: DDI + DDD + número, só dígitos. Ex.: "5561999999999" (Brasil) ou "15085551234" (EUA) */
  whatsapp: "5561999999999",

  /** ID do Meta Pixel (só dígitos). Enquanto estiver com o placeholder, o pixel não carrega. */
  metaPixelId: "[ID DO PIXEL]",

  /** Logo original em /public (usado na imagem de compartilhamento) */
  logo: "/logo.png",
  /** Recorte do logo sem a frase de baixo, para o header */
  logoHeader: "/logo-header.png",
  /** Logo completo, com a frase, para o rodapé */
  logoFooter: "/logo-full.png",

  seo: {
    title: "BuildScale Company | Marketing para construtoras brasileiras nos EUA",
    description:
      "Pare de depender de indicação. Anúncios, Google, Instagram, vídeos e atendimento dos leads para empresas brasileiras de construção e reforma nos EUA, com atendimento em português.",
  },

  /** Depoimentos — substitua os placeholders pelos reais (não invente). */
  depoimentos: [
    {
      quote: "[Depoimento do cliente]",
      name: "[Nome]",
      company: "[Empresa]",
      location: "[Cidade, Estado]",
      result: "[Resultado]",
    },
    {
      quote: "[Depoimento do cliente]",
      name: "[Nome]",
      company: "[Empresa]",
      location: "[Cidade, Estado]",
      result: "[Resultado]",
    },
    {
      quote: "[Depoimento do cliente]",
      name: "[Nome]",
      company: "[Empresa]",
      location: "[Cidade, Estado]",
      result: "[Resultado]",
    },
  ] as Testimonial[],

  /**
   * Opcional: URL que recebe cada lead em JSON (Zapier, Make, Google Apps Script, CRM).
   * Com ela preenchida, leads "C" não precisam abrir o WhatsApp para não se perderem.
   */
  leadWebhookUrl: "",

  /** URL do vídeo vertical do hero (mp4). Vazio = mostra placeholder com play. */
  heroVideoUrl: "",
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
