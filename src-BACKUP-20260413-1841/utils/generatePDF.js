import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency } from './formatCurrency'

function hexToRgb(hex) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return { r: 193, g: 68, b: 14 }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function formatDateDDMMYYYY(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

/**
 * Construye el documento jsPDF (descarga o base64)
 * @param {object} data — payload completo (empresa, totales, tablas, etc.)
 * @param {{ isPro: boolean }} opts
 */
export function buildPresupuestoPdfDoc(data, opts = { isPro: false }) {
  const { isPro } = opts
  const marginL = 15
  const marginR = 15
  const marginT = 20
  const accent = isPro && data.empresa?.pdfAccentColor ? data.empresa.pdfAccentColor : '#C1440E'
  const accentRgb = hexToRgb(accent)
  const brown = { r: 139, g: 69, b: 19 }
  const dark = { r: 26, g: 26, b: 26 }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = marginT

  const addFooter = (pageNumber, pageCount) => {
    doc.setFontSize(8)
    doc.setTextColor(107, 94, 82)
    doc.text(`Emisión: ${formatDateDDMMYYYY(data.fechaEmision)}`, marginL, doc.internal.pageSize.getHeight() - 10)
    doc.text(`Pág. ${pageNumber} / ${pageCount}`, pageW - marginR, doc.internal.pageSize.getHeight() - 10, {
      align: 'right',
    })
  }

  // Logo (PRO + imagen)
  if (data.empresa?.logoBase64) {
    try {
      doc.addImage(data.empresa.logoBase64, marginL, y, 22, 22)
    } catch {
      /* ignore */
    }
  }

  doc.setFont('times', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(dark.r, dark.g, dark.b)
  doc.text(data.empresa?.nombreEmpresa || 'Obra Pro', data.empresa?.logoBase64 ? marginL + 26 : marginL, y + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(90, 90, 90)
  let subY = y + 14
  const contactLines = [
    data.empresa?.cuit ? `CUIT: ${data.empresa.cuit}` : '',
    data.empresa?.telefono ? `Tel: ${data.empresa.telefono}` : '',
    data.empresa?.email ? data.empresa.email : '',
    data.empresa?.direccion ? data.empresa.direccion : '',
  ].filter(Boolean)
  contactLines.forEach((line) => {
    doc.text(line, data.empresa?.logoBase64 ? marginL + 26 : marginL, subY)
    subY += 4
  })

  doc.setFont('times', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(dark.r, dark.g, dark.b)
  doc.text('PRESUPUESTO DE OBRA', pageW - marginR, y + 6, { align: 'right' })
  doc.setFontSize(11)
  doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b)
  doc.text(`N° ${data.numero}`, pageW - marginR, y + 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text(`Emisión: ${formatDateDDMMYYYY(data.fechaEmision)}`, pageW - marginR, y + 19, { align: 'right' })
  if (data.validoHasta) {
    doc.text(`Válido hasta: ${formatDateDDMMYYYY(data.validoHasta)}`, pageW - marginR, y + 24, { align: 'right' })
  }

  y = Math.max(subY, y + 28) + 4
  doc.setDrawColor(accentRgb.r, accentRgb.g, accentRgb.b)
  doc.setLineWidth(0.4)
  doc.line(marginL, y, pageW - marginR, y)
  y += 6

  const tipo =
    data.tipoTrabajo === 'Otro' && data.tipoTrabajoOtro ? data.tipoTrabajoOtro : data.tipoTrabajo

  doc.setFillColor(244, 241, 236)
  doc.roundedRect(marginL, y, pageW - marginL - marginR, 32, 2, 2, 'F')
  doc.setFont('times', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(dark.r, dark.g, dark.b)
  const col1X = marginL + 4
  const col2X = marginL + (pageW - marginL - marginR) / 2
  let yy = y + 6
  doc.text(`Cliente: ${data.clienteNombre}`, col1X, yy)
  if (data.clienteTelefono) doc.text(`Tel: ${data.clienteTelefono}`, col1X, yy + 5)
  if (data.clienteEmail) doc.text(`Email: ${data.clienteEmail}`, col1X, yy + 10)
  doc.text(`Obra: ${data.direccionObra}`, col2X, yy)
  doc.text(`Tipo: ${tipo}`, col2X, yy + 5)
  doc.text(`Inicio: ${formatDateDDMMYYYY(data.fechaInicio)}`, col2X, yy + 10)
  doc.text(`Entrega: ${formatDateDDMMYYYY(data.fechaEntrega)}`, col2X, yy + 15)
  y += 38

  if (data.descripcion) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    const descLines = doc.splitTextToSize(data.descripcion, pageW - marginL - marginR)
    doc.text(descLines, marginL, y)
    y += descLines.length * 4 + 4
    doc.setFont('helvetica', 'normal')
  }

  const tableBodyMat = (data.materiales || []).map((r) => [
    r.nombre,
    r.unidad,
    String(r.cantidad),
    formatCurrency(r.precioUnitario),
    formatCurrency(r.cantidad * r.precioUnitario),
  ])

  doc.setFont('times', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(dark.r, dark.g, dark.b)
  doc.text('MATERIALES', pageW / 2, y, { align: 'center' })
  y += 3
  autoTable(doc, {
    startY: y,
    head: [['Material', 'Unidad', 'Cantidad', 'P. Unitario', 'Subtotal']],
    body: tableBodyMat,
    theme: 'striped',
    headStyles: { fillColor: [dark.r, dark.g, dark.b], textColor: 255 },
    styles: { fontSize: 8.4, cellPadding: 2.2, font: 'helvetica' },
    columnStyles: {
      0: { cellWidth: 68 },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 24, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center' },
    },
    tableWidth: 174,
    margin: { left: (pageW - 174) / 2, right: (pageW - 174) / 2 },
  })
  y = doc.lastAutoTable.finalY + 6

  const tableBodyMo = (data.manoObra || []).map((r) => [
    r.descripcion,
    r.categoria,
    String(r.cantidad),
    r.unidad,
    formatCurrency(r.precioUnitario),
    formatCurrency(r.cantidad * r.precioUnitario),
  ])

  doc.setFont('times', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(dark.r, dark.g, dark.b)
  doc.text('MANO DE OBRA', pageW / 2, y, { align: 'center' })
  y += 3
  autoTable(doc, {
    startY: y,
    head: [['Descripción', 'Categoría', 'Cant.', 'Unidad', 'P. Unit.', 'Subtotal']],
    body: tableBodyMo,
    theme: 'striped',
    headStyles: { fillColor: [brown.r, brown.g, brown.b], textColor: 255 },
    styles: { fontSize: 8.4, cellPadding: 2.2, font: 'helvetica' },
    columnStyles: {
      0: { cellWidth: 52 },
      1: { cellWidth: 28 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 27, halign: 'center' },
      5: { cellWidth: 27, halign: 'center' },
    },
    tableWidth: 174,
    margin: { left: (pageW - 174) / 2, right: (pageW - 174) / 2 },
  })
  y = doc.lastAutoTable.finalY + 6

  if (data.gastosAdicionales?.length) {
    const gBody = data.gastosAdicionales.map((r) => [r.concepto, formatCurrency(r.montoCalculado ?? r.monto ?? 0)])
    autoTable(doc, {
      startY: y,
      head: [['Concepto', 'Monto']],
      body: gBody,
      theme: 'grid',
      headStyles: { fillColor: [120, 120, 120], textColor: 255 },
      styles: { fontSize: 8 },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: marginL, right: marginR },
    })
    y = doc.lastAutoTable.finalY + 6
  }

  const lines = [
    ['Subtotal materiales', formatCurrency(data.subtotalMateriales)],
    ['Subtotal mano de obra', formatCurrency(data.subtotalMano)],
    ['Gastos adicionales', formatCurrency(data.subtotalGastos)],
    ['Subtotal', formatCurrency(data.subtotal)],
  ]
  if (data.incluirIva) {
    lines.push(['IVA 21%', formatCurrency(data.ivaMonto)])
  }
  lines.push(['TOTAL FINAL', formatCurrency(data.totalFinal)])
  const differsFromTotal = (value) => value != null && Math.abs(Number(value) - Number(data.totalFinal || 0)) > 0.009
  if (data.includeEscenariosPdf && differsFromTotal(data.totalConContingencia)) {
    lines.push([`Total + contingencia (${data.contingenciaPct ?? 0}%)`, formatCurrency(data.totalConContingencia)])
  }
  if (data.includeEscenariosPdf && differsFromTotal(data.precioSugeridoMargen)) {
    lines.push([`Sugerido con margen (${data.margenPct ?? 0}%)`, formatCurrency(data.precioSugeridoMargen)])
  }
  if (data.includeEscenariosPdf && differsFromTotal(data.precioSugeridoMargenContingencia)) {
    lines.push(['Sugerido margen + contingencia', formatCurrency(data.precioSugeridoMargenContingencia)])
  }

  const rightX = pageW - marginR
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  let ly = y
  lines.forEach(([k, v]) => {
    const isTotal = k === 'TOTAL FINAL'
    doc.setFont('helvetica', isTotal ? 'bold' : 'normal')
    doc.setFontSize(isTotal ? 12 : 9)
    doc.setTextColor(isTotal ? accentRgb.r : dark.r, isTotal ? accentRgb.g : dark.g, isTotal ? accentRgb.b : dark.b)
    doc.text(k, rightX - 60, ly, { align: 'left' })
    doc.text(v, rightX, ly, { align: 'right' })
    ly += isTotal ? 8 : 6
  })
  ly += 2
  doc.setDrawColor(214, 208, 196)
  doc.setLineWidth(0.2)
  doc.line(rightX - 70, ly, rightX, ly)
  ly += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(dark.r, dark.g, dark.b)
  if (data.includeAnticipoPdf) {
    doc.text(`Anticipo (${data.anticipoPct}%): ${formatCurrency(data.anticipoMonto)}`, rightX, ly, { align: 'right' })
    ly += 10
  }

  if (data.includeChecklistCierrePdf && data.checklistCierre?.length) {
    doc.setFont('times', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(dark.r, dark.g, dark.b)
    doc.text('Checklist de cierre de obra', marginL, ly)
    ly += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    data.checklistCierre.forEach((item) => {
      const bullet = `• ${item}`
      const linesChecklist = doc.splitTextToSize(bullet, pageW - marginL - marginR)
      doc.text(linesChecklist, marginL, ly)
      ly += linesChecklist.length * 4
    })
    ly += 4
  }

  if (data.includeFirmasPdf) {
    ly += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(dark.r, dark.g, dark.b)
    doc.text('Firma del profesional: ___________________________', marginL, ly)
    doc.text('Firma y aclaración del cliente: ___________________', marginL + 95, ly)
    ly += 8
    doc.setFontSize(8)
    doc.text('Aclaración: _______________', marginL, ly)
    doc.text('Fecha: _______________', marginL + 95, ly)
  }

  if (data.condiciones) {
    ly += 8
    doc.setDrawColor(accentRgb.r, accentRgb.g, accentRgb.b)
    doc.setLineWidth(1)
    doc.line(marginL, ly - 2, marginL, ly + 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(60, 60, 60)
    const condLines = doc.splitTextToSize(data.condiciones, pageW - marginL - marginR - 6)
    doc.text(condLines, marginL + 4, ly)
  }

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    addFooter(i, pageCount)
  }

  return doc
}

/**
 * PDF en Base64 (sin prefijo data:) — p. ej. adjunto EmailJS
 */
export function getPresupuestoPdfBase64(data, opts = { isPro: false }) {
  const doc = buildPresupuestoPdfDoc(data, opts)
  const dataUri = doc.output('datauristring')
  const comma = dataUri.indexOf(',')
  return comma >= 0 ? dataUri.slice(comma + 1) : dataUri
}

/**
 * Descarga el PDF al equipo del usuario
 */
export function generatePresupuestoPDF(data, opts = { isPro: false }) {
  const doc = buildPresupuestoPdfDoc(data, opts)
  const safeName = String(data.clienteNombre || 'cliente').replace(/[^\w\d\- ]/g, '').slice(0, 40)
  doc.save(`Presupuesto-${safeName}-${data.numero?.replace(/\s/g, '') || 'obra'}.pdf`)
}

