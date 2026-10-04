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

  /** Caminho do logo em /public */
  logo: "/logo.png",

  seo: {
    title: "BuildScale Company | Marketing para construtoras brasileiras nos EUA",
    description:
      "Agenda cheia de orçamentos direto com o dono da casa. Google Meu Negócio, anúncios no Meta e roteiros de vídeo para empresas brasileiras de construção e reforma nos EUA, com atendimento em português.",
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

  /** URL do vídeo vertical do hero (mp4). Vazio = mostra placeholder com play. */
  heroVideoUrl: "",
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
