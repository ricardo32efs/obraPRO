/**
 * Vercel Serverless Function: Recibe feedback y lo envía por EmailJS API REST
 * POST /api/feedback
 * Body: { nombre, email, tipo, mensaje, fecha, url }
 * Usa fetch directo a EmailJS API (sin SDK de Node.js)
 */

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { nombre, email, tipo, mensaje, url } = req.body || {}

    if (!mensaje?.trim()) {
      return res.status(400).json({ error: 'Mensaje requerido' })
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID
    const templateId = process.env.EMAILJS_TEMPLATE_ID
    const publicKey = process.env.EMAILJS_PUBLIC_KEY
    const privateKey = process.env.EMAILJS_PRIVATE_KEY
    const toEmail = process.env.EMAIL_TO

    // Debug: log qué variables faltan
    const missing = []
    if (!serviceId) missing.push('EMAILJS_SERVICE_ID')
    if (!templateId) missing.push('EMAILJS_TEMPLATE_ID')
    if (!publicKey) missing.push('EMAILJS_PUBLIC_KEY')
    if (!privateKey) missing.push('EMAILJS_PRIVATE_KEY')
    if (!toEmail) missing.push('EMAIL_TO')

    if (missing.length > 0) {
      console.error('Missing env vars:', missing.join(', '))
      return res.status(500).json({ 
        error: 'Server config error', 
        missing: missing 
      })
    }

    // Llamar a EmailJS API REST directamente
    const emailjsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: toEmail,
          from_name: nombre || 'Usuario anónimo',
          from_email: email || 'no-reply@obraproweb.com',
          tipo: tipo || 'feedback',
          mensaje: mensaje,
          url: url || 'No disponible',
          fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
        }
      })
    })

    if (!emailjsRes.ok) {
      const errorText = await emailjsRes.text().catch(() => 'Unknown error')
      console.error('EmailJS error:', emailjsRes.status, errorText)
      return res.status(500).json({ 
        error: 'Error enviando a EmailJS', 
        status: emailjsRes.status,
        detail: errorText.substring(0, 200)
      })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Feedback error:', err.message)
    return res.status(500).json({ 
      error: 'Error enviando feedback',
      detail: err.message 
    })
  }
}
