import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import { site, brands } from '../../config/site'
import { isValidBrPhone, maskPhone } from '../../lib/phone'
import { IntegrationNotConfigured, submitLead } from '../../lib/leads'
import { Text3D } from '../ui/Text3D'

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured'
type Errors = Partial<Record<'nome' | 'whatsapp' | 'veiculo' | 'usado' | 'consent', string>>

const field = 'w-full rounded border border-white/15 bg-black/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40'

export function LeadForm() {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [veiculo, setVeiculo] = useState('')
  const [usado, setUsado] = useState<'sim' | 'nao' | ''>('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const validate = (): Errors => {
    const e: Errors = {}
    if (nome.trim().split(/\s+/).filter(Boolean).length < 2 || nome.trim().length < 5) e.nome = 'Informe seu nome completo.'
    if (!isValidBrPhone(whatsapp)) e.whatsapp = 'Informe um WhatsApp válido com DDD.'
    if (veiculo.trim().length < 2) e.veiculo = 'Diga qual veículo te interessa.'
    if (!usado) e.usado = 'Selecione uma opção.'
    if (!consent) e.consent = 'É necessário autorizar o contato para continuar.'
    return e
  }

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const form = new FormData(ev.currentTarget)
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = ev.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitLead({
        nome: nome.trim(),
        whatsapp: whatsapp.replace(/\D/g, ''),
        veiculoInteresse: veiculo.trim(),
        possuiUsado: usado as 'sim' | 'nao',
        consentimento: true,
        campanha: String(form.get('campanha')),
        origem: window.location.href,
        enviadoEm: new Date().toISOString(),
      })
      setStatus('success')
    } catch (err) {
      setStatus(err instanceof IntegrationNotConfigured ? 'unconfigured' : 'error')
    }
  }

  const Err = ({ id, msg }: { id: string; msg?: string }) =>
    msg ? <p id={id} role="alert" className="mt-1 text-xs font-semibold text-red-400">{msg}</p> : null

  return (
    <section id="formulario" aria-labelledby="form-titulo" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgba(255,106,0,.18), transparent 70%)' }} />
      <div className="relative mx-auto max-w-2xl">
        <div className="text-center" data-reveal>
          <h2 id="form-titulo" className="text-[clamp(1.6rem,6vw,3.2rem)]"><Text3D text="SEU PRÓXIMO CARRO ESTÁ AQUI" variant="chrome" onView /></h2>
          <p className="mt-5 text-steel">Preencha seus dados e fale com nossa equipe para conhecer as condições especiais do Mega Feirão.</p>
        </div>

        <div className="glass glow-border relative mt-10 rounded-lg p-6 sm:p-9" data-reveal>
          <i className="hud-corner hud-tl" /><i className="hud-corner hud-tr" /><i className="hud-corner hud-bl" /><i className="hud-corner hud-br" />
          {status === 'success' ? (
            <div className="py-10 text-center" role="status">
              <CheckCircle2 className="mx-auto text-brand" size={56} aria-hidden="true" />
              <p className="mt-4 font-display text-xl font-black">RECEBEMOS SEUS DADOS!</p>
              <p className="mt-2 text-steel">Nossa equipe da Multi Car entrará em contato pelo WhatsApp com as condições do Mega Feirão.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <input type="hidden" name="campanha" value={site.campaignId} />

              <div>
                <label htmlFor="lead-nome" className="mb-1 block text-xs font-bold tracking-widest text-steel">NOME COMPLETO</label>
                <input id="lead-nome" name="nome" autoComplete="name" className={field} value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'e-nome' : undefined} placeholder="Seu nome completo" />
                <Err id="e-nome" msg={errors.nome} />
              </div>

              <div>
                <label htmlFor="lead-whats" className="mb-1 block text-xs font-bold tracking-widest text-steel">WHATSAPP</label>
                <input id="lead-whats" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" className={field} value={whatsapp} onChange={(e) => setWhatsapp(maskPhone(e.target.value))} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? 'e-whats' : undefined} placeholder="(00) 00000-0000" />
                <Err id="e-whats" msg={errors.whatsapp} />
              </div>

              <div>
                <label htmlFor="lead-veiculo" className="mb-1 block text-xs font-bold tracking-widest text-steel">VEÍCULO DE INTERESSE</label>
                <input id="lead-veiculo" name="veiculo" list="marcas" className={field} value={veiculo} onChange={(e) => setVeiculo(e.target.value)} aria-invalid={!!errors.veiculo} aria-describedby={errors.veiculo ? 'e-veiculo' : undefined} placeholder="Marca ou modelo" />
                <datalist id="marcas">{brands.map((b) => <option key={b} value={b} />)}</datalist>
                <Err id="e-veiculo" msg={errors.veiculo} />
              </div>

              <fieldset aria-describedby={errors.usado ? 'e-usado' : undefined}>
                <legend className="mb-2 block text-xs font-bold tracking-widest text-steel">POSSUI VEÍCULO USADO PARA TROCA?</legend>
                <div className="grid grid-cols-2 gap-3">
                  {(['sim', 'nao'] as const).map((v) => (
                    <label key={v} className={`cursor-pointer rounded border px-4 py-3 text-center text-sm font-bold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${usado === v ? 'border-brand bg-brand/15 text-white' : 'border-white/15 text-steel hover:border-brand/60'}`}>
                      <input type="radio" name="usado" value={v} checked={usado === v} onChange={() => setUsado(v)} className="sr-only" aria-invalid={!!errors.usado} />
                      {v === 'sim' ? 'SIM' : 'NÃO'}
                    </label>
                  ))}
                </div>
                <Err id="e-usado" msg={errors.usado} />
              </fieldset>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-steel">
                  <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#FF6A00]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'e-consent' : undefined} />
                  <span>
                    Autorizo a Multi Car Veículos a entrar em contato comigo e a tratar meus dados pessoais para esta finalidade
                    {site.contacts.privacyUrl ? <> (<a className="text-brand underline" href={site.contacts.privacyUrl} target="_blank" rel="noopener noreferrer">Política de Privacidade</a>)</> : null}.
                  </span>
                </label>
                <Err id="e-consent" msg={errors.consent} />
              </div>

              <button type="submit" className="cta w-full" disabled={status === 'sending'}>
                {status === 'sending' ? <><Loader2 className="animate-spin" size={18} aria-hidden="true" /> ENVIANDO...</> : 'QUERO RECEBER AS OFERTAS'}
              </button>

              <div aria-live="polite">
                {status === 'unconfigured' && (
                  <p className="flex items-start gap-2 rounded border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    O envio ainda não está configurado (defina VITE_LEAD_WEBHOOK_URL). Nenhum dado foi enviado.
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-start gap-2 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Não foi possível enviar agora. Tente novamente em instantes.
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
