/**
 * Google Analytics 4 (opcional). Solo en producción y si configurás VITE_GA_MEASUREMENT_ID.
 */
export function initAnalytics() {
  if (!import.meta.env.PROD) return

  const id = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!id || typeof id !== 'string' || !/^G-[A-Z0-9]+$/i.test(id.trim())) return

  const measurementId = id.trim()

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(s)
}
