/**
 * Utilidades de seguridad para el frontend
 * Sanitización y validación de inputs
 */

/**
 * Sanitiza texto para prevenir XSS
 * Elimina caracteres peligrosos y tags HTML
 */
export function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Valida un email
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Limita la longitud de un string
 */
export function limitLength(text, maxLength) {
  if (!text || typeof text !== 'string') return ''
  return text.slice(0, maxLength)
}

/**
 * Sanitiza y valida un nombre (solo letras, espacios y guiones)
 */
export function sanitizeName(name) {
  if (!name || typeof name !== 'string') return ''
  return name
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-']/g, '')
    .slice(0, 100)
    .trim()
}

/**
 * Detecta si un texto contiene posible intento de inyección SQL básico
 */
export function containsSQLInjection(text) {
  if (!text || typeof text !== 'string') return false
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
    /(\bUNION\b.*\bSELECT\b)/i,
  ]
  
  return sqlPatterns.some(pattern => pattern.test(text))
}

/**
 * Sanitiza inputs de formularios de presupuesto
 */
export function sanitizePresupuestoInput(input) {
  if (!input || typeof input !== 'string') return ''
  
  // Primero sanitizar XSS
  let sanitized = sanitizeInput(input)
  
  // Luego limitar longitud
  sanitized = limitLength(sanitized, 1000)
  
  return sanitized
}
