"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type FieldPath, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import SectionHeading from "./ui/SectionHeading";
import Button from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { whatsappLink } from "@/config/site";
import { trackLead } from "@/lib/pixel";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

const SERVICOS = ["Pintura", "Piso", "Reforma geral", "Cozinha/Banheiro", "Siding/Telhado", "Outro"] as const;
const ESTADOS = ["MA", "FL", "NJ", "CT", "GA", "NY", "Outro"] as const;
const FATURAMENTOS = ["Até US$ 20 mil", "US$ 20–50 mil", "US$ 50–100 mil", "Mais de US$ 100 mil"] as const;
const ORIGENS = ["Indicação", "Sub", "Anúncio", "Misto"] as const;
const DDIS = { "+1": { label: "🇺🇸 +1", digits: [10], placeholder: "(555) 123-4567" }, "+55": { label: "🇧🇷 +55", digits: [10, 11], placeholder: "(11) 91234-5678" } } as const;

const schema = z
  .object({
    servico: z.enum(SERVICOS, { error: "Escolha o principal serviço." }),
    estado: z.enum(ESTADOS, { error: "Escolha o estado." }),
    faturamento: z.enum(FATURAMENTOS, { error: "Escolha a faixa de faturamento." }),
    origem: z.enum(ORIGENS, { error: "Escolha de onde vêm seus clientes." }),
    nome: z.string().trim().min(2, "Digite seu nome."),
    empresa: z.string().trim().min(2, "Digite o nome da empresa."),
    ddi: z.enum(["+1", "+55"]),
    telefone: z.string(),
  })
  .superRefine((v, ctx) => {
    const n = v.telefone.replace(/\D/g, "").length;
    if (!(DDIS[v.ddi].digits as readonly number[]).includes(n)) {
      ctx.addIssue({ code: "custom", path: ["telefone"], message: "Digite um WhatsApp válido com DDD/área." });
    }
  });

type FormData = z.infer<typeof schema>;

const STEPS: { title: string; fields: FieldPath<FormData>[] }[] = [
  { title: "Sua empresa", fields: ["servico", "estado"] },
  { title: "Seu momento", fields: ["faturamento", "origem"] },
  { title: "Seus dados", fields: ["nome", "empresa", "ddi", "telefone"] },
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

export function buildMessage(d: FormData) {
  return [
    "Olá, BuildScale! Quero meu diagnóstico gratuito.",
    `Nome: ${d.nome.trim()} | Empresa: ${d.empresa.trim()}`,
    `Serviço: ${d.servico} | Estado: ${d.estado}`,
    `Faturamento: ${d.faturamento} | Clientes vêm de: ${d.origem}`,
  ].join("\n");
}

export default function DiagnosticForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [waUrl, setWaUrl] = useState<string | null>(null);
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
    defaultValues: { ddi: "+1", telefone: "", nome: "", empresa: "" },
  });

  const ddi = watch("ddi");

  useEffect(() => {
    if (!touched.current) return;
    headingRef.current?.focus({ preventScroll: true });
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
    trackLead();
    const url = whatsappLink(buildMessage(data));
    setWaUrl(url);
    window.requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    window.setTimeout(() => {
      window.location.href = url;
    }, 1400);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) void next();
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
              Agende seu <span className="text-gold">diagnóstico gratuito</span>
            </>
          }
          subtitle="Em 30 minutos mostramos quantos orçamentos sua empresa pode gerar por mês e quanto investir."
        />

        <Reveal className="mx-auto mt-10 max-w-2xl md:mt-14">
          <div ref={cardRef} className="glass relative overflow-hidden rounded-3xl border-white/10 bg-[#121212]/80 p-5 shadow-[0_40px_120px_-50px_rgba(247,181,44,0.35)] sm:p-8 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {waUrl ? (
                <Success key="ok" url={waUrl} />
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                  {/* Progresso */}
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em]">
                    <span className="text-gold">
                      Etapa {step + 1} de {STEPS.length}
                    </span>
                    <span className="text-muted">{STEPS[step].title}</span>
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

                  <div className="relative mt-8 min-h-[380px] sm:min-h-[340px]">
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={step}
                        custom={dir}
                        initial={{ opacity: 0, x: dir * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: dir * -40 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                          Etapa {step + 1}: {STEPS[step].title}
                        </h3>

                        {step === 0 && (
                          <div className="space-y-8">
                            <OptionGroup
                              legend="Qual o principal serviço da sua empresa?"
                              options={SERVICOS}
                              error={errors.servico?.message}
                              registration={register("servico")}
                              selected={watch("servico")}
                              cols="grid-cols-2 sm:grid-cols-3"
                            />
                            <OptionGroup
                              legend="Em qual estado você atende?"
                              options={ESTADOS}
                              error={errors.estado?.message}
                              registration={register("estado")}
                              selected={watch("estado")}
                              cols="grid-cols-4 sm:grid-cols-7"
                              compact
                            />
                          </div>
                        )}

                        {step === 1 && (
                          <div className="space-y-8">
                            <OptionGroup
                              legend="Qual o faturamento mensal da empresa?"
                              options={FATURAMENTOS}
                              error={errors.faturamento?.message}
                              registration={register("faturamento")}
                              selected={watch("faturamento")}
                              cols="grid-cols-1 sm:grid-cols-2"
                            />
                            <OptionGroup
                              legend="Hoje, de onde vêm seus clientes?"
                              options={ORIGENS}
                              error={errors.origem?.message}
                              registration={register("origem")}
                              selected={watch("origem")}
                              cols="grid-cols-2 sm:grid-cols-4"
                            />
                          </div>
                        )}

                        {step === 2 && (
                          <div className="space-y-5">
                            <Field label="Seu nome" id="nome" error={errors.nome?.message}>
                              <input
                                id="nome"
                                autoComplete="name"
                                placeholder="Como podemos te chamar?"
                                className={inputCls(!!errors.nome)}
                                aria-invalid={!!errors.nome}
                                aria-describedby={errors.nome ? "nome-erro" : undefined}
                                {...register("nome")}
                              />
                            </Field>
                            <Field label="Nome da empresa" id="empresa" error={errors.empresa?.message}>
                              <input
                                id="empresa"
                                autoComplete="organization"
                                placeholder="Ex.: Silva Painting LLC"
                                className={inputCls(!!errors.empresa)}
                                aria-invalid={!!errors.empresa}
                                aria-describedby={errors.empresa ? "empresa-erro" : undefined}
                                {...register("empresa")}
                              />
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
                            <p className="flex items-center gap-2 pt-1 text-xs text-muted">
                              <Lock aria-hidden className="h-3.5 w-3.5" /> Seus dados ficam só com a BuildScale. Sem spam.
                            </p>
                          </div>
                        )}
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
                    {step < STEPS.length - 1 ? (
                      <Button type="submit" className="w-full sm:w-auto">
                        Continuar <ArrowRight aria-hidden className="ml-1 inline h-[18px] w-[18px]" />
                      </Button>
                    ) : (
                      <Button type="submit" arrow disabled={isSubmitting} className="w-full sm:w-auto">
                        Quero meu diagnóstico
                      </Button>
                    )}
                  </div>
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
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-sm font-medium text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function OptionGroup({
  legend,
  options,
  error,
  registration,
  selected,
  cols,
  compact,
}: {
  legend: string;
  options: readonly string[];
  error?: string;
  registration: UseFormRegisterReturn;
  selected?: string;
  cols: string;
  compact?: boolean;
}) {
  const errId = `${registration.name}-erro`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="mb-3 text-base font-semibold text-ink">{legend}</legend>
      <div className={cn("grid gap-2.5", cols)}>
        {options.map((opt) => {
          const on = selected === opt;
          return (
            <label
              key={opt}
              className={cn(
                "relative flex min-h-[52px] cursor-pointer select-none items-center rounded-xl border text-sm font-medium transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold/70 sm:text-[15px]",
                compact ? "justify-center px-2 text-center" : "justify-between gap-2 px-3 sm:px-4",
                on
                  ? "border-gold/70 bg-gold/[0.09] text-ink shadow-[0_0_0_1px_rgba(247,181,44,0.25),0_10px_30px_-12px_rgba(247,181,44,0.4)]"
                  : "border-white/10 bg-white/[0.02] text-[#D4D4D8] hover:border-white/25 hover:bg-white/[0.04]",
              )}
            >
              <input type="radio" value={opt} className="sr-only" {...registration} />
              <span>{opt}</span>
              {!compact && (
                <span
                  aria-hidden
                  className={cn(
                    "hidden h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors sm:grid",
                    on ? "border-gold bg-gold" : "border-white/20",
                  )}
                >
                  {on && <span className="h-1.5 w-1.5 rounded-full bg-[#140d00]" />}
                </span>
              )}
            </label>
          );
        })}
      </div>
      <ErrorText id={errId} message={error} />
    </fieldset>
  );
}

function Success({ url }: { url: string }) {
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
      <h3 className="font-display mt-7 text-3xl font-extrabold tracking-[-0.02em] text-ink">Pronto! Abrindo o WhatsApp…</h3>
      <p className="mt-3 max-w-sm text-muted">Sua mensagem já vai preenchida. É só tocar em enviar e a gente responde rapidinho.</p>
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
      <Button href={url} className="mt-8 w-full sm:w-auto">
        <span className="inline-flex items-center gap-2">
          <MessageCircle aria-hidden className="h-5 w-5" /> Abrir WhatsApp
        </span>
      </Button>
    </motion.div>
  );
}
