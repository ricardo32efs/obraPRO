/**
 * Formatea números como moneda argentina: $1.234,56
 * @param {number} value
 * @param {boolean} [withSymbol=true]
 */
export function formatCurrency(value, withSymbol = true) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return withSymbol ? '$0,00' : '0,00'
  }
  const n = Number(value)
  const fixed = n.toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const s = `${withThousands},${decPart}`
  return withSymbol ? `$${s}` : s
}

/** Parsea input tipo argentino o plano a número */
export function parseCurrencyInput(str) {
  if (str === '' || str == null) return 0
  const cleaned = String(str)
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

/** Formatea string de visualización mientras escribe (limitado) */
export function formatInputThousands(value) {
  if (value === '' || value == null) return ''
  const n = parseCurrencyInput(String(value).replace(/\./g, '').replace(',', '.'))
  if (!Number.isFinite(n)) return ''
  return formatCurrency(n, false)
}
