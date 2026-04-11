import { useMemo } from 'react'
import { MetricCard } from './MetricCard'
import { GraficoBarras } from './GraficoBarras'

/**
 * Dashboard de análisis — solo lectura PRO; gratis con overlay upgrade
 */
export function Dashboard({ presupuestos, isPro, onRequestUpgrade }) {
  const now = new Date()
  const m = now.getMonth()
  const y = now.getFullYear()

  const metrics = useMemo(() => {
    const list = presupuestos || []
    const thisMonth = list.filter((p) => {
      const d = new Date(p.fechaEmision || p.updatedAt)
      return d.getMonth() === m && d.getFullYear() === y
    })
    const prevMonthDate = new Date(y, m - 1, 1)
    const prevMonth = list.filter((p) => {
      const d = new Date(p.fechaEmision || p.updatedAt)
      return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear()
    })
    const totalMes = thisMonth.reduce((a, p) => a + (p.totalFinal || 0), 0)
    const totalPrev = prevMonth.reduce((a, p) => a + (p.totalFinal || 0), 0)
    const pct = totalPrev > 0 ? Math.round(((totalMes - totalPrev) / totalPrev) * 100) : 0
    const enviados = thisMonth.filter((p) => p.estado === 'enviado').length
    const aprobados = thisMonth.filter((p) => p.estado === 'aprobado').length
    const tasa = enviados > 0 ? Math.round((aprobados / enviados) * 100) : 0
    const ticket =
      thisMonth.length > 0 ? thisMonth.reduce((a, p) => a + (p.totalFinal || 0), 0) / thisMonth.length : 0

    const six = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(y, m - i, 1)
      const label = d.toLocaleString('es-AR', { month: 'short' })
      const total = list
        .filter((p) => {
          const pd = new Date(p.fechaEmision || p.updatedAt)
          return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear()
        })
        .reduce((a, p) => a + (p.totalFinal || 0), 0)
      six.push({ label, total })
    }
    const currentMonthIndex = 5

    const tipoFreq = {}
    thisMonth.forEach((p) => {
      const t = p.tipoTrabajo || '—'
      tipoFreq[t] = (tipoFreq[t] || 0) + 1
    })
    const topTipos = Object.entries(tipoFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return { totalMes, pct, tasa, ticket, count: thisMonth.length, six, currentMonthIndex, topTipos }
  }, [presupuestos, m, y])

  const spark = 'M0,20 L20,8 L40,18 L60,6 L80,16'

  const inner = (
    <div className="space-y-8 px-4 py-6 pb-28 lg:pb-8">
      <h1 className="font-display text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Facturado este mes" value={metrics.totalMes} suffix="$" comparePct={metrics.pct} sparkPath={spark} />
        <MetricCard title="Presupuestos del mes" value={metrics.count} comparePct={null} />
        <MetricCard title="Tasa de aprobación" value={metrics.tasa} suffix="%" />
        <MetricCard title="Ticket promedio" value={metrics.ticket} suffix="$" comparePct={null} />
      </div>
      <GraficoBarras data={metrics.six} currentMonthIndex={metrics.currentMonthIndex} />
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h3 className="font-display text-lg font-bold">Tipos de obra más frecuentes (mes)</h3>
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-xs text-[var(--color-text-2)]">
            <tr>
              <th className="p-2">Tipo</th>
              <th className="p-2">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {metrics.topTipos.map(([nombre, c]) => (
              <tr key={nombre} className="border-t border-[var(--color-border)]">
                <td className="p-2">{nombre}</td>
                <td className="p-2 font-mono">{c}</td>
              </tr>
            ))}
            {metrics.topTipos.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-[var(--color-text-2)]">
                  Sin datos del mes actual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )

  if (!isPro) {
    return (
      <div className="relative min-h-[60vh]">
        <div className="pointer-events-none select-none blur-sm opacity-40">{inner}</div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={onRequestUpgrade}
            className="pointer-events-auto rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-surface)] px-8 py-6 text-center shadow-xl"
          >
            <p className="font-display text-xl font-bold">Dashboard disponible en PRO</p>
            <p className="mt-2 text-sm text-[var(--color-text-2)]">
              Métricas, gráficos y análisis de conversión para hacer crecer tu negocio.
            </p>
            <span className="mt-4 inline-block rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white">
              Ver planes
            </span>
          </button>
        </div>
      </div>
    )
  }

  return inner
}
