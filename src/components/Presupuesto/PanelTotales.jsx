import { formatCurrency } from '../../utils/formatCurrency'

/** Panel sticky de resumen de costos */
export function PanelTotales({
  totals,
  incluirIva,
  onToggleIva,
  anticipoPct,
  onAnticipoChange,
  margenPct,
  onMargenChange,
  contingenciaPct,
  onContingenciaChange,
}) {
  const totalConContingencia = totals.totalFinal * (1 + Number(contingenciaPct || 0) / 100)
  const precioSugerido = totals.totalFinal * (1 + Number(margenPct || 0) / 100)
  const precioSugeridoConContingencia = totalConContingencia * (1 + Number(margenPct || 0) / 100)

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm lg:sticky lg:top-4">
      <h3 className="font-display text-lg font-bold text-[var(--color-text)]">Resumen</h3>
      <dl className="mt-3 space-y-1 text-sm">
        <Row label="Subtotal materiales" value={formatCurrency(totals.subtotalMateriales)} />
        <Row label="Subtotal mano de obra" value={formatCurrency(totals.subtotalMano)} />
        <Row label="Gastos adicionales" value={formatCurrency(totals.subtotalGastos)} />
        <div className="divider-fade my-2" />
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} bold />
        <div className="mt-3 flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={incluirIva} onChange={(e) => onToggleIva(e.target.checked)} />
            Incluir IVA (21%)
          </label>
        </div>
        {incluirIva && <Row label="IVA" value={formatCurrency(totals.ivaMonto)} />}
        <div className="divider-fade my-2" />
        <div className="flex items-baseline justify-between">
          <dt className="font-display text-base font-bold text-[var(--color-text)]">TOTAL FINAL</dt>
          <dd className="font-mono text-xl font-bold text-[var(--color-accent)]">
            {formatCurrency(totals.totalFinal)}
          </dd>
        </div>
        <div className="mt-4 rounded-xl bg-[var(--color-surface-2)] p-4">
          <label className="text-xs font-medium text-[var(--color-text-2)]">Anticipo requerido</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={anticipoPct}
              onChange={(e) => onAnticipoChange(Number(e.target.value))}
              className="h-2 flex-1 accent-[var(--color-accent)]"
            />
            <span className="font-mono text-base font-bold w-14 text-right">{anticipoPct}%</span>
          </div>
          <p className="mt-2 text-right font-mono text-base font-semibold text-[var(--color-text)]">
            Monto: {formatCurrency(totals.anticipoMonto)}
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <label className="text-xs font-medium text-[var(--color-text-2)]">Margen objetivo (%)</label>
          <p className="text-[10px] leading-snug text-[var(--color-text-2)] opacity-70">Tu ganancia sobre el costo total. Ej: 20% = cobrás 20% más de lo que gastás.</p>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={60}
              value={margenPct}
              onChange={(e) => onMargenChange(Number(e.target.value))}
              className="h-2 flex-1 accent-[var(--color-accent)]"
            />
            <span className="w-14 text-right font-mono text-base font-bold">{margenPct}%</span>
          </div>
          <label className="mt-3 block text-xs font-medium text-[var(--color-text-2)]">Contingencia técnica (%)</label>
          <p className="text-[10px] leading-snug text-[var(--color-text-2)] opacity-70">Reserva para imprevistos: roturas, faltantes o demoras. Recomendado: 10–15%.</p>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={25}
              value={contingenciaPct}
              onChange={(e) => onContingenciaChange(Number(e.target.value))}
              className="h-2 flex-1 accent-[var(--color-warning)]"
            />
            <span className="w-14 text-right font-mono text-base font-bold">{contingenciaPct}%</span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <Row label="Costo base (total actual)" value={formatCurrency(totals.totalFinal)} />
            <Row label="Total + contingencia" value={formatCurrency(totalConContingencia)} />
            <Row label="Precio sugerido (margen)" value={formatCurrency(precioSugerido)} bold />
            <Row
              label="Sugerido margen + contingencia"
              value={formatCurrency(precioSugeridoConContingencia)}
              bold
            />
          </div>
        </div>
      </dl>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between gap-2 ${bold ? 'font-semibold' : ''}`}>
      <dt className="text-[var(--color-text-2)]">{label}</dt>
      <dd className="font-mono text-[var(--color-text)]">{value}</dd>
    </div>
  )
}
