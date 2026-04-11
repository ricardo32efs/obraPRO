import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastCtx = createContext(null)

/** @typedef {{ id: string, type: 'success'|'error'|'warning', message: string }} Toast */

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState(/** @type {Toast[]} */ ([]))
  const idRef = useRef(0)

  const push = useCallback((message, type = 'success') => {
    const id = `t-${++idRef.current}`
    setToasts((prev) => {
      const next = [...prev, { id, type, message }]
      return next.slice(-3)
    })
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-[200] flex max-w-[92vw] flex-col items-end gap-2 sm:right-6"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              role="status"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg ${
                t.type === 'error'
                  ? 'border-red-900/20 bg-red-50 text-red-900'
                  : t.type === 'warning'
                    ? 'border-amber-800/20 bg-amber-50 text-amber-950'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]'
              }`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

// useToast se exporta junto al Provider en apps pequeñas; Fast Refresh permite ambos.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast outside ToastProvider')
  return ctx
}
