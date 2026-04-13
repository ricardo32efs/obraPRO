import { LS_KEYS } from './constants'

/** Uso mensual: solo métricas de IA (el límite de presupuestos se calcula desde el historial). */
export function loadUsage() {
  const month = new Date().toISOString().slice(0, 7)
  try {
    const raw = localStorage.getItem(LS_KEYS.usage)
    if (!raw) return { month, ia_uses: 0 }
    const u = JSON.parse(raw)
    if (u.month !== month) return { month, ia_uses: 0 }
    return {
      month,
      ia_uses: Number(u.ia_uses) || 0,
    }
  } catch {
    return { month, ia_uses: 0 }
  }
}

export function saveUsage(next) {
  try {
    localStorage.setItem(LS_KEYS.usage, JSON.stringify(next))
  } catch {
    /* quota */
  }
}

export function incrementIaUses() {
  const u = loadUsage()
  saveUsage({ ...u, ia_uses: u.ia_uses + 1 })
}
