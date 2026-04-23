import crypto from 'node:crypto'
import { checkRateLimit, getClientIP } from './lib/rateLimit.js'

/**
 * Vercel Serverless Function — verifica un pago de Mercado Pago y emite un token de licencia.
 * GET /api/verify-payment?payment_id=XXX
 * GET /api/verify-payment?preapproval_id=XXX  (suscripciones)
 */
export default async function handler(req, res) {
  // Rate limiting
  const clientIP = getClientIP(req)
  const rateLimit = checkRateLimit('verify-payment', clientIP)
  
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Demasiadas solicitudes. Intentá de nuevo en unos minutos.',
      retryAfter: rateLimit.retryAfter 
    })
  }

  const origin = process.env.VITE_SITE_URL || 'https://obraproweb.com'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('X-RateLimit-Limit', '5')
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining))

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const { payment_id, preapproval_id } = req.query

  if (!payment_id && !preapproval_id) {
    return res.status(400).json({ error: 'Falta payment_id o preapproval_id' })
  }
  
  // Validar formato de IDs (solo caracteres alfanuméricos y guiones)
  const validIdRegex = /^[a-zA-Z0-9_-]+$/
  if (payment_id && !validIdRegex.test(payment_id)) {
    return res.status(400).json({ error: 'payment_id inválido' })
  }
  if (preapproval_id && !validIdRegex.test(preapproval_id)) {
    return res.status(400).json({ error: 'preapproval_id inválido' })
  }

  const MP_TOKEN = process.env.MP_ACCESS_TOKEN
  const SECRET = process.env.LICENSE_SECRET

  if (!MP_TOKEN || !SECRET) {
    console.error('[verify-payment] Variables de entorno faltantes: MP_ACCESS_TOKEN o LICENSE_SECRET')
    return res.status(500).json({ error: 'Servidor no configurado. Contactá al soporte.' })
  }

  try {
    let payerEmail, amount, approvedAt, identifier

    if (payment_id) {
      const r = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: { Authorization: `Bearer ${MP_TOKEN}` },
      })
      const data = await r.json()

      if (!r.ok || data.status !== 'approved') {
        return res.status(400).json({
          error: 'Pago no aprobado',
          status: data.status || 'desconocido',
        })
      }

      payerEmail = data.payer?.email || 'unknown'
      amount = data.transaction_amount
      approvedAt = data.date_approved
      identifier = `pay_${payment_id}`
    } else {
      const r = await fetch(`https://api.mercadopago.com/preapproval/${preapproval_id}`, {
        headers: { Authorization: `Bearer ${MP_TOKEN}` },
      })
      const data = await r.json()

      if (!r.ok || data.status !== 'authorized') {
        return res.status(400).json({
          error: 'Suscripción no autorizada',
          status: data.status || 'desconocido',
        })
      }

      payerEmail = data.payer_email || 'unknown'
      amount = data.auto_recurring?.transaction_amount
      approvedAt = data.date_created
      identifier = `sub_${preapproval_id}`
    }

    const plan = Number(amount) >= 60000 ? 'annual' : 'monthly'
    const activatedAt = new Date().toISOString()

    const payload = `${identifier}:${payerEmail}:${plan}:${activatedAt}`
    const token = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')

    return res.status(200).json({
      ok: true,
      token,
      plan,
      email: payerEmail,
      identifier,
      activatedAt,
    })
  } catch (err) {
    console.error('[verify-payment] Error inesperado:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
