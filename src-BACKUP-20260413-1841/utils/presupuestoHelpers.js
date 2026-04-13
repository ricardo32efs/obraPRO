import { FREE_MONTHLY_BUDGET_LIMIT } from './constants'

/** Fecha en que el presupuesto se creó por primera vez en la app (persistido). */
export function getCreadoEn(p) {
  if (!p) return null
  return p.creadoEn || p.updatedAt || p.fechaEmision || null
}

/** Cantidad de presupuestos nuevos creados en el mes calendario actual (para límite free). */
export function countPresupuestosCreadosEsteMes(presupuestos) {
  const now = new Date()
  return (presupuestos || []).filter((p) => {
    const iso = getCreadoEn(p)
    if (!iso) return false
    const d = new Date(iso)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
}

/**
 * ¿Se puede crear un presupuesto nuevo este mes en plan gratuito?
 * @param {{ isPro: boolean, presupuestos: object[], presupuestoIdActual: string }} ctx
 */
export function puedeCrearPresupuestoGratis(ctx) {
  if (ctx.isPro) return true
  const yaExiste = (ctx.presupuestos || []).some((p) => p.id === ctx.presupuestoIdActual)
  if (yaExiste) return true
  return countPresupuestosCreadosEsteMes(ctx.presupuestos) < FREE_MONTHLY_BUDGET_LIMIT
}

/** Para PDF/email: asegura objeto empresa (cabecera del documento). */
export function mergePayloadConEmpresa(record, empresaFallback) {
  if (!record) return record
  return {
    ...record,
    empresa: record.empresa && Object.keys(record.empresa).length ? record.empresa : empresaFallback || {},
  }
}
