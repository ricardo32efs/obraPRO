import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { getClientes, deleteCliente } from '../../utils/clientesStorage'

export function ModalClientes({ open, onClose, onPick }) {
  const ref = useFocusTrap(open)
  const [clientes, setClientes] = useState([])
  const [q, setQ] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    if (open) setClientes(getClientes())
  }, [open])

  if (!open) return null

  const filtered = q.trim()
    ? clientes.filter((c) => c.nombre.toLowerCase().includes(q.trim().toLowerCase()))
    : clientes

  const handleDelete = (id) => {
    const updated = deleteCliente(id)
    setClientes(updated)
    setConfirmId(null)
  }

  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Mis clientes"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl"
      >
        <h2 className="font-display text-xl font-bold text-[var(--color-text)]">Mis clientes</h2>
        <p className="mt-1 text-sm text-[var(--color-text-2)]">
          Los clientes se guardan automáticamente cuando guardás un presupuesto.
        </p>

        <input
          className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          placeholder="Buscar cliente..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {clientes.length === 0 ? 'Todavía no hay clientes guardados' : 'Sin resultados'}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-2)]">
              {clientes.length === 0
                ? 'Guardá un presupuesto y el cliente se guardará automáticamente.'
                : 'Probá con otro nombre.'}
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {filtered.map((c) => (
              <li key={c.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                {confirmId === c.id ? (
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <p className="text-sm text-[var(--color-text)]">¿Eliminar <strong>{c.nombre}</strong>?</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleDelete(c.id)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
                        Eliminar
                      </button>
                      <button type="button" onClick={() => setConfirmId(null)}
                        className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3">
                    <button type="button" className="min-w-0 flex-1 text-left" onClick={() => { onPick?.(c); onClose?.() }}>
                      <span className="block font-semibold text-[var(--color-text)]">{c.nombre}</span>
                      <span className="mt-0.5 block text-xs text-[var(--color-text-2)]">
                        {[c.telefono, c.email].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
                      </span>
                    </button>
                    <button type="button" onClick={() => { onPick?.(c); onClose?.() }}
                      className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-105">
                      Usar
                    </button>
                    <button type="button" onClick={() => setConfirmId(c.id)}
                      className="shrink-0 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      aria-label="Eliminar cliente">
                      ✕
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <button type="button" onClick={onClose}
          className="mt-6 w-full rounded-lg border border-[var(--color-border)] py-2 text-sm font-medium">
          Cerrar
        </button>
      </motion.div>
    </div>
  )
}
