/**
 * Meta Conversions API (CAPI) — função serverless de exemplo (Vercel / Netlify Functions v2 / Node 18+).
 *
 * Recebe do front-end o MESMO event_id usado no Pixel e envia os eventos
 * "Lead" e "lead_qualificado" para a API de Conversões, permitindo a deduplicação.
 * Nome e telefone já chegam com hash SHA-256 (o front nunca envia esses dados em texto puro para cá).
 *
 * Variáveis de ambiente:
 *   META_PIXEL_ID        ID do Pixel
 *   META_ACCESS_TOKEN    Token da API de Conversões (Gerenciador de Eventos > Configurações)
 *   META_API_VERSION     opcional, padrão "v24.0" — confira a versão vigente da Graph API
 *   META_TEST_EVENT_CODE opcional, para validar na aba "Eventos de teste"
 *   ALLOWED_ORIGIN       opcional, ex.: https://seudominio.com.br (CORS)
 */

const SHA256 = /^[a-f0-9]{64}$/;
const ALLOWED_EVENTS = ['Lead', 'lead_qualificado'];

const pickHash = (v) => (typeof v === 'string' && SHA256.test(v) ? [v] : undefined);
const str = (v, max = 300) => (typeof v === 'string' ? v.slice(0, max) : undefined);

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { META_PIXEL_ID, META_ACCESS_TOKEN } = process.env;
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) return res.status(500).json({ error: 'missing_env' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const eventId = str(body.event_id, 64);
  if (!eventId) return res.status(400).json({ error: 'missing_event_id' });

  const u = body.user_data || {};
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;

  const user_data = {
    fn: pickHash(u.fn),
    ln: pickHash(u.ln),
    ph: pickHash(u.ph),
    fbp: str(u.fbp),
    fbc: str(u.fbc),
    client_user_agent: str(u.client_user_agent, 512) || str(req.headers['user-agent'], 512),
    client_ip_address: ip,
  };

  const c = body.custom_data || {};
  const custom_data = {
    content_name: 'Outubro Black',
    interesse: str(c.interesse, 60),
    troca: str(c.troca, 10),
    entrada: str(c.entrada, 60),
    utm_source: str(c.utm_source, 200),
    utm_campaign: str(c.utm_campaign, 200),
    utm_content: str(c.utm_content, 200),
  };

  const names = (Array.isArray(body.event_names) ? body.event_names : ALLOWED_EVENTS).filter((n) =>
    ALLOWED_EVENTS.includes(n)
  );
  const eventTime = Number.isFinite(body.event_time) ? body.event_time : Math.floor(Date.now() / 1000);

  const payload = {
    data: names.map((event_name) => ({
      event_name,
      event_time: eventTime,
      event_id: eventId, // mesmo eventID do fbq() => deduplicação
      action_source: 'website',
      event_source_url: str(body.event_source_url, 1000),
      user_data,
      custom_data,
    })),
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  const version = process.env.META_API_VERSION || 'v24.0';
  try {
    const r = await fetch(
      `https://graph.facebook.com/${version}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const out = await r.json();
    return res.status(r.ok ? 200 : 502).json(out);
  } catch (err) {
    return res.status(502).json({ error: 'capi_request_failed' });
  }
}
