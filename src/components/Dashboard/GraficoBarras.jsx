import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'

/** Gráfico de barras SVG — últimos 6 meses de totales (animación CSS) */
export function GraficoBarras({ data, currentMonthIndex }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const show = inView

  const max = Math.max(1, ...data.map((d) => d.total))
  const w = 320
  const h = 140
  const barW = 36
  const gap = 16

  return (
    <div ref={ref} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h3 className="font-display text-lg font-bold text-[var(--color-text)]">Facturado por mes (últimos 6 meses)</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full max-w-full" role="img" aria-label="Gráfico de barras mensual">
        <title>Totales mensuales</title>
        {data.map((d, i) => {
          const bh = (d.total / max) * (h - 36)
          const y = h - 20 - bh
          const x = 24 + i * (barW + gap)
          const highlighted = i === currentMonthIndex
          const height = show ? bh : 0
          const yv = show ? y : h - 20
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={yv}
                width={barW}
                height={height}
                fill={highlighted ? '#c1440e' : '#d6d0c4'}
                rx={4}
                style={{ transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              <text
                x={x + barW / 2}
                y={h - 4}
                textAnchor="middle"
                className="fill-[var(--color-text-2)] text-[8px]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-xs text-[var(--color-text-2)]">
        Escala relativa al máximo del período. Mes actual:{' '}
        {formatCurrency(data[currentMonthIndex]?.total || 0)}
      </p>
    </div>
  )
}
