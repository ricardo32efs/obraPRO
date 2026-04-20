import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'

/**
 * Modal de feedback profesional usando Netlify Function + EmailJS
 * El feedback se envía al endpoint /api/feedback que usa EmailJS desde el servidor
 * (mantiene las API keys ocultas)
 */
export function ModalFeedback({ open, onClose }) {
  const ref = useFocusTrap(open)
  const [form, setForm] = useState({ nombre: '', email: '', tipo: 'sugerencia', mensaje: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.mensaje.trim()) return
    setStatus('submitting')

    try {
      // Enviar a la Netlify Function que usa EmailJS desde el servidor
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          tipo: form.tipo,
          mensaje: form.mensaje,
          fecha: new Date().toISOString(),
          url: window.location.href,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ nombre: '', email: '', tipo: 'sugerencia', mensaje: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const tipos = [
    { value: 'sugerencia', label: '💡 Sugerencia', desc: 'Tengo una idea para mejorar la app' },
    { value: 'bug', label: '🐛 Error/Bug', desc: 'Algo no funciona correctamente' },
    { value: 'pregunta', label: '❓ Pregunta', desc: 'Necesito ayuda o información' },
    { value: 'opinion', label: '💬 Opinión', desc: 'Quiero compartir mi experiencia' },
  ]

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Enviar feedback"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--color-text)]">Tu opinión nos importa</h2>
            <p className="mt-1 text-sm text-[var(--color-text-2)]">
              Ayudanos a mejorar Obra Pro. Respondemos por email.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-lg leading-none text-[var(--color-text-2)] hover:bg-[var(--color-surface-2)]"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center"
            >
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
                ✅
              </div>
              <h3 className="font-semibold text-green-800">¡Gracias por tu feedback!</h3>
              <p className="mt-1 text-sm text-green-700">
                Lo revisaremos y te contactaremos si dejaste tu email.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
              >
                Cerrar
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {tipos.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, tipo: t.value }))}
                    className={`rounded-lg border p-3 text-left text-sm transition ${
                      form.tipo === t.value
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                        : 'border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
                    }`}
                  >
                    <span className="block font-semibold">{t.label}</span>
                    <span className="mt-0.5 block text-xs opacity-70">{t.desc}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-[var(--color-text-2)]">Nombre (opcional)</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-text-2)]">Email (opcional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-2)]">Mensaje *</label>
                <textarea
                  required
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  placeholder="Contanos qué pensás, qué error encontraste, o qué te gustaría ver..."
                  maxLength={1000}
                />
                <p className="mt-1 text-right text-[11px] text-[var(--color-text-2)]">
                  {form.mensaje.length}/1000
                </p>
              </div>

              {status === 'error' && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  Error al enviar. Intentá de nuevo en un momento.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={status === 'submitting' || !form.mensaje.trim()}
                  className="flex-1 rounded-lg bg-[var(--color-accent)] py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Enviando...' : 'Enviar feedback'}
                </button>
              </div>

              <p className="text-center text-[11px] text-[var(--color-text-2)]">
                🔒 Tu privacidad es importante. No compartimos tus datos.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
