import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { DocumentoPresupuesto } from './DocumentoPresupuesto'

/**
 * Modal casi pantalla completa con preview del documento
 */
export function PreviewModal({
  open,
  onClose,
  payload,
  empresa,
  isPro,
  readOnly = false,
  onDownloadPdf,
  onExportExcel,
  onEmail,
  onSave,
  onContinueEdit,
}) {
  const trapRef = useFocusTrap(open)

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 p-2 sm:p-4"
      role="presentation"
    >
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Vista previa del presupuesto"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="flex max-h-[95vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-[var(--color-bg)] shadow-2xl"
      >
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-white sm:text-sm"
          >
            Descargar PDF
          </button>
          {isPro && (
            <>
              <button
                type="button"
                onClick={onEmail}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold sm:text-sm"
              >
                Enviar por email
              </button>
              <button
                type="button"
                onClick={onExportExcel}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold sm:text-sm"
              >
                Exportar a Excel
              </button>
            </>
          )}
          <button
            type="button"
            onClick={readOnly ? onClose : onContinueEdit}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold sm:text-sm"
          >
            {readOnly ? 'Cerrar' : 'Seguir editando'}
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={onSave}
              className="rounded-lg border border-[var(--color-success)] px-3 py-2 text-xs font-semibold text-[var(--color-success)] sm:text-sm"
            >
              Guardar presupuesto
            </button>
          )}
          <button
            type="button"
            aria-label="Cerrar vista previa"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-lg leading-none text-[var(--color-text-2)] hover:bg-[var(--color-surface-2)]"
          >
            Cerrar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <DocumentoPresupuesto payload={payload} empresa={empresa} isPro={isPro} />
        </div>
      </motion.div>
    </div>
  )
}
