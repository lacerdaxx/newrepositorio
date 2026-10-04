/**
 * Perguntas do formulário de diagnóstico e regras de pontuação do lead.
 * Os textos das opções aparecem no formulário e na mensagem do WhatsApp.
 */

export const SERVICOS = ["Pintura", "Piso", "Cozinha/Banheiro", "Siding/Telhado", "Deck/Exterior", "Reforma geral", "Construção nova", "Outro"] as const;
export const ESTADOS = ["Massachusetts", "Flórida", "Nova Jersey", "Connecticut", "Geórgia", "Nova York", "Outro"] as const;
export const TEMPOS = ["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"] as const;
export const EQUIPES = ["Só eu", "2 a 3", "4 a 10", "Mais de 10"] as const;
export const FATURAMENTOS = ["Até US$ 10 mil", "US$ 10 a 20 mil", "US$ 20 a 50 mil", "US$ 50 a 100 mil", "Mais de US$ 100 mil"] as const;
export const TICKETS = ["Até US$ 2 mil", "US$ 2 a 5 mil", "US$ 5 a 15 mil", "Mais de US$ 15 mil"] as const;
export const ORIGENS = ["Indicação", "Trabalho como sub para outro contractor", "Anúncios", "HomeAdvisor/Angi/Thumbtack", "Misto"] as const;
export const GOOGLE = ["Sim, com mais de 20 reviews", "Sim, com poucas reviews", "Não tenho / não sei"] as const;
export const INSTAGRAM_STATUS = ["Ativo, posto toda semana", "Tenho, mas está parado", "Não tenho"] as const;
export const PROBLEMAS = [
  "Agenda instável, mês cheio e mês vazio",
  "Dependo de sub/contractor e ganho pouco",
  "Não tenho tempo para atender e vender",
  "Já investi em marketing e não deu resultado",
  "Quero crescer e não sei por onde começar",
] as const;
export const VERBAS = ["Menos de US$ 1.000", "US$ 1.000 a 2.000", "US$ 2.000 a 5.000", "Mais de US$ 5.000"] as const;
export const MOMENTOS = ["Agora, o quanto antes", "Nos próximos 30 dias", "Nos próximos 3 meses", "Só estou pesquisando"] as const;
export const CAPACIDADES = ["1 a 2", "3 a 5", "Mais de 5", "Não tenho capacidade agora"] as const;

/** Pontos por resposta (total máximo = 100). Ajuste à vontade. */
export const PONTOS = {
  tempo: { "Menos de 1 ano": 0, "1 a 3 anos": 5, "3 a 5 anos": 8, "Mais de 5 anos": 10 },
  equipe: { "Só eu": 0, "2 a 3": 5, "4 a 10": 10, "Mais de 10": 10 },
  faturamento: { "Até US$ 10 mil": 0, "US$ 10 a 20 mil": 5, "US$ 20 a 50 mil": 10, "US$ 50 a 100 mil": 15, "Mais de US$ 100 mil": 15 },
  ticket: { "Até US$ 2 mil": 0, "US$ 2 a 5 mil": 5, "US$ 5 a 15 mil": 10, "Mais de US$ 15 mil": 10 },
  verba: { "Menos de US$ 1.000": 0, "US$ 1.000 a 2.000": 8, "US$ 2.000 a 5.000": 20, "Mais de US$ 5.000": 20 },
  momento: { "Agora, o quanto antes": 20, "Nos próximos 30 dias": 15, "Nos próximos 3 meses": 5, "Só estou pesquisando": 0 },
  capacidade: { "1 a 2": 5, "3 a 5": 10, "Mais de 5": 15, "Não tenho capacidade agora": 0 },
} as const;

/** Pontuação mínima para cada classe. Abaixo de B = C. */
export const CORTES = { A: 65, B: 40 };

type Respostas = { [K in keyof typeof PONTOS]: keyof (typeof PONTOS)[K] };

export function classificarLead(r: Respostas) {
  const pontuacao = (Object.keys(PONTOS) as (keyof typeof PONTOS)[]).reduce(
    (soma, k) => soma + ((PONTOS[k] as Record<string, number>)[r[k] as string] ?? 0),
    0,
  );
  // Respostas que, sozinhas, colocam o lead em C (fora do perfil agora)
  const eliminatorio =
    r.verba === "Menos de US$ 1.000" || r.momento === "Só estou pesquisando" || (r.equipe === "Só eu" && r.tempo === "Menos de 1 ano");
  const classificacao: "A" | "B" | "C" = eliminatorio ? "C" : pontuacao >= CORTES.A ? "A" : pontuacao >= CORTES.B ? "B" : "C";
  return { pontuacao, classificacao };
}
