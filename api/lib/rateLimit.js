/**
 * Rate Limiting simple para Vercel Serverless Functions
 * Usa un Map en memoria (resetea en cada cold start, pero protege contra abuso inmediato)
 */

const RATE_LIMITS = {
  // 10 requests por minuto por IP
  'ai-suggest': { windowMs: 60 * 1000, maxRequests: 10 },
  // 5 requests por minuto por IP  
  'verify-payment': { windowMs: 60 * 1000, maxRequests: 5 },
  // 3 feedbacks por minuto por IP
  'feedback': { windowMs: 60 * 1000, maxRequests: 3 },
}

// Almacenamiento en memoria (se resetea en cold starts)
const requestCounts = new Map()

export function checkRateLimit(endpointKey, identifier) {
  const config = RATE_LIMITS[endpointKey]
  if (!config) return { allowed: true }

  const now = Date.now()
  const key = `${endpointKey}:${identifier}`
  
  // Limpiar entradas antiguas
  if (requestCounts.has(key)) {
    const entries = requestCounts.get(key).filter(timestamp => now - timestamp < config.windowMs)
    requestCounts.set(key, entries)
    
    if (entries.length >= config.maxRequests) {
      const oldestRequest = entries[0]
      const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000)
      return { 
        allowed: false, 
        retryAfter,
        limit: config.maxRequests,
        remaining: 0
      }
    }
    
    entries.push(now)
    return { 
      allowed: true, 
      remaining: config.maxRequests - entries.length 
    }
  }
  
  // Primera request
  requestCounts.set(key, [now])
  return { 
    allowed: true, 
    remaining: config.maxRequests - 1 
  }
}

export function getClientIP(req) {
  // Vercel headers
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}
