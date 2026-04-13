import * as XLSX from 'xlsx'
import { formatCurrency } from './formatCurrency'

/**
 * Exporta presupuesto a Excel — pensado para plan PRO
 * @param {object} payload — mismos campos que usa el PDF / estado
 * @param {string} fileBase nombre sin extensión
 */
export function exportPresupuestoExcel(payload, fileBase = 'presupuesto') {
  const {
    numero,
    empresa,
    clienteNombre,
    clienteTelefono,
    clienteEmail,
    direccionObra,
    tipoTrabajo,
    tipoTrabajoOtro,
    descripcion,
    fechaInicio,
    fechaEntrega,
    fechaEmision,
    materiales,
    manoObra,
    gastosAdicionales,
    subtotalMateriales,
    subtotalMano,
    subtotalGastos,
    subtotal,
    ivaMonto,
    incluirIva,
    totalFinal,
    anticipoMonto,
    anticipoPct,
    condiciones,
    validezDias,
  } = payload

  const tipo = tipoTrabajo === 'Otro' && tipoTrabajoOtro ? tipoTrabajoOtro : tipoTrabajo

  const wb = XLSX.utils.book_new()

  const info = [
    ['Presupuesto de obra', numero],
    ['Empresa', empresa?.nombreEmpresa || ''],
    ['CUIT', empresa?.cuit || ''],
    ['Cliente', clienteNombre],
    ['Tel cliente', clienteTelefono || ''],
    ['Email cliente', clienteEmail || ''],
    ['Obra', direccionObra],
    ['Tipo', tipo],
    ['Inicio', fechaInicio],
    ['Entrega', fechaEntrega],
    ['Emisión', fechaEmision],
    ['Descripción', descripcion || ''],
    [],
    ['Totales', ''],
    ['Subtotal materiales', formatCurrency(subtotalMateriales)],
    ['Subtotal mano de obra', formatCurrency(subtotalMano)],
    ['Gastos adicionales', formatCurrency(subtotalGastos)],
    ['Subtotal', formatCurrency(subtotal)],
    ['IVA 21%', incluirIva ? formatCurrency(ivaMonto) : '$0,00'],
    ['TOTAL FINAL', formatCurrency(totalFinal)],
    ['Anticipo', `${anticipoPct}% — ${formatCurrency(anticipoMonto)}`],
    ['Validez (días)', validezDias],
    ['Condiciones', condiciones || ''],
  ]
  const wsInfo = XLSX.utils.aoa_to_sheet(info)
  XLSX.utils.book_append_sheet(wb, wsInfo, 'Resumen')

  const matHeader = ['Material', 'Unidad', 'Cantidad', 'P. Unitario', 'Subtotal']
  const matRows = (materiales || []).map((r) => [
    r.nombre,
    r.unidad,
    r.cantidad,
    r.precioUnitario,
    r.cantidad * r.precioUnitario,
  ])
  const wsMat = XLSX.utils.aoa_to_sheet([matHeader, ...matRows])
  XLSX.utils.book_append_sheet(wb, wsMat, 'Materiales')

  const moHeader = ['Descripción', 'Categoría', 'Cantidad', 'Unidad', 'P. Unitario', 'Subtotal']
  const moRows = (manoObra || []).map((r) => [
    r.descripcion,
    r.categoria,
    r.cantidad,
    r.unidad,
    r.precioUnitario,
    r.cantidad * r.precioUnitario,
  ])
  const wsMo = XLSX.utils.aoa_to_sheet([moHeader, ...moRows])
  XLSX.utils.book_append_sheet(wb, wsMo, 'Mano de obra')

  if (gastosAdicionales?.length) {
    const gHeader = ['Concepto', 'Monto']
    const gRows = gastosAdicionales.map((r) => [r.concepto, r.montoCalculado ?? r.monto ?? 0])
    const wsG = XLSX.utils.aoa_to_sheet([gHeader, ...gRows])
    XLSX.utils.book_append_sheet(wb, wsG, 'Gastos')
  }

  XLSX.writeFile(wb, `${fileBase}.xlsx`)
}
