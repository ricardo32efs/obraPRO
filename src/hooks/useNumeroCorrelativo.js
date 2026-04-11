import { LS_KEYS } from '../utils/constants'

/** @returns {string} OBP-YYYY-NNNN */
export function formatNumeroObra(seq, year = new Date().getFullYear()) {
  return `OBP-${year}-${String(seq).padStart(4, '0')}`
}

/** Lee contador: próximo número a asignar */
export function loadNumeroCounter() {
  const year = new Date().getFullYear()
  try {
    const raw = localStorage.getItem(LS_KEYS.correlativo)
    if (!raw) return { year, next: 1 }
    const p = JSON.parse(raw)
    if (p?.year !== year) return { year, next: 1 }
    return { year, next: Math.max(1, Number(p.next) || 1) }
  } catch {
    return { year, next: 1 }
  }
}

/** Persiste el siguiente número libre después de guardar un presupuesto */
export function saveNumeroCounter(nextFree) {
  const year = new Date().getFullYear()
  localStorage.setItem(LS_KEYS.correlativo, JSON.stringify({ year, next: nextFree }))
}
