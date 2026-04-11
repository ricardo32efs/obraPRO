/** Subtotal de una lista con cantidad * precioUnitario */
export function sumLineItems(rows) {
  return (rows || []).reduce((acc, r) => acc + Number(r.cantidad || 0) * Number(r.precioUnitario || 0), 0)
}

/**
 * Enriquece filas de gastos con montoCalculado para UI/PDF
 */
export function enrichGastosRows(rows, baseSubtotal) {
  return (rows || []).map((r) => {
    if (r.esPorcentaje) {
      const p = Number(r.porcentaje || 0)
      return { ...r, montoCalculado: (baseSubtotal * p) / 100 }
    }
    return { ...r, montoCalculado: Number(r.monto || 0) }
  })
}

export function computePresupuestoTotals(state) {
  const subMat = sumLineItems(state.materiales)
  const subMano = sumLineItems(state.manoObra)
  const base = subMat + subMano
  const gastosRows = enrichGastosRows(state.gastosAdicionales, base)
  const subGastos = gastosRows.reduce((a, r) => a + (r.montoCalculado || 0), 0)
  const subtotal = base + subGastos
  const ivaMonto = state.incluirIva ? subtotal * 0.21 : 0
  const totalFinal = subtotal + ivaMonto
  const anticipoMonto = (totalFinal * Number(state.anticipoPct || 0)) / 100
  return {
    subtotalMateriales: subMat,
    subtotalMano: subMano,
    subtotalGastos: subGastos,
    subtotal,
    ivaMonto,
    totalFinal,
    anticipoMonto,
    gastosRowsComputed: gastosRows,
  }
}
