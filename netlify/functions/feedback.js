/**
 * Netlify Function: Recibe feedback del usuario y lo envía por EmailJS al Gmail del admin
 * POST /api/feedback
 * Body: { nombre, email, tipo, mensaje, fecha, url }
 */
import emailjs from '@emailjs/nodejs'

export const handler = async (event) => {
  // Solo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { nombre, email, tipo, mensaje, url } = JSON.parse(event.body || '{}')

    if (!mensaje?.trim()) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Mensaje requerido' }) }
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID
    const templateId = process.env.EMAILJS_TEMPLATE_ID
    const publicKey = process.env.EMAILJS_PUBLIC_KEY
    const privateKey = process.env.EMAILJS_PRIVATE_KEY
    const toEmail = process.env.EMAIL_TO

    if (!serviceId || !templateId || !publicKey || !privateKey || !toEmail) {
      console.error('Missing EmailJS environment variables')
      return { statusCode: 500, body: JSON.stringify({ error: 'Server config error' }) }
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

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true }),
    }
  } catch (err) {
    console.error('Feedback error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Error enviando feedback' }) }
  }
}
