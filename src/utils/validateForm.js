const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** CUIT formato XX-XXXXXXXX-X */
export function isValidCuitFormat(cuit) {
  const s = String(cuit || '').trim()
  return /^\d{2}-\d{8}-\d{1}$/.test(s)
}

export function isValidEmail(email) {
  if (!email || !String(email).trim()) return true
  return EMAIL_RE.test(String(email).trim())
}

/** @param {string} d1 yyyy-mm-dd */
export function parseISODate(d) {
  if (!d) return null
  const [y, m, day] = d.split('-').map(Number)
  if (!y || !m || !day) return null
  return new Date(y, m - 1, day)
}

export function isEntregaAfterInicio(fechaInicio, fechaEntrega) {
  if (!fechaInicio || !fechaEntrega) return true
  const a = parseISODate(fechaInicio)
  const b = parseISODate(fechaEntrega)
  if (!a || !b) return true
  return b >= a
}

/**
 * Valida formulario principal de presupuesto
 * @returns {{ ok: boolean, errors: Record<string, string> }}
 */
export function validatePresupuestoForm(state) {
  const errors = {}
  const { clienteNombre, direccionObra, tipoTrabajo, fechaInicio, fechaEntrega, materiales, manoObra } =
    state

  if (!String(clienteNombre || '').trim()) {
    errors.clienteNombre = 'El nombre del cliente es obligatorio.'
  }
  if (!String(direccionObra || '').trim()) {
    errors.direccionObra = 'La dirección de la obra es obligatorio.'
  }
  if (!String(tipoTrabajo || '').trim()) {
    errors.tipoTrabajo = 'Seleccioná el tipo de trabajo.'
  }
  if (!isEntregaAfterInicio(fechaInicio, fechaEntrega)) {
    errors.fechaEntrega = 'La fecha de entrega no puede ser anterior al inicio.'
  }

  const mats = materiales || []
  const manos = manoObra || []
  const matOk = mats.some(
    (r) => String(r.nombre || '').trim() && Number(r.cantidad) > 0 && Number(r.precioUnitario) > 0,
  )
  const manoOk = manos.some(
    (r) =>
      String(r.descripcion || '').trim() && Number(r.cantidad) > 0 && Number(r.precioUnitario) > 0,
  )
  if (!matOk && !manoOk) {
    errors.items = 'Agregá al menos un material o un ítem de mano de obra completo (nombre, cantidad y precio).'
  }

  mats.forEach((r, i) => {
    if (String(r.nombre || '').trim() && (Number(r.cantidad) <= 0 || Number(r.precioUnitario) <= 0)) {
      errors[`material_${i}`] = 'Cantidad y precio deben ser mayores a 0.'
    }
  })
  manos.forEach((r, i) => {
    if (
      String(r.descripcion || '').trim() &&
      (Number(r.cantidad) <= 0 || Number(r.precioUnitario) <= 0)
    ) {
      errors[`mano_${i}`] = 'Cantidad y precio deben ser mayores a 0.'
    }
  })

  if (state.clienteEmail && !isValidEmail(state.clienteEmail)) {
    errors.clienteEmail = 'Email inválido.'
  }

  return { ok: Object.keys(errors).length === 0, errors }
}

export function validateEmpresaConfig(e) {
  const errors = {}
  if (!String(e?.nombreEmpresa || '').trim()) errors.nombreEmpresa = 'Obligatorio.'
  if (!String(e?.nombreResponsable || '').trim()) errors.nombreResponsable = 'Obligatorio.'
  if (!isValidCuitFormat(e?.cuit || '')) errors.cuit = 'Formato: XX-XXXXXXXX-X'
  if (e?.email && !isValidEmail(e.email)) errors.email = 'Email inválido.'
  return { ok: Object.keys(errors).length === 0, errors }
}
