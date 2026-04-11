import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'

/**
 * Diálogo modal de confirmación accesible
 */
export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  const trapRef = useFocusTrap(open)

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onCancel?.()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <motion.div
        ref={trapRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="font-display text-xl font-bold text-[var(--color-text)]">
          {title}
        </h2>
        <p id="confirm-desc" className="mt-2 text-sm text-[var(--color-text-2)]">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:brightness-[1.02]"
          >
            {cancelLabel || 'Cancelar'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[var(--color-danger)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            {confirmLabel || 'Confirmar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
