import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from './constants'

/**
 * Inicializa el SDK (idempotente)
 */
export function initEmailJsClient(publicKey) {
  if (!publicKey) return
  try {
    emailjs.init({ publicKey })
  } catch {
    /* ya inicializado o versión sin init */
  }
}

export function isEmailJsConfigured() {
  const c = EMAILJS_CONFIG
  return Boolean(c.publicKey && c.serviceId && c.templateId)
}

/**
 * Arma el cuerpo sugerido del correo (es-AR)
 */
export function defaultEmailBody({
  clienteNombre,
  numero,
  descripcionCorta,
  fechaValidez,
  nombreProfesional,
  telefono,
  email,
}) {
  const desc = (descripcionCorta || '').slice(0, 200)
  return `Estimado/a ${clienteNombre || 'cliente'}:

Adjunto el presupuesto de obra N° ${numero}${desc ? ` correspondiente a: ${desc}` : ''}.
Validez del documento hasta el ${fechaValidez || '—'}.

Quedo a disposición para cualquier consulta.

Saludos cordiales,
${nombreProfesional || ''}
${telefono ? `Tel: ${telefono}` : ''}${email ? ` | ${email}` : ''}`
}

/**
 * Envía usando EmailJS. Los nombres de parámetros coinciden con plantillas típicas;
 * en el dashboard podés mapear {{subject}}, {{message}}, {{to_email}}, etc.
 */
export async function sendPresupuestoEmail({
  toEmail,
  toName,
  ccEmail,
  subject,
  messagePlain,
  empresa,
  payload,
  attachPdfBase64,
}) {
  const { publicKey, serviceId, templateId } = EMAILJS_CONFIG
  const attachmentParam = import.meta.env.VITE_EMAILJS_ATTACHMENT_PARAM || 'presupuesto_pdf'

  if (!publicKey || !serviceId || !templateId) {
    throw new Error('EmailJS no configurado. Revisá el archivo .env (VITE_EMAILJS_*).')
  }

  initEmailJsClient(publicKey)

  const messageHtml = String(messagePlain || '').replace(/\n/g, '<br/>')

  const templateParams = {
    to_email: toEmail,
    to_name: toName || '',
    cc_email: ccEmail || '',
    reply_to: empresa?.email || '',
    from_name: empresa?.nombreEmpresa || empresa?.nombreResponsable || 'Obra Pro',
    subject,
    message: messagePlain,
    message_html: messageHtml,
    phone: empresa?.telefono || '',
    company: empresa?.nombreEmpresa || '',
    professional_name: empresa?.nombreResponsable || '',
    budget_number: payload?.numero || '',
    obra_direccion: payload?.direccionObra || '',
    total_final: payload?.totalFinal != null ? String(payload.totalFinal) : '',
    valid_until: payload?.validoHasta || '',
    /* Alias usados en plantillas EmailJS por defecto */
    email: toEmail,
    name: toName || '',
    to: toEmail,
  }

  if (attachPdfBase64 && attachmentParam) {
    templateParams[attachmentParam] = attachPdfBase64
  }

  return emailjs.send(serviceId, templateId, templateParams, publicKey)
}
