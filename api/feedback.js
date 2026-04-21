/**
 * Vercel Serverless Function: Recibe feedback y lo envía por EmailJS
 * POST /api/feedback
 * Body: { nombre, email, tipo, mensaje, fecha, url }
 */

// Import con manejo de error
let emailjs
try {
  emailjs = await import('@emailjs/nodejs').then(m => m.default || m)
} catch (importErr) {
  console.error('Failed to import @emailjs/nodejs:', importErr.message)
}

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verificar que emailjs se cargó
  if (!emailjs || !emailjs.send) {
    return res.status(500).json({ 
      error: 'EmailJS module not loaded', 
      detail: 'Check if @emailjs/nodejs is in package.json dependencies'
    })
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

    // Debug: log qué variables faltan (sin revelar valores)
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

    const templateParams = {
      to_email: toEmail,
      from_name: nombre || 'Usuario anónimo',
      from_email: email || 'no-reply@obraproweb.com',
      tipo: tipo || 'feedback',
      mensaje: mensaje,
      url: url || 'No disponible',
      fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
    }

    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Feedback error:', err.message, err.stack)
    return res.status(500).json({ 
      error: 'Error enviando feedback',
      detail: err.message 
    })
  }
}
