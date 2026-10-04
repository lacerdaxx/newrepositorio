"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lock, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type FieldPath, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { siteConfig, whatsappLink } from "@/config/site";
import {
  CAPACIDADES,
  EQUIPES,
  ESTADOS,
  FATURAMENTOS,
  GOOGLE,
  INSTAGRAM_STATUS,
  MOMENTOS,
  ORIGENS,
  PROBLEMAS,
  SERVICOS,
  TEMPOS,
  TICKETS,
  VERBAS,
  classificarLead,
} from "@/config/form";
import { trackLead } from "@/lib/pixel";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

const DDIS = {
  "+1": { label: "🇺🇸 +1", digits: [10], placeholder: "(555) 123-4567" },
  "+55": { label: "🇧🇷 +55", digits: [10, 11], placeholder: "(11) 91234-5678" },
} as const;

const pick = (msg: string) => ({ error: msg });

const schema = z
  .object({
    servicos: z.array(z.enum(SERVICOS)).min(1, "Escolha pelo menos um serviço."),
    estado: z.enum(ESTADOS, pick("Escolha o estado.")),
    cidade: z.string().trim().min(2, "Digite a cidade principal."),
    tempo: z.enum(TEMPOS, pick("Escolha há quanto tempo a empresa existe.")),
    equipe: z.enum(EQUIPES, pick("Escolha o tamanho da equipe.")),
    faturamento: z.enum(FATURAMENTOS, pick("Escolha a faixa de faturamento.")),
    ticket: z.enum(TICKETS, pick("Escolha o valor médio de uma obra.")),
    origem: z.enum(ORIGENS, pick("Escolha de onde vêm seus clientes.")),
    google: z.enum(GOOGLE, pick("Escolha uma opção.")),
    instagramStatus: z.enum(INSTAGRAM_STATUS, pick("Escolha uma opção.")),
    problema: z.enum(PROBLEMAS, pick("Escolha o seu maior problema.")),
    verba: z.enum(VERBAS, pick("Escolha quanto pode investir.")),
    momento: z.enum(MOMENTOS, pick("Escolha quando quer começar.")),
    capacidade: z.enum(CAPACIDADES, pick("Escolha uma opção.")),
    nome: z.string().trim().min(3, "Digite seu nome completo."),
    empresa: z.string().trim().min(2, "Digite o nome da empresa."),
    ddi: z.enum(["+1", "+55"]),
    telefone: z.string(),
    email: z.string().trim().email("Digite um e-mail válido."),
    instagram: z.string().trim().optional(),
    consentimento: z.boolean().refine((v) => v, "Marque para podermos te chamar no WhatsApp."),
  })
  .superRefine((v, ctx) => {
    const n = v.telefone.replace(/\D/g, "").length;
    if (!(DDIS[v.ddi].digits as readonly number[]).includes(n)) {
      ctx.addIssue({ code: "custom", path: ["telefone"], message: "Digite um WhatsApp válido com DDD/código de área." });
    }
  });

type FormData = z.infer<typeof schema>;

type Question = {
  name: FieldPath<FormData>;
  legend: string;
  hint?: string;
  options: readonly string[];
  cols: string;
  multi?: boolean;
};

const STEPS: { title: string; fields: FieldPath<FormData>[]; questions: Question[] }[] = [
  {
    title: "Sua empresa",
    fields: ["servicos", "estado", "cidade"],
    questions: [
      { name: "servicos", legend: "Qual o principal serviço da sua empresa?", hint: "Pode marcar mais de um.", options: SERVICOS, cols: "grid-cols-2 sm:grid-cols-4", multi: true },
      { name: "estado", legend: "Em qual estado você atua?", options: ESTADOS, cols: "grid-cols-2 sm:grid-cols-4" },
    ],
  },
  {
    title: "Estrutura",
    fields: ["tempo", "equipe"],
    questions: [
      { name: "tempo", legend: "Há quanto tempo sua empresa existe?", options: TEMPOS, cols: "grid-cols-2" },
      { name: "equipe", legend: "Quantas pessoas trabalham na sua equipe (incluindo você)?", options: EQUIPES, cols: "grid-cols-2 sm:grid-cols-4" },
    ],
  },
  {
    title: "Faturamento",
    fields: ["faturamento", "ticket"],
    questions: [
      { name: "faturamento", legend: "Quanto sua empresa fatura por mês, em média?", options: FATURAMENTOS, cols: "grid-cols-1 sm:grid-cols-2" },
      { name: "ticket", legend: "Qual o valor médio de uma obra sua?", options: TICKETS, cols: "grid-cols-2" },
    ],
  },
  {
    title: "Como você vende hoje",
    fields: ["origem", "google", "instagramStatus", "problema"],
    questions: [
      { name: "origem", legend: "De onde vêm a maioria dos seus clientes hoje?", options: ORIGENS, cols: "grid-cols-1 sm:grid-cols-2" },
      { name: "google", legend: "Sua empresa tem perfil no Google Meu Negócio?", options: GOOGLE, cols: "grid-cols-1 sm:grid-cols-3" },
      { name: "instagramStatus", legend: "E o Instagram da empresa?", options: INSTAGRAM_STATUS, cols: "grid-cols-1 sm:grid-cols-3" },
      { name: "problema", legend: "Qual o seu maior problema hoje?", options: PROBLEMAS, cols: "grid-cols-1" },
    ],
  },
  {
    title: "Investimento e momento",
    fields: ["verba", "momento", "capacidade"],
    questions: [
      {
        name: "verba",
        legend: "Quanto você consegue investir por mês em anúncios?",
        hint: "Pago direto ao Facebook, fora o serviço.",
        options: VERBAS,
        cols: "grid-cols-1 sm:grid-cols-2",
      },
      { name: "momento", legend: "Quando você quer começar?", options: MOMENTOS, cols: "grid-cols-1 sm:grid-cols-2" },
      { name: "capacidade", legend: "Quantas obras a mais por mês sua equipe consegue atender?", options: CAPACIDADES, cols: "grid-cols-2 sm:grid-cols-4" },
    ],
  },
  {
    title: "Seus dados",
    fields: ["nome", "empresa", "ddi", "telefone", "email", "instagram", "consentimento"],
    questions: [],
  },
];

function maskPhone(raw: string, ddi: keyof typeof DDIS) {
  const d = raw.replace(/\D/g, "");
  if (ddi === "+1") {
    const x = d.slice(0, 10);
    if (x.length <= 3) return x.length ? `(${x}` : "";
    if (x.length <= 6) return `(${x.slice(0, 3)}) ${x.slice(3)}`;
    return `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
  }
  const x = d.slice(0, 11);
  if (x.length <= 2) return x.length ? `(${x}` : "";
  const local = x.slice(2);
  const split = x.length === 11 ? 5 : 4;
  if (local.length <= split) return `(${x.slice(0, 2)}) ${local}`;
  return `(${x.slice(0, 2)}) ${local.slice(0, split)}-${local.slice(split)}`;
}

export function buildMessage(d: FormData, ref: string) {
  const ig = d.instagram?.trim() ? d.instagram.trim() : "—";
  return [
    "Olá, BuildScale! Quero meu diagnóstico gratuito.",
    `👤 ${d.nome.trim()} — ${d.empresa.trim()}`,
    `📍 ${d.cidade.trim()}, ${d.estado}`,
    `🔨 Serviços: ${d.servicos.join(", ")}`,
    `👷 Equipe: ${d.equipe} · Empresa há: ${d.tempo}`,
    `💰 Faturamento: ${d.faturamento} · Ticket médio: ${d.ticket}`,
    `📣 Clientes vêm de: ${d.origem}`,
    `⭐ Google: ${d.google} · Instagram: ${d.instagramStatus}`,
    `🎯 Maior problema: ${d.problema}`,
    `💵 Verba para anúncios: ${d.verba}`,
    `⏱️ Começar: ${d.momento} · Capacidade: ${d.capacidade}`,
    `📧 ${d.email.trim()} · IG: ${ig}`,
    `Ref: ${ref}`,
  ].join("\n");
}

type Result = { url: string; classificacao: "A" | "B" | "C" };

export default function DiagnosticForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [result, setResult] = useState<Result | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { servicos: [], ddi: "+1", telefone: "", nome: "", empresa: "", cidade: "", email: "", instagram: "", consentimento: false },
  });

  const ddi = watch("ddi");
  const last = STEPS.length - 1;

  useEffect(() => {
    if (!touched.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) window.scrollTo({ top: window.scrollY + top - 96, behavior: "smooth" });
  }, [step]);

  const go = (to: number) => {
    touched.current = true;
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const next = async () => {
    const ok = await trigger(STEPS[step].fields, { shouldFocus: true });
    if (ok) go(step + 1);
  };

  const onValid = (data: FormData) => {
    const { pontuacao, classificacao } = classificarLead(data);
    const ref = `BS-${classificacao}${pontuacao}`;
    const url = whatsappLink(buildMessage(data, ref));
    trackLead(classificacao, pontuacao);

    if (siteConfig.leadWebhookUrl) {
      fetch(siteConfig.leadWebhookUrl, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ ...data, classificacao, pontuacao, ref, enviadoEm: new Date().toISOString() }),
      }).catch(() => {});
    }

    setResult({ url, classificacao });
    window.requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    if (classificacao !== "C") {
      window.setTimeout(() => {
        window.location.href = url;
      }, 1400);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < last) void next();
    else void handleSubmit(onValid)(e);
  };

  return (
    <section id="diagnostico" className="section scroll-mt-12">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[500px] max-w-3xl rounded-full bg-[radial-gradient(closest-side,rgba(247,181,44,0.12),transparent)]" />
      <div className="container-site relative">
        <SectionHeading
          tag="Diagnóstico gratuito"
          title={
            <>
              Descubra quantas obras sua empresa <span className="text-gold">pode fechar por mês</span>
            </>
          }
          subtitle="Responda em menos de 2 minutos. Em 30 minutos de conversa, analisamos sua região, seus serviços e seu ticket, e mostramos quantos orçamentos você pode gerar e quanto precisa investir. Gratuito e sem compromisso."
        />

        <Reveal className="mx-auto mt-10 max-w-2xl md:mt-14">
          <div
            ref={cardRef}
            className="glass relative scroll-mt-28 overflow-hidden rounded-3xl border-white/10 bg-[#121212]/80 p-5 shadow-[0_40px_120px_-50px_rgba(247,181,44,0.35)] sm:p-8 md:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              {result ? (
                <Success key="ok" {...result} />
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em]">
                    <span className="shrink-0 text-gold">
                      Etapa {step + 1} de {STEPS.length}
                    </span>
                    <span className="truncate text-muted">{STEPS[step].title}</span>
                  </div>
                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
                    role="progressbar"
                    aria-label="Progresso do formulário"
                    aria-valuemin={1}
                    aria-valuemax={STEPS.length}
                    aria-valuenow={step + 1}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      initial={false}
                      animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  </div>

                  <div className="relative mt-8 md:min-h-[360px]">
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: dir * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: dir * -40 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                          Etapa {step + 1}: {STEPS[step].title}
                        </h3>

                        <div className="space-y-8">
                          {STEPS[step].questions.map((q) => (
                            <OptionGroup
                              key={q.name}
                              {...q}
                              error={(errors[q.name as keyof FormData] as { message?: string } | undefined)?.message}
                              registration={register(q.name)}
                              selected={watch(q.name) as string | string[] | undefined}
                            />
                          ))}

                          {step === 0 && (
                            <Field label="Cidade principal" id="cidade" error={errors.cidade?.message}>
                              <input
                                id="cidade"
                                autoComplete="address-level2"
                                placeholder="Ex.: Boston"
                                className={inputCls(!!errors.cidade)}
                                aria-invalid={!!errors.cidade}
                                aria-describedby={errors.cidade ? "cidade-erro" : undefined}
                                {...register("cidade")}
                              />
                            </Field>
                          )}

                          {step === last && (
                            <div className="space-y-5">
                              <Field label="Nome completo" id="nome" error={errors.nome?.message}>
                                <input id="nome" autoComplete="name" placeholder="Seu nome e sobrenome" className={inputCls(!!errors.nome)} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "nome-erro" : undefined} {...register("nome")} />
                              </Field>
                              <Field label="Nome da empresa" id="empresa" error={errors.empresa?.message}>
                                <input id="empresa" autoComplete="organization" placeholder="Ex.: Silva Painting LLC" className={inputCls(!!errors.empresa)} aria-invalid={!!errors.empresa} aria-describedby={errors.empresa ? "empresa-erro" : undefined} {...register("empresa")} />
                              </Field>
                              <Field label="WhatsApp" id="telefone" error={errors.telefone?.message}>
                                <div className="flex gap-2">
                                  <label htmlFor="ddi" className="sr-only">
                                    País
                                  </label>
                                  <select
                                    id="ddi"
                                    className={cn(inputCls(false), "!w-[108px] shrink-0 cursor-pointer !px-3")}
                                    {...register("ddi", {
                                      onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setValue("telefone", maskPhone(watch("telefone"), e.target.value as keyof typeof DDIS)),
                                    })}
                                  >
                                    {Object.entries(DDIS).map(([k, v]) => (
                                      <option key={k} value={k}>
                                        {v.label}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    id="telefone"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel-national"
                                    placeholder={DDIS[ddi].placeholder}
                                    className={cn(inputCls(!!errors.telefone), "min-w-0 flex-1")}
                                    aria-invalid={!!errors.telefone}
                                    aria-describedby={errors.telefone ? "telefone-erro" : undefined}
                                    {...register("telefone", {
                                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                        setValue("telefone", maskPhone(e.target.value, ddi), { shouldValidate: !!errors.telefone }),
                                    })}
                                  />
                                </div>
                              </Field>
                              <Field label="E-mail" id="email" error={errors.email?.message}>
                                <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="voce@suaempresa.com" className={inputCls(!!errors.email)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-erro" : undefined} {...register("email")} />
                              </Field>
                              <Field label="Instagram da empresa (opcional)" id="instagram">
                                <input id="instagram" autoComplete="off" placeholder="@suaempresa" className={inputCls(false)} {...register("instagram")} />
                              </Field>
                              <div>
                                <label htmlFor="consentimento" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#D4D4D8]">
                                  <input
                                    id="consentimento"
                                    type="checkbox"
                                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[#F7B52C]"
                                    aria-invalid={!!errors.consentimento}
                                    aria-describedby={errors.consentimento ? "consentimento-erro" : undefined}
                                    {...register("consentimento")}
                                  />
                                  Concordo em receber contato da BuildScale pelo WhatsApp.
                                </label>
                                <ErrorText id="consentimento-erro" message={errors.consentimento?.message} />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => go(step - 1)}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-muted transition-colors hover:text-ink"
                      >
                        <ArrowLeft aria-hidden className="h-4 w-4" /> Voltar
                      </button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                    {step < last ? (
                      <Button type="submit" className="w-full sm:w-auto">
                        Continuar <ArrowRight aria-hidden className="ml-1 inline h-[18px] w-[18px]" />
                      </Button>
                    ) : (
                      <Button type="submit" arrow disabled={isSubmitting} className="w-full sm:w-auto">
                        Quero meu diagnóstico
                      </Button>
                    )}
                  </div>
                  {step === last && (
                    <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted sm:justify-end">
                      <Lock aria-hidden className="h-3.5 w-3.5 shrink-0" /> Você será direcionado para o nosso WhatsApp. Atendimento em português.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const inputCls = (err: boolean) =>
  cn(
    "block min-h-[52px] w-full rounded-xl border bg-[#0A0A0A] px-4 text-base text-ink placeholder:text-zinc-500 transition-colors focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-gold/60",
    err ? "border-red-400/70" : "border-white/10 hover:border-white/20 focus:border-gold/60",
  );

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      <ErrorText id={`${id}-erro`} message={error} />
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p id={id} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm font-medium text-red-400">
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function OptionGroup({
  legend,
  hint,
  options,
  error,
  registration,
  selected,
  cols,
  multi,
}: Question & { error?: string; registration: UseFormRegisterReturn; selected?: string | string[] }) {
  const errId = `${registration.name}-erro`;
  const isOn = (opt: string) => (Array.isArray(selected) ? selected.includes(opt) : selected === opt);
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="text-base font-semibold text-ink">{legend}</legend>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className={cn("mt-3 grid gap-2.5", cols)}>
        {options.map((opt) => {
          const on = isOn(opt);
          return (
            <label
              key={opt}
              className={cn(
                "relative flex min-h-[52px] cursor-pointer select-none items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium leading-snug transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold/70 sm:px-4 sm:text-[15px]",
                on
                  ? "border-gold/70 bg-gold/[0.09] text-ink shadow-[0_0_0_1px_rgba(247,181,44,0.25),0_10px_30px_-12px_rgba(247,181,44,0.4)]"
                  : "border-white/10 bg-white/[0.02] text-[#D4D4D8] hover:border-white/25 hover:bg-white/[0.04]",
              )}
            >
              <input type={multi ? "checkbox" : "radio"} value={opt} className="sr-only" {...registration} />
              <span>{opt}</span>
              <span
                aria-hidden
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center border transition-colors",
                  multi ? "rounded-md" : "rounded-full",
                  on ? "border-gold bg-gold" : "border-white/20",
                )}
              >
                {on &&
                  (multi ? (
                    <Check strokeWidth={3.5} className="h-3 w-3 text-[#140d00]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#140d00]" />
                  ))}
              </span>
            </label>
          );
        })}
      </div>
      <ErrorText id={errId} message={error} />
    </fieldset>
  );
}

function Success({ url, classificacao }: Result) {
  const isC = classificacao === "C";
  const needsButton = !isC || !siteConfig.leadWebhookUrl;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex min-h-[420px] flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
    >
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className="relative grid h-20 w-20 place-items-center rounded-full bg-gold shadow-[0_0_60px_-5px_rgba(247,181,44,0.7)]"
      >
        <CheckCircle2 aria-hidden className="h-10 w-10 text-[#140d00]" />
      </motion.span>
      {isC ? (
        <>
          <h3 className="font-display mt-7 text-3xl font-extrabold tracking-[-0.02em] text-ink">Recebemos suas respostas!</h3>
          <p className="mt-3 max-w-sm text-muted">Vamos analisar o melhor momento para sua empresa e te chamar no WhatsApp.</p>
        </>
      ) : (
        <>
          <h3 className="font-display mt-7 text-3xl font-extrabold tracking-[-0.02em] text-ink">Pronto! Abrindo o WhatsApp…</h3>
          <p className="mt-3 max-w-sm text-muted">Já estamos te esperando do outro lado.</p>
          <div className="mt-6 flex items-center gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-gold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </>
      )}
      {needsButton && (
        <Button href={url} className="mt-8 w-full sm:w-auto">
          <span className="inline-flex items-center gap-2">
            <MessageCircle aria-hidden className="h-5 w-5" /> Abrir WhatsApp
          </span>
        </Button>
      )}
    </motion.div>
  );
}
