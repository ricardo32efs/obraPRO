/**
 * Ajusta canonical y Open Graph con URLs absolutas (necesario para WhatsApp, Facebook, X).
 * Usa VITE_SITE_URL en build si la definís; si no, el origen actual del navegador.
 */
function baseUrl() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim().replace(/\/$/, '')
  }
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('file:')) {
    return window.location.origin
  }
  return ''
}

function upsertMetaProperty(property, content) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertMetaName(name, content) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (!href) return
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export function bootstrapPublicMeta() {
  if (typeof document === 'undefined') return

  const base = baseUrl()
  if (!base) return

  const home = `${base}/`
  const image = `${base}/og-share.png`

  upsertCanonical(home)
  upsertMetaProperty('og:url', home)
  upsertMetaProperty('og:image', image)
  upsertMetaName('twitter:image', image)
  upsertMetaName('twitter:card', 'summary_large_image')
}
