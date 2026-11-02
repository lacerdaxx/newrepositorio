import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'
import { site, brands } from '../../config/site'
import { isValidBrPhone, maskPhone } from '../../lib/phone'
import { IntegrationNotConfigured, submitLead } from '../../lib/leads'
import { Text3D } from '../ui/Text3D'

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured'
type Errors = Partial<Record<'nome' | 'whatsapp' | 'veiculo' | 'usado' | 'consent', string>>

const field = 'fld'

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
    msg ? <p id={id} role="alert" className="mt-1 font-cond text-sm font-bold tracking-wider text-red-400">{msg}</p> : null
  const lbl = 'mb-1 block font-cond text-xs font-extrabold tracking-[0.35em] text-brand'

  return (
    <section id="formulario" aria-labelledby="form-titulo" className="relative overflow-hidden bg-ink px-4 py-20 sm:px-8 sm:py-32">
      <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-brand/20 blur-[140px]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div data-reveal>
          <h2 id="form-titulo" className="text-[clamp(3rem,10vw,8.5rem)] leading-[0.88]"><Text3D text="SEU PRÓXIMO CARRO ESTÁ AQUI" variant="chrome" onView /></h2>
          <p className="mt-8 max-w-md border-l-4 border-brand pl-5 text-lg text-steel">Preencha seus dados e fale com nossa equipe para conhecer as condições especiais do Mega Feirão.</p>
        </div>

        <div className="relative bg-coal p-6 sm:p-10" data-reveal style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)' }}>
          <span className="absolute inset-y-0 left-0 w-1.5 bg-brand" aria-hidden="true" />
          {status === 'success' ? (
            <div className="py-12" role="status">
              <CheckCircle2 className="text-brand" size={56} aria-hidden="true" />
              <p className="mt-4 font-display text-4xl">RECEBEMOS SEUS DADOS!</p>
              <p className="mt-3 text-steel">Nossa equipe da Multi Car entrará em contato pelo WhatsApp com as condições do Mega Feirão.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-7">
              <input type="hidden" name="campanha" value={site.campaignId} />
              <div>
                <label htmlFor="lead-nome" className={lbl}>NOME COMPLETO</label>
                <input id="lead-nome" name="nome" autoComplete="name" className={field} value={nome} onChange={(e) => setNome(e.target.value)} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'e-nome' : undefined} placeholder="Seu nome completo" />
                <Err id="e-nome" msg={errors.nome} />
              </div>
              <div>
                <label htmlFor="lead-whats" className={lbl}>WHATSAPP</label>
                <input id="lead-whats" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" className={field} value={whatsapp} onChange={(e) => setWhatsapp(maskPhone(e.target.value))} aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? 'e-whats' : undefined} placeholder="(00) 00000-0000" />
                <Err id="e-whats" msg={errors.whatsapp} />
              </div>
              <div>
                <label htmlFor="lead-veiculo" className={lbl}>VEÍCULO DE INTERESSE</label>
                <input id="lead-veiculo" name="veiculo" list="marcas" className={field} value={veiculo} onChange={(e) => setVeiculo(e.target.value)} aria-invalid={!!errors.veiculo} aria-describedby={errors.veiculo ? 'e-veiculo' : undefined} placeholder="Marca ou modelo" />
                <datalist id="marcas">{brands.map((b) => <option key={b} value={b} />)}</datalist>
                <Err id="e-veiculo" msg={errors.veiculo} />
              </div>
              <fieldset aria-describedby={errors.usado ? 'e-usado' : undefined}>
                <legend className={lbl}>POSSUI VEÍCULO USADO PARA TROCA?</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(['sim', 'nao'] as const).map((v) => (
                    <label key={v} className={`cursor-pointer -skew-x-12 border-2 px-4 py-3 text-center font-display text-2xl tracking-wider transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${usado === v ? 'border-brand bg-brand text-black' : 'border-white/25 text-white/60 hover:border-brand'}`}>
                      <input type="radio" name="usado" value={v} checked={usado === v} onChange={() => setUsado(v)} className="sr-only" aria-invalid={!!errors.usado} />
                      <span className="inline-block skew-x-12">{v === 'sim' ? 'SIM' : 'NÃO'}</span>
                    </label>
                  ))}
                </div>
                <Err id="e-usado" msg={errors.usado} />
              </fieldset>
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-steel">
                  <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-[#FF6A00]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'e-consent' : undefined} />
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
                  <p className="flex items-start gap-2 border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    O envio ainda não está configurado (defina VITE_LEAD_WEBHOOK_URL). Nenhum dado foi enviado.
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-start gap-2 border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
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
