import { useFocusTrap } from '../../hooks/useFocusTrap'
import { motion } from 'framer-motion'

export function ModalPlantillas({ open, plantillas, onClose, onPick }) {
  const ref = useFocusTrap(open)
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[155] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Plantillas guardadas"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl"
      >
        <h2 className="font-display text-xl font-bold">Plantillas</h2>
        <p className="mt-1 text-sm text-[var(--color-text-2)]">
          Se cargan materiales, mano de obra y montos. Los datos del cliente quedan en blanco para completar.
        </p>
        <ul className="mt-4 space-y-2">
          {(plantillas || []).length === 0 && (
            <li className="text-sm text-[var(--color-text-2)]">No hay plantillas guardadas.</li>
          )}
          {(plantillas || []).map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm hover:bg-[var(--color-surface-2)]"
                onClick={() => onPick(p)}
              >
                <span className="font-semibold text-[var(--color-text)]">{p.nombre}</span>
                <span className="mt-1 block text-xs text-[var(--color-text-2)]">{p.tipoTrabajo}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-[var(--color-border)] py-2 text-sm font-medium"
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  )
}
