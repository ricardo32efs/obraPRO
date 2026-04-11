import { formatCurrency } from '../../utils/formatCurrency'

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  if (!y) return iso
  return `${d}/${m}/${y}`
}

/**
 * Vista tipo documento A4 para preview en pantalla
 */
export function DocumentoPresupuesto({ payload, empresa, isPro }) {
  const {
    numero,
    fechaEmision,
    validoHasta,
    clienteNombre,
    clienteTelefono,
    clienteEmail,
    direccionObra,
    tipoTrabajo,
    tipoTrabajoOtro,
    descripcion,
    fechaInicio,
    fechaEntrega,
    materiales,
    manoObra,
    gastosAdicionales,
    subtotalMateriales,
    subtotalMano,
    subtotalGastos,
    subtotal,
    incluirIva,
    ivaMonto,
    totalFinal,
    anticipoPct,
    anticipoMonto,
    margenPct,
    contingenciaPct,
    totalConContingencia,
    precioSugeridoMargen,
    precioSugeridoMargenContingencia,
    checklistCierre,
    condiciones,
    validezDias,
  } = payload

  const tipo = tipoTrabajo === 'Otro' && tipoTrabajoOtro ? tipoTrabajoOtro : tipoTrabajo

  return (
    <div className="mx-auto min-h-[1100px] max-w-[210mm] bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.15)] print:shadow-none">
      <header className="flex flex-col gap-4 border-b-4 border-[var(--color-accent)] pb-4 md:flex-row md:justify-between">
        <div className="flex gap-3">
          {isPro && empresa?.logoBase64 && (
            <img src={empresa.logoBase64} alt="" className="h-14 w-14 rounded-full object-cover" />
          )}
          <div>
            <div className="font-display text-2xl font-bold text-[var(--color-text)]">
              {empresa?.nombreEmpresa || 'Obra Pro'}
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-2)]">
              {empresa?.cuit && <div>CUIT: {empresa.cuit}</div>}
              {empresa?.telefono && <div>Tel: {empresa.telefono}</div>}
              {empresa?.email && <div>{empresa.email}</div>}
              {empresa?.direccion && <div>{empresa.direccion}</div>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold text-[var(--color-text)]">PRESUPUESTO DE OBRA</div>
          <div className="font-mono text-lg font-bold text-[var(--color-accent)]">{numero}</div>
          <div className="mt-1 text-xs text-[var(--color-text-2)]">Fecha de emisión: {formatDate(fechaEmision)}</div>
          {validoHasta && (
            <div className="text-xs text-[var(--color-text-2)]">Válido hasta: {formatDate(validoHasta)}</div>
          )}
        </div>
      </header>

      <section className="mt-6 grid gap-4 rounded-xl bg-[var(--color-surface-2)]/80 p-4 md:grid-cols-2">
        <div className="space-y-1 text-sm">
          <div>
            <strong>CLIENTE:</strong> {clienteNombre}
          </div>
          <div>Tel: {clienteTelefono || '—'}</div>
          <div>Email: {clienteEmail || '—'}</div>
        </div>
        <div className="space-y-1 text-sm">
          <div>
            <strong>OBRA:</strong> {direccionObra}
          </div>
          <div>Tipo: {tipo}</div>
          <div>Inicio estimado: {formatDate(fechaInicio)}</div>
          <div>Entrega estimada: {formatDate(fechaEntrega)}</div>
        </div>
      </section>

      {descripcion && (
        <p className="mt-4 border-l-4 border-[var(--color-border)] pl-3 text-sm italic text-[var(--color-text-2)]">
          {descripcion}
        </p>
      )}

      <TableSection
        title="Materiales"
        headClass="bg-[var(--color-primary)] text-white"
        columns={['Material', 'Unidad', 'Cantidad', 'P. Unit.', 'Subtotal']}
        rows={(materiales || []).map((r) => [
          r.nombre,
          r.unidad,
          r.cantidad,
          formatCurrency(r.precioUnitario),
          formatCurrency(r.cantidad * r.precioUnitario),
        ])}
        foot={['Subtotal materiales', '', '', '', formatCurrency(subtotalMateriales)]}
      />

      <TableSection
        title="Mano de obra"
        headClass="bg-[var(--color-accent-2)] text-white"
        columns={['Descripción', 'Categoría', 'Cant.', 'Unidad', 'P. Unit.', 'Subtotal']}
        rows={(manoObra || []).map((r) => [
          r.descripcion,
          r.categoria,
          r.cantidad,
          r.unidad,
          formatCurrency(r.precioUnitario),
          formatCurrency(r.cantidad * r.precioUnitario),
        ])}
        foot={['Subtotal mano de obra', '', '', '', '', formatCurrency(subtotalMano)]}
      />

      {(gastosAdicionales || []).length > 0 && (
        <TableSection
          title="Gastos adicionales"
          headClass="bg-[#555] text-white"
          columns={['Concepto', 'Monto']}
          rows={(gastosAdicionales || []).map((r) => [
            r.concepto,
            formatCurrency(r.montoCalculado ?? r.monto ?? 0),
          ])}
          foot={['Total gastos', formatCurrency(subtotalGastos)]}
        />
      )}

      <section className="mt-6 flex justify-end">
        <div className="w-full max-w-sm space-y-1 text-sm">
          <TotalRow label="Subtotal materiales" value={formatCurrency(subtotalMateriales)} />
          <TotalRow label="Subtotal mano de obra" value={formatCurrency(subtotalMano)} />
          <TotalRow label="Gastos adicionales" value={formatCurrency(subtotalGastos)} />
          <div className="border-t border-[var(--color-border)] pt-1">
            <TotalRow label="Subtotal" value={formatCurrency(subtotal)} bold />
          </div>
          {incluirIva && <TotalRow label="IVA (21%)" value={formatCurrency(ivaMonto)} />}
          <div className="border-t-2 border-[var(--color-text)] pt-2">
            <div className="flex justify-between font-display text-lg font-bold text-[var(--color-accent)]">
              <span>TOTAL FINAL</span>
              <span className="font-mono">{formatCurrency(totalFinal)}</span>
            </div>
          </div>
          <div className="mt-3 rounded-lg border-2 border-[var(--color-accent)]/40 bg-[var(--color-surface-2)] p-2 text-center text-sm">
            Anticipo requerido ({anticipoPct}%): <strong className="font-mono">{formatCurrency(anticipoMonto)}</strong>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/60 p-3">
        <h4 className="font-display text-base font-bold text-[var(--color-text)]">Escenarios comerciales</h4>
        <div className="mt-2 grid gap-1 text-sm md:grid-cols-2">
          <TotalRow label={`Contingencia (${contingenciaPct ?? 0}%)`} value={formatCurrency(totalConContingencia || 0)} />
          <TotalRow label={`Margen objetivo (${margenPct ?? 0}%)`} value={formatCurrency(precioSugeridoMargen || 0)} />
          <TotalRow
            label="Sugerido margen + contingencia"
            value={formatCurrency(precioSugeridoMargenContingencia || 0)}
            bold
          />
        </div>
      </section>

      {condiciones && (
        <div className="mt-6 border-l-4 border-[var(--color-accent)] bg-[var(--color-surface-2)]/50 p-4 text-sm text-[var(--color-text)]">
          <strong>Condiciones</strong>
          <p className="mt-2 whitespace-pre-wrap">{condiciones}</p>
        </div>
      )}

      {(checklistCierre || []).length > 0 && (
        <section className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h4 className="font-display text-base font-bold text-[var(--color-text)]">Checklist de cierre de obra</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-text)]">
            {(checklistCierre || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold">Firma del profesional</p>
          <div className="mt-8 border-b border-dashed border-[var(--color-text)]" />
          <p className="mt-2 text-xs text-[var(--color-text-2)]">Aclaración: _______________</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Firma y aclaración del cliente</p>
          <div className="mt-8 border-b border-dashed border-[var(--color-text)]" />
          <p className="mt-2 text-xs text-[var(--color-text-2)]">Fecha: _______________</p>
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-[var(--color-text-2)]">
        Presupuesto generado con Obra Pro — Este documento es válido por {validezDias ?? 15} días desde la fecha de
        emisión.
      </footer>
    </div>
  )
}

function TableSection({ title, headClass, columns, rows, foot }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="mb-2 font-display text-base font-bold text-[var(--color-text)]">{title}</h3>
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className={headClass}>
            {columns.map((c) => (
              <th key={c} className="px-2 py-2 text-left font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-[var(--color-surface-2)]/60' : 'bg-white'}>
              {r.map((cell, j) => (
                <td key={j} className={`px-2 py-2 font-mono ${j > 1 ? 'text-right' : 'text-left'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="bg-[var(--color-surface-2)] font-bold">
              {foot.map((c, i) => (
                <td key={i} className={`px-2 py-2 font-mono ${i > 0 ? 'text-right' : ''}`}>
                  {c}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

function TotalRow({ label, value, bold }) {
  return (
    <div className={`flex justify-between gap-4 ${bold ? 'font-semibold' : ''}`}>
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}
