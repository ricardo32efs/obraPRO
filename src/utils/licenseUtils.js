const KEY = 'obrapro_license_v1'

/**
 * Guarda la licencia PRO en localStorage después de verificar el pago.
 * @param {{ token: string, plan: string, email: string, identifier: string, activatedAt: string }} data
 */
export function saveLicense(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {}
}

/**
 * Lee la licencia guardada. Devuelve null si no existe o está corrupta.
 */
export function getLicense() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Devuelve true si hay una licencia válida almacenada.
 */
export function hasValidLicense() {
  const lic = getLicense()
  return !!(lic?.token && lic?.plan && lic?.identifier)
}

/**
 * Elimina la licencia (para soporte/debug).
 */
export function clearLicense() {
  localStorage.removeItem(KEY)
}
