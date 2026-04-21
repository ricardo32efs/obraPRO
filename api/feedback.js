/**
 * Vercel Serverless Function: Recibe feedback y lo envía por EmailJS
 * POST /api/feedback
 * Body: { nombre, email, tipo, mensaje, fecha, url }
 */
import emailjs from '@emailjs/nodejs'

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

    if (!serviceId || !templateId || !publicKey || !privateKey || !toEmail) {
      console.error('Missing EmailJS environment variables')
      return res.status(500).json({ error: 'Server config error' })
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
    console.error('Feedback error:', err)
    return res.status(500).json({ error: 'Error enviando feedback' })
  }
}
