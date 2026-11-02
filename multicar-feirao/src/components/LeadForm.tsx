import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BRANDS, WHATSAPP } from '../data/content'
import { isLeadIntegrationConfigured, sendLead } from '../lib/lead'
import { isValidMobile, maskPhone, toE164 } from '../lib/phone'

type Errors = Partial<Record<'name' | 'whatsapp' | 'vehicle' | 'trade' | 'consent', string>>
type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'not-configured'

export const CONSENT_TEXT =
  'Autorizo a Multi Car Veículos a tratar meus dados (nome, WhatsApp e veículo de interesse) para entrar em contato com informações sobre o Mega Feirão de Aniversário, nos termos da LGPD.'

export function LeadForm() {
  const uid = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [trade, setTrade] = useState<'sim' | 'nao' | ''>('')
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  const validate = (): Errors => {
    const e: Errors = {}
    const parts = name.trim().split(/\s+/).filter((p) => p.length > 1)
    if (parts.length < 2) e.name = 'Informe nome e sobrenome.'
    if (!isValidMobile(phone)) e.whatsapp = 'Informe um WhatsApp válido com DDD. Ex.: (61) 99999-9999'
    if (vehicle.trim().length < 2) e.vehicle = 'Diga qual veículo ou marca você procura.'
    if (!trade) e.trade = 'Selecione uma opção.'
    if (!consent) e.consent = 'É necessário autorizar o contato para enviar.'
    return e
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (hp) return // honeypot: bots
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    const result = await sendLead({
      name: name.trim(),
      whatsapp: toE164(phone),
      vehicleInterest: vehicle.trim(),
      hasTradeIn: trade === 'sim',
      consent: true,
      consentText: CONSENT_TEXT,
    })
    setStatus(result === 'sent' ? 'sent' : result)
  }

  const waLink = WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Quero receber as ofertas do Mega Feirão de Aniversário da Multi Car.')}` : ''

  if (status === 'sent') {
    return (
      <motion.div role="status" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="border-t-2 border-brand pt-8">
        <p className="mono text-brand">Cadastro recebido</p>
        <p className="font-display mt-4 text-[clamp(2.6rem,5vw,4.4rem)]">Obrigado, {name.trim().split(/\s+/)[0]}.</p>
        <p className="mt-4 max-w-md text-lg text-bone/80">Nossa equipe vai falar com você pelo WhatsApp com as condições do Mega Feirão de Aniversário.</p>
      </motion.div>
    )
  }

  const err = (k: keyof Errors) => (errors[k] ? <p id={`${uid}-${k}-err`} className="err" role="alert">{errors[k]}</p> : null)
  const aria = (k: keyof Errors) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-9" aria-label="Cadastro de interesse">
      <div className="field" data-invalid={!!errors.name}>
        <label htmlFor={`${uid}-name`}>Nome completo</label>
        <input id={`${uid}-name`} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome e sobrenome" {...aria('name')} />
        <span className="bar" />
        {err('name')}
      </div>

      <div className="field" data-invalid={!!errors.whatsapp}>
        <label htmlFor={`${uid}-whatsapp`}>WhatsApp</label>
        <input id={`${uid}-whatsapp`} type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} placeholder="(61) 99999-9999" maxLength={15} {...aria('whatsapp')} />
        <span className="bar" />
        {err('whatsapp')}
      </div>

      <div className="field" data-invalid={!!errors.vehicle}>
        <label htmlFor={`${uid}-vehicle`}>Veículo de interesse</label>
        <input id={`${uid}-vehicle`} type="text" list={`${uid}-brands`} value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Marca ou modelo que você procura" {...aria('vehicle')} />
        <datalist id={`${uid}-brands`}>{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
        <span className="bar" />
        {err('vehicle')}
      </div>

      <fieldset className="field m-0 border-0 p-0" data-invalid={!!errors.trade} aria-describedby={errors.trade ? `${uid}-trade-err` : undefined}>
        <legend className="lbl p-0">Possui veículo usado para troca?</legend>
        <div className="seg">
          <input id={`${uid}-trade`} type="radio" name="trade" value="sim" checked={trade === 'sim'} onChange={() => setTrade('sim')} />
          <label htmlFor={`${uid}-trade`}>Sim</label>
          <input id={`${uid}-trade-no`} type="radio" name="trade" value="nao" checked={trade === 'nao'} onChange={() => setTrade('nao')} />
          <label htmlFor={`${uid}-trade-no`}>Não</label>
        </div>
        {err('trade')}
      </fieldset>

      <div className="hp" aria-hidden="true">
        <label>Não preencha<input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
      </div>

      <div>
        <label className="check">
          <input id={`${uid}-consent`} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} {...aria('consent')} />
          <span>{CONSENT_TEXT}</span>
        </label>
        {err('consent')}
      </div>

      <div>
        <button type="submit" className="btn w-full justify-between" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Quero receber as ofertas'} <span className="arrow" aria-hidden="true">→</span>
        </button>
        <div aria-live="polite" className="min-h-6">
          <AnimatePresence>
            {(status === 'failed' || status === 'not-configured') && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 border-l-2 border-brand pl-4 text-[0.95rem] text-bone/85">
                {status === 'not-configured' ? (
                  <p>O envio online ainda não está ativo nesta página, então seus dados não foram enviados.</p>
                ) : (
                  <p>Não conseguimos enviar seu cadastro agora. Verifique sua conexão e tente novamente.</p>
                )}
                {waLink && <p className="mt-1"><a className="text-brand underline underline-offset-4" href={waLink} target="_blank" rel="noopener noreferrer">Falar com a Multi Car pelo WhatsApp</a></p>}
                {status === 'not-configured' && import.meta.env.DEV && <p className="mono mt-2 text-steel">dev: defina VITE_LEAD_WEBHOOK_URL no .env</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  )
}

export { isLeadIntegrationConfigured }
