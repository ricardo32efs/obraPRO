import ExcelJS from 'exceljs'

/**
 * Exporta presupuesto a Excel con formato profesional (exceljs)
 * @param {object} payload — mismos campos que usa el PDF / estado
 * @param {string} fileBase nombre sin extensión
 */
export async function exportPresupuestoExcel(payload, fileBase = 'presupuesto') {
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
  const ACCENT = '1A1A1A'
  const BROWN  = '8B4513'
  const GRAY   = '555555'
  const WHITE  = 'FFFFFF'
  const LIGHT  = 'F5F5F5'
  const TOTAL_BG = 'FFF3E0'

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Obra Pro'
  wb.created = new Date()

  const currency = '#,##0.00'

  function styleHeader(row, bgHex, fgHex = WHITE) {
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + bgHex } }
      cell.font = { bold: true, color: { argb: 'FF' + fgHex }, size: 11 }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      }
    })
    row.height = 22
  }

  function styleDataRow(row, even) {
    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: even ? 'FFFAFAFA' : 'FFFFFFFF' } }
      cell.alignment = { vertical: 'middle', wrapText: true }
      cell.border = {
        bottom: { style: 'hair', color: { argb: 'FFDDDDDD' } },
        left:   { style: 'hair', color: { argb: 'FFDDDDDD' } },
        right:  { style: 'hair', color: { argb: 'FFDDDDDD' } },
      }
    })
    row.height = 18
  }

  // ── HOJA RESUMEN ──────────────────────────────────────────────
  const wsR = wb.addWorksheet('Resumen', { views: [{ showGridLines: false }] })
  wsR.columns = [{ width: 28 }, { width: 42 }]

  const addResumenRow = (label, value, bold = false, bgHex = null) => {
    const row = wsR.addRow([label, value])
    if (bold) row.font = { bold: true, size: 11 }
    if (bgHex) row.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + bgHex } } })
    row.getCell(1).font = { bold: true, size: 10, color: { argb: 'FF' + GRAY } }
    row.getCell(2).font = { bold, size: bold ? 12 : 10 }
    row.getCell(2).alignment = { horizontal: 'left' }
    row.height = 18
    return row
  }

  const titleRow = wsR.addRow(['PRESUPUESTO DE OBRA', numero])
  titleRow.height = 30
  titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: 'FF' + ACCENT } }
  titleRow.getCell(2).font = { bold: true, size: 14, color: { argb: 'FF' + BROWN } }
  wsR.addRow([])

  addResumenRow('Empresa', empresa?.nombreEmpresa || '')
  if (empresa?.cuit) addResumenRow('CUIT', empresa.cuit)
  wsR.addRow([])
  addResumenRow('Cliente', clienteNombre)
  if (clienteTelefono) addResumenRow('Teléfono', clienteTelefono)
  if (clienteEmail) addResumenRow('Email', clienteEmail)
  addResumenRow('Dirección de obra', direccionObra)
  addResumenRow('Tipo de trabajo', tipo)
  addResumenRow('Fecha inicio', fechaInicio)
  addResumenRow('Fecha entrega', fechaEntrega)
  addResumenRow('Fecha emisión', fechaEmision)
  if (validezDias) addResumenRow('Validez (días)', validezDias)
  if (descripcion) addResumenRow('Descripción', descripcion)
  wsR.addRow([])

  const totTitleRow = wsR.addRow(['TOTALES', ''])
  styleHeader(totTitleRow, ACCENT)
  wsR.mergeCells(`A${totTitleRow.number}:B${totTitleRow.number}`)

  const addTotalRow = (label, value, isTotal = false) => {
    const row = wsR.addRow([label, value])
    row.getCell(2).numFmt = currency
    if (isTotal) {
      row.eachCell(c => {
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + TOTAL_BG } }
        c.font = { bold: true, size: 12 }
      })
      row.height = 22
    }
    row.getCell(1).font = { bold: isTotal, size: isTotal ? 12 : 10, color: { argb: 'FF' + GRAY } }
    row.height = row.height || 18
  }

  addTotalRow('Subtotal materiales', subtotalMateriales || 0)
  addTotalRow('Subtotal mano de obra', subtotalMano || 0)
  addTotalRow('Gastos adicionales', subtotalGastos || 0)
  addTotalRow('Subtotal', subtotal || 0)
  if (incluirIva) addTotalRow('IVA 21%', ivaMonto || 0)
  addTotalRow('TOTAL FINAL', totalFinal || 0, true)
  addTotalRow(`Anticipo (${anticipoPct}%)`, anticipoMonto || 0)
  wsR.addRow([])
  if (condiciones) addResumenRow('Condiciones', condiciones)

  // ── HOJA MATERIALES ───────────────────────────────────────────
  const wsM = wb.addWorksheet('Materiales', { views: [{ showGridLines: false, state: 'frozen', ySplit: 1 }] })
  wsM.columns = [
    { key: 'nombre',   header: 'Material',    width: 40 },
    { key: 'unidad',   header: 'Unidad',      width: 14 },
    { key: 'cantidad', header: 'Cantidad',    width: 12 },
    { key: 'precio',   header: 'P. Unitario', width: 18 },
    { key: 'subtotal', header: 'Subtotal',    width: 18 },
  ]
  styleHeader(wsM.getRow(1), ACCENT)
  ;(materiales || []).forEach((r, i) => {
    const row = wsM.addRow({
      nombre: r.nombre,
      unidad: r.unidad,
      cantidad: r.cantidad,
      precio: r.precioUnitario,
      subtotal: r.cantidad * r.precioUnitario,
    })
    row.getCell('precio').numFmt = currency
    row.getCell('subtotal').numFmt = currency
    row.getCell('cantidad').alignment = { horizontal: 'center' }
    row.getCell('unidad').alignment = { horizontal: 'center' }
    styleDataRow(row, i % 2 === 0)
  })
  const matTotal = wsM.addRow(['', '', '', 'TOTAL', (materiales || []).reduce((s, r) => s + r.cantidad * r.precioUnitario, 0)])
  styleHeader(matTotal, BROWN)
  matTotal.getCell(5).numFmt = currency

  // ── HOJA MANO DE OBRA ─────────────────────────────────────────
  const wsMo = wb.addWorksheet('Mano de obra', { views: [{ showGridLines: false, state: 'frozen', ySplit: 1 }] })
  wsMo.columns = [
    { key: 'descripcion', header: 'Descripción',  width: 40 },
    { key: 'categoria',   header: 'Categoría',    width: 20 },
    { key: 'cantidad',    header: 'Cantidad',     width: 12 },
    { key: 'unidad',      header: 'Unidad',       width: 14 },
    { key: 'precio',      header: 'P. Unitario',  width: 18 },
    { key: 'subtotal',    header: 'Subtotal',     width: 18 },
  ]
  styleHeader(wsMo.getRow(1), BROWN)
  ;(manoObra || []).forEach((r, i) => {
    const row = wsMo.addRow({
      descripcion: r.descripcion,
      categoria: r.categoria,
      cantidad: r.cantidad,
      unidad: r.unidad,
      precio: r.precioUnitario,
      subtotal: r.cantidad * r.precioUnitario,
    })
    row.getCell('precio').numFmt = currency
    row.getCell('subtotal').numFmt = currency
    row.getCell('cantidad').alignment = { horizontal: 'center' }
    row.getCell('unidad').alignment = { horizontal: 'center' }
    styleDataRow(row, i % 2 === 0)
  })
  const moTotal = wsMo.addRow(['', '', '', '', 'TOTAL', (manoObra || []).reduce((s, r) => s + r.cantidad * r.precioUnitario, 0)])
  styleHeader(moTotal, ACCENT)
  moTotal.getCell(6).numFmt = currency

  // ── HOJA GASTOS ───────────────────────────────────────────────
  if (gastosAdicionales?.length) {
    const wsG = wb.addWorksheet('Gastos adicionales', { views: [{ showGridLines: false, state: 'frozen', ySplit: 1 }] })
    wsG.columns = [
      { key: 'concepto', header: 'Concepto', width: 45 },
      { key: 'monto',    header: 'Monto',    width: 20 },
    ]
    styleHeader(wsG.getRow(1), GRAY)
    gastosAdicionales.forEach((r, i) => {
      const row = wsG.addRow({ concepto: r.concepto, monto: r.montoCalculado ?? r.monto ?? 0 })
      row.getCell('monto').numFmt = currency
      styleDataRow(row, i % 2 === 0)
    })
  }

  // ── DESCARGAR ─────────────────────────────────────────────────
  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileBase}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
