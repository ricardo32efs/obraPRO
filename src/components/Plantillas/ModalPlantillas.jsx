import { useState } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { motion } from 'framer-motion'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function ModalPlantillas({ open, plantillas, onClose, onPick, onDelete }) {
  const ref = useFocusTrap(open)
  const [confirmId, setConfirmId] = useState(null)

  if (!open) return null

  const lista = plantillas || []

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
        <h2 className="font-display text-xl font-bold">Mis plantillas</h2>
        <p className="mt-1 text-sm text-[var(--color-text-2)]">
          Cargá materiales, mano de obra y montos de una plantilla. Los datos del cliente quedan en blanco.
        </p>

        {lista.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[var(--color-text)]">Sin plantillas guardadas</p>
            <p className="mt-1 text-xs text-[var(--color-text-2)]">
              Completá un presupuesto y hacé click en "Guardar como plantilla" para reutilizarlo.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {lista.map((p) => (
              <li key={p.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                {confirmId === p.id ? (
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <p className="text-sm text-[var(--color-text)]">¿Eliminar <strong>{p.nombre}</strong>?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { onDelete?.(p.id); setConfirmId(null) }}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => onPick(p)}
                    >
                      <span className="block font-semibold text-[var(--color-text)]">{p.nombre}</span>
                      <span className="mt-0.5 block text-xs text-[var(--color-text-2)]">
                        {p.tipoTrabajo}{p.savedAt ? ` · ${formatDate(p.savedAt)}` : ''}
                        {p.materiales?.length ? ` · ${p.materiales.length} mat.` : ''}
                        {p.manoObra?.length ? ` · ${p.manoObra.length} tarea(s)` : ''}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPick(p)}
                      className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-105"
                    >
                      Usar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(p.id)}
                      className="shrink-0 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      aria-label="Eliminar plantilla"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

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
