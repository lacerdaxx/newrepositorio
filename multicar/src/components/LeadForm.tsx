import { useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { gsap, whenMotionOk } from '../lib/gsap'
import { WEBHOOK_URL, WHATSAPP, maskPhone, sendLead, validName, validPhone } from '../lib/lead'

const interests = ['BYD', 'Citroën', 'Peugeot', 'Ford', 'Nissan', 'Semi-novos', 'Ainda não sei']

type Errors = Partial<Record<'nome' | 'whatsapp' | 'veiculo' | 'consent', string>>
type Status = 'idle' | 'sending' | 'ok' | 'error' | 'unconfigured'

export function LeadForm() {
  const root = useRef<HTMLElement>(null)
  const uid = useId()
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [veiculo, setVeiculo] = useState('')
  const [troca, setTroca] = useState<'sim' | 'nao'>('nao')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [honey, setHoney] = useState('')

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    return whenMotionOk(el, () => {
      const q = gsap.utils.selector(el)
      gsap.from(q('[data-l]'), { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: el, start: 'top 70%' } })
      gsap.from(q('[data-f]'), { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: q('form')[0], start: 'top 80%' } })
      gsap.from(q('[data-vrule]'), { scaleY: 0, transformOrigin: 'top', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 70%' } })
    })
  }, [])

  function validate(): Errors {
    const e: Errors = {}
    if (!validName(nome)) e.nome = 'Informe nome e sobrenome.'
    if (!validPhone(whatsapp)) e.whatsapp = 'Informe um WhatsApp válido com DDD.'
    if (!veiculo) e.veiculo = 'Selecione um veículo de interesse.'
    if (!consent) e.consent = 'É necessário autorizar o contato para continuar.'
    return e
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (honey) return // bot
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0]
      root.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus()
      return
    }
    if (!WEBHOOK_URL) {
      console.warn('[lead] VITE_LEAD_WEBHOOK_URL não configurada — nenhum dado foi enviado.')
      setStatus('unconfigured')
      return
    }
    setStatus('sending')
    try {
      await sendLead({ nome: nome.trim(), whatsapp, veiculo_interesse: veiculo, possui_usado_troca: troca, consentimento_lgpd: consent })
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  const err = (k: keyof Errors) => (errors[k] ? `${uid}-${k}` : undefined)

  return (
    <section id="cadastro" ref={root} className="relative bg-ink py-24 md:py-40">
      <div className="mx-auto grid max-w-[1680px] gap-16 px-5 md:grid-cols-12 md:gap-8 md:px-10">
        <div className="md:col-span-6">
          <p className="mono text-ember">Cadastro</p>
          <h2 className="display mt-8 text-[clamp(3.4rem,9.4vw,11rem)]">
            <span className="line-mask"><span data-l className="block">Seu próximo</span></span>
            <span className="line-mask"><span data-l className="block">carro começa</span></span>
            <span className="line-mask"><span data-l className="block text-ember">aqui.</span></span>
          </h2>
          <p className="mt-10 max-w-md text-lg leading-relaxed text-bone/75">
            Cadastre seu interesse e receba informações sobre as condições especiais do Mega Feirão de Aniversário da Multi Car Veículos.
          </p>
          <p className="mono mt-8 text-steel">13 — 14 — 15 Novembro<br />Multi Car Veículos | Luziânia-GO</p>
        </div>

        <div className="relative md:col-span-5 md:col-start-8 md:pl-10">
          <div data-vrule className="absolute inset-y-0 left-0 hidden w-px bg-white/15 md:block" />

          {status === 'ok' ? (
            <div role="status" className="py-10">
              <p className="mono text-ember">Recebido</p>
              <p className="display mt-4 text-6xl">Obrigado, {nome.trim().split(' ')[0]}.</p>
              <p className="mt-6 text-lg text-bone/75">Seu interesse foi registrado. Nossa equipe entrará em contato pelo WhatsApp informado.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-describedby={`${uid}-status`}>
              <div data-f className="field" data-invalid={!!errors.nome}>
                <label htmlFor={`${uid}-nome`} className="mono text-steel">Nome completo</label>
                <input id={`${uid}-nome`} data-field="nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" placeholder="Seu nome e sobrenome" aria-invalid={!!errors.nome} aria-describedby={err('nome')} />
              </div>
              {errors.nome && <p id={err('nome')} className="mono mt-2 text-[#ff6b6f]">{errors.nome}</p>}

              <div data-f className="field mt-6" data-invalid={!!errors.whatsapp}>
                <label htmlFor={`${uid}-wa`} className="mono text-steel">WhatsApp</label>
                <input id={`${uid}-wa`} data-field="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(maskPhone(e.target.value))} inputMode="tel" autoComplete="tel-national" placeholder="(61) 90000-0000" aria-invalid={!!errors.whatsapp} aria-describedby={err('whatsapp')} />
              </div>
              {errors.whatsapp && <p id={err('whatsapp')} className="mono mt-2 text-[#ff6b6f]">{errors.whatsapp}</p>}

              <div data-f className="field mt-6" data-invalid={!!errors.veiculo}>
                <label htmlFor={`${uid}-v`} className="mono text-steel">Veículo de interesse</label>
                <select id={`${uid}-v`} data-field="veiculo" value={veiculo} onChange={(e) => setVeiculo(e.target.value)} aria-invalid={!!errors.veiculo} aria-describedby={err('veiculo')}>
                  <option value="">Selecione</option>
                  {interests.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              {errors.veiculo && <p id={err('veiculo')} className="mono mt-2 text-[#ff6b6f]">{errors.veiculo}</p>}

              <fieldset data-f className="field mt-6 pb-5">
                <legend className="legend mono text-steel">Possui veículo usado para troca?</legend>
                <div className="mt-3 flex gap-3">
                  {(['sim', 'nao'] as const).map((v) => (
                    <label key={v} className={`cursor-pointer border px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${troca === v ? 'border-ember bg-ember text-ink' : 'border-white/25 text-bone/80 hover:border-bone'}`}>
                      <input type="radio" name="troca" value={v} checked={troca === v} onChange={() => setTroca(v)} className="sr-only" />
                      {v === 'sim' ? 'Sim' : 'Não'}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} name="website" />
              </div>

              <div data-f className="mt-8">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-bone/70">
                  <input type="checkbox" data-field="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={err('consent')} className="mt-1 h-4 w-4 shrink-0 accent-[#F36B21]" />
                  <span>Autorizo a Multi Car Veículos a tratar meus dados pessoais e a entrar em contato por WhatsApp, telefone ou e-mail sobre as ofertas do Mega Feirão, conforme a LGPD (Lei 13.709/2018).</span>
                </label>
                {errors.consent && <p id={err('consent')} className="mono mt-2 text-[#ff6b6f]">{errors.consent}</p>}
              </div>

              <div data-f className="mt-10">
                <button type="submit" className="btn-ember w-full justify-between md:w-auto" disabled={status === 'sending'}>
                  <span>{status === 'sending' ? 'Enviando…' : 'Quero receber as ofertas'}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </button>
              </div>

              <div id={`${uid}-status`} role="status" aria-live="polite" className="mt-6 text-sm leading-relaxed">
                {status === 'error' && <p className="text-[#ff6b6f]">Não foi possível enviar agora. Tente novamente em instantes.</p>}
                {status === 'unconfigured' && (
                  <p className="text-bone/80">
                    O envio online ainda não está ativo nesta página, então seus dados não foram enviados.
                    {WHATSAPP && <> Fale agora com a gente: <a className="text-ember underline underline-offset-4" href={`https://wa.me/${WHATSAPP}`}>WhatsApp</a>.</>}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
