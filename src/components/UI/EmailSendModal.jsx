import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import {
  defaultEmailBody,
  isEmailJsConfigured,
  sendPresupuestoEmail,
} from '../../utils/emailjsSend'
import { getPresupuestoPdfBase64 } from '../../utils/generatePDF'

function formatDateAR(iso) {
  if (!iso) return ''
  const [y, m, d] = String(iso).slice(0, 10).split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function initialEmailState(payload, empresa) {
  const cliente = payload.clienteNombre || ''
  const num = payload.numero || ''
  const prof = empresa?.nombreResponsable || ''
  const val = formatDateAR(payload.validoHasta || payload.fechaEmision)
  return {
    toEmail: payload.clienteEmail || '',
    toName: cliente,
    ccEmail: empresa?.email || '',
    subject: `Presupuesto de obra N° ${num} — ${prof}`.trim(),
    body: defaultEmailBody({
      clienteNombre: cliente,
      numero: num,
      descripcionCorta: payload.descripcion,
      fechaValidez: val,
      nombreProfesional: prof,
      telefono: empresa?.telefono,
      email: empresa?.email,
    }),
  }
}

function EmailSendModalInner({
  empresa,
  payload,
  isPro,
  onClose,
  onRequestUpgrade,
  onSent,
}) {
  const trapRef = useFocusTrap(true)
  const init = initialEmailState(payload, empresa)
  const [toEmail, setToEmail] = useState(init.toEmail)
  const [toName, setToName] = useState(init.toName)
  const [ccEmail, setCcEmail] = useState(init.ccEmail)
  const [subject, setSubject] = useState(init.subject)
  const [body, setBody] = useState(init.body)
  const [attachPdf, setAttachPdf] = useState(true)
  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')
  const sending = status === 'sending'

  const merged = useMemo(
    () => ({
      ...payload,
      empresa: payload?.empresa || empresa,
    }),
    [payload, empresa],
  )

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && !sending && onClose?.()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose, sending])

  const handleSend = async () => {
    if (!isPro) {
      onRequestUpgrade?.()
      return
    }
    if (!isEmailJsConfigured()) {
      setErrMsg('Falta configurar EmailJS. Creá un archivo .env con VITE_EMAILJS_* (ver .env.example).')
      return
    }
    if (!toEmail.trim()) {
      setErrMsg('Indicá el email del cliente.')
      return
    }
    let pdfB64
    if (attachPdf) {
      try {
        pdfB64 = getPresupuestoPdfBase64(merged, { isPro })
      } catch {
        setErrMsg('No se pudo generar el PDF para adjuntar. Probá sin adjunto o reintentá.')
        return
      }
    }
    setStatus('sending')
    setErrMsg('')
    try {
      await sendPresupuestoEmail({
        toEmail: toEmail.trim(),
        toName: toName.trim(),
        ccEmail: ccEmail.trim(),
        subject: subject.trim(),
        messagePlain: body,
        empresa,
        payload: merged,
        attachPdfBase64: attachPdf ? pdfB64 : null,
      })
      onSent?.()
    } catch (e) {
      setStatus('error')
      const apiMsg =
        typeof e?.text === 'string'
          ? e.text
          : Array.isArray(e?.text)
            ? e.text.join(', ')
            : e?.message
      setErrMsg(apiMsg || 'Error al enviar. Revisá la consola y la plantilla EmailJS.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[165] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !sending && onClose?.()}
    >
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
      >
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 id="email-modal-title" className="font-display text-xl font-bold text-[var(--color-text)]">
            Enviar presupuesto por email
          </h2>
          <p className="mt-1 text-xs text-[var(--color-text-2)]">
            Requiere cuenta{' '}
            <a href="https://www.emailjs.com/" className="font-semibold text-[var(--color-accent)] underline" target="_blank" rel="noreferrer">
              EmailJS
            </a>{' '}
            y plantilla con los parámetros indicados en <code className="rounded bg-[var(--color-surface-2)] px-1">.env.example</code>.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <div>
            <label htmlFor="em-to" className="text-sm font-medium text-[var(--color-text)]">
              Para (email del cliente) *
            </label>
            <input
              id="em-to"
              type="email"
              autoComplete="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="em-name" className="text-sm font-medium text-[var(--color-text)]">
              Nombre del cliente
            </label>
            <input
              id="em-name"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="em-cc" className="text-sm font-medium text-[var(--color-text)]">
              CC (ej. tu email de empresa)
            </label>
            <input
              id="em-cc"
              type="email"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="em-sub" className="text-sm font-medium text-[var(--color-text)]">
              Asunto
            </label>
            <input
              id="em-sub"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="em-body" className="text-sm font-medium text-[var(--color-text)]">
              Mensaje
            </label>
            <textarea
              id="em-body"
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={attachPdf} onChange={(e) => setAttachPdf(e.target.checked)} />
            Adjuntar PDF del presupuesto (Base64 a variable en plantilla EmailJS)
          </label>

          {errMsg && <p className="text-sm text-[var(--color-danger)]">Error: {errMsg}</p>}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
          <button
            type="button"
            disabled={sending}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={sending}
            onClick={handleSend}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Modal PRO: envío por EmailJS con asunto, cuerpo, CC y adjunto PDF opcional
 */
export function EmailSendModal({
  open,
  onClose,
  empresa,
  payload,
  isPro,
  onRequestUpgrade,
  onSent,
  /** Incrementar al abrir el modal de nuevo con el mismo presupuesto (p. ej. desde el formulario). */
  instanceKey = 0,
}) {
  if (!open || !payload) return null
  const resetKey = `${instanceKey}-${payload.id ?? payload.numero ?? payload.updatedAt ?? 'draft'}`

  return (
    <EmailSendModalInner
      key={resetKey}
      empresa={empresa}
      payload={payload}
      isPro={isPro}
      onClose={onClose}
      onRequestUpgrade={onRequestUpgrade}
      onSent={onSent}
    />
  )
}
