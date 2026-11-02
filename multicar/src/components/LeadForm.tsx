import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { maskPhone, sendLead, validateName, validatePhone, type SendResult } from '../lib/lead'
import { whatsappLink } from '../config'

type Errors = Partial<Record<'nome' | 'whatsapp' | 'veiculo' | 'troca' | 'consent', string>>
type Status = 'idle' | 'sending' | 'done' | SendResult

export default function LeadForm() {
  const uid = useId()
  const [nome, setNome] = useState('')
  const [whats, setWhats] = useState('')
  const [veiculo, setVeiculo] = useState('')
  const [troca, setTroca] = useState<'' | 'sim' | 'nao'>('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (): Errors => {
    const e: Errors = {}
    const n = validateName(nome); if (n) e.nome = n
    const p = validatePhone(whats); if (p) e.whatsapp = p
    if (veiculo.trim().length < 2) e.veiculo = 'Diga qual veículo te interessa.'
    if (!troca) e.troca = 'Selecione uma opção.'
    if (!consent) e.consent = 'É necessário autorizar o contato para continuar.'
    return e
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (honeypot.current?.value) return // robô
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = formRef.current?.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"]')
      first?.focus()
      return
    }
    setStatus('sending')
    const r = await sendLead({
      nome: nome.trim().replace(/\s+/g, ' '),
      whatsapp: whats,
      veiculoInteresse: veiculo.trim(),
      possuiUsadoParaTroca: troca as 'sim' | 'nao',
      consentimentoLGPD: consent,
    })
    if (r.ok) {
      setStatus('done')
      setNome(''); setWhats(''); setVeiculo(''); setTroca(''); setConsent(false)
    } else {
      setStatus(r)
    }
  }

  const wa = whatsappLink('Olá! Vi o Mega Feirão de Aniversário da Multi Car e quero saber mais sobre as ofertas.')
  const sending = status === 'sending'
  const failure = typeof status === 'object' && !status.ok ? status.reason : null

  return (
    <section id="cadastro" aria-labelledby="cadastro-titulo" className="relative bg-graphite py-24 md:py-40">
      <div className="gutter grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="mono flex items-center gap-4 text-steel" data-rise>
            <span className="text-ember">05</span>
            <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          </div>
          <h2 id="cadastro-titulo" className="display mt-12 text-[clamp(3.2rem,8vw,7.4rem)]" data-rise>
            Seu próximo
            <br />
            carro começa
            <br />
            <span className="text-ember">aqui.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/75" data-rise>
            Cadastre seu interesse e receba informações sobre as condições especiais do Mega Feirão de Aniversário da Multi Car Veículos.
          </p>
        </div>

        <div className="md:col-span-6 md:col-start-7" data-rise>
          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="ok"
                role="status"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="border-t-2 border-ember pt-8"
              >
                <p className="display text-5xl md:text-7xl">Cadastro <span className="text-ember">recebido.</span></p>
                <p className="mt-6 max-w-md text-bone/75">
                  Obrigado! Nossa equipe entrará em contato pelo WhatsApp informado com as condições do Mega Feirão.
                </p>
                {wa && (
                  <a className="btn-ember mt-8" href={wa} target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp <span className="arrow" aria-hidden="true">→</span>
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                aria-describedby={`${uid}-status`}
              >
                {/* honeypot anti-robô */}
                <div aria-hidden="true" className="absolute -left-[9999px]">
                  <label>Não preencha<input ref={honeypot} type="text" tabIndex={-1} autoComplete="off" name="website" /></label>
                </div>

                <div className="field" data-invalid={!!errors.nome}>
                  <label htmlFor={`${uid}-nome`}>Nome completo</label>
                  <input id={`${uid}-nome`} type="text" name="name" autoComplete="name" value={nome}
                    onChange={(e) => setNome(e.target.value)} placeholder="Como está no seu documento"
                    aria-invalid={!!errors.nome} aria-describedby={`${uid}-nome-e`} />
                  <p id={`${uid}-nome-e`} className="err" role={errors.nome ? 'alert' : undefined}>{errors.nome}</p>
                </div>

                <div className="field" data-invalid={!!errors.whatsapp}>
                  <label htmlFor={`${uid}-wa`}>WhatsApp</label>
                  <input id={`${uid}-wa`} type="tel" inputMode="numeric" name="tel" autoComplete="tel-national" value={whats}
                    onChange={(e) => setWhats(maskPhone(e.target.value))} placeholder="(61) 99999-9999"
                    aria-invalid={!!errors.whatsapp} aria-describedby={`${uid}-wa-e`} />
                  <p id={`${uid}-wa-e`} className="err" role={errors.whatsapp ? 'alert' : undefined}>{errors.whatsapp}</p>
                </div>

                <div className="field" data-invalid={!!errors.veiculo}>
                  <label htmlFor={`${uid}-v`}>Veículo de interesse</label>
                  <input id={`${uid}-v`} type="text" name="vehicle" value={veiculo}
                    onChange={(e) => setVeiculo(e.target.value)} placeholder="Modelo, marca ou tipo de carro"
                    aria-invalid={!!errors.veiculo} aria-describedby={`${uid}-v-e`} />
                  <p id={`${uid}-v-e`} className="err" role={errors.veiculo ? 'alert' : undefined}>{errors.veiculo}</p>
                </div>

                <fieldset className="field m-0 border-0 p-0 pt-[1.35rem]" data-invalid={!!errors.troca}>
                  <legend className="legend p-0">Possui veículo usado para troca?</legend>
                  <div className="seg">
                    {(['sim', 'nao'] as const).map((v) => (
                      <label key={v}>
                        <input type="radio" name="troca" value={v} checked={troca === v} onChange={() => setTroca(v)} />
                        <span>{v === 'sim' ? 'SIM' : 'NÃO'}</span>
                      </label>
                    ))}
                  </div>
                  <p className="err" role={errors.troca ? 'alert' : undefined}>{errors.troca}</p>
                </fieldset>

                <div className="mt-2" data-invalid={!!errors.consent}>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-bone/70">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#F36B21]" aria-invalid={!!errors.consent} />
                    <span>
                      Autorizo a Multi Car Veículos a tratar meus dados pessoais (nome, WhatsApp e interesse) e a entrar em contato
                      para apresentar as condições do Mega Feirão de Aniversário, nos termos da LGPD (Lei 13.709/2018).
                    </span>
                  </label>
                  <p className="err" role={errors.consent ? 'alert' : undefined}>{errors.consent}</p>
                </div>

                <div className="mt-8">
                  <button type="submit" className="btn-ember w-full justify-between" disabled={sending}>
                    {sending ? 'Enviando…' : 'Quero receber as ofertas'} <span className="arrow" aria-hidden="true">→</span>
                  </button>
                </div>

                <div id={`${uid}-status`} aria-live="polite" className="mt-5 min-h-6 text-sm">
                  {failure === 'not-configured' && (
                    <p className="border-l-2 border-ember pl-3 text-bone/80">
                      O envio de cadastros ainda não está ativo neste site (webhook não configurado). Seus dados não foram enviados.
                      {wa && <> Fale conosco direto pelo <a className="underline decoration-ember underline-offset-4" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>.</>}
                    </p>
                  )}
                  {failure === 'network' && <p className="border-l-2 border-[#e5484d] pl-3">Sem conexão com o servidor. Verifique sua internet e tente novamente.</p>}
                  {failure === 'server' && <p className="border-l-2 border-[#e5484d] pl-3">Não foi possível registrar seu cadastro agora. Tente novamente em instantes.</p>}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
