import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'

/** Tarjeta de métrica con contador animado y mini sparkline */
export function MetricCard({ title, value, suffix, comparePct, sparkPath }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t0 = performance.now()
    const dur = 1500
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      const e = 1 - (1 - p) ** 3
      setN(value * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  const display = suffix === '$' ? formatCurrency(n) : `${Math.round(n)}${suffix || ''}`

  return (
    <motion.div
      ref={ref}
      layout
      className="obrapro-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-2)]">{title}</p>
      <p className="mt-2 font-mono text-2xl font-bold text-[var(--color-text)]">{display}</p>
      {comparePct != null && (
        <p
          className={`mt-1 text-xs font-semibold ${comparePct >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}
        >
          {comparePct >= 0 ? '↑' : '↓'} {Math.abs(comparePct)}% vs mes anterior
        </p>
      )}
      {sparkPath && (
        <svg viewBox="0 0 80 24" className="mt-2 h-8 w-full text-[var(--color-accent)]" aria-hidden>
          <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </motion.div>
  )
}
